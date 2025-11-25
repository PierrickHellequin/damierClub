# Scripts d'import FFJD

Scripts modulaires pour importer des clubs et membres depuis le site FFJD.

## Structure

```
scripts/
├── ffjd/
│   ├── import_club.py    # Import d'UN club
│   └── import_member.py  # Import d'UN membre
└── import_wattrelos_final.py  # Orchestrateur
```

## Usage rapide

### Import complet Wattrelos
```bash
python import_wattrelos_final.py
cat import_wattrelos_*.sql | docker exec -i club-db psql -U clubuser -d clubdames
```

## Modules réutilisables

### import_club.py
Importe UN club + liste des membres

### import_member.py  
Importe UN membre avec détails (points, titre, etc.)

## Données importées
- first_name, last_name
- current_points (ELO)
- ffjd_id
- ranking
- active/inactive

Durée: ~10 min pour 187 membres
