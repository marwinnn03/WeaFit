import { CityData } from '../types';

export const PHILIPPINE_CITIES: CityData[] = [
  {
    name: 'Caloocan / Metro Manila',
    province: 'National Capital Region',
    latitude: 14.6507,
    longitude: 120.9830,
    isPopular: true
  },
  {
    name: 'Quezon City',
    province: 'Metro Manila',
    latitude: 14.6760,
    longitude: 121.0437,
    isPopular: true
  },
  {
    name: 'Baguio City',
    province: 'Benguet (Summer Capital)',
    latitude: 16.4023,
    longitude: 120.5960,
    isPopular: true
  },
  {
    name: 'Tagaytay City',
    province: 'Cavite (Cool Ridge)',
    latitude: 14.1153,
    longitude: 120.9621,
    isPopular: true
  },
  {
    name: 'Cebu City',
    province: 'Central Visayas',
    latitude: 10.3157,
    longitude: 123.8854,
    isPopular: true
  },
  {
    name: 'Davao City',
    province: 'Davao del Sur, Mindanao',
    latitude: 7.1907,
    longitude: 125.4553,
    isPopular: true
  },
  {
    name: 'Iloilo City',
    province: 'Western Visayas',
    latitude: 10.7202,
    longitude: 122.5621,
    isPopular: false
  },
  {
    name: 'Puerto Princesa',
    province: 'Palawan',
    latitude: 9.7392,
    longitude: 118.7353,
    isPopular: false
  },
  {
    name: 'Legazpi City (Mayon)',
    province: 'Albay, Bicol',
    latitude: 13.1391,
    longitude: 123.7438,
    isPopular: false
  },
  {
    name: 'Angeles / Clark',
    province: 'Pampanga, Central Luzon',
    latitude: 15.1450,
    longitude: 120.5887,
    isPopular: false
  }
];

export const DEFAULT_CITY = PHILIPPINE_CITIES[0];
