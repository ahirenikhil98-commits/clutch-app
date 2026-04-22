-- ── CLUTCH seed data ────────────────────────────────────────────
-- Run this after schema.sql

-- Cars
insert into cars (id, name, brand, segment, fuel, hue) values
  (1,  'Maruti Alto K10',        'Maruti',   'Hatchback',   'Petrol',         '#E53935'),
  (2,  'Tata Tiago',             'Tata',     'Hatchback',   'Petrol/CNG',     '#1E88E5'),
  (3,  'Maruti WagonR',          'Maruti',   'Hatchback',   'Petrol/CNG',     '#E53935'),
  (4,  'Tata Punch',             'Tata',     'Hatchback',   'Petrol',         '#1E88E5'),
  (5,  'Maruti Swift',           'Maruti',   'Hatchback',   'Petrol',         '#E53935'),
  (6,  'Hyundai Grand i10 Nios', 'Hyundai',  'Hatchback',   'Petrol/CNG',     '#0D47A1'),
  (7,  'Maruti Baleno',          'Maruti',   'Hatchback',   'Petrol',         '#E53935'),
  (8,  'Hyundai i20',            'Hyundai',  'Hatchback',   'Petrol',         '#0D47A1'),
  (9,  'Maruti Dzire',           'Maruti',   'Sedan',       'Petrol/CNG',     '#E53935'),
  (10, 'Hyundai Aura',           'Hyundai',  'Sedan',       'Petrol/CNG',     '#0D47A1'),
  (11, 'Honda Amaze',            'Honda',    'Sedan',       'Petrol',         '#CC0000'),
  (12, 'Maruti Ciaz',            'Maruti',   'Sedan',       'Petrol',         '#E53935'),
  (13, 'Honda City',             'Honda',    'Sedan',       'Petrol',         '#CC0000'),
  (14, 'Nissan Magnite',         'Nissan',   'Compact SUV', 'Petrol',         '#C62828'),
  (15, 'Renault Kiger',          'Renault',  'Compact SUV', 'Petrol',         '#FFB300'),
  (16, 'Hyundai Venue',          'Hyundai',  'Compact SUV', 'Petrol',         '#0D47A1'),
  (17, 'Tata Nexon',             'Tata',     'Compact SUV', 'Petrol/EV',      '#1E88E5'),
  (18, 'Kia Sonet',              'Kia',      'Compact SUV', 'Petrol/Diesel',  '#FC5A03'),
  (19, 'Maruti Brezza',          'Maruti',   'Compact SUV', 'Petrol/CNG',     '#E53935'),
  (20, 'Maruti Grand Vitara',    'Maruti',   'Compact SUV', 'Hybrid',         '#E53935'),
  (21, 'Toyota Hyryder',         'Toyota',   'Compact SUV', 'Hybrid',         '#333333'),
  (22, 'Hyundai Creta',          'Hyundai',  'SUV',         'Petrol/Diesel',  '#0D47A1'),
  (23, 'Kia Seltos',             'Kia',      'SUV',         'Petrol/Diesel',  '#FC5A03'),
  (24, 'Mahindra Scorpio N',     'Mahindra', 'SUV',         'Petrol/Diesel',  '#D32F2F'),
  (25, 'Mahindra XUV700',        'Mahindra', 'SUV',         'Petrol/Diesel',  '#D32F2F'),
  (26, 'MG Hector',              'MG',       'SUV',         'Petrol/Hybrid',  '#B71C1C'),
  (27, 'Tata Harrier',           'Tata',     'SUV',         'Diesel',         '#1E88E5'),
  (28, 'Tata Safari',            'Tata',     'SUV',         'Diesel',         '#1E88E5')
on conflict (id) do nothing;

-- Variants
insert into variants (car_id, name, price) values
  -- Maruti Alto K10
  (1, 'Std',     399000), (1, 'VXi',     449000), (1, 'VXi+',    499000), (1, 'VXi AGS', 534000),
  -- Tata Tiago
  (2, 'XE',      560000), (2, 'XM',      620000), (2, 'XT',      690000), (2, 'XZ+',     770000),
  -- Maruti WagonR
  (3, 'LXi',     554000), (3, 'VXi',     609000), (3, 'ZXi',     660000), (3, 'ZXi AGS', 699000),
  -- Tata Punch
  (4, 'Pure',       606000), (4, 'Adventure',   715000), (4, 'Accomplished', 810000), (4, 'Creative',   960000),
  -- Maruti Swift
  (5, 'LXi',     649000), (5, 'VXi',     729000), (5, 'ZXi',     849000), (5, 'ZXi+',    949000),
  -- Hyundai Grand i10 Nios
  (6, 'Era',     572000), (6, 'Magna',   640000), (6, 'Sportz',  730000), (6, 'Asta',    810000),
  -- Maruti Baleno
  (7, 'Sigma',   672000), (7, 'Delta',   765000), (7, 'Zeta',    855000), (7, 'Alpha',   965000),
  -- Hyundai i20
  (8, 'Magna',   704000), (8, 'Sportz',  836000), (8, 'Asta',    999000), (8, 'Asta(O)', 1121000),
  -- Maruti Dzire
  (9, 'LXi',     679000), (9, 'VXi',     779000), (9, 'ZXi',     879000), (9, 'ZXi+',    999000),
  -- Hyundai Aura
  (10, 'E',      630000), (10, 'S',      729000), (10, 'SX',     829000), (10, 'SX+',    899000),
  -- Honda Amaze
  (11, 'E',      799000), (11, 'S',      879000), (11, 'VX',     959000), (11, 'ZX',     1009000),
  -- Maruti Ciaz
  (12, 'Sigma',  941000), (12, 'Delta',  1010000), (12, 'Zeta',  1075000), (12, 'Alpha', 1140000),
  -- Honda City
  (13, 'V',      1189000), (13, 'VX',    1309000), (13, 'ZX',    1459000), (13, 'ZX CVT', 1529000),
  -- Nissan Magnite
  (14, 'XE',     600000), (14, 'XL',     720000), (14, 'XV',     840000), (14, 'XV Premium', 960000),
  -- Renault Kiger
  (15, 'RXE',    600000), (15, 'RXL',    710000), (15, 'RXT',    830000), (15, 'RXZ',    940000),
  -- Hyundai Venue
  (16, 'E',      794000), (16, 'S',      889000), (16, 'S+',     999000), (16, 'SX(O)',  1189000),
  -- Tata Nexon
  (17, 'Smart',  810000), (17, 'Pure',   935000), (17, 'Creative', 1100000), (17, 'Fearless+', 1310000),
  -- Kia Sonet
  (18, 'HTE',    799000), (18, 'HTK',    889000), (18, 'HTK+',   1059000), (18, 'HTX+',  1249000),
  -- Maruti Brezza
  (19, 'LXi',    834000), (19, 'VXi',    935000), (19, 'ZXi',    1089000), (19, 'ZXi+',  1199000),
  -- Maruti Grand Vitara
  (20, 'Sigma',  1070000), (20, 'Delta', 1150000), (20, 'Zeta',  1320000), (20, 'Alpha', 1510000),
  -- Toyota Hyryder
  (21, 'E',      1073000), (21, 'G',     1189000), (21, 'S',     1349000), (21, 'V',     1510000),
  -- Hyundai Creta
  (22, 'E',      1100000), (22, 'EX',    1230000), (22, 'S',     1399000), (22, 'SX(O)', 1699000),
  -- Kia Seltos
  (23, 'HTE',    1090000), (23, 'HTK+',  1279000), (23, 'HTX+',  1459000), (23, 'X-Line', 1699000),
  -- Mahindra Scorpio N
  (24, 'Z4',     1360000), (24, 'Z6',    1489000), (24, 'Z8',    1619000), (24, 'Z8 L',  1879000),
  -- Mahindra XUV700
  (25, 'MX',     1399000), (25, 'AX3',   1549000), (25, 'AX5',   1729000), (25, 'AX7 L', 1999000),
  -- MG Hector
  (26, 'Style',  1399000), (26, 'Super', 1599000), (26, 'Smart', 1789000), (26, 'Savvy', 1999000),
  -- Tata Harrier
  (27, 'Smart',  1499000), (27, 'Pure+', 1669000), (27, 'Adventure+', 1879000), (27, 'Fearless+', 2089000),
  -- Tata Safari
  (28, 'Smart',  1600000), (28, 'Pure+', 1789000), (28, 'Adventure+', 1989000), (28, 'Accomplished+', 2299000)
on conflict do nothing;
