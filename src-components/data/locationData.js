/**
 * ShambaNi Multi-Country Location Data
 * Covers Uganda, Kenya, Tanzania, and Rwanda
 * Used in farmer registration, buyer registration, and filtering
 */

export const COUNTRIES = [
  { code: 'UG', name: 'Uganda', currency: 'UGX', phoneCode: '+256' },
  { code: 'KE', name: 'Kenya', currency: 'KES', phoneCode: '+254' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', phoneCode: '+255' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', phoneCode: '+250' }
];

export const REGIONS = {
  UG: [
    { id: 'central', name: 'Central Region' },
    { id: 'western', name: 'Western Region' },
    { id: 'eastern', name: 'Eastern Region' },
    { id: 'northern', name: 'Northern Region' }
  ],
  KE: [
    { id: 'nairobi', name: 'Nairobi Region' },
    { id: 'central', name: 'Central Region' },
    { id: 'coast', name: 'Coast Region' },
    { id: 'eastern', name: 'Eastern Region' },
    { id: 'north_eastern', name: 'North Eastern Region' },
    { id: 'nyanza', name: 'Nyanza Region' },
    { id: 'rift_valley', name: 'Rift Valley Region' },
    { id: 'western', name: 'Western Region' }
  ],
  TZ: [
    { id: 'dar_es_salaam', name: 'Dar es Salaam Region' },
    { id: 'arusha', name: 'Arusha Region' },
    { id: 'dodoma', name: 'Dodoma Region' },
    { id: 'mwanza', name: 'Mwanza Region' },
    { id: 'mbeya', name: 'Mbeya Region' },
    { id: 'mara', name: 'Mara Region' },
    { id: 'kilimanjaro', name: 'Kilimanjaro Region' },
    { id: 'tanga', name: 'Tanga Region' },
    { id: 'morogoro', name: 'Morogoro Region' },
    { id: 'kagera', name: 'Kagera Region' },
    { id: 'kigoma', name: 'Kigoma Region' },
    { id: 'ruvuma', name: 'Ruvuma Region' }
  ],
  RW: [
    { id: 'kigali', name: 'Kigali Province' },
    { id: 'northern', name: 'Northern Province' },
    { id: 'southern', name: 'Southern Province' },
    { id: 'eastern', name: 'Eastern Province' },
    { id: 'western', name: 'Western Province' }
  ]
};

export const DISTRICTS = {
  // ========== UGANDA ==========
  UG: {
    central: [
      'Kampala', 'Wakiso', 'Mukono', 'Mpigi', 'Masaka', 'Luwero', 'Mityana', 
      'Mubende', 'Nakasongola', 'Kayunga', 'Buikwe', 'Bukomansimbi', 'Butambala',
      'Gomba', 'Kalangala', 'Kalungu', 'Kassanda', 'Kyankwanzi', 'Lyonje',
      'Mityana', 'Nakaseke', 'Rakai', 'Sembabule'
    ],
    western: [
      'Mbarara', 'Kabale', 'Kasese', 'Bushenyi', 'Rukungiri', 'Ntungamo',
      'Kamwenge', 'Ibanda', 'Isingiro', 'Kiruhura', 'Buhweju', 'Mitooma',
      'Rubirizi', 'Sheema', 'Buhweju', 'Bunyangabu', 'Kyotera', 'Lyantonde',
      'Bukomansimbi', 'Kalungu', 'Masaka'
    ],
    eastern: [
      'Jinja', 'Mbale', 'Soroti', 'Tororo', 'Iganga', 'Kamuli', 'Pallisa',
      'Kumi', 'Kapchorwa', 'Katakwi', 'Sironko', 'Budaka', 'Bukedea',
      'Bukwo', 'Bulambuli', 'Butaleja', 'Kaberamaido', 'Kaliro', 'Luuka',
      'Manafwa', 'Mayuge', 'Namayingo', 'Namutumba', 'Ngora', 'Serere'
    ],
    northern: [
      'Gulu', 'Lira', 'Arua', 'Kitgum', 'Apac', 'Nebbi', 'Pader', 'Yumbe',
      'Adjumani', 'Amuru', 'Dokolo', 'Amolatar', 'Oyam', 'Abim', 'Kaabong',
      'Koboko', 'Maracha', 'Moyo', 'Nakapiripirit', 'Napak', 'Zombo'
    ]
  },

  // ========== KENYA ==========
  KE: {
    nairobi: [
      'Nairobi City', 'Westlands', 'Dagoretti', 'Langata', 'Kibra', 'Roysambu',
      'Kasarani', 'Ruaraka', 'Embakasi', 'Makadara', 'Kamukunji', 'Starehe',
      'Mathare'
    ],
    central: [
      'Kiambu', 'Thika', 'Ruiru', 'Kikuyu', 'Limuru', 'Gatundu', 'Kabete',
      'Kiambaa', 'Lari', 'Juja', 'Nyandarua', 'Nyeri', 'Murang'a',
      'Kirinyaga', 'Embu', 'Meru', 'Laikipia'
    ],
    coast: [
      'Mombasa', 'Kilifi', 'Kwale', 'Lamu', 'Tana River', 'Taita Taveta',
      'Malindi', 'Ukunda', 'Msambweni', 'Voi', 'Wundanyi', 'Mwatate'
    ],
    eastern: [
      'Machakos', 'Kitui', 'Makueni', 'Mwingi', 'Kathiani', 'Athi River',
      'Mavoko', 'Kangundo', 'Matungulu', 'Yatta', 'Kibwezi'
    ],
    north_eastern: [
      'Garissa', 'Wajir', 'Mandera', 'Dadaab', 'Hola', 'Moyale', 'El Wak'
    ],
    nyanza: [
      'Kisumu', 'Homabay', 'Migori', 'Kisii', 'Nyamira', 'Siaya', 'Bondo',
      'Rongo', 'Awendo', 'Oyugis', 'Kendu Bay', 'Mbita', 'Rangwe'
    ],
    rift_valley: [
      'Nakuru', 'Eldoret', 'Naivasha', 'Kericho', 'Bomet', 'Nandi', 'Uasin Gishu',
      'Trans Nzoia', 'West Pokot', 'Turkana', 'Samburu', 'Laikipia', 'Narok',
      'Kajiado', 'Baringo', 'Elgeyo Marakwet', 'Kipkelion', 'Litein', 'Iten'
    ],
    western: [
      'Kakamega', 'Bungoma', 'Busia', 'Vihiga', 'Malava', 'Kimilili', 'Webuye',
      'Mumias', 'Butere', 'Khwisero', 'Navakholo', 'Teso'
    ]
  },

  // ========== TANZANIA ==========
  TZ: {
    dar_es_salaam: [
      'Ilala', 'Kinondoni', 'Temeke', 'Ubungo', 'Kigamboni', 'Tandale',
      'Magomeni', 'Sinza', 'Mikocheni', 'Upanga', 'Kariakoo', 'Gongo la Mboto'
    ],
    arusha: [
      'Arusha City', 'Meru', 'Karatu', 'Monduli', 'Ngorongoro', 'Longido',
      'Arumeru', 'Mbulu', 'Babati', 'Hanang', 'Kiteto'
    ],
    dodoma: [
      'Dodoma City', 'Chamwino', 'Bahi', 'Kongwa', 'Mpwapwa', 'Kondoa',
      'Chemba', 'Sikonge'
    ],
    mwanza: [
      'Mwanza City', 'Nyamagana', 'Ilemela', 'Geita', 'Sengerema', 'Misungwi',
      'Ukerewe', 'Magu', 'Kwimba'
    ],
    mbeya: [
      'Mbeya City', 'Kyela', 'Rungwe', 'Mbarali', 'Chunya', 'Mbozi',
      'Momba', 'Ileje', 'Isangati'
    ],
    mara: [
      'Musoma', 'Rorya', 'Tarime', 'Serengeti', 'Bunda', 'Butiama',
      'Mwibara', 'Mugumu'
    ],
    kilimanjaro: [
      'Moshi', 'Hai', 'Rombo', 'Mwanga', 'Same', 'Siha', 'Moshi Rural'
    ],
    tanga: [
      'Tanga City', 'Muheza', 'Pangani', 'Korogwe', 'Lushoto', 'Mkinga',
      'Handeni', 'Kilindi'
    ],
    morogoro: [
      'Morogoro', 'Kilosa', 'Ifakara', 'Mahenge', 'Ulanga', 'Malinyi',
      'Gairo', 'Mvomero', 'Kilombero'
    ],
    kagera: [
      'Bukoba', 'Muleba', 'Karagwe', 'Biharamulo', 'Ngara', 'Kyerwa',
      'Missenyi'
    ],
    kigoma: [
      'Kigoma', 'Kasulu', 'Kibondo', 'Uvinza', 'Kakonko', 'Buhinga'
    ],
    ruvuma: [
      'Songea', 'Mbinga', 'Tunduru', 'Namtumbo', 'Nyasa', 'Madaba'
    ]
  },

  // ========== RWANDA ==========
  RW: {
    kigali: [
      'Gasabo', 'Kicukiro', 'Nyarugenge', 'Remera', 'Kimironko', 'Gisozi',
      'Kacyiru', 'Kimihurura', 'Nyarutarama', 'Gacuriro', 'Kanombe'
    ],
    northern: [
      'Musanze', 'Gicumbi', 'Burera', 'Rulindo', 'Gakenke'
    ],
    southern: [
      'Huye', 'Muhanga', 'Kamonyi', 'Ruhango', 'Nyanza', 'Nyaruguru',
      'Gisagara', 'Nyamagabe'
    ],
    eastern: [
      'Rwamagana', 'Kayonza', 'Kirehe', 'Ngoma', 'Bugesera', 'Nyagatare',
      'Gatsibo'
    ],
    western: [
      'Rubavu', 'Nyabihu', 'Ngororero', 'Rutsiro', 'Karongi', 'Rusizi',
      'Nyamasheke'
    ]
  }
};

// Helper function to get districts for a country + region
export function getDistricts(countryCode, regionId) {
  return DISTRICTS[countryCode]?.[regionId] || [];
}

// Helper function to get regions for a country
export function getRegions(countryCode) {
  return REGIONS[countryCode] || [];
}

// Helper function to format phone number by country
export function getPhonePlaceholder(countryCode) {
  const placeholders = {
    UG: '+256 708 123 456',
    KE: '+254 712 345 678',
    TZ: '+255 718 123 456',
    RW: '+250 788 123 456'
  };
  return placeholders[countryCode] || '+256 708 123 456';
}

// Helper function to validate phone by country
export function validatePhone(phone, countryCode) {
  const cleaned = phone.replace(/\s/g, '');
  const patterns = {
    UG: /^\+?256[0-9]{9}$|^0[0-9]{9}$/,
    KE: /^\+?254[0-9]{9}$|^0[0-9]{9}$/,
    TZ: /^\+?255[0-9]{9}$|^0[0-9]{9}$/,
    RW: /^\+?250[0-9]{9}$|^0[0-9]{9}$/
  };
  return patterns[countryCode]?.test(cleaned) || false;
}

// Helper function to get currency symbol
export function getCurrencySymbol(countryCode) {
  const symbols = { UG: 'UGX', KE: 'KES', TZ: 'TZS', RW: 'RWF' };
  return symbols[countryCode] || 'UGX';
}

export default {
  COUNTRIES,
  REGIONS,
  DISTRICTS,
  getDistricts,
  getRegions,
  getPhonePlaceholder,
  validatePhone,
  getCurrencySymbol
};
