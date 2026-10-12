import { Room, Promotion, DiningMenuItem } from '../../types/hotel.js';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    slug: 'presidential-ocean-penthouse',
    title: 'The Presidential Ocean Penthouse',
    category: 'Presidential Suite',
    description: 'Perched on the highest crown of the Grand Azure, this palatial 185-square-meter penthouse provides unmatched 360-degree vistas across the open azure ocean and twilight skyline. Featuring handcrafted marble floors, custom Italian silk draping, a private heated infinity dip pool on your panoramic terrace, and a dedicated 24/7 personal butler. Guests enjoy complimentary Dom Pérignon champagne upon arrival, private elevator security access, and bespoke in-suite dining orchestrated by our Michelin-starred chef.',
    shortDescription: 'Palatial 185 sqm penthouse with private infinity dip pool, panoramic ocean views, and 24/7 private butler.',
    pricePerNight: 1250,
    capacityAdults: 4,
    capacityChildren: 2,
    sizeSqm: 185,
    bedType: '1 Emperor King + 1 Queen Master Bed',
    view: 'Panoramic Ocean & City Skyline View',
    floor: 'Penthouse Level (28th Floor)',
    rating: 4.98,
    reviewsCount: 48,
    isAvailable: true,
    amenities: [
      'Private Heated Infinity Plunge Pool',
      'Dedicated 24/7 Personal Butler',
      'Complimentary Dom Pérignon On Arrival',
      'Panoramic 360° Oceanfront Balcony',
      'Master Marble Bath with Hydrotherapy Jacuzzi',
      'Dornbracht Rainforest Shower & Steam Room',
      'High-Speed Wi-Fi 6',
      'Bang & Olufsen Acoustic Sound System',
      'Private Elevator Key Access',
      'Custom Bvlgari Luxury Bath Amenities'
    ],
    images: [
      '/src/assets/images/room_presidential_suite_1791847526410.jpg',
      '/src/assets/images/hotel_hero_exterior_1791847526394.jpg',
      '/src/assets/images/facility_spa_wellness_1791847527068.jpg'
    ],
    featured: true,
    totalUnits: 2
  },
  {
    id: 'room-2',
    slug: 'deluxe-azure-ocean-suite',
    title: 'Deluxe Azure Ocean Suite',
    category: 'Deluxe',
    description: 'Awaken to the soothing melody of ocean waves and golden sunrise light pouring through expansive floor-to-ceiling glass sliding doors. This 78-square-meter sanctuary features a private teak wood oceanfront terrace, custom organic linen furnishings, and an open freestanding soaking bathtub overlooking the coast. Thoughtfully appointed with curated artwork, an artisanal Illy espresso bar, and personalized evening turndown service.',
    shortDescription: 'Sunlit 78 sqm oceanfront retreat with teak terrace, freestanding soaking tub, and bespoke linen drapes.',
    pricePerNight: 580,
    capacityAdults: 3,
    capacityChildren: 1,
    sizeSqm: 78,
    bedType: '1 California King Bed',
    view: 'Direct Oceanfront View',
    floor: 'Floors 8 - 20',
    rating: 4.94,
    reviewsCount: 112,
    isAvailable: true,
    amenities: [
      'Teak Sun-Drenched Ocean Terrace',
      'Freestanding Deep Soaking Tub',
      'Walk-In Waterfall Rain Shower',
      'Illy Artisanal Espresso Bar',
      'High-Speed Wi-Fi 6',
      'Custom Le Labo Santal 33 Toiletries',
      'Bose Smart Bluetooth Audio',
      'Curated Organic Mini Bar',
      'Pillow Concierge Menu'
    ],
    images: [
      '/src/assets/images/room_deluxe_ocean_1791847526856.jpg',
      '/src/assets/images/hotel_hero_exterior_1791847526394.jpg',
      '/src/assets/images/dining_fine_restaurant_1791847527242.jpg'
    ],
    featured: true,
    totalUnits: 6
  },
  {
    id: 'room-3',
    slug: 'executive-skyline-club-suite',
    title: 'Executive Skyline Club Suite',
    category: 'Executive',
    description: 'Designed specifically for distinguished travelers and executive leaders, the Skyline Club Suite provides 95 square meters of sophisticated elegance. Includes full complimentary access to the private 22nd-floor Azure Club Lounge featuring afternoon artisanal tea, daily champagne hours, and private conference facilities. Includes an ergonomic executive workspace, leather wingback lounge chairs, and an acoustic soundproof sanctuary.',
    shortDescription: 'Sophisticated 95 sqm suite with exclusive Azure Club Lounge privileges, skyline vistas, and work lounge.',
    pricePerNight: 720,
    capacityAdults: 2,
    capacityChildren: 1,
    sizeSqm: 95,
    bedType: '1 King Bed',
    view: 'Skyline & Harbor View',
    floor: 'Floors 21 - 26',
    rating: 4.92,
    reviewsCount: 76,
    isAvailable: true,
    amenities: [
      'Exclusive Azure Club Lounge Access',
      'Complimentary Evening Champagne & Canapés',
      'Ergonomic Executive Leather Workstation',
      'Italian Marble Double Vanity Bathroom',
      'Acoustic Acoustic Triple-Glazed Glass',
      'High-Speed Enterprise Wi-Fi',
      'Daily Garment Pressing (2 Pieces)',
      'Nespresso Vertuo Coffee Station'
    ],
    images: [
      '/src/assets/images/hotel_hero_exterior_1791847526394.jpg',
      '/src/assets/images/room_deluxe_ocean_1791847526856.jpg',
      '/src/assets/images/facility_spa_wellness_1791847527068.jpg'
    ],
    featured: true,
    totalUnits: 5
  },
  {
    id: 'room-4',
    slug: 'royal-garden-sanctuary-villa',
    title: 'Royal Garden Sanctuary Villa',
    category: 'Executive',
    description: 'Secluded amid fragrant Mediterranean gardens and tranquil water features, this 130-square-meter private villa combines serene seclusion with 5-star hotel luxury. Enjoy a private stone courtyard with outdoor heated daybeds, an open-air rain bath carved from natural travertine, direct private garden pathway access to the wellness pavilion, and breakfast served on your patio.',
    shortDescription: 'Secluded 130 sqm botanical villa with private travertine stone courtyard and outdoor rain bath.',
    pricePerNight: 890,
    capacityAdults: 4,
    capacityChildren: 2,
    sizeSqm: 130,
    bedType: '2 King Beds',
    view: 'Private Botanical Courtyard View',
    floor: 'Ground Pavilion Level',
    rating: 4.96,
    reviewsCount: 64,
    isAvailable: true,
    amenities: [
      'Private Walled Garden Courtyard',
      'Outdoor Carved Travertine Bath',
      'Direct Access to Wellness Pavilion',
      'Private In-Garden Breakfast Service',
      'Dedicated Villa Host',
      'Custom Diptyque Fragrance Amenities',
      'Heated Outdoor Sun Loungers',
      'High-Speed Wi-Fi'
    ],
    images: [
      '/src/assets/images/facility_spa_wellness_1791847527068.jpg',
      '/src/assets/images/room_deluxe_ocean_1791847526856.jpg',
      '/src/assets/images/hotel_hero_exterior_1791847526394.jpg'
    ],
    featured: false,
    totalUnits: 3
  },
  {
    id: 'room-5',
    slug: 'classic-azure-deluxe-room',
    title: 'Classic Azure Deluxe Room',
    category: 'Standard',
    description: 'An elegant retreat blending contemporary comfort with timeless European hospitality. Spanning 48 square meters, each room features custom oak furnishings, plush Egyptian cotton bed dressing, a spa-inspired walk-in marble shower, and double acoustic soundproofing for an exceptionally restful night.',
    shortDescription: 'Refined 48 sqm luxury guest room with marble shower, Egyptian cotton linens, and quiet garden courtyard view.',
    pricePerNight: 340,
    capacityAdults: 2,
    capacityChildren: 1,
    sizeSqm: 48,
    bedType: '1 King Bed or 2 Twin Beds',
    view: 'Garden & Courtyard View',
    floor: 'Floors 2 - 7',
    rating: 4.88,
    reviewsCount: 140,
    isAvailable: true,
    amenities: [
      'Italian Marble Bathroom with Rain Shower',
      'Egyptian Cotton 800-Thread-Count Linens',
      'High-Speed Wi-Fi',
      'Smart 55-inch 4K OLED TV with Streaming',
      'In-Room Safe & Laptop Charger',
      'Gourmet Coffee & Herbal Tea Collection',
      'Plush Terry Robes and Slippers'
    ],
    images: [
      '/src/assets/images/room_deluxe_ocean_1791847526856.jpg',
      '/src/assets/images/hotel_hero_exterior_1791847526394.jpg'
    ],
    featured: false,
    totalUnits: 10
  },
  {
    id: 'room-6',
    slug: 'imperial-diplomatic-residence',
    title: 'Imperial Diplomatic Residence',
    category: 'Presidential Suite',
    description: 'The pinnacle of private luxury in the Grand Azure collection. Spanning 240 square meters, this diplomatic residence offers two grand living salons, a private 10-guest dining room with service pantry, bullet-resistant discreet entrance, master bedroom with dual en-suite marble spa bathrooms, and private sauna.',
    shortDescription: 'Ultimate 240 sqm diplomatic residence with two living salons, 10-person private dining, and in-suite sauna.',
    pricePerNight: 1650,
    capacityAdults: 6,
    capacityChildren: 2,
    sizeSqm: 240,
    bedType: '2 King Beds + 1 Queen Bed',
    view: 'Dual Ocean and Skyline Panorama',
    floor: 'Penthouse Crown (29th Floor)',
    rating: 5.0,
    reviewsCount: 22,
    isAvailable: true,
    amenities: [
      'Private Sauna & Steam Room',
      '10-Seat Dining Salon with Chef Pantry',
      'Dual Master En-Suite Bathrooms',
      '24/7 Dedicated Butler and Private Chauffeur',
      'Discreet VIP Security Entrance',
      'Steinway Baby Grand Piano',
      'Custom Bvlgari Imperial Spa Set',
      'Top-Shelf Private Bar Included'
    ],
    images: [
      '/src/assets/images/room_presidential_suite_1791847526410.jpg',
      '/src/assets/images/dining_fine_restaurant_1791847527242.jpg',
      '/src/assets/images/hotel_hero_exterior_1791847526394.jpg'
    ],
    featured: true,
    totalUnits: 1
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    code: 'AZURE2026',
    discountPercent: 15,
    description: '15% Seasonal Welcome Discount on stays of 2 or more nights',
    validUntil: '2026-12-31',
    minNights: 2,
    active: true
  },
  {
    code: 'HONEYMOON',
    discountPercent: 20,
    description: '20% Romantic Escape Discount + complimentary champagne',
    validUntil: '2026-11-30',
    minNights: 3,
    active: true
  },
  {
    code: 'EXECUTIVE10',
    discountPercent: 10,
    description: '10% Corporate Traveler Privileges with club lounge access',
    validUntil: '2026-12-31',
    minNights: 1,
    active: true
  }
];

export const DINING_MENU_ITEMS: DiningMenuItem[] = [
  {
    id: 'dine-1',
    name: 'Alba White Truffle Risotto',
    category: 'Starters',
    description: 'Carnaroli rice aged 2 years, cultured normandy butter, 36-month parmigiano reggiano, shaved autumn white truffle.',
    price: 48,
    dietary: ['Vegetarian', 'Gluten-Free']
  },
  {
    id: 'dine-2',
    name: 'Wild Turbot with Caviar Beurre Blanc',
    category: 'Seafood',
    description: 'Pan-roasted Atlantic turbot, braised baby leeks, Oscietra royal caviar, champagne reduction emulsified with sea butter.',
    price: 76,
    dietary: ['Signature Catch']
  },
  {
    id: 'dine-3',
    name: 'A5 Miyazaki Wagyu Tenderloin',
    category: 'Main Course',
    description: 'Charred over binchotan charcoal, smoked marrow glaze, truffled potato mousseline, baby glazed morel mushrooms.',
    price: 110,
    dietary: ['Prime Cut']
  },
  {
    id: 'dine-4',
    name: 'Valrhona Grand Cru Soufflé',
    category: 'Desserts',
    description: '70% Guanaja chocolate, Tahitian vanilla bean anglaise, house-churned pistachio gelato.',
    price: 28,
    dietary: ['Vegetarian']
  },
  {
    id: 'dine-5',
    name: 'Grand Azure Royal Smoked Negroni',
    category: 'Cocktails',
    description: 'Monkey 47 Gin, Antica Formula carpano, Campari infused with dried figs, cedar smoke cloche.',
    price: 26,
    dietary: ['Signature Cocktail']
  },
  {
    id: 'dine-6',
    name: 'Château Margaux Premier Grand Cru 2015',
    category: 'Fine Wines',
    description: 'Exceptional vintage, silken tannins, notes of blackcurrant, violet petals, and cedar box. By the bottle.',
    price: 850,
    dietary: ['Rare Vintage']
  }
];
