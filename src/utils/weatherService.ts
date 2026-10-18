import { WeatherData, HourlyForecastItem } from '../types';
import { interpretWmoCode } from './pagasaEngine';

export async function fetchLiveWeather(
  latitude: number,
  longitude: number,
  cityName: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,uv_index&forecast_days=1&timezone=Asia%2FManila`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current;
  const hourly = data.hourly;

  const currentHour = new Date().getHours();
  const currentRainProb = hourly?.precipitation_probability?.[currentHour] ?? Math.round((current.precipitation || 0) > 0 ? 80 : 10);
  const currentUv = hourly?.uv_index?.[currentHour] ?? 5;

  const conditionInfo = interpretWmoCode(current.weather_code);

  // Parse hourly forecast for next 8 hours
  const hourlyForecast: HourlyForecastItem[] = [];
  if (hourly?.time) {
    const totalHours = hourly.time.length;
    for (let i = currentHour; i < Math.min(currentHour + 8, totalHours); i++) {
      const timeStr = hourly.time[i];
      const hourNum = new Date(timeStr).getHours();
      const displayHour = hourNum === 0 ? '12 AM' : hourNum > 12 ? `${hourNum - 12} PM` : hourNum === 12 ? '12 PM' : `${hourNum} AM`;

      hourlyForecast.push({
        time: displayHour,
        temp: Math.round(hourly.temperature_2m[i]),
        feelsLike: Math.round(hourly.apparent_temperature[i]),
        rainChance: hourly.precipitation_probability[i] ?? 0,
        weatherCode: hourly.weather_code[i] ?? 0,
        uvIndex: hourly.uv_index?.[i] ?? 0
      });
    }
  }

  return {
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    rainChance: currentRainProb,
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    weatherCode: current.weather_code,
    uvIndex: currentUv,
    conditionText: conditionInfo.textTagalog,
    cityName,
    isSimulated: false,
    hourlyForecast
  };
}

export function createSimulatedWeather(
  scenario: {
    cityName: string;
    temp: number;
    feelsLike: number;
    rainChance: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    uvIndex: number;
  }
): WeatherData {
  const condition = interpretWmoCode(scenario.weatherCode);
  const currentHour = new Date().getHours();

  const hourlyForecast: HourlyForecastItem[] = [];
  for (let i = 0; i < 8; i++) {
    const h = (currentHour + i) % 24;
    const displayHour = h === 0 ? '12 AM' : h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`;
    hourlyForecast.push({
      time: displayHour,
      temp: scenario.temp + (i % 2 === 0 ? 0 : -1),
      feelsLike: scenario.feelsLike + (i % 2 === 0 ? 0 : -1),
      rainChance: scenario.rainChance,
      weatherCode: scenario.weatherCode,
      uvIndex: scenario.uvIndex
    });
  }

  return {
    temp: scenario.temp,
    feelsLike: scenario.feelsLike,
    rainChance: scenario.rainChance,
    humidity: scenario.humidity,
    windSpeed: scenario.windSpeed,
    weatherCode: scenario.weatherCode,
    uvIndex: scenario.uvIndex,
    conditionText: condition.textTagalog,
    cityName: scenario.cityName,
    isSimulated: true,
    hourlyForecast
  };
}

/**
 * Searches for any Philippine or global city/municipality using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<import('../types').CityData[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    // Prioritize results in Philippines, but allow others if specifically searched
    const phResults = data.results.filter((item: any) => item.country === 'Philippines' || item.country_code === 'PH');
    const listToMap = phResults.length > 0 ? phResults : data.results;

    return listToMap.map((item: any) => {
      const adminPart = item.admin1 ? ` (${item.admin1})` : '';
      return {
        name: `${item.name}${adminPart}`,
        province: item.admin1 || item.country || 'Pilipinas',
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        isPopular: false
      };
    });
  } catch (err) {
    console.warn('Geocoding search error:', err);
    return [];
  }
}

