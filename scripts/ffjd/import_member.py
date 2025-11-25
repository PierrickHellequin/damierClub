#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import d'UN membre FFJD avec tous ses détails
Code extrait de import_club_with_details.py qui FONCTIONNAIT
"""

import requests
import re
from bs4 import BeautifulSoup


BASE_URL = "http://www.ffjd.fr/CP"


def escape_sql_string(s):
    """Échappe les apostrophes pour SQL"""
    if s is None:
        return ''
    return str(s).replace("'", "''")


def generate_uuid(ffjd_id):
    """Génère un UUID basé sur le ffjd_id"""
    ffjd_int = int(ffjd_id)
    return f"019d{ffjd_int:08x}"[:8] + f"-{ffjd_int:04x}"[:5] + "-7000-8000-" + f"{ffjd_int:012x}"


def generate_email(name):
    """Génère un email à partir du nom"""
    clean = name.lower().replace(' ', '.').replace("'", "").replace('-', '.')
    clean = re.sub(r'[^a-z0-9.]', '', clean)
    return f"{clean}@wattrelos-dames.fr"


def parse_name(full_name):
    """Parse un nom complet en first_name et last_name
    Format FFJD: 'NOM Prénom' ou 'NOM Prénom1 Prénom2'
    """
    parts = full_name.strip().split()
    if len(parts) == 0:
        return None, None
    elif len(parts) == 1:
        return None, parts[0]  # Seulement un nom
    else:
        # Premier mot = nom de famille (en majuscules généralement)
        # Reste = prénom(s)
        last_name = parts[0]
        first_name = ' '.join(parts[1:])
        return first_name, last_name


def fetch_player_details(ffjd_id):
    """Récupère les détails d'un joueur depuis sa page FFJD"""
    url = f"{BASE_URL}/C_Joueur.php?Id={ffjd_id}"
    print(f"  📥 Récupération détails joueur {ffjd_id}...", end='', flush=True)

    try:
        response = requests.get(url, timeout=10)
        response.encoding = 'iso-8859-1'
        soup = BeautifulSoup(response.text, 'html.parser')

        details = {
            'current_points': None,
            'titre': None,
            'category': None,
            'gender': None
        }

        # Rechercher le tableau avec class="border2a"
        table = soup.find('table', class_='border2a')
        if not table:
            print(" ⚠️ Tableau non trouvé")
            return details

        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 2:
                label = cells[0].get_text().strip().lower()
                value = cells[1].get_text().strip()

                if 'capital-point' in label and value:
                    try:
                        details['current_points'] = int(value)
                    except ValueError:
                        pass

                elif 'titre ffjd' in label and value and value != '-':
                    details['titre'] = value

                elif 'catégorie' in label or 'cat' in label:
                    # Format: "Renseignée / Seniors" ou juste "Seniors"
                    if '/' in value:
                        category = value.split('/')[-1].strip()
                    else:
                        category = value
                    if category and category != '-':
                        details['category'] = category

        print(f" ✅ Points: {details['current_points']}, Titre: {details['titre']}")
        return details

    except Exception as e:
        print(f" ❌ Erreur: {e}")
        return {
            'current_points': None,
            'titre': None,
            'category': None,
            'gender': None
        }


def generate_member_sql(player, club_uuid, is_active):
    """Génère le SQL INSERT pour un membre avec détails"""
    member_uuid = generate_uuid(player['ffjd_id'])
    email = generate_email(player['name'])
    first_name, last_name = parse_name(player['name'])

    # Récupérer les détails du joueur
    details = fetch_player_details(player['ffjd_id'])

    # Valeurs avec defaults
    current_points = details['current_points'] if details['current_points'] is not None else 'NULL'
    ranking = player['ranking'] if player['ranking'] is not None else 'NULL'

    sql = f"""
INSERT INTO members (
    id, email, name, password, role, club_id, club_role, active, rate,
    first_name, last_name, current_points, ffjd_id, ranking
) VALUES (
    '{member_uuid}',
    '{email}',
    '{escape_sql_string(player['name'])}',
    '$2a$10$defaultHashForImportedUsers12345678901234567890',
    'ROLE_USER',
    '{club_uuid}',
    'MEMBRE',
    {'true' if is_active else 'false'},
    0,
    {f"'{escape_sql_string(first_name)}'" if first_name else 'NULL'},
    {f"'{escape_sql_string(last_name)}'" if last_name else 'NULL'},
    {current_points},
    '{player['ffjd_id']}',
    {ranking}
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    current_points = EXCLUDED.current_points,
    ffjd_id = EXCLUDED.ffjd_id,
    ranking = EXCLUDED.ranking,
    active = EXCLUDED.active;
"""
    return sql


def import_member(player, club_uuid, is_active):
    """
    Importe un membre FFJD
    Retourne: sql_string
    """
    return generate_member_sql(player, club_uuid, is_active)
