import { PagasaHeatIndexInfo, PagasaRainInfo, PagasaHeatLevel, PagasaRainLevel } from '../types';

/**
 * Official PAGASA Heat Index Scale (Damang Init)
 * References: Philippine Atmospheric, Geophysical and Astronomical Services Administration (DOST-PAGASA)
 */
export function getPagasaHeatIndexInfo(heatIndex: number): PagasaHeatIndexInfo {
  if (heatIndex < 27) {
    return {
      level: 'comfortable',
      tagalogLabel: 'Komportable / Presko',
      englishLabel: 'Comfortable',
      badgeColor: '#10b981', // Emerald
      textColor: '#064e3b',
      bgGradient: 'from-emerald-500/20 to-teal-500/10',
      description: 'Mababa ang panganib sa init. Kaaya-aya ang temperatura para sa outdoor activities.',
      healthEffects: 'Mababang tsansa ng pagkapagod o heat illness.',
      recommendedAction: 'Mag-enjoy sa labas! Uminom ng regular na tubig at magsuot ng komportableng damit.'
    };
  }

  if (heatIndex >= 27 && heatIndex <= 32) {
    return {
      level: 'caution',
      tagalogLabel: 'Mag-ingat (Caution)',
      englishLabel: 'Caution',
      badgeColor: '#f59e0b', // Amber
      textColor: '#78350f',
      bgGradient: 'from-amber-500/20 to-yellow-500/10',
      description: 'Normal na klimang tropikal pero mararamdaman ang init kapag babad sa araw.',
      healthEffects: 'Posible ang pagkapagod kapag matagal ang exposure at pisikal na aktibidad.',
      recommendedAction: 'Uminom ng 2-3 basong tubig bawat oras kung nasa labas. Magsuot ng sumbrero o payong.'
    };
  }

  if (heatIndex >= 33 && heatIndex <= 41) {
    return {
      level: 'extreme_caution',
      tagalogLabel: 'Labis na Pag-iingat (Extreme Caution)',
      englishLabel: 'Extreme Caution',
      badgeColor: '#f97316', // Orange
      textColor: '#7c2d12',
      bgGradient: 'from-orange-500/20 to-amber-600/10',
      description: 'Mataas ang init at alinsangan. Mabilis manghina at magpawis.',
      healthEffects: 'Posible ang heat cramps at heat exhaustion. Kapag nagpatuloy, pwedeng magdulot ng heat stroke.',
      recommendedAction: 'Limitahan ang diretsong exposure sa araw sa pagitan ng 10 AM hanggang 3 PM. Mag-ice water o malamig na inumin.'
    };
  }

  if (heatIndex >= 42 && heatIndex <= 51) {
    return {
      level: 'danger',
      tagalogLabel: 'PANGANIB (Danger)',
      englishLabel: 'Danger',
      badgeColor: '#ef4444', // Red
      textColor: '#7f1d1d',
      bgGradient: 'from-red-600/25 to-rose-700/15',
      description: 'Mapanganib na antas ng init! Mataas ang banta ng sunstroke at dehydration.',
      healthEffects: 'Malamang ang heat cramps at heat exhaustion. Posible at mapanganib ang HEAT STROKE sa tuluy-tuloy na aktibidad.',
      recommendedAction: 'MANATILI SA LOOB NG BAHAY O MAY AIRCON. Iwasan ang matitinding workout sa labas. Magbaon ng insulated water bottle.'
    };
  }

  // >= 52°C
  return {
    level: 'extreme_danger',
    tagalogLabel: 'MATINDING PANGANIB (Extreme Danger)',
    englishLabel: 'Extreme Danger',
    badgeColor: '#7f1d1d', // Dark Maroon
    textColor: '#ffffff',
    bgGradient: 'from-red-900/40 to-black/30',
    description: 'KLASENG EMERGENCY NA INIT! Tiyak ang panganib sa kalusugan.',
    healthEffects: 'HINDI MAIWASAN ANG HEAT STROKE kung mananatili sa labas nang matagal. Posibleng magdulot ng pagkahimatay.',
    recommendedAction: 'HUWAG LUMABAS KUNG HINDI KAILANGAN. Ipatay ang matitinding physical tasks at magpalamig agad gamit ang basang tuwalya.'
  };
}

/**
 * PAGASA Rainfall Advisory Color Coding
 */
export function getPagasaRainInfo(rainChance: number, weatherCode: number): PagasaRainInfo {
  const isStorm = weatherCode >= 80 && weatherCode <= 99;
  const isHeavyRain = (weatherCode >= 63 && weatherCode <= 67) || weatherCode === 75;

  if (isStorm || rainChance >= 85) {
    return {
      level: 'red',
      label: 'Red Warning (Torrential Rain / Baha Alert)',
      color: '#ef4444',
      description: 'Matinding buhos ng ulan o bagyo. Mataas ang banta ng baha sa kalsada.',
      floodingRisk: 'Mataas ang banta ng baha sa Mababang Lugar. Posibleng kanselado ang biyahe o pasok.'
    };
  }

  if (isHeavyRain || rainChance >= 65) {
    return {
      level: 'orange',
      label: 'Orange Warning (Intense Rain)',
      color: '#f97316',
      description: 'Tuloy-tuloy na malakas na ulan. Asahan ang matinding traffic at naipong tubig.',
      floodingRisk: 'Posible ang baha sa mga major thoroughfares (EDSA, España, Taft, etc.).'
    };
  }

  if (rainChance >= 40 || (weatherCode >= 51 && weatherCode <= 62)) {
    return {
      level: 'yellow',
      label: 'Yellow Warning / Katamtamang Ulan',
      color: '#eab308',
      description: 'May mga pag-ambon o biglaang buhos ng ulan (localized thunderstorms).',
      floodingRisk: 'Mababa ang baha ngunit madulas ang kalsada at may water splashes mula sa sasakyan.'
    };
  }

  if (rainChance >= 15) {
    return {
      level: 'light',
      label: 'Bahagyang Ambon (Light Isolated Rain)',
      color: '#06b6d4',
      description: 'May maliit na tsansa ng panandaliang pag-ulan.',
      floodingRisk: 'Walang banta ng baha pero mainam magdala ng foldable payong.'
    };
  }

  return {
    level: 'none',
    label: 'Maaliwalas / Walang Ulan',
    color: '#10b981',
    description: 'Maliit o walang tsansa ng ulan sa susunod na mga oras.',
    floodingRisk: 'Ligtas sa baha at tuyo ang mga daanan.'
  };
}

/**
 * WMO Weather Interpretation Code
 */
export function interpretWmoCode(code: number): { textTagalog: string; textEnglish: string; icon: string } {
  switch (code) {
    case 0:
      return { textTagalog: 'Matingkad na Araw (Clear Sky)', textEnglish: 'Clear Sky', icon: 'Sun' };
    case 1:
      return { textTagalog: 'Pangunahing Maaliwalas', textEnglish: 'Mainly Clear', icon: 'SunMedium' };
    case 2:
      return { textTagalog: 'Bahagyang Maulap', textEnglish: 'Partly Cloudy', icon: 'CloudSun' };
    case 3:
      return { textTagalog: 'Maulap (Overcast)', textEnglish: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { textTagalog: 'Mahamog / Mababa ang Visibility', textEnglish: 'Foggy', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { textTagalog: 'May Ambon (Drizzle)', textEnglish: 'Drizzle', icon: 'CloudDrizzle' };
    case 61:
      return { textTagalog: 'Mahinang Ulan', textEnglish: 'Slight Rain', icon: 'CloudRain' };
    case 63:
      return { textTagalog: 'Katamtamang Ulan', textEnglish: 'Moderate Rain', icon: 'CloudRain' };
    case 65:
      return { textTagalog: 'Malakas na Ulan', textEnglish: 'Heavy Rain', icon: 'CloudRainWind' };
    case 80:
    case 81:
    case 82:
      return { textTagalog: 'Biglaang Buhos ng Ulan (Rain Showers)', textEnglish: 'Rain Showers', icon: 'CloudLightning' };
    case 95:
      return { textTagalog: 'Thunderstorm / Kulog at Kidlat', textEnglish: 'Thunderstorm', icon: 'CloudLightning' };
    case 96:
    case 99:
      return { textTagalog: 'Matinding Thunderstorm na may Hail', textEnglish: 'Severe Thunderstorm', icon: 'Zap' };
    default:
      return { textTagalog: 'Karaniwang Panahon', textEnglish: 'Variable Weather', icon: 'CloudSun' };
  }
}
