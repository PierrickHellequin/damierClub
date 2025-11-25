#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import d'UN club FFJD (informations de base + liste des membres)
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


def extract_officials(soup):
    """Extrait les dirigeants du club"""
    officials = {
        'president': None,
        'secretaire': None,
        'tresorier': None
    }

    table = soup.find('table', class_='border2a')
    if not table:
        return officials

    rows = table.find_all('tr')
    for row in rows:
        cells = row.find_all('td')
        if len(cells) >= 2:
            role_cell = cells[0]
            name_cell = cells[1]

            role_text = role_cell.get_text().strip().lower()
            text = name_cell.get_text('\n').strip()
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            name = lines[0] if lines else None

            if 'président' in role_text:
                officials['president'] = name
            elif 'secrétaire' in role_text or 'secretaire' in role_text:
                officials['secretaire'] = name
            elif 'trésorier' in role_text or 'tresorier' in role_text:
                officials['tresorier'] = name

    return officials


def extract_club_info(soup):
    """Extrait les informations générales du club"""
    info = {
        'name': 'Wattrelos Club',
        'website': None,
        'president': None,
        'vice_president': None,
        'secretaire': None,
        'tresorier': None,
        'status': 'ACTIVE'
    }

    # Extraire depuis div_infos (contient textarea)
    div_infos = soup.find('div', class_='div_infos')
    if div_infos:
        text = div_infos.get_text()

        # Site Web
        website_match = re.search(r'Site Web\s*:\s*(http[^\s]+)', text)
        if website_match:
            info['website'] = website_match.group(1).strip()

        # Président
        president_match = re.search(r'Président du Club\s*:\s*\n\s*([^\n]+)', text, re.IGNORECASE)
        if president_match:
            info['president'] = president_match.group(1).strip()

        # Vice-président
        vp_match = re.search(r'Vice-président\s*:\s*\n\s*([^\n]+)', text, re.IGNORECASE)
        if vp_match:
            info['vice_president'] = vp_match.group(1).strip()

        # Trésorier
        tresorier_match = re.search(r'Trésorier\s*:\s*\n\s*([^\n]+)', text, re.IGNORECASE)
        if tresorier_match:
            info['tresorier'] = tresorier_match.group(1).strip()

        # Secrétaire
        secretaire_match = re.search(r'Secretaire\s*:\s*\n\s*([^\n]+)', text, re.IGNORECASE)
        if secretaire_match:
            info['secretaire'] = secretaire_match.group(1).strip()

    return info


def extract_players(soup):
    """Extrait la liste des joueurs actifs et inactifs"""
    players = {
        'active': [],
        'inactive': []
    }

    player_divs = soup.find_all('div', class_='div_liste_joueurs')

    if len(player_divs) < 2:
        print(f"⚠️ Seulement {len(player_divs)} div_liste_joueurs trouvées")
        return players

    for idx, div in enumerate(player_divs[:2]):
        status = 'active' if idx == 0 else 'inactive'
        links = div.find_all('a', href=re.compile(r'C_Joueur\.php\?Id='))

        for link in links:
            href = link.get('href', '')
            id_match = re.search(r'Id=(\d+)', href)
            player_id = id_match.group(1) if id_match else None
            name = link.text.strip()

            if name and player_id:
                player_data = {
                    'ffjd_id': player_id,
                    'name': name,
                    'ranking': None
                }

                parent = link.parent
                if parent:
                    text = parent.get_text()
                    ranking_match = re.search(rf'{re.escape(name)}\s*(\d+)', text)
                    if ranking_match:
                        player_data['ranking'] = int(ranking_match.group(1))

                players[status].append(player_data)

    return players


def generate_club_sql(club_info, club_uuid):
    """Génère le SQL INSERT pour le club"""
    sql = f"""-- Création du club Wattrelos
INSERT INTO clubs (id, name, city, website, status, president, vice_president, tresorier, secretaire)
VALUES (
    '{club_uuid}',
    '{escape_sql_string(club_info['name'])}',
    'Wattrelos',
    '{escape_sql_string(club_info['website'])}',
    '{club_info['status']}',
    '{escape_sql_string(club_info['president'])}',
    '{escape_sql_string(club_info['vice_president'])}',
    '{escape_sql_string(club_info['tresorier'])}',
    '{escape_sql_string(club_info['secretaire'])}'
)
ON CONFLICT (id) DO UPDATE SET
    website = EXCLUDED.website,
    status = EXCLUDED.status,
    president = EXCLUDED.president,
    vice_president = EXCLUDED.vice_president,
    tresorier = EXCLUDED.tresorier,
    secretaire = EXCLUDED.secretaire;

"""
    return sql


def import_club(club_ffjd_id, club_uuid):
    """
    Importe un club FFJD
    Retourne: (club_info, players_dict, sql_string)
    """
    print(f"📥 Récupération de la page du club {club_ffjd_id}...")
    url = f"{BASE_URL}/C_Club.php?Id={club_ffjd_id}"
    response = requests.get(url, timeout=10)
    response.encoding = 'iso-8859-1'
    soup = BeautifulSoup(response.text, 'html.parser')
    print("✅ Page récupérée\n")

    print("📊 Extraction des informations du club...")
    club_info = extract_club_info(soup)
    print(f"✅ Club: {club_info['name']}")
    print(f"   President: {club_info['president']}")
    print(f"   Vice-President: {club_info['vice_president']}")
    print(f"   Secrétaire: {club_info['secretaire']}")
    print(f"   Trésorier: {club_info['tresorier']}")
    print(f"   Website: {club_info['website']}\n")

    print("👥 Extraction des joueurs...")
    players = extract_players(soup)
    nb_active = len(players['active'])
    nb_inactive = len(players['inactive'])
    nb_total = nb_active + nb_inactive
    print(f"✅ {nb_total} joueurs trouvés ({nb_active} actifs + {nb_inactive} inactifs)\n")

    sql = generate_club_sql(club_info, club_uuid)

    return club_info, players, sql
