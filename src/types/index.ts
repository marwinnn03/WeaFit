export type PersonaType = 'commuter' | 'student' | 'office' | 'casual' | 'workout';

export interface PersonaInfo {
  id: PersonaType;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  defaultTransit: string;
}

export interface CityData {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  isPopular?: boolean;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  uvIndex: number;
  conditionText: string;
  cityName: string;
  isSimulated?: boolean;
  hourlyForecast: HourlyForecastItem[];
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  feelsLike: number;
  rainChance: number;
  weatherCode: number;
  uvIndex?: number;
}

export type PagasaHeatLevel = 'comfortable' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger';

export interface PagasaHeatIndexInfo {
  level: PagasaHeatLevel;
  tagalogLabel: string;
  englishLabel: string;
  badgeColor: string;
  textColor: string;
  bgGradient: string;
  description: string;
  healthEffects: string;
  recommendedAction: string;
}

export type PagasaRainLevel = 'none' | 'light' | 'yellow' | 'orange' | 'red';

export interface PagasaRainInfo {
  level: PagasaRainLevel;
  label: string;
  color: string;
  description: string;
  floodingRisk: string;
}

export interface OutfitItem {
  category: 'Ulo / Mukha' | 'Pang-itaas (Top)' | 'Pang-ibaba (Bottom)' | 'Kasuotan sa Paa (Footwear)' | 'Layers / Jacket' | 'Gamit / Accessories';
  item: string;
  fabricOrNote: string;
  iconName: string;
}

export interface RecommendationResult {
  vibeSummary: string;
  topAdvice: string;
  heatIndexInfo: PagasaHeatIndexInfo;
  rainInfo: PagasaRainInfo;
  outfitItems: OutfitItem[];
  activities: {
    recommended: { title: string; desc: string; type: 'indoor' | 'outdoor' | 'shaded' }[];
    toAvoid: { title: string; desc: string }[];
  };
  commuterTip: string;
  packingChecklist: string[];
  hydrationTargetLiters: number;
  isAiGenerated: boolean;
}

export interface GeminiResponseSchema {
  vibeSummary: string;
  topAdvice: string;
  outfitItems: {
    category: string;
    item: string;
    fabricOrNote: string;
    iconName: string;
  }[];
  activities: {
    recommended: { title: string; desc: string; type: 'indoor' | 'outdoor' | 'shaded' }[];
    toAvoid: { title: string; desc: string }[];
  };
  commuterTip: string;
  packingChecklist: string[];
}
