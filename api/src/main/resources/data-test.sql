-- Script SQL pour insérer des données de test réalistes
-- Basé sur le profil réel de Pierrick HELLEQUIN-VANDAELE (FFJD #6059)

-- ============================================
-- 1. MISE À JOUR DU MEMBRE EXISTANT
-- ============================================

-- Mettre à jour le membre avec les vraies données
UPDATE members
SET
    first_name = 'Pierrick',
    last_name = 'HELLEQUIN-VANDAELE',
    name = 'phellequin',
    licence_number = '6059',
    current_points = 1626,
    registration_date = '2019-01-01',
    birth_date = '1990-05-15',
    gender = 'M',
    city = 'Wattrelos',
    address = '15 rue de la République',
    phone = '06 12 34 56 78',
    active = false -- Non actif selon le profil FFJD
WHERE id = '019a0000-0000-7000-8000-000000000002';

-- ============================================
-- 2. CRÉATION DES TOURNOIS
-- ============================================

-- Tournoi 1: Championnat de France 2024
INSERT INTO tournaments (id, name, start_date, end_date, type, category, location, description, active)
VALUES (
    '019c0000-0000-7000-8000-000000000001',
    'Championnat de France 2024',
    '2024-05-15',
    '2024-05-19',
    'CHAMPIONNAT',
    'NATIONAL',
    'Paris',
    'Championnat de France des clubs de jeu de dames',
    true
);

-- Tournoi 2: Open de Marseille 2024
INSERT INTO tournaments (id, name, start_date, end_date, type, category, location, description, active)
VALUES (
    '019c0000-0000-7000-8000-000000000002',
    'Open de Marseille',
    '2024-06-20',
    '2024-06-23',
    'TOURNOI',
    'OPEN',
    'Marseille',
    'Open international de Marseille',
    true
);

-- Tournoi 3: Blitz de Paris 2024
INSERT INTO tournaments (id, name, start_date, type, category, location, description, active)
VALUES (
    '019c0000-0000-7000-8000-000000000003',
    'Blitz de Paris',
    '2024-07-05',
    'BLITZ',
    'OPEN',
    'Paris',
    'Tournoi de parties rapides',
    true
);

-- Tournoi 4: Open de Nice 2024
INSERT INTO tournaments (id, name, start_date, end_date, type, category, location, description, active)
VALUES (
    '019c0000-0000-7000-8000-000000000004',
    'Open de Nice',
    '2024-08-10',
    '2024-08-13',
    'TOURNOI',
    'OPEN',
    'Nice',
    'Open de la Côte d''Azur',
    true
);

-- Tournoi 5: Championnat Hauts-de-France 2024
INSERT INTO tournaments (id, name, start_date, end_date, type, category, location, description, active)
VALUES (
    '019c0000-0000-7000-8000-000000000005',
    'Championnat Hauts-de-France',
    '2024-09-22',
    '2024-09-24',
    'CHAMPIONNAT',
    'REGIONAL',
    'Lille',
    'Championnat régional Hauts-de-France',
    true
);

-- Tournoi 6: Open International Paris 2024
INSERT INTO tournaments (id, name, start_date, end_date, type, category, location, description, active)
VALUES (
    '019c0000-0000-7000-8000-000000000006',
    'Open International Paris',
    '2024-10-15',
    '2024-10-20',
    'TOURNOI',
    'INTERNATIONAL',
    'Paris',
    'Grand open international de Paris',
    true
);

-- ============================================
-- 3. CRÉATION D'ADVERSAIRES FICTIFS
-- ============================================

-- Adversaire 1: Sophie Bernard
INSERT INTO members (id, name, first_name, last_name, email, current_points, active, registration_date, gender, rate)
VALUES (
    '019c0001-0000-7000-8000-000000000001',
    'sbernard',
    'Sophie',
    'BERNARD',
    'sophie.bernard@example.com',
    1680,
    true,
    '2018-03-15',
    'F',
    1680
);

-- Adversaire 2: Jean Martin
INSERT INTO members (id, name, first_name, last_name, email, current_points, active, registration_date, gender, rate)
VALUES (
    '019c0001-0000-7000-8000-000000000002',
    'jmartin',
    'Jean',
    'MARTIN',
    'jean.martin@example.com',
    1720,
    true,
    '2017-09-20',
    'M',
    1720
);

-- Adversaire 3: Paul Lefebvre
INSERT INTO members (id, name, first_name, last_name, email, current_points, active, registration_date, gender, rate)
VALUES (
    '019c0001-0000-7000-8000-000000000003',
    'plefebvre',
    'Paul',
    'LEFEBVRE',
    'paul.lefebvre@example.com',
    1590,
    true,
    '2019-01-10',
    'M',
    1590
);

-- Adversaire 4: Thomas Blanc
INSERT INTO members (id, name, first_name, last_name, email, current_points, active, registration_date, gender, rate)
VALUES (
    '019c0001-0000-7000-8000-000000000004',
    'tblanc',
    'Thomas',
    'BLANC',
    'thomas.blanc@example.com',
    1650,
    true,
    '2020-02-05',
    'M',
    1650
);

-- Adversaire 5: Julie Roux
INSERT INTO members (id, name, first_name, last_name, email, current_points, active, registration_date, gender, rate)
VALUES (
    '019c0001-0000-7000-8000-000000000005',
    'jroux',
    'Julie',
    'ROUX',
    'julie.roux@example.com',
    1610,
    true,
    '2019-06-12',
    'F',
    1610
);

-- ============================================
-- 4. PARTICIPATIONS AUX TOURNOIS
-- ============================================

-- Participation 1: Championnat de France (4ème place)
INSERT INTO tournament_participations (id, member_id, tournament_id, place, points_change, points_after, victories, defeats, draws)
VALUES (
    '019c0002-0000-7000-8000-000000000001',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000001',
    '4ème',
    40,
    1580,
    7,
    3,
    2
);

-- Participation 2: Open de Marseille (1er place)
INSERT INTO tournament_participations (id, member_id, tournament_id, place, points_change, points_after, victories, defeats, draws)
VALUES (
    '019c0002-0000-7000-8000-000000000002',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000002',
    '1er',
    60,
    1640,
    10,
    0,
    0
);

-- Participation 3: Blitz de Paris (8ème place)
INSERT INTO tournament_participations (id, member_id, tournament_id, place, points_change, points_after, victories, defeats, draws)
VALUES (
    '019c0002-0000-7000-8000-000000000003',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000003',
    '8ème',
    -10,
    1630,
    5,
    5,
    2
);

-- Participation 4: Open de Nice (2ème place)
INSERT INTO tournament_participations (id, member_id, tournament_id, place, points_change, points_after, victories, defeats, draws)
VALUES (
    '019c0002-0000-7000-8000-000000000004',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000004',
    '2ème',
    30,
    1660,
    9,
    1,
    0
);

-- Participation 5: Championnat Hauts-de-France (3ème place)
INSERT INTO tournament_participations (id, member_id, tournament_id, place, points_change, points_after, victories, defeats, draws)
VALUES (
    '019c0002-0000-7000-8000-000000000005',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000005',
    '3ème',
    20,
    1680,
    8,
    2,
    0
);

-- Participation 6: Open International Paris (5ème place)
INSERT INTO tournament_participations (id, member_id, tournament_id, place, points_change, points_after, victories, defeats, draws)
VALUES (
    '019c0002-0000-7000-8000-000000000006',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000006',
    '5ème',
    -40,
    1640,
    6,
    3,
    1
);

-- ============================================
-- 5. PARTIES JOUÉES (exemples pour quelques tournois)
-- ============================================

-- Parties du Championnat de France
INSERT INTO games (id, participation_id, opponent_id, result, color, played_at)
VALUES
    ('019c0003-0000-7000-8000-000000000001', '019c0002-0000-7000-8000-000000000001', '019c0001-0000-7000-8000-000000000001', 'WIN', 'WHITE', '2024-05-15 10:00:00'),
    ('019c0003-0000-7000-8000-000000000002', '019c0002-0000-7000-8000-000000000001', '019c0001-0000-7000-8000-000000000002', 'LOSS', 'BLACK', '2024-05-15 14:00:00'),
    ('019c0003-0000-7000-8000-000000000003', '019c0002-0000-7000-8000-000000000001', '019c0001-0000-7000-8000-000000000003', 'WIN', 'WHITE', '2024-05-16 10:00:00');

-- Parties de l'Open de Marseille
INSERT INTO games (id, participation_id, opponent_id, result, color, played_at)
VALUES
    ('019c0003-0000-7000-8000-000000000010', '019c0002-0000-7000-8000-000000000002', '019c0001-0000-7000-8000-000000000004', 'WIN', 'BLACK', '2024-06-20 10:00:00'),
    ('019c0003-0000-7000-8000-000000000011', '019c0002-0000-7000-8000-000000000002', '019c0001-0000-7000-8000-000000000005', 'WIN', 'WHITE', '2024-06-20 14:00:00');

-- Parties du Championnat Hauts-de-France
INSERT INTO games (id, participation_id, opponent_id, result, color, played_at)
VALUES
    ('019c0003-0000-7000-8000-000000000020', '019c0002-0000-7000-8000-000000000005', '019c0001-0000-7000-8000-000000000004', 'WIN', 'WHITE', '2024-09-22 10:00:00'),
    ('019c0003-0000-7000-8000-000000000021', '019c0002-0000-7000-8000-000000000005', '019c0001-0000-7000-8000-000000000005', 'WIN', 'BLACK', '2024-09-22 14:00:00'),
    ('019c0003-0000-7000-8000-000000000022', '019c0002-0000-7000-8000-000000000005', '019c0001-0000-7000-8000-000000000001', 'LOSS', 'WHITE', '2024-09-23 10:00:00');

-- ============================================
-- 6. HISTORIQUE DES POINTS
-- ============================================

-- Point de départ (Janvier 2024)
INSERT INTO points_history (id, member_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000001',
    '019a0000-0000-7000-8000-000000000002',
    1540,
    1540,
    0,
    'Points initiaux 2024',
    '2024-01-01 00:00:00'
);

-- Championnat de France (Mai 2024)
INSERT INTO points_history (id, member_id, tournament_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000002',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000001',
    1540,
    1580,
    40,
    'Championnat de France 2024',
    '2024-05-19 18:00:00'
);

-- Open de Marseille (Juin 2024)
INSERT INTO points_history (id, member_id, tournament_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000003',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000002',
    1580,
    1640,
    60,
    'Open de Marseille',
    '2024-06-23 18:00:00'
);

-- Blitz de Paris (Juillet 2024)
INSERT INTO points_history (id, member_id, tournament_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000004',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000003',
    1640,
    1630,
    -10,
    'Blitz de Paris',
    '2024-07-05 18:00:00'
);

-- Open de Nice (Août 2024)
INSERT INTO points_history (id, member_id, tournament_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000005',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000004',
    1630,
    1660,
    30,
    'Open de Nice',
    '2024-08-13 18:00:00'
);

-- Championnat Hauts-de-France (Septembre 2024)
INSERT INTO points_history (id, member_id, tournament_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000006',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000005',
    1660,
    1680,
    20,
    'Championnat Hauts-de-France',
    '2024-09-24 18:00:00'
);

-- Open International Paris (Octobre 2024)
INSERT INTO points_history (id, member_id, tournament_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000007',
    '019a0000-0000-7000-8000-000000000002',
    '019c0000-0000-7000-8000-000000000006',
    1680,
    1640,
    -40,
    'Open International Paris',
    '2024-10-20 18:00:00'
);

-- Ajustement final pour correspondre au capital actuel (1626)
INSERT INTO points_history (id, member_id, points_before, points_after, points_change, reason, changed_at)
VALUES (
    '019c0004-0000-7000-8000-000000000008',
    '019a0000-0000-7000-8000-000000000002',
    1640,
    1626,
    -14,
    'Ajustement classement',
    '2024-11-01 00:00:00'
);
