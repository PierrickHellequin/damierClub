#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parser HTML complet pour extraire les données FFJD
Méthode : détection des adversaires par la présence de liens <a href='C_Joueur.php'>
"""

import re
from datetime import datetime
from collections import defaultdict

# Configuration
PLAYER_NAME = "HELLEQUIN-VANDAELE Pierrick"
MEMBER_ID = "019a0000-0000-7000-8000-000000000002"
HTML_FILE = "player_6059.html"
OUTPUT_SQL = "player_6059_data_complete.sql"

class Tournament:
    def __init__(self, name, serie, evolution, performance, homologation, games):
        self.name = name
        self.serie = serie
        self.evolution = evolution
        self.performance = performance
        self.homologation = homologation
        self.games = games

    def get_date(self):
        """Convertir MM/YYYY en date PostgreSQL"""
        if self.homologation:
            parts = self.homologation.split('/')
            if len(parts) == 2:
                month, year = parts
                return f"20{year}-{month.zfill(2)}-01" if len(year) == 2 else f"{year}-{month.zfill(2)}-01"
        return "2000-01-01"

class Game:
    def __init__(self, opponent_name, opponent_id, opponent_rating, result, score):
        self.opponent_name = opponent_name
        self.opponent_id = opponent_id
        self.opponent_rating = opponent_rating
        self.result = result  # WIN, LOSS, DRAW
        self.score = score

def extract_text_between(text, start, end):
    """Extraire le texte entre deux marqueurs"""
    pattern = re.escape(start) + r'(.*?)' + re.escape(end)
    match = re.search(pattern, text)
    return match.group(1) if match else None

def clean_html(text):
    """Nettoyer les balises HTML"""
    return re.sub(r'<[^>]+>', '', text).strip()

def parse_tournament_block(block):
    """Parser un bloc de tournoi"""
    # Extraire le nom du tournoi
    tournament_match = re.search(r"<A class=titre HREF='C_Tournoi\.php\?Id=\d+'>([^<]+)</A>", block)
    tournament_name = tournament_match.group(1) if tournament_match else "Unknown"

    # Extraire la série
    serie_match = re.search(r"Srie : <B><A class=titre HREF='C_Serie\.php\?Id=\d+'>([^<]+)</A>", block)
    serie_name = serie_match.group(1) if serie_match else "Unknown"

    # Extraire l'évolution
    evolution_match = re.search(r"Evolution : <B>([+-]?\d+)</B>", block)
    evolution = int(evolution_match.group(1)) if evolution_match else 0

    # Extraire la performance
    performance_match = re.search(r"Performance : <B>(\d+)</B>", block)
    performance = int(performance_match.group(1)) if performance_match else 0

    # Extraire la date d'homologation
    homol_match = re.search(r"Homol\. : (\d{2}/\d{4})", block)
    homologation = homol_match.group(1) if homol_match else None

    # Parser les matchs
    games = parse_games(block)

    return Tournament(tournament_name, serie_name, evolution, performance, homologation, games)

def parse_games(block):
    """Parser tous les matchs d'un tournoi"""
    games = []

    # Trouver toutes les lignes de match
    # Format réel du HTML: <TD><TD><TD align=left>JOUEUR<TD align=center>SCORE<TD align=left>ADVERSAIRE
    # Note: pas de <TR> au début de chaque ligne de match, et pas de fermeture </TR>
    # La fin peut être <TR, </table, ou fin de chaîne
    game_pattern = r'<TD><TD><TD align=left>(.*?)<TD align=center>(.*?)<TD align=left>(.*?)(?=<TR|<tr|</table|$)'

    for match in re.finditer(game_pattern, block, re.IGNORECASE | re.DOTALL):
        left_player = match.group(1)
        score_section = match.group(2)
        right_player = match.group(3)

        # Extraire le score (chercher X-<SCRIPT>...('Y')...)
        # Note: Resultat_Oppose('Y') est une fonction JS qui inverse le résultat
        # Donc si le HTML dit "0-Resultat_Oppose('0')", le score réel est "0-2"
        score_match = re.search(r"(\d+)-<SCRIPT>.*?Resultat_Oppose\('(\d+)'\)", score_section)
        if not score_match:
            continue

        left_score = int(score_match.group(1))
        right_score_html = int(score_match.group(2))

        # Inverser le right_score car Resultat_Oppose inverse le résultat
        # 0 devient 2, 2 devient 0, 1 reste 1
        right_score = 2 - right_score_html

        # Déterminer qui est le joueur et qui est l'adversaire
        # Méthode fiable : détecter par le nom du joueur (HELLEQUIN-VANDAELE)
        opponent_data = None
        result = None

        # Vérifier si le joueur est à gauche ou à droite en cherchant son nom
        if PLAYER_NAME in clean_html(left_player):
            # Joueur à gauche, adversaire à droite
            opponent_data = parse_opponent(right_player)
            # Le score se lit toujours gauche-droite, donc left_score est le score du joueur
            if left_score == 2:
                result = "WIN"
            elif left_score == 0:
                result = "LOSS"
            else:
                result = "DRAW"
        elif PLAYER_NAME in clean_html(right_player):
            # Joueur à droite, adversaire à gauche
            opponent_data = parse_opponent(left_player)
            # Le score se lit toujours gauche-droite, donc right_score est le score du joueur
            if right_score == 2:
                result = "WIN"
            elif right_score == 0:
                result = "LOSS"
            else:
                result = "DRAW"
        else:
            # Fallback : utiliser la détection par lien
            left_has_link = bool(re.search(r"<a href='C_Joueur\.php\?Id=(\d+)'>", left_player))
            right_has_link = bool(re.search(r"<a href='C_Joueur\.php\?Id=(\d+)'>", right_player))

            if left_has_link and not right_has_link:
                # Adversaire à gauche, joueur à droite
                opponent_data = parse_opponent(left_player)
                if right_score == 2:
                    result = "WIN"
                elif right_score == 0:
                    result = "LOSS"
                else:
                    result = "DRAW"
            elif right_has_link and not left_has_link:
                # Joueur à gauche, adversaire à droite
                opponent_data = parse_opponent(right_player)
                if left_score == 2:
                    result = "WIN"
                elif left_score == 0:
                    result = "LOSS"
                else:
                    result = "DRAW"

        if opponent_data and result:
            score_str = f"{left_score}-{right_score}"
            games.append(Game(
                opponent_data['name'],
                opponent_data['id'],
                opponent_data['rating'],
                result,
                score_str
            ))

    return games

def parse_opponent(html_text):
    """Extraire les informations de l'adversaire"""
    # Extraire l'ID FFJD
    id_match = re.search(r"<a href='C_Joueur\.php\?Id=(\d+)'>([^<]+)</a>", html_text)
    if not id_match:
        # Fallback: extraire le nom sans lien
        name_match = re.search(r"([A-Z\-]+(?:\s+[A-Z][a-z]+)*)", clean_html(html_text))
        if name_match:
            return {
                'id': None,
                'name': name_match.group(1).strip(),
                'rating': extract_rating(html_text)
            }
        return None

    ffjd_id = id_match.group(1)
    opponent_name = id_match.group(2).strip()

    # Extraire le rating (nombre entre parenthèses)
    rating = extract_rating(html_text)

    return {
        'id': ffjd_id,
        'name': opponent_name,
        'rating': rating
    }

def extract_rating(text):
    """Extraire le rating entre parenthèses"""
    rating_match = re.search(r'\((\d+)\)', text)
    if rating_match:
        return int(rating_match.group(1))
    # Chercher NC (non classé)
    if 'NC' in text or 'nc' in text:
        return 0
    return None

def main():
    print("[*] Lecture du fichier HTML...")

    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Trouver la ligne 377 qui contient toutes les données
    # En réalité, les données sont dans une grande balise TABLE
    # Chercher le début du tableau des tournois
    table_match = re.search(r"<TABLE class='border2b'.*?</TABLE>", html_content, re.DOTALL | re.IGNORECASE)

    if not table_match:
        print("[!] Impossible de trouver le tableau des tournois")
        return

    table_content = table_match.group(0)

    print("[+] Tableau trouve")

    # Séparer les tournois par <HR>
    tournament_blocks = re.split(r'<TR\s+height=25><TD colspan=6><HR>', table_content, flags=re.IGNORECASE)

    print(f"[*] Nombre de blocs trouves: {len(tournament_blocks)}")

    tournaments = []
    all_opponents = {}  # {ffjd_id: opponent_data}

    # Compteurs de debug
    total_matches_found = 0
    skipped_no_score = 0
    skipped_no_opponent = 0

    for i, block in enumerate(tournament_blocks):
        if 'Tournoi :' not in block:
            continue

        tournament = parse_tournament_block(block)
        tournaments.append(tournament)

        # Collecter les adversaires uniques
        for game in tournament.games:
            if game.opponent_id:
                if game.opponent_id not in all_opponents:
                    all_opponents[game.opponent_id] = {
                        'name': game.opponent_name,
                        'rating': game.opponent_rating
                    }

    print(f"[+] {len(tournaments)} tournois parses")
    print(f"[+] {len(all_opponents)} adversaires uniques trouves")

    # Calculer le total de matchs
    total_games = sum(len(t.games) for t in tournaments)
    print(f"[+] {total_games} matchs trouves")

    # Générer le fichier SQL
    generate_sql(tournaments, all_opponents)

    print(f"[+] Fichier SQL genere: {OUTPUT_SQL}")

def generate_sql(tournaments, opponents):
    """Générer le fichier SQL complet"""

    # Note: Le rating actuel est celui de FFJD (à mettre à jour manuellement)
    # Ne pas calculer à partir des tournois car le système FFJD est complexe
    final_rate = 1624  # Rating actuel FFJD (à jour le 2025-01-26)

    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("-- Données FFJD pour HELLEQUIN-VANDAELE Pierrick\n")
        f.write("-- Générées automatiquement par parse_ffjd_complete.py\n")
        f.write(f"-- Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

        # Section 0: Créer le membre principal si besoin
        f.write("-- ============================================\n")
        f.write("-- MEMBRE PRINCIPAL\n")
        f.write("-- ============================================\n\n")

        # Hash BCrypt du mot de passe "123456" (généré par le backend)
        password_hash = '$2a$10$vGX7bFBPnxjtVi98RQ6q3.gahqdE7r9UGnqXfnwaFVh07p5xOi8OK'

        f.write(f"INSERT INTO members (id, name, first_name, last_name, email, password, rate, current_points, club_id, role, active) VALUES\n")
        f.write(f"('{MEMBER_ID}', 'HELLEQUIN-VANDAELE', 'Pierrick', 'HELLEQUIN-VANDAELE', 'pkhv@hotmail.fr', '{password_hash}', {final_rate}, {final_rate}, NULL, 'ADMIN', true)\n")
        f.write(f"ON CONFLICT (id) DO NOTHING;\n\n")

        # Section 1: Adversaires
        f.write("-- ============================================\n")
        f.write("-- ADVERSAIRES (Membres)\n")
        f.write("-- ============================================\n\n")

        opponent_uuid_map = {}  # {ffjd_id: uuid}

        for idx, (ffjd_id, data) in enumerate(sorted(opponents.items()), start=10):
            # Séparer prénom et nom
            parts = data['name'].split(maxsplit=1)
            if len(parts) == 2:
                last_name, first_name = parts
            else:
                last_name = data['name']
                first_name = ""

            # Générer un UUID v7 pour chaque adversaire (commence à 10 pour éviter collision avec membre #2)
            uuid = f"019a0000-0000-7000-8000-{str(idx).zfill(12)}"
            opponent_uuid_map[ffjd_id] = uuid

            # rate ne peut pas être NULL, utiliser 0 par défaut pour les joueurs non classés (NC)
            rating = data['rating'] if data['rating'] else 0

            f.write(f"INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES\n")
            f.write(f"('{uuid}', '{last_name}', '{first_name}', '{last_name}', 'opponent{idx}@ffjd.fr', {rating}, NULL, 'USER', true);\n\n")

        # Section 2: Tournois
        f.write("\n-- ============================================\n")
        f.write("-- TOURNOIS\n")
        f.write("-- ============================================\n\n")

        tournament_uuid_map = {}  # {index: uuid}

        for idx, tournament in enumerate(tournaments, start=1):
            tournament_uuid = f"019a1000-0000-7000-8000-{str(idx).zfill(12)}"
            tournament_uuid_map[idx] = tournament_uuid

            tournament_date = tournament.get_date()

            # Déterminer la catégorie (REGIONAL par défaut pour les championnats LRNP, NATIONAL pour les championnats de France)
            category = "NATIONAL" if "France" in tournament.name else "REGIONAL"

            # Déterminer le type
            if "Championnat" in tournament.name or "Chpt" in tournament.name:
                tournament_type = "CHAMPIONNAT"
            elif "Coupe" in tournament.name:
                tournament_type = "TOURNOI"
            elif "Interclub" in tournament.name:
                tournament_type = "CHAMPIONNAT"
            else:
                tournament_type = "TOURNOI"

            f.write(f"INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES\n")
            f.write(f"('{tournament_uuid}', '{escape_sql(tournament.name)} - {escape_sql(tournament.serie)}', 'France', '{tournament_date}', '{tournament_date}', '{category}', '{tournament_type}', true);\n\n")

        # Section 3: Participations
        f.write("\n-- ============================================\n")
        f.write("-- PARTICIPATIONS AUX TOURNOIS\n")
        f.write("-- ============================================\n\n")

        participation_uuid_map = {}  # {tournament_idx: participation_uuid}

        # Parcourir les tournois en ordre chronologique (du plus ancien au plus récent)
        sorted_tournaments = sorted(enumerate(tournaments, start=1), key=lambda x: x[1].get_date())

        for idx, (tournament_idx, tournament) in enumerate(sorted_tournaments):
            tournament_uuid = tournament_uuid_map[tournament_idx]

            participation_uuid = f"019a2000-{str(tournament_idx).zfill(4)}-7000-8000-{str(idx).zfill(12)}"
            participation_uuid_map[tournament_idx] = participation_uuid

            # L'évolution est stockée mais on ne calcule pas les points_after/points_change
            # car le système de points FFJD est complexe (recalculs, homologations, etc.)
            points_change = tournament.evolution

            # Calculer victoires, défaites, nuls
            victories = sum(1 for g in tournament.games if g.result == "WIN")
            defeats = sum(1 for g in tournament.games if g.result == "LOSS")
            draws = sum(1 for g in tournament.games if g.result == "DRAW")

            # On laisse points_after à NULL car il sera renseigné manuellement ou via l'API FFJD
            f.write(f"INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES\n")
            f.write(f"('{participation_uuid}', '{tournament_uuid}', '{MEMBER_ID}', NULL, {points_change}, {victories}, {defeats}, {draws});\n\n")

        # Section 4: Matchs
        f.write("\n-- ============================================\n")
        f.write("-- MATCHS (Games)\n")
        f.write("-- ============================================\n\n")

        game_counter = 1

        for tournament_idx, tournament in enumerate(tournaments, start=1):
            participation_uuid = participation_uuid_map[tournament_idx]

            for game in tournament.games:
                game_uuid = f"019a3000-0000-7000-8000-{str(game_counter).zfill(12)}"

                # Trouver l'UUID de l'adversaire
                opponent_uuid = opponent_uuid_map.get(game.opponent_id, 'NULL')
                if opponent_uuid != 'NULL':
                    opponent_uuid = f"'{opponent_uuid}'"

                f.write(f"INSERT INTO games (id, participation_id, opponent_id, result) VALUES\n")
                f.write(f"('{game_uuid}', '{participation_uuid}', {opponent_uuid}, '{game.result}');\n\n")

                game_counter += 1

        # Section 5: Historique des points
        # Note: L'historique des points n'est pas généré car les points seront gérés manuellement
        # ou via l'API FFJD ultérieurement

        f.write("\n-- Fin du fichier\n")

def escape_sql(text):
    """Échapper les apostrophes pour SQL"""
    return text.replace("'", "''")

if __name__ == '__main__':
    main()
