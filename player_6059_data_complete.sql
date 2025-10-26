-- Données FFJD pour HELLEQUIN-VANDAELE Pierrick
-- Générées automatiquement par parse_ffjd_complete.py
-- Date: 2025-10-26 16:41:10

-- ============================================
-- MEMBRE PRINCIPAL
-- ============================================

INSERT INTO members (id, name, first_name, last_name, email, password, rate, current_points, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000002', 'HELLEQUIN-VANDAELE', 'Pierrick', 'HELLEQUIN-VANDAELE', 'pkhv@hotmail.fr', '$2a$10$vGX7bFBPnxjtVi98RQ6q3.gahqdE7r9UGnqXfnwaFVh07p5xOi8OK', 1600, 1600, NULL, 'ADMIN', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ADVERSAIRES (Membres)
-- ============================================

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000010', 'KHIN', 'Kawsar', 'KHIN', 'opponent10@ffjd.fr', 0, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000011', 'CHARLES', 'Gilbert', 'CHARLES', 'opponent11@ffjd.fr', 1916, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000012', 'DARRY', 'Boris', 'DARRY', 'opponent12@ffjd.fr', 1897, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000013', 'DAUTREMEPUIS', 'Florian', 'DAUTREMEPUIS', 'opponent13@ffjd.fr', 1566, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000014', 'ALAVOINE', 'Mathieu', 'ALAVOINE', 'opponent14@ffjd.fr', 1194, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000015', 'BANNERY', 'Jean-Pierre', 'BANNERY', 'opponent15@ffjd.fr', 1660, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000016', 'BEAUCHENE', 'Joel', 'BEAUCHENE', 'opponent16@ffjd.fr', 1555, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000017', 'BENARD', 'Christian', 'BENARD', 'opponent17@ffjd.fr', 1436, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000018', 'BENSAFIA', 'Yoann', 'BENSAFIA', 'opponent18@ffjd.fr', 1370, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000019', 'BLANPAIN', 'Rgis', 'BLANPAIN', 'opponent19@ffjd.fr', 1972, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000020', 'BONTE', 'Robert', 'BONTE', 'opponent20@ffjd.fr', 1368, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000021', 'BOTTE', 'Philippe', 'BOTTE', 'opponent21@ffjd.fr', 1455, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000022', 'BURY', 'Igor', 'BURY', 'opponent22@ffjd.fr', 1668, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000023', 'CARTON', 'Mickael', 'CARTON', 'opponent23@ffjd.fr', 1804, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000024', 'DELEU', 'Vianney', 'DELEU', 'opponent24@ffjd.fr', 1962, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000025', 'DELMOTTE', 'Thierry', 'DELMOTTE', 'opponent25@ffjd.fr', 2236, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000026', 'DE', 'MEYER Andr', 'DE', 'opponent26@ffjd.fr', 1621, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000027', 'DHONDT', 'Jacques', 'DHONDT', 'opponent27@ffjd.fr', 1358, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000028', 'DUPLOUY', 'Sbastien', 'DUPLOUY', 'opponent28@ffjd.fr', 2083, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000029', 'DUSART', 'Patrick', 'DUSART', 'opponent29@ffjd.fr', 1458, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000030', 'EGELS', 'Freddy', 'EGELS', 'opponent30@ffjd.fr', 1678, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000031', 'FABRE', 'Jean-Nol', 'FABRE', 'opponent31@ffjd.fr', 1591, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000032', 'FALCK', 'Mario', 'FALCK', 'opponent32@ffjd.fr', 1649, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000033', 'FEREDYE', 'Antoine', 'FEREDYE', 'opponent33@ffjd.fr', 966, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000034', 'FINEZ', 'Virginie', 'FINEZ', 'opponent34@ffjd.fr', 1554, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000035', 'FONTIER', 'Grard', 'FONTIER', 'opponent35@ffjd.fr', 2048, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000036', 'GENOT', 'Jean-Pierre', 'GENOT', 'opponent36@ffjd.fr', 1572, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000037', 'GRESSIER', 'Ghislain', 'GRESSIER', 'opponent37@ffjd.fr', 1386, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000038', 'HILD', 'Bruno', 'HILD', 'opponent38@ffjd.fr', 1623, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000039', 'HOCHEDE', 'Yves', 'HOCHEDE', 'opponent39@ffjd.fr', 1569, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000040', 'HUGUIN', 'Alain', 'HUGUIN', 'opponent40@ffjd.fr', 1810, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000041', 'HUREL', 'David', 'HUREL', 'opponent41@ffjd.fr', 1589, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000042', 'HYRON', 'Jol', 'HYRON', 'opponent42@ffjd.fr', 1611, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000043', 'JAUFFRIT', 'Pascal', 'JAUFFRIT', 'opponent43@ffjd.fr', 1806, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000044', 'KALFON', 'Gilbert', 'KALFON', 'opponent44@ffjd.fr', 1861, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000045', 'KITENGE', 'Dieudonn', 'KITENGE', 'opponent45@ffjd.fr', 1859, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000046', 'LAMORY', 'Roland', 'LAMORY', 'opponent46@ffjd.fr', 1804, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000047', 'LEFEBVRE', 'Aymeric', 'LEFEBVRE', 'opponent47@ffjd.fr', 1304, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000048', 'LELEU', 'Guillaume', 'LELEU', 'opponent48@ffjd.fr', 1854, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000049', 'LEMAIRE', 'Maxime', 'LEMAIRE', 'opponent49@ffjd.fr', 2005, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000050', 'LEMAIRE', 'Thomas', 'LEMAIRE', 'opponent50@ffjd.fr', 1965, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000051', 'LE', 'QUANG Thierry', 'LE', 'opponent51@ffjd.fr', 1852, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000052', 'MACHTELINCK', 'Daniel', 'MACHTELINCK', 'opponent52@ffjd.fr', 1737, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000053', 'MAISONNAVE', 'Guy', 'MAISONNAVE', 'opponent53@ffjd.fr', 1784, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000054', 'MANGANO', 'Laurent', 'MANGANO', 'opponent54@ffjd.fr', 1536, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000055', 'MATTELIN', 'Jean', 'MATTELIN', 'opponent55@ffjd.fr', 1463, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000056', 'MERRIR', 'Hocine', 'MERRIR', 'opponent56@ffjd.fr', 1917, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000057', 'MEUNIER', 'Gal', 'MEUNIER', 'opponent57@ffjd.fr', 1561, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000058', 'MICHEL', 'Xavier', 'MICHEL', 'opponent58@ffjd.fr', 1491, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000059', 'N', 'DZODO Eric', 'N', 'opponent59@ffjd.fr', 1899, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000060', 'NORET', 'Christian', 'NORET', 'opponent60@ffjd.fr', 1375, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000061', 'PAILLET', 'Kevin', 'PAILLET', 'opponent61@ffjd.fr', 1368, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000062', 'PLAISANT', 'Georges', 'PLAISANT', 'opponent62@ffjd.fr', 1824, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000063', 'ROELENS', 'FRELIER Ren', 'ROELENS', 'opponent63@ffjd.fr', 1577, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000064', 'ROMERO', 'Georges', 'ROMERO', 'opponent64@ffjd.fr', 1541, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000065', 'SERNICLAY', 'Grard', 'SERNICLAY', 'opponent65@ffjd.fr', 1621, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000066', 'TORTEREAU', 'Pierre', 'TORTEREAU', 'opponent66@ffjd.fr', 1616, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000067', 'VANHOUTE', 'Quentin', 'VANHOUTE', 'opponent67@ffjd.fr', 1639, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000068', 'VERHELST', 'Christophe', 'VERHELST', 'opponent68@ffjd.fr', 1614, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000069', 'VERHELST', 'Jacques', 'VERHELST', 'opponent69@ffjd.fr', 1509, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000070', 'VILLAEYS', 'Alan', 'VILLAEYS', 'opponent70@ffjd.fr', 1872, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000071', 'YUSSUPOV', 'Artur', 'YUSSUPOV', 'opponent71@ffjd.fr', 1711, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000072', 'BOSSUT', 'Robin', 'BOSSUT', 'opponent72@ffjd.fr', 1105, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000073', 'RIVELLINI', 'Duncan', 'RIVELLINI', 'opponent73@ffjd.fr', 1095, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000074', 'CUBIER', 'Franck', 'CUBIER', 'opponent74@ffjd.fr', 1921, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000075', 'CHARLES', 'Quentin', 'CHARLES', 'opponent75@ffjd.fr', 1230, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000076', 'ALAVOINE', 'Steven', 'ALAVOINE', 'opponent76@ffjd.fr', 1286, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000077', 'HELLEQUIN-VANDAELE', 'Robin', 'HELLEQUIN-VANDAELE', 'opponent77@ffjd.fr', 1287, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000078', 'LOOSVELDT', 'Julien', 'LOOSVELDT', 'opponent78@ffjd.fr', 0, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000079', 'TETY', 'Alain', 'TETY', 'opponent79@ffjd.fr', 2205, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000080', 'KOPP', 'Vincent', 'KOPP', 'opponent80@ffjd.fr', 1436, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000081', 'CARTON', 'Patrick', 'CARTON', 'opponent81@ffjd.fr', 1289, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000082', 'DEKIMPE', 'Jens', 'DEKIMPE', 'opponent82@ffjd.fr', 1231, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000083', 'DENEEF', 'Bert', 'DENEEF', 'opponent83@ffjd.fr', 1322, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000084', 'ALAVOINE', 'Anthony', 'ALAVOINE', 'opponent84@ffjd.fr', 1281, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000085', 'HOUNIEUX', 'Jean', 'HOUNIEUX', 'opponent85@ffjd.fr', 1409, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000086', 'DAVID', 'Hugo', 'DAVID', 'opponent86@ffjd.fr', 1385, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000087', 'CALMELS', 'Vincent', 'CALMELS', 'opponent87@ffjd.fr', 1714, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000088', 'LE', 'GAL Mickal', 'LE', 'opponent88@ffjd.fr', 1098, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000089', 'SAUJOT', 'Aurlien', 'SAUJOT', 'opponent89@ffjd.fr', 1248, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000090', 'OLOU', 'Alexandre', 'OLOU', 'opponent90@ffjd.fr', 1547, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000091', 'VILBERT', 'Caroline', 'VILBERT', 'opponent91@ffjd.fr', 1266, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000092', 'VAN', 'DEN BROEK Thijs', 'VAN', 'opponent92@ffjd.fr', 1805, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000093', 'JOLY', 'Florent', 'JOLY', 'opponent93@ffjd.fr', 0, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000094', 'BAES', 'Alexandre', 'BAES', 'opponent94@ffjd.fr', 1093, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000095', 'DELFORTRIE', 'Maxence', 'DELFORTRIE', 'opponent95@ffjd.fr', 700, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000096', 'LEROY', 'Julien', 'LEROY', 'opponent96@ffjd.fr', 927, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000097', 'LLORENS', 'Bertrand', 'LLORENS', 'opponent97@ffjd.fr', 1195, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000098', 'LABET', 'Gabriel', 'LABET', 'opponent98@ffjd.fr', 0, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000099', 'NDJIB', 'Desir', 'NDJIB', 'opponent99@ffjd.fr', 2295, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000100', 'LECLERC', 'Anastase', 'LECLERC', 'opponent100@ffjd.fr', 732, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000101', 'ARDIN', 'Claire', 'ARDIN', 'opponent101@ffjd.fr', 961, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000102', 'VANROYEN', 'Thierry', 'VANROYEN', 'opponent102@ffjd.fr', 724, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000103', 'LECLERC', 'Eric', 'LECLERC', 'opponent103@ffjd.fr', 0, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000104', 'JENNES', 'Luc', 'JENNES', 'opponent104@ffjd.fr', 1698, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000105', 'DESMET', 'Keita', 'DESMET', 'opponent105@ffjd.fr', 0, NULL, 'USER', true);

INSERT INTO members (id, name, first_name, last_name, email, rate, club_id, role, active) VALUES
('019a0000-0000-7000-8000-000000000106', 'LEROY', 'Kenny', 'LEROY', 'opponent106@ffjd.fr', 0, NULL, 'USER', true);


-- ============================================
-- TOURNOIS
-- ============================================

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000001', 'Championnat de France semi-rapides Jeunes 2011 - Juniors phase 2', 'France', '2011-07-01', '2011-07-01', 'NATIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000002', 'Championnat de France semi-rapides Jeunes 2011 - Juniors phase 1', 'France', '2011-07-01', '2011-07-01', 'NATIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000003', 'Championnat LRNP par quipes R7 - Compigne B 5 - 3 Wattrelos C', 'France', '2011-06-01', '2011-06-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000004', 'Championnat LRNP par quipes R6 - Wattrelos C 1 - 7 Glisy', 'France', '2011-05-01', '2011-05-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000005', 'Championnat de France des jeunes 2010 - Juniors', 'France', '2010-06-01', '2010-06-01', 'NATIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000006', 'Championnat LRNP par quipes R5 - Wattrelos C 7 - 1 Bas Pays d''Artois', 'France', '2010-05-01', '2010-05-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000007', 'Championnat du Club Wattrelos 2010 - Adulte', 'France', '2010-03-01', '2010-03-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000008', 'Coupe de France 2010 - 16mes de finale Wattrelos 2 - Montrouge', 'France', '2010-03-01', '2010-03-01', 'NATIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000009', 'Championnat LRNP par quipes R4 - Bas Pays d''Artois 3 - 5 Wattrelos B', 'France', '2010-03-01', '2010-03-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000010', 'Championnat LRNP par quipes R3 - Wattrelos C 5 - 3 Leers', 'France', '2010-01-01', '2010-01-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000011', 'Championnat LRNP par quipes R2 - Heule C 5 - 3 Wattrelos C', 'France', '2009-12-01', '2009-12-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000012', 'Championnat LRNP par quipes R1 - Wattrelos B 6 - 2 Wattrelos C', 'France', '2009-11-01', '2009-11-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000013', '1er open International des jeunes  Wattrelos - Plus de 12 Ans', 'France', '2009-08-01', '2009-08-01', 'REGIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000014', 'Interclubs LRNP 2009 - Ronde 7 - Wattrelos B 2 - 6 Pelves', 'France', '2009-07-01', '2009-07-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000015', 'Championnat de France des jeunes 2009 - Juniors', 'France', '2009-07-01', '2009-07-01', 'NATIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000016', '5me Open du Douaisis - OPEN', 'France', '2009-06-01', '2009-06-01', 'REGIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000017', 'Coupe de France 2008-2009 - Finale Challenge Nantes - Wattrelos 1', 'France', '2009-06-01', '2009-06-01', 'NATIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000018', 'Coupe de France 2008-2009 - 1/2 Challenge Toulouse - Wattrelos 1', 'France', '2009-06-01', '2009-06-01', 'NATIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000019', 'Coupe de France 2008-2009 - 1/4 Lille - Wattrelos 1', 'France', '2009-06-01', '2009-06-01', 'NATIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000020', 'Interclubs LRNP 2009 - Ronde 5 - Wattrelos B 3 - 5 Glisy A', 'France', '2009-05-01', '2009-05-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000021', 'Championnat du Club Wattrelos 2009 - Poule commune', 'France', '2009-04-01', '2009-04-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000022', 'Championnat du Nord 2009 - Srie 2', 'France', '2009-02-01', '2009-02-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000023', 'Interclubs LRNP 2009 - Ronde 3 - Wattrelos B 4 - 4 Heule A', 'France', '2009-01-01', '2009-01-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000024', 'Interclubs LRNP 2009 - Ronde 2 - Wattrelos C 0 - 8 La Chapelle d''Armentires', 'France', '2008-12-01', '2008-12-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000025', 'Interclubs LRNP 2009 - Ronde 1 - Wattrelos B 1 - 7 Wattrelos A', 'France', '2008-11-01', '2008-11-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000026', 'Chpt du Club Wattrelos 2008 - Phase Finale - 1er Division', 'France', '2008-08-01', '2008-08-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000027', 'Championnat de la LRNP 2008 - Homologation Finale 18/05/2008', 'France', '2008-06-01', '2008-06-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000028', 'Interclub LRNP 2008 (Finale) - La Chapelle 3 - 5 Wattrelos C', 'France', '2008-06-01', '2008-06-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000029', 'Championnat de France des jeunes 2008 - Cadets', 'France', '2008-06-01', '2008-06-01', 'NATIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000030', 'Chpt du Club Wattrelos 2008 - Poule A', 'France', '2008-06-01', '2008-06-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000031', 'Championnat de la LRNP 2008 - Srie Promotion', 'France', '2008-06-01', '2008-06-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000032', 'Interclubs LRNP 2008 (R6 D1 - R8 D2) - Wattrelos C 5 - 3 Pelves B', 'France', '2008-05-01', '2008-05-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000033', 'Interclubs LRNP 2008 (R5 D1 - R7 D2) - Wattrelos C 5 - 3 Bas Pays d''Artois', 'France', '2008-04-01', '2008-04-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000034', 'Open de Cannes 2008 - Open National', 'France', '2008-03-01', '2008-03-01', 'REGIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000035', 'Championnat de la LRNP 2008 - Homologation 3me journe - 02/02/2008', 'France', '2008-03-01', '2008-03-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000036', 'Interclubs LRNP 2008 (R5 - Division 2) - Leers 3 - 5 Wattrelos C', 'France', '2008-02-01', '2008-02-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000037', 'Championnat du Nord - 3eme Serie', 'France', '2008-02-01', '2008-02-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000038', 'Interclubs LRNP 2008 (R4 - Division 2) - Wattrelos C 3 - 5 Glisy A', 'France', '2008-02-01', '2008-02-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000039', 'Championnat de la LRNP 2008 - Homologation 2me journe - 09/12/2007', 'France', '2008-01-01', '2008-01-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000040', 'Interclubs LRNP 2008 (R3) - Glisy B 2 - 6 Wattrelos C', 'France', '2008-01-01', '2008-01-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000041', 'Championnat de la LRNP 2008 - Homologation 1re journe - 18/11/2007', 'France', '2007-12-01', '2007-12-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000042', 'Interclubs LRNP 2008 (R1) - Wattrelos B 1 - 7 Wattrelos C', 'France', '2007-11-01', '2007-11-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000043', 'Tournoi du Club Damier Toulousain 2007 - 1re srie', 'France', '2007-07-01', '2007-07-01', 'REGIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000044', 'Coupe de France 1/4 - 1/2 - Finale - 1/4 -1/2 - Finale', 'France', '2007-07-01', '2007-07-01', 'NATIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000045', 'Coupe de France 1/8 - Le Mans - Wattrelos 2', 'France', '2007-07-01', '2007-07-01', 'NATIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000046', 'Interclubs LRNP 2007 (R6) - Wattrelos C - Compigne A', 'France', '2007-07-01', '2007-07-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000047', '21me chpt de l''acadmie de Lille - Catgorie Collge', 'France', '2007-07-01', '2007-07-01', 'REGIONAL', 'TOURNOI', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000048', 'Chpt de France des jeunes 2007 - Cadets', 'France', '2007-07-01', '2007-07-01', 'NATIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000049', 'Chpt du Club de Wattrelos 2007 - 2me serie', 'France', '2007-07-01', '2007-07-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000050', 'Interclubs LRNP 2007 (R4) - Bas Pays d''Artois - Wattrelos C', 'France', '2007-04-01', '2007-04-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000051', 'Chpt de la LRNP 2006-2007 - Promotion B', 'France', '2007-04-01', '2007-04-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000052', 'Interclubs LRNP 2007 (R3) - Wattrelos D - Wattrelos C', 'France', '2007-01-01', '2007-01-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000053', 'Interclubs LRNP 2007 (R1) - Arleux B - Wattrelos C', 'France', '2007-01-01', '2007-01-01', 'REGIONAL', 'CHAMPIONNAT', true);

INSERT INTO tournaments (id, name, location, start_date, end_date, category, type, active) VALUES
('019a1000-0000-7000-8000-000000000054', 'Chpt LRNP 2006 - Promotion C', 'France', '2006-10-01', '2006-10-01', 'REGIONAL', 'CHAMPIONNAT', true);


-- ============================================
-- PARTICIPATIONS AUX TOURNOIS
-- ============================================

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0054-7000-8000-000000000000', '019a1000-0000-7000-8000-000000000054', '019a0000-0000-7000-8000-000000000002', NULL, 66, 4, 0, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0052-7000-8000-000000000001', '019a1000-0000-7000-8000-000000000052', '019a0000-0000-7000-8000-000000000002', NULL, 17, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0053-7000-8000-000000000002', '019a1000-0000-7000-8000-000000000053', '019a0000-0000-7000-8000-000000000002', NULL, -17, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0050-7000-8000-000000000003', '019a1000-0000-7000-8000-000000000050', '019a0000-0000-7000-8000-000000000002', NULL, 21, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0051-7000-8000-000000000004', '019a1000-0000-7000-8000-000000000051', '019a0000-0000-7000-8000-000000000002', NULL, 72, 4, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0043-7000-8000-000000000005', '019a1000-0000-7000-8000-000000000043', '019a0000-0000-7000-8000-000000000002', NULL, -4, 1, 3, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0044-7000-8000-000000000006', '019a1000-0000-7000-8000-000000000044', '019a0000-0000-7000-8000-000000000002', NULL, -22, 0, 2, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0045-7000-8000-000000000007', '019a1000-0000-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000002', NULL, 15, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0046-7000-8000-000000000008', '019a1000-0000-7000-8000-000000000046', '019a0000-0000-7000-8000-000000000002', NULL, -13, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0047-7000-8000-000000000009', '019a1000-0000-7000-8000-000000000047', '019a0000-0000-7000-8000-000000000002', NULL, -6, 3, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0048-7000-8000-000000000010', '019a1000-0000-7000-8000-000000000048', '019a0000-0000-7000-8000-000000000002', NULL, -8, 5, 2, 2);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0049-7000-8000-000000000011', '019a1000-0000-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000002', NULL, -18, 1, 4, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0042-7000-8000-000000000012', '019a1000-0000-7000-8000-000000000042', '019a0000-0000-7000-8000-000000000002', NULL, 12, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0041-7000-8000-000000000013', '019a1000-0000-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000002', NULL, 18, 2, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0039-7000-8000-000000000014', '019a1000-0000-7000-8000-000000000039', '019a0000-0000-7000-8000-000000000002', NULL, -20, 0, 1, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0040-7000-8000-000000000015', '019a1000-0000-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000002', NULL, 14, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0036-7000-8000-000000000016', '019a1000-0000-7000-8000-000000000036', '019a0000-0000-7000-8000-000000000002', NULL, 16, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0037-7000-8000-000000000017', '019a1000-0000-7000-8000-000000000037', '019a0000-0000-7000-8000-000000000002', NULL, 3, 2, 1, 2);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0038-7000-8000-000000000018', '019a1000-0000-7000-8000-000000000038', '019a0000-0000-7000-8000-000000000002', NULL, 8, 0, 0, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0034-7000-8000-000000000019', '019a1000-0000-7000-8000-000000000034', '019a0000-0000-7000-8000-000000000002', NULL, 19, 3, 3, 3);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0035-7000-8000-000000000020', '019a1000-0000-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000002', NULL, 9, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0033-7000-8000-000000000021', '019a1000-0000-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000002', NULL, 15, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0032-7000-8000-000000000022', '019a1000-0000-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000002', NULL, 9, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0027-7000-8000-000000000023', '019a1000-0000-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000002', NULL, 1, 1, 0, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0028-7000-8000-000000000024', '019a1000-0000-7000-8000-000000000028', '019a0000-0000-7000-8000-000000000002', NULL, 14, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0029-7000-8000-000000000025', '019a1000-0000-7000-8000-000000000029', '019a0000-0000-7000-8000-000000000002', NULL, -1, 6, 1, 2);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0030-7000-8000-000000000026', '019a1000-0000-7000-8000-000000000030', '019a0000-0000-7000-8000-000000000002', NULL, 11, 5, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0031-7000-8000-000000000027', '019a1000-0000-7000-8000-000000000031', '019a0000-0000-7000-8000-000000000002', NULL, 0, 4, 1, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0026-7000-8000-000000000028', '019a1000-0000-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000002', NULL, 6, 1, 1, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0025-7000-8000-000000000029', '019a1000-0000-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000002', NULL, -6, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0024-7000-8000-000000000030', '019a1000-0000-7000-8000-000000000024', '019a0000-0000-7000-8000-000000000002', NULL, -10, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0023-7000-8000-000000000031', '019a1000-0000-7000-8000-000000000023', '019a0000-0000-7000-8000-000000000002', NULL, 4, 0, 0, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0022-7000-8000-000000000032', '019a1000-0000-7000-8000-000000000022', '019a0000-0000-7000-8000-000000000002', NULL, 3, 4, 3, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0021-7000-8000-000000000033', '019a1000-0000-7000-8000-000000000021', '019a0000-0000-7000-8000-000000000002', NULL, -6, 4, 3, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0020-7000-8000-000000000034', '019a1000-0000-7000-8000-000000000020', '019a0000-0000-7000-8000-000000000002', NULL, -20, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0016-7000-8000-000000000035', '019a1000-0000-7000-8000-000000000016', '019a0000-0000-7000-8000-000000000002', NULL, -12, 1, 4, 2);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0017-7000-8000-000000000036', '019a1000-0000-7000-8000-000000000017', '019a0000-0000-7000-8000-000000000002', NULL, 12, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0018-7000-8000-000000000037', '019a1000-0000-7000-8000-000000000018', '019a0000-0000-7000-8000-000000000002', NULL, -2, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0019-7000-8000-000000000038', '019a1000-0000-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000002', NULL, -2, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0014-7000-8000-000000000039', '019a1000-0000-7000-8000-000000000014', '019a0000-0000-7000-8000-000000000002', NULL, -5, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0015-7000-8000-000000000040', '019a1000-0000-7000-8000-000000000015', '019a0000-0000-7000-8000-000000000002', NULL, 9, 5, 0, 4);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0013-7000-8000-000000000041', '019a1000-0000-7000-8000-000000000013', '019a0000-0000-7000-8000-000000000002', NULL, -6, 5, 2, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0012-7000-8000-000000000042', '019a1000-0000-7000-8000-000000000012', '019a0000-0000-7000-8000-000000000002', NULL, -9, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0011-7000-8000-000000000043', '019a1000-0000-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000002', NULL, 6, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0010-7000-8000-000000000044', '019a1000-0000-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000002', NULL, 13, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0007-7000-8000-000000000045', '019a1000-0000-7000-8000-000000000007', '019a0000-0000-7000-8000-000000000002', NULL, 18, 3, 3, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0008-7000-8000-000000000046', '019a1000-0000-7000-8000-000000000008', '019a0000-0000-7000-8000-000000000002', NULL, -10, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0009-7000-8000-000000000047', '019a1000-0000-7000-8000-000000000009', '019a0000-0000-7000-8000-000000000002', NULL, -22, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0006-7000-8000-000000000048', '019a1000-0000-7000-8000-000000000006', '019a0000-0000-7000-8000-000000000002', NULL, 10, 1, 0, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0005-7000-8000-000000000049', '019a1000-0000-7000-8000-000000000005', '019a0000-0000-7000-8000-000000000002', NULL, -3, 6, 2, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0004-7000-8000-000000000050', '019a1000-0000-7000-8000-000000000004', '019a0000-0000-7000-8000-000000000002', NULL, -26, 0, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0003-7000-8000-000000000051', '019a1000-0000-7000-8000-000000000003', '019a0000-0000-7000-8000-000000000002', NULL, 1, 0, 0, 1);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0001-7000-8000-000000000052', '019a1000-0000-7000-8000-000000000001', '019a0000-0000-7000-8000-000000000002', NULL, 1, 4, 1, 0);

INSERT INTO tournament_participations (id, tournament_id, member_id, points_after, points_change, victories, defeats, draws) VALUES
('019a2000-0002-7000-8000-000000000053', '019a1000-0000-7000-8000-000000000002', '019a0000-0000-7000-8000-000000000002', NULL, 6, 4, 0, 1);


-- ============================================
-- MATCHS (Games)
-- ============================================

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000001', '019a2000-0001-7000-8000-000000000052', '019a0000-0000-7000-8000-000000000094', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000002', '019a2000-0001-7000-8000-000000000052', '019a0000-0000-7000-8000-000000000074', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000003', '019a2000-0001-7000-8000-000000000052', '019a0000-0000-7000-8000-000000000076', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000004', '019a2000-0001-7000-8000-000000000052', '019a0000-0000-7000-8000-000000000010', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000005', '019a2000-0001-7000-8000-000000000052', '019a0000-0000-7000-8000-000000000033', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000006', '019a2000-0002-7000-8000-000000000053', '019a0000-0000-7000-8000-000000000094', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000007', '019a2000-0002-7000-8000-000000000053', '019a0000-0000-7000-8000-000000000076', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000008', '019a2000-0002-7000-8000-000000000053', '019a0000-0000-7000-8000-000000000033', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000009', '019a2000-0002-7000-8000-000000000053', '019a0000-0000-7000-8000-000000000074', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000010', '019a2000-0002-7000-8000-000000000053', '019a0000-0000-7000-8000-000000000010', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000011', '019a2000-0003-7000-8000-000000000051', '019a0000-0000-7000-8000-000000000015', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000012', '019a2000-0004-7000-8000-000000000050', '019a0000-0000-7000-8000-000000000091', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000013', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000077', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000014', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000014', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000015', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000078', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000016', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000071', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000017', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000023', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000018', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000080', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000019', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000097', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000020', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000034', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000021', '019a2000-0005-7000-8000-000000000049', '019a0000-0000-7000-8000-000000000076', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000022', '019a2000-0006-7000-8000-000000000048', '019a0000-0000-7000-8000-000000000055', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000023', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000028', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000024', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000012', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000025', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000050', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000026', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000070', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000027', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000056', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000028', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000030', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000029', '019a2000-0007-7000-8000-000000000045', '019a0000-0000-7000-8000-000000000011', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000030', '019a2000-0008-7000-8000-000000000046', '019a0000-0000-7000-8000-000000000043', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000031', '019a2000-0009-7000-8000-000000000047', '019a0000-0000-7000-8000-000000000055', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000032', '019a2000-0010-7000-8000-000000000044', '019a0000-0000-7000-8000-000000000034', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000033', '019a2000-0011-7000-8000-000000000043', '019a0000-0000-7000-8000-000000000083', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000034', '019a2000-0012-7000-8000-000000000042', '019a0000-0000-7000-8000-000000000012', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000035', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000106', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000036', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000089', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000037', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000095', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000038', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000096', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000039', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000084', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000040', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000082', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000041', '019a2000-0013-7000-8000-000000000041', '019a0000-0000-7000-8000-000000000105', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000042', '019a2000-0014-7000-8000-000000000039', '019a0000-0000-7000-8000-000000000019', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000043', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000101', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000044', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000088', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000045', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000013', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000046', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000023', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000047', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000066', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000048', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000071', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000049', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000034', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000050', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000014', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000051', '019a2000-0015-7000-8000-000000000040', '019a0000-0000-7000-8000-000000000018', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000052', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000079', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000053', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000084', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000054', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000065', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000055', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000104', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000056', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000035', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000057', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000023', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000058', '019a2000-0016-7000-8000-000000000035', '019a0000-0000-7000-8000-000000000060', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000059', '019a2000-0017-7000-8000-000000000036', '019a0000-0000-7000-8000-000000000016', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000060', '019a2000-0018-7000-8000-000000000037', '019a0000-0000-7000-8000-000000000025', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000061', '019a2000-0019-7000-8000-000000000038', '019a0000-0000-7000-8000-000000000099', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000062', '019a2000-0020-7000-8000-000000000034', '019a0000-0000-7000-8000-000000000058', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000063', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000049', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000064', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000103', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000065', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000077', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000066', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000012', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000067', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000050', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000068', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000100', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000069', '019a2000-0021-7000-8000-000000000033', '019a0000-0000-7000-8000-000000000102', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000070', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000041', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000071', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000063', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000072', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000012', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000073', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000052', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000074', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000013', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000075', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000038', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000076', '019a2000-0022-7000-8000-000000000032', '019a0000-0000-7000-8000-000000000026', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000077', '019a2000-0023-7000-8000-000000000031', '019a0000-0000-7000-8000-000000000092', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000078', '019a2000-0024-7000-8000-000000000030', '019a0000-0000-7000-8000-000000000048', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000079', '019a2000-0025-7000-8000-000000000029', '019a0000-0000-7000-8000-000000000049', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000080', '019a2000-0026-7000-8000-000000000028', '019a0000-0000-7000-8000-000000000024', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000081', '019a2000-0026-7000-8000-000000000028', '019a0000-0000-7000-8000-000000000012', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000082', '019a2000-0026-7000-8000-000000000028', '019a0000-0000-7000-8000-000000000050', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000083', '019a2000-0027-7000-8000-000000000023', '019a0000-0000-7000-8000-000000000090', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000084', '019a2000-0027-7000-8000-000000000023', '019a0000-0000-7000-8000-000000000081', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000085', '019a2000-0028-7000-8000-000000000024', '019a0000-0000-7000-8000-000000000041', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000086', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000080', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000087', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000066', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000088', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000086', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000089', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000075', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000090', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000074', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000091', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000013', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000092', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000077', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000093', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000047', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000094', '019a2000-0029-7000-8000-000000000025', '019a0000-0000-7000-8000-000000000076', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000095', '019a2000-0030-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000018', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000096', '019a2000-0030-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000094', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000097', '019a2000-0030-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000049', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000098', '019a2000-0030-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000012', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000099', '019a2000-0030-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000037', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000100', '019a2000-0030-7000-8000-000000000026', '019a0000-0000-7000-8000-000000000020', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000101', '019a2000-0031-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000014', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000102', '019a2000-0031-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000027', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000103', '019a2000-0031-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000068', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000104', '019a2000-0031-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000021', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000105', '019a2000-0031-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000037', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000106', '019a2000-0031-7000-8000-000000000027', '019a0000-0000-7000-8000-000000000081', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000107', '019a2000-0032-7000-8000-000000000022', '019a0000-0000-7000-8000-000000000017', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000108', '019a2000-0033-7000-8000-000000000021', '019a0000-0000-7000-8000-000000000065', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000109', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000044', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000110', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000031', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000111', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000085', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000112', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000040', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000113', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000046', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000114', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000064', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000115', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000051', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000116', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000039', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000117', '019a2000-0034-7000-8000-000000000019', '019a0000-0000-7000-8000-000000000036', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000118', '019a2000-0035-7000-8000-000000000020', '019a0000-0000-7000-8000-000000000037', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000119', '019a2000-0036-7000-8000-000000000016', '019a0000-0000-7000-8000-000000000068', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000120', '019a2000-0037-7000-8000-000000000017', '019a0000-0000-7000-8000-000000000069', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000121', '019a2000-0037-7000-8000-000000000017', '019a0000-0000-7000-8000-000000000034', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000122', '019a2000-0037-7000-8000-000000000017', '019a0000-0000-7000-8000-000000000063', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000123', '019a2000-0037-7000-8000-000000000017', '019a0000-0000-7000-8000-000000000068', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000124', '019a2000-0037-7000-8000-000000000017', '019a0000-0000-7000-8000-000000000021', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000125', '019a2000-0038-7000-8000-000000000018', '019a0000-0000-7000-8000-000000000062', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000126', '019a2000-0039-7000-8000-000000000014', '019a0000-0000-7000-8000-000000000068', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000127', '019a2000-0039-7000-8000-000000000014', '019a0000-0000-7000-8000-000000000021', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000128', '019a2000-0040-7000-8000-000000000015', '019a0000-0000-7000-8000-000000000090', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000129', '019a2000-0041-7000-8000-000000000013', '019a0000-0000-7000-8000-000000000014', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000130', '019a2000-0041-7000-8000-000000000013', '019a0000-0000-7000-8000-000000000027', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000131', '019a2000-0042-7000-8000-000000000012', '019a0000-0000-7000-8000-000000000029', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000132', '019a2000-0043-7000-8000-000000000005', '019a0000-0000-7000-8000-000000000053', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000133', '019a2000-0043-7000-8000-000000000005', '019a0000-0000-7000-8000-000000000032', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000134', '019a2000-0043-7000-8000-000000000005', '019a0000-0000-7000-8000-000000000059', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000135', '019a2000-0043-7000-8000-000000000005', '019a0000-0000-7000-8000-000000000066', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000136', '019a2000-0043-7000-8000-000000000005', '019a0000-0000-7000-8000-000000000087', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000137', '019a2000-0044-7000-8000-000000000006', '019a0000-0000-7000-8000-000000000045', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000138', '019a2000-0044-7000-8000-000000000006', '019a0000-0000-7000-8000-000000000067', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000139', '019a2000-0044-7000-8000-000000000006', '019a0000-0000-7000-8000-000000000071', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000140', '019a2000-0045-7000-8000-000000000007', '019a0000-0000-7000-8000-000000000042', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000141', '019a2000-0046-7000-8000-000000000008', '019a0000-0000-7000-8000-000000000022', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000142', '019a2000-0047-7000-8000-000000000009', '019a0000-0000-7000-8000-000000000013', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000143', '019a2000-0047-7000-8000-000000000009', '019a0000-0000-7000-8000-000000000072', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000144', '019a2000-0047-7000-8000-000000000009', '019a0000-0000-7000-8000-000000000073', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000145', '019a2000-0047-7000-8000-000000000009', '019a0000-0000-7000-8000-000000000093', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000146', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000098', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000147', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000088', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000148', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000047', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000149', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000061', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000150', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000014', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000151', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000023', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000152', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000037', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000153', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000071', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000154', '019a2000-0048-7000-8000-000000000010', '019a0000-0000-7000-8000-000000000013', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000155', '019a2000-0049-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000057', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000156', '019a2000-0049-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000012', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000157', '019a2000-0049-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000037', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000158', '019a2000-0049-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000068', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000159', '019a2000-0049-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000038', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000160', '019a2000-0049-7000-8000-000000000011', '019a0000-0000-7000-8000-000000000063', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000161', '019a2000-0050-7000-8000-000000000003', '019a0000-0000-7000-8000-000000000065', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000162', '019a2000-0051-7000-8000-000000000004', '019a0000-0000-7000-8000-000000000054', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000163', '019a2000-0051-7000-8000-000000000004', '019a0000-0000-7000-8000-000000000023', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000164', '019a2000-0051-7000-8000-000000000004', '019a0000-0000-7000-8000-000000000017', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000165', '019a2000-0051-7000-8000-000000000004', '019a0000-0000-7000-8000-000000000068', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000166', '019a2000-0051-7000-8000-000000000004', '019a0000-0000-7000-8000-000000000015', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000167', '019a2000-0052-7000-8000-000000000001', '019a0000-0000-7000-8000-000000000063', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000168', '019a2000-0053-7000-8000-000000000002', '019a0000-0000-7000-8000-000000000017', 'LOSS');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000169', '019a2000-0054-7000-8000-000000000000', '019a0000-0000-7000-8000-000000000069', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000170', '019a2000-0054-7000-8000-000000000000', '019a0000-0000-7000-8000-000000000023', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000171', '019a2000-0054-7000-8000-000000000000', '019a0000-0000-7000-8000-000000000060', 'DRAW');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000172', '019a2000-0054-7000-8000-000000000000', '019a0000-0000-7000-8000-000000000013', 'WIN');

INSERT INTO games (id, participation_id, opponent_id, result) VALUES
('019a3000-0000-7000-8000-000000000173', '019a2000-0054-7000-8000-000000000000', '019a0000-0000-7000-8000-000000000020', 'WIN');


-- Fin du fichier
