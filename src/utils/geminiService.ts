import { WeatherData, PersonaType, RecommendationResult, OutfitItem, GeminiResponseSchema } from '../types';
import { generateRuleBasedRecommendation } from './wardrobePresets';
import { getPagasaHeatIndexInfo, getPagasaRainInfo } from './pagasaEngine';

export const GEMINI_API_KEY_STORAGE_KEY = 'weafit_gemini_api_key';

export function getStoredGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || localStorage.getItem('klimafit_gemini_api_key') || '';
}

export function saveStoredGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    localStorage.removeItem('klimafit_gemini_api_key');
  } else {
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
  }
}

/**
 * Calls the live Google Gemini API with structured JSON output schema
 */
export async function fetchGeminiOutfitRecommendation(
  weather: WeatherData,
  persona: PersonaType,
  apiKey: string
): Promise<RecommendationResult> {
  if (!apiKey || apiKey.trim() === '') {
    // Fallback to rule engine immediately if no key
    return generateRuleBasedRecommendation(weather, persona);
  }

  const prompt = `
Ikaw si WeaFit AI, isang matalinong Pinoy fashion stylist at tropical weather advisor.
Bigyan ng payo ang user base sa sumusunod na real-time weather sa Pilipinas:

Lokasyon: ${weather.cityName}
Temperatura: ${weather.temp}°C
Damang Init (PAGASA Heat Index / Feels Like): ${weather.feelsLike}°C
Tsansa ng Ulan: ${weather.rainChance}%
Alinsangan / Humidity: ${weather.humidity}%
Bilis ng Hangin: ${weather.windSpeed} km/h
UV Index: ${weather.uvIndex}
Kondisyon: ${weather.conditionText}
Persona / Profile ng User: ${persona.toUpperCase()}

MGA PATAKARAN SA PAGSAGOT:
1. Magsalita sa natural, moderno, at nakakaaliw na Taglish (tulad ng tunay na Pinoy stylist).
2. Isaalang-alang ang PAGASA Heat Index warnings (Danger kapag 42°C+), baha, putik, at siksikan sa commute (LRT, Jeepney, Angkas, etc.).
3. Magbigay ng 5 specific outfit items (Ulo/Mukha, Pang-itaas, Pang-ibaba, Kasuotan sa Paa, at Gamit/Layers).
4. Magbigay ng 3 recommended activities at 2 activities to avoid.
5. Magbigay ng direct commuter tip para sa piniling persona.
6. Magbigay ng 4 mahalagang baon sa checklist (hal. payong, tumbler, pamaypay, ziploc).
`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      response_mime_type: 'application/json',
      response_schema: {
        type: 'OBJECT',
        properties: {
          vibeSummary: { type: 'STRING' },
          topAdvice: { type: 'STRING' },
          outfitItems: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                category: { type: 'STRING' },
                item: { type: 'STRING' },
                fabricOrNote: { type: 'STRING' },
                iconName: { type: 'STRING' }
              },
              required: ['category', 'item', 'fabricOrNote', 'iconName']
            }
          },
          activities: {
            type: 'OBJECT',
            properties: {
              recommended: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    title: { type: 'STRING' },
                    desc: { type: 'STRING' },
                    type: { type: 'STRING', enum: ['indoor', 'outdoor', 'shaded'] }
                  },
                  required: ['title', 'desc', 'type']
                }
              },
              toAvoid: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    title: { type: 'STRING' },
                    desc: { type: 'STRING' }
                  },
                  required: ['title', 'desc']
                }
              }
            },
            required: ['recommended', 'toAvoid']
          },
          commuterTip: { type: 'STRING' },
          packingChecklist: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          }
        },
        required: ['vibeSummary', 'topAdvice', 'outfitItems', 'activities', 'commuterTip', 'packingChecklist']
      }
    }
  };

  // Try gemini-2.5-flash first, then gemini-1.5-flash as fallback
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        throw new Error(errorJson?.error?.message || `Gemini API HTTP ${response.status}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Walang binalik na text content ang Gemini API.');
      }

      const parsed: GeminiResponseSchema = JSON.parse(rawText);

      const heatInfo = getPagasaHeatIndexInfo(weather.feelsLike);
      const rainInfo = getPagasaRainInfo(weather.rainChance, weather.weatherCode);

      const items: OutfitItem[] = parsed.outfitItems.map(item => ({
        category: (item.category as any) || 'Gamit / Accessories',
        item: item.item,
        fabricOrNote: item.fabricOrNote,
        iconName: item.iconName || 'Shirt'
      }));

      return {
        vibeSummary: parsed.vibeSummary,
        topAdvice: parsed.topAdvice,
        heatIndexInfo: heatInfo,
        rainInfo,
        outfitItems: items,
        activities: parsed.activities,
        commuterTip: parsed.commuterTip,
        packingChecklist: parsed.packingChecklist || [],
        hydrationTargetLiters: weather.feelsLike >= 42 ? 3.5 : weather.feelsLike >= 33 ? 2.8 : 2.2,
        isAiGenerated: true
      };
    } catch (err) {
      lastError = err;
      console.warn(`Failed with model ${model}, trying next or falling back...`, err);
    }
  }

  console.error('All Gemini attempts failed, using rule engine fallback:', lastError);
  throw lastError;
}
