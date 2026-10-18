export interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const NEXTJS_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'nextjs-api-route',
    title: 'Next.js App Router API Route',
    filename: 'app/api/weather-ai/route.ts',
    language: 'typescript',
    description: 'Serverless API route gamit ang official Google Generative AI SDK at structured responseSchema para sa malinis na JSON response.',
    code: `import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini SDK with your API key from .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { weather, persona } = await req.json();

    if (!weather) {
      return NextResponse.json({ error: 'Missing weather data' }, { status: 400 });
    }

    // Define the strict structured JSON schema
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        vibeSummary: { type: SchemaType.STRING, description: 'Snappy Taglish vibe sentence' },
        topAdvice: { type: SchemaType.STRING, description: 'Essential advice for today' },
        outfitItems: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              category: { type: SchemaType.STRING },
              item: { type: SchemaType.STRING },
              fabricOrNote: { type: SchemaType.STRING },
              iconName: { type: SchemaType.STRING }
            },
            required: ['category', 'item', 'fabricOrNote', 'iconName']
          }
        },
        activities: {
          type: SchemaType.OBJECT,
          properties: {
            recommended: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING },
                  desc: { type: SchemaType.STRING },
                  type: { type: SchemaType.STRING, enum: ['indoor', 'outdoor', 'shaded'] }
                },
                required: ['title', 'desc', 'type']
              }
            },
            toAvoid: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: { type: SchemaType.STRING },
                  desc: { type: SchemaType.STRING }
                },
                required: ['title', 'desc']
              }
            }
          },
          required: ['recommended', 'toAvoid']
        },
        commuterTip: { type: SchemaType.STRING },
        packingChecklist: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        }
      },
      required: ['vibeSummary', 'topAdvice', 'outfitItems', 'activities', 'commuterTip', 'packingChecklist']
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.7
      }
    });

    const prompt = \`
Ikaw si KlimaFit AI, isang matalinong Pinoy fashion stylist at tropical weather advisor.
Bigyan ng payo ang user base sa real-time weather sa Pilipinas:

Lokasyon: \${weather.cityName}
Temperatura: \${weather.temp}°C
Damang Init (Heat Index): \${weather.feelsLike}°C
Tsansa ng Ulan: \${weather.rainChance}%
Alinsangan / Humidity: \${weather.humidity}%
Bilis ng Hangin: \${weather.windSpeed} km/h
Persona: \${persona?.toUpperCase() || 'COMMUTER'}

MGA PATAKARAN:
1. Magsalita sa natural, moderno, at nakakaaliw na Taglish.
2. Isaalang-alang ang PAGASA Heat Index warnings (Danger kapag 42°C+), baha, putik, at siksikan sa commute (LRT, Jeepney, Angkas, etc.).
3. Magbigay ng 5 specific outfit items (Ulo/Mukha, Pang-itaas, Pang-ibaba, Kasuotan sa Paa, at Gamit/Layers).
4. Magbigay ng 3 recommended activities at 2 to avoid.
5. Magbigay ng commuter tip para sa persona at 4 packing checklist items.
\`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/weather-ai:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}`
  },
  {
    id: 'pagasa-rules-lib',
    title: 'PAGASA Rule Engine Utility',
    filename: 'lib/pagasaRules.ts',
    language: 'typescript',
    description: 'Opisyal na klasipikasyon ng PAGASA Heat Index Scale (Damang Init) at Rainfall Color Advisories.',
    code: `export interface PagasaHeatIndexInfo {
  level: 'comfortable' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger';
  tagalogLabel: string;
  englishLabel: string;
  badgeColor: string;
  description: string;
  healthEffects: string;
  recommendedAction: string;
}

export function getPagasaHeatIndexInfo(heatIndex: number): PagasaHeatIndexInfo {
  if (heatIndex < 27) {
    return {
      level: 'comfortable',
      tagalogLabel: 'Komportable / Presko',
      englishLabel: 'Comfortable',
      badgeColor: '#10b981',
      description: 'Mababa ang panganib sa init. Kaaya-aya ang klima sa labas.',
      healthEffects: 'Mababang tsansa ng pagkapagod o heat illness.',
      recommendedAction: 'Mag-enjoy sa labas! Uminom ng regular na tubig.'
    };
  }
  if (heatIndex <= 32) {
    return {
      level: 'caution',
      tagalogLabel: 'Mag-ingat (Caution)',
      englishLabel: 'Caution',
      badgeColor: '#f59e0b',
      description: 'Normal na klimang tropikal pero mararamdaman ang init.',
      healthEffects: 'Posible ang pagkapagod kapag matagal ang exposure.',
      recommendedAction: 'Uminom ng tubig bawat oras. Magbaon ng payong o sumbrero.'
    };
  }
  if (heatIndex <= 41) {
    return {
      level: 'extreme_caution',
      tagalogLabel: 'Labis na Pag-iingat (Extreme Caution)',
      englishLabel: 'Extreme Caution',
      badgeColor: '#f97316',
      description: 'Mataas ang alinsangan. Mabilis manghina at magpawis.',
      healthEffects: 'Posible ang heat cramps at heat exhaustion. Banta sa heat stroke.',
      recommendedAction: 'Limitahan ang paglabas sa pagitan ng 10 AM hanggang 3 PM.'
    };
  }
  if (heatIndex <= 51) {
    return {
      level: 'danger',
      tagalogLabel: 'PANGANIB (Danger)',
      englishLabel: 'Danger',
      badgeColor: '#ef4444',
      description: 'Mapanganib na antas ng init! Mataas ang banta ng sunstroke.',
      healthEffects: 'Malamang ang heat cramps at exhaustion. Posible ang HEAT STROKE.',
      recommendedAction: 'MANATILI SA LOOB NA MAY AIRCON. Iwasan ang outdoor sports.'
    };
  }
  return {
    level: 'extreme_danger',
    tagalogLabel: 'MATINDING PANGANIB (Extreme Danger)',
    englishLabel: 'Extreme Danger',
    badgeColor: '#7f1d1d',
    description: 'KLASENG EMERGENCY NA INIT! Tiyak ang panganib sa kalusugan.',
    healthEffects: 'HINDI MAIWASAN ANG HEAT STROKE sa tuluy-tuloy na babad sa labas.',
    recommendedAction: 'HUWAG LUMABAS KUNG HINDI KAILANGAN. Magpalamig agad.'
  };
}`
  },
  {
    id: 'env-example-snippet',
    title: '.env.local Setup Guide',
    filename: '.env.local',
    language: 'bash',
    description: 'I-save ang iyong Google Gemini API Key sa root folder ng Next.js project.',
    code: `# Kumuha ng libreng Gemini API Key mula sa Google AI Studio:
# https://aistudio.google.com/app/apikey

GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere

# Tandaan: Huwag i-commit ang .env.local sa pampublikong Git repository!`
  }
];
