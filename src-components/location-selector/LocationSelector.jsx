/**
 * ShambaNi Multi-Country Location Selector
 * Cascading dropdown: Country → Region → District
 * Supports Uganda, Kenya, Tanzania, Rwanda
 * 
 * File: src/components/LocationSelector/LocationSelector.jsx
 * Usage: Import into farmer registration, buyer registration, and filters
 */

import React, { useState, useEffect } from 'react';
import './LocationSelector.css';

// ===== DATA: All 4 East African Countries =====
const COUNTRIES = [
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', phoneCode: '+256' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', phoneCode: '+254' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', phoneCode: '+255' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', phoneCode: '+250' }
];

const REGIONS = {
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

const DISTRICTS = {
  UG: {
    central: ['Kampala','Wakiso','Mukono','Mpigi','Masaka','Luwero','Mityana','Mubende','Nakasongola','Kayunga','Buikwe','Bukomansimbi','Butambala','Gomba','Kalangala','Kalungu','Kassanda','Kyankwanzi','Nakaseke','Rakai','Sembabule'],
    western: ['Mbarara','Kabale','Kasese','Bushenyi','Rukungiri','Ntungamo','Kamwenge','Ibanda','Isingiro','Kiruhura','Buhweju','Mitooma','Rubirizi','Sheema','Bunyangabu','Kyotera','Lyantonde'],
    eastern: ['Jinja','Mbale','Soroti','Tororo','Iganga','Kamuli','Pallisa','Kumi','Kapchorwa','Katakwi','Sironko','Budaka','Bukedea','Bukwo','Bulambuli','Butaleja','Kaberamaido','Kaliro','Luuka','Manafwa','Mayuge','Namayingo','Namutumba','Ngora','Serere'],
    northern: ['Gulu','Lira','Arua','Kitgum','Apac','Nebbi','Pader','Yumbe','Adjumani','Amuru','Dokolo','Amolatar','Oyam','Abim','Kaabong','Koboko','Maracha','Moyo','Nakapiripirit','Napak','Zombo']
  },
  KE: {
    nairobi: ['Nairobi City','Westlands','Dagoretti','Langata','Kibra','Roysambu','Kasarani','Ruaraka','Embakasi','Makadara','Kamukunji','Starehe','Mathare'],
    central: ['Kiambu','Thika','Ruiru','Kikuyu','Limuru','Gatundu','Kabete','Kiambaa','Lari','Juja','Nyandarua','Nyeri',"Murang'a",'Kirinyaga','Embu','Meru','Laikipia'],
    coast: ['Mombasa','Kilifi','Kwale','Lamu','Tana River','Taita Taveta','Malindi','Ukunda','Msambweni','Voi','Wundanyi','Mwatate'],
    eastern: ['Machakos','Kitui','Makueni','Mwingi','Kathiani','Athi River','Mavoko','Kangundo','Matungulu','Yatta','Kibwezi'],
    north_eastern: ['Garissa','Wajir','Mandera','Dadaab','Hola','Moyale','El Wak'],
    nyanza: ['Kisumu','Homabay','Migori','Kisii','Nyamira','Siaya','Bondo','Rongo','Awendo','Oyugis','Kendu Bay','Mbita','Rangwe'],
    rift_valley: ['Nakuru','Eldoret','Naivasha','Kericho','Bomet','Nandi','Uasin Gishu','Trans Nzoia','West Pokot','Turkana','Samburu','Laikipia','Narok','Kajiado','Baringo','Elgeyo Marakwet','Kipkelion','Litein','Iten'],
    western: ['Kakamega','Bungoma','Busia','Vihiga','Malava','Kimilili','Webuye','Mumias','Butere','Khwisero','Navakholo','Teso']
  },
  TZ: {
    dar_es_salaam: ['Ilala','Kinondoni','Temeke','Ubungo','Kigamboni','Tandale','Magomeni','Sinza','Mikocheni','Upanga','Kariakoo','Gongo la Mboto'],
    arusha: ['Arusha City','Meru','Karatu','Monduli','Ngorongoro','Longido','Arumeru','Mbulu','Babati','Hanang','Kiteto'],
    dodoma: ['Dodoma City','Chamwino','Bahi','Kongwa','Mpwapwa','Kondoa','Chemba','Sikonge'],
    mwanza: ['Mwanza City','Nyamagana','Ilemela','Geita','Sengerema','Misungwi','Ukerewe','Magu','Kwimba'],
    mbeya: ['Mbeya City','Kyela','Rungwe','Mbarali','Chunya','Mbozi','Momba','Ileje','Isangati'],
    mara: ['Musoma','Rorya','Tarime','Serengeti','Bunda','Butiama','Mwibara','Mugumu'],
    kilimanjaro: ['Moshi','Hai','Rombo','Mwanga','Same','Siha','Moshi Rural'],
    tanga: ['Tanga City','Muheza','Pangani','Korogwe','Lushoto','Mkinga','Handeni','Kilindi'],
    morogoro: ['Morogoro','Kilosa','Ifakara','Mahenge','Ulanga','Malinyi','Gairo','Mvomero','Kilombero'],
    kagera: ['Bukoba','Muleba','Karagwe','Biharamulo','Ngara','Kyerwa','Missenyi'],
    kigoma: ['Kigoma','Kasulu','Kibondo','Uvinza','Kakonko','Buhinga'],
    ruvuma: ['Songea','Mbinga','Tunduru','Namtumbo','Nyasa','Madaba']
  },
  RW: {
    kigali: ['Gasabo','Kicukiro','Nyarugenge','Remera','Kimironko','Gisozi','Kacyiru','Kimihurura','Nyarutarama','Gacuriro','Kanombe'],
    northern: ['Musanze','Gicumbi','Burera','Rulindo','Gakenke'],
    southern: ['Huye','Muhanga','Kamonyi','Ruhango','Nyanza','Nyaruguru','Gisagara','Nyamagabe'],
    eastern: ['Rwamagana','Kayonza','Kirehe','Ngoma','Bugesera','Nyagatare','Gatsibo'],
    western: ['Rubavu','Nyabihu','Ngororero','Rutsiro','Karongi','Rusizi','Nyamasheke']
  }
};

// Phone validation patterns
const PHONE_PATTERNS = {
  UG: /^\+?256[0-9]{9}$|^0[0-9]{9}$/,
  KE: /^\+?254[0-9]{9}$|^0[0-9]{9}$/,
  TZ: /^\+?255[0-9]{9}$|^0[0-9]{9}$/,
  RW: /^\+?250[0-9]{9}$|^0[0-9]{9}$/
};

const PHONE_PLACEHOLDERS = {
  UG: '+256 708 123 456',
  KE: '+254 712 345 678',
  TZ: '+255 718 123 456',
  RW: '+250 788 123 456'
};

const CURRENCY_SYMBOLS = { UG: 'UGX', KE: 'KES', TZ: 'TZS', RW: 'RWF' };

// ===== COMPONENT =====

export default function LocationSelector({ value, onChange, showVillage = true }) {
  const [country, setCountry] = useState(value?.country || '');
  const [region, setRegion] = useState(value?.region || '');
  const [district, setDistrict] = useState(value?.district || '');
  const [village, setVillage] = useState(value?.village || '');

  const regions = country ? REGIONS[country] || [] : [];
  const districts = country && region ? DISTRICTS[country]?.[region] || [] : [];
  const selectedCountry = COUNTRIES.find(c => c.code === country);

  // Notify parent on any change
  useEffect(() => {
    onChange({
      country,
      countryName: selectedCountry?.name || '',
      region,
      regionName: regions.find(r => r.id === region)?.name || '',
      district,
      village: showVillage ? village : undefined,
      currency: selectedCountry?.currency || 'UGX',
      phoneCode: selectedCountry?.phoneCode || '+256'
    });
  }, [country, region, district, village]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setRegion('');
    setDistrict('');
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setDistrict('');
  };

  return (
    <div className="location-selector">
      {/* Country */}
      <div className="form-group">
        <label>Country *</label>
        <select value={country} onChange={handleCountryChange} className="country-select">
          <option value="">Select Country</option>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Region */}
      <div className="form-group">
        <label>Region / Province *</label>
        <select value={region} onChange={handleRegionChange} disabled={!country}>
          <option value="">{country ? 'Select Region' : 'Select Country First'}</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="form-group">
        <label>District / County *</label>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!region}>
          <option value="">{region ? 'Select District' : 'Select Region First'}</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Village / Area (optional) */}
      {showVillage && (
        <div className="form-group">
          <label>Village or Area *</label>
          <input
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g., Mpigi Town Council"
          />
        </div>
      )}
    </div>
  );
}

// ===== UTILITY EXPORTS =====

export { COUNTRIES, REGIONS, DISTRICTS, PHONE_PATTERNS, PHONE_PLACEHOLDERS, CURRENCY_SYMBOLS };

export function validatePhone(phone, countryCode) {
  const cleaned = phone.replace(/\s/g, '');
  return PHONE_PATTERNS[countryCode]?.test(cleaned) || false;
}

export function getPhonePlaceholder(countryCode) {
  return PHONE_PLACEHOLDERS[countryCode] || '+256 708 123 456';
}

export function getCurrencySymbol(countryCode) {
  return CURRENCY_SYMBOLS[countryCode] || 'UGX';
}

export function getDistricts(countryCode, regionId) {
  return DISTRICTS[countryCode]?.[regionId] || [];
}

export function getRegions(countryCode) {
  return REGIONS[countryCode] || [];
}
