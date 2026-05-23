// ============================================================
//  DATA.JS — Données initiales Tours Lise B. — Saison 2025
//  Structure unifiée : 1 tour = infos + pourboires + lignes travail
// ============================================================

const SEED_2025 = [
  {
    id: 'tour_2025_1',
    date: '2025-07-24', label: '24 juillet AM',
    ship: 'Marina (1)', activity: 'Discover New France', bus: '5', adults: 37, children: 0, escort: 0,
    photo: null,
    tips: { can: 90, us: 63, eur: 0, aud: 40 },
    workLines: [
      { id: 'wl1', meetTime: '09:35', arriveTime: '12:35', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_2',
    date: '2025-07-24', label: '24 juillet PM',
    ship: 'Marina (1)', activity: 'Discover New France', bus: '5', adults: 37, children: 0, escort: 0,
    photo: null,
    tips: { can: 0, us: 0, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl2', meetTime: '13:30', arriveTime: '16:20', consideredHrs: 3.33, sent: 73.26 }
    ]
  },
  {
    id: 'tour_2025_3',
    date: '2025-07-29', label: '29 juillet',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 49, us: 25, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl3', meetTime: '12:15', arriveTime: '16:35', consideredHrs: 4.75, sent: 104.50 }
    ]
  },
  {
    id: 'tour_2025_4',
    date: '2025-08-03', label: '3 août',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 5, us: 35, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl4', meetTime: '13:35', arriveTime: '17:35', consideredHrs: 4.50, sent: 99.00 }
    ]
  },
  {
    id: 'tour_2025_5',
    date: '2025-08-08', label: '8 août',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 53, us: 20, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl5', meetTime: '13:00', arriveTime: '15:15', consideredHrs: 4.75, sent: 104.50 }
    ]
  },
  {
    id: 'tour_2025_6',
    date: '2025-08-28', label: '28 août',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 33, us: 73, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl6', meetTime: '13:15', arriveTime: '17:20', consideredHrs: 5.25, sent: 115.50 }
    ]
  },
  {
    id: 'tour_2025_7',
    date: '2025-08-30', label: '30 août',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 10, us: 30, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl7', meetTime: '08:52', arriveTime: '12:05', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_8',
    date: '2025-09-07', label: '7 septembre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 0, us: 5, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl8', meetTime: '09:00', arriveTime: '16:30', consideredHrs: 7.50, sent: 165.00 }
    ]
  },
  {
    id: 'tour_2025_9',
    date: '2025-09-11', label: '11 septembre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 75, us: 75, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl9', meetTime: '09:00', arriveTime: '14:30', consideredHrs: 5.50, sent: 121.00 }
    ]
  },
  {
    id: 'tour_2025_10',
    date: '2025-09-12', label: '12 septembre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 19, us: 63, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl10', meetTime: '08:00', arriveTime: '15:30', consideredHrs: 7.50, sent: 165.00 }
    ]
  },
  {
    id: 'tour_2025_11',
    date: '2025-09-13', label: '13 septembre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 50, us: 5, eur: 5, aud: 0 },
    workLines: [
      { id: 'wl11', meetTime: '12:40', arriveTime: '16:35', consideredHrs: 4.00, sent: 88.00 }
    ]
  },
  {
    id: 'tour_2025_12',
    date: '2025-09-15', label: '15 septembre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 105, us: 0, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl12', meetTime: '09:00', arriveTime: '13:40', consideredHrs: 4.75, sent: 104.50 }
    ]
  },
  {
    id: 'tour_2025_13',
    date: '2025-09-17', label: '17 septembre AM',
    ship: 'Mein Schiff (1)', activity: "Whale Watching L'Anse St-Jean", bus: '30', adults: 39, children: 0, escort: 1,
    photo: null,
    tips: { can: 200, us: 31, eur: 10, aud: 0 },
    workLines: [
      { id: 'wl13', meetTime: '07:45', arriveTime: '17:25', consideredHrs: 9.75, sent: 339.50 }
    ]
  },
  {
    id: 'tour_2025_14',
    date: '2025-09-18', label: '18 septembre',
    ship: 'Viking Mars 2', activity: "Whale Watching L'Anse-Jean", bus: '4', adults: 25, children: 0, escort: 0,
    photo: null,
    tips: { can: 35, us: 35, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl14', meetTime: '08:00', arriveTime: '15:20', consideredHrs: 7.25, sent: 159.50 }
    ]
  },
  {
    id: 'tour_2025_15',
    date: '2025-09-23', label: '23 septembre',
    ship: 'Sojourn 3', activity: 'Saguenay National Park', bus: '6,7,8', adults: 28, children: 0, escort: 3,
    photo: null,
    tips: { can: 10, us: 15, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl15', meetTime: '12:30', arriveTime: '17:25', consideredHrs: 5.00, sent: 110.00 }
    ]
  },
  {
    id: 'tour_2025_16',
    date: '2025-09-25', label: '25 septembre',
    ship: 'Norwegian Gem (2)', activity: 'Discover New France', bus: '16', adults: 36, children: 0, escort: 0,
    photo: null,
    tips: { can: 25, us: 95, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl16', meetTime: '14:00', arriveTime: '17:25', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_17',
    date: '2025-09-27', label: '27 septembre 1er tour',
    ship: 'Splendor', activity: 'Saguenay National Park', bus: '14+15', adults: 19, children: 0, escort: 1,
    photo: null,
    tips: { can: 52, us: 69, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl17', meetTime: '13:00', arriveTime: '19:35', consideredHrs: 6.50, sent: 143.00 }
    ]
  },
  {
    id: 'tour_2025_18',
    date: '2025-09-27', label: '27 septembre 2e tour',
    ship: 'Splendor 2', activity: 'Saguenay National Park', bus: '1+2', adults: 36, children: 0, escort: 0,
    photo: null,
    tips: { can: 0, us: 0, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl18', meetTime: '13:00', arriveTime: '19:35', consideredHrs: 6.50, sent: 143.00 }
    ]
  },
  {
    id: 'tour_2025_19',
    date: '2025-10-01', label: '1 octobre',
    ship: 'Majestic Princess 4', activity: "Discover Fjord's Treasures", bus: 'Blue 14', adults: 26, children: 0, escort: 0,
    photo: null,
    tips: { can: 27, us: 75, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl19', meetTime: '08:00', arriveTime: '14:10', consideredHrs: 5.25, sent: 115.50 }
    ]
  },
  {
    id: 'tour_2025_20',
    date: '2025-10-03', label: '3 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 40, us: 57, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl20', meetTime: '12:30', arriveTime: '16:00', consideredHrs: 4.50, sent: 99.00 }
    ]
  },
  {
    id: 'tour_2025_21',
    date: '2025-10-06', label: '6 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 20, us: 130, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl21', meetTime: '08:00', arriveTime: '15:25', consideredHrs: 7.50, sent: 165.00 }
    ]
  },
  {
    id: 'tour_2025_22',
    date: '2025-10-07', label: '7 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 65, us: 0, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl22', meetTime: '10:00', arriveTime: '15:30', consideredHrs: 5.50, sent: 121.00 }
    ]
  },
  {
    id: 'tour_2025_23',
    date: '2025-10-09', label: '9 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 82, us: 65, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl23', meetTime: '08:00', arriveTime: '15:40', consideredHrs: 7.75, sent: 170.50 }
    ]
  },
  {
    id: 'tour_2025_24',
    date: '2025-10-12', label: '12 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 58, us: 33, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl24', meetTime: '08:00', arriveTime: '15:35', consideredHrs: 7.50, sent: 165.00 }
    ]
  },
  {
    id: 'tour_2025_25',
    date: '2025-10-13', label: '13 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 48, us: 21, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl25', meetTime: '12:00', arriveTime: '15:35', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_26',
    date: '2025-10-17', label: '17 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 30, us: 110, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl26', meetTime: '09:00', arriveTime: '16:40', consideredHrs: 7.75, sent: 170.50 }
    ]
  },
  {
    id: 'tour_2025_27',
    date: '2025-10-18', label: '18 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 73, us: 55, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl27', meetTime: '08:45', arriveTime: '12:10', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_28',
    date: '2025-10-19', label: '19 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 10, us: 90, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl28', meetTime: '13:00', arriveTime: '16:30', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_29',
    date: '2025-10-20', label: '20 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 85, us: 70, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl29', meetTime: '08:30', arriveTime: '16:00', consideredHrs: 7.50, sent: 165.00 }
    ]
  },
  {
    id: 'tour_2025_30',
    date: '2025-10-25', label: '25 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 0, us: 60, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl30', meetTime: '12:45', arriveTime: '15:15', consideredHrs: 3.50, sent: 99.00 }
    ]
  },
  {
    id: 'tour_2025_31',
    date: '2025-10-26', label: '26 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 65, us: 74, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl31', meetTime: '12:45', arriveTime: '16:10', consideredHrs: 3.50, sent: 77.00 }
    ]
  },
  {
    id: 'tour_2025_32',
    date: '2025-10-29', label: '29 octobre',
    ship: '', activity: '', bus: '', adults: 0, children: 0, escort: 0,
    photo: null,
    tips: { can: 46, us: 50, eur: 0, aud: 0 },
    workLines: [
      { id: 'wl32', meetTime: '12:30', arriveTime: '17:15', consideredHrs: 4.75, sent: 104.50 }
    ]
  }
];
