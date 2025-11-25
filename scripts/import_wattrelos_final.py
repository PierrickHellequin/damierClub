#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script d'import complet du club Wattrelos
Utilise 2 scripts modulaires : import_club.py et import_member.py
"""

import sys
import io
from datetime import datetime
from ffjd.import_club import import_club
from ffjd.import_member import import_member

# Configuration UTF-8 pour Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
CLUB_ID_FFJD = 8128  # Wattrelos
CLUB_UUID = "019c0000-0000-7000-8000-000000000001"


def main():
    print("=" * 80)
    print("🏁 IMPORT CLUB WATTRELOS AVEC DÉTAILS DES JOUEURS")
    print("=" * 80)
    print()

    # 1. Importer le club et récupérer la liste des membres
    club_info, players, club_sql = import_club(CLUB_ID_FFJD, CLUB_UUID)

    nb_active = len(players['active'])
    nb_inactive = len(players['inactive'])
    nb_total = nb_active + nb_inactive

    # 2. Générer le fichier SQL
    print("📝 Génération du script SQL...")
    output_file = f"import_wattrelos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Script d'import du club Wattrelos avec détails des joueurs\n")
        f.write(f"-- Généré le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"-- Source: http://www.ffjd.fr/CP/C_Club.php?Id={CLUB_ID_FFJD}\n\n")

        f.write("BEGIN;\n\n")

        # Club
        f.write(club_sql)

        # Membres actifs
        f.write(f"\n-- MEMBRES ACTIFS ({nb_active})\n")
        for i, player in enumerate(players['active'], 1):
            print(f"  [{i}/{nb_active}] {player['name']}", end='')
            member_sql = import_member(player, CLUB_UUID, is_active=True)
            f.write(member_sql)

        # Membres inactifs
        f.write(f"\n-- MEMBRES INACTIFS ({nb_inactive})\n")
        for i, player in enumerate(players['inactive'], 1):
            print(f"  [{i}/{nb_inactive}] {player['name']}", end='')
            member_sql = import_member(player, CLUB_UUID, is_active=False)
            f.write(member_sql)

        f.write("\nCOMMIT;\n")

    print(f"\n✅ Script SQL généré: {output_file}\n")

    # 3. Statistiques finales
    print("=" * 80)
    print("📊 RÉSUMÉ")
    print("=" * 80)
    print(f"CLUB: {club_info['name']}")
    print(f"MEMBRES ACTIFS: {nb_active}")
    print(f"MEMBRES INACTIFS: {nb_inactive}")
    print(f"TOTAL MEMBRES: {nb_total}")
    print(f"FICHIER SQL: {output_file}")
    print("=" * 80)
    print()
    print("💡 Pour importer dans la base de données:")
    print(f"   cat {output_file} | docker exec -i club-db psql -U clubuser -d clubdames")
    print()


if __name__ == '__main__':
    main()
