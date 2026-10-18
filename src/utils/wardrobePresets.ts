import { PersonaInfo, PersonaType, WeatherData, RecommendationResult, OutfitItem } from '../types';
import { getPagasaHeatIndexInfo, getPagasaRainInfo } from './pagasaEngine';

export const PERSONAS: PersonaInfo[] = [
  {
    id: 'commuter',
    name: 'Commuter PH',
    tagline: 'Jeepney, MRT/LRT, Bus & Angkas/MoveIt',
    icon: 'Bike',
    description: 'Naka-focus sa proteksyon sa ulan, alikabok, siksikan, at matinding init sa kalsada.',
    defaultTransit: 'Jeepney / MRT / Motor'
  },
  {
    id: 'student',
    name: 'Estudyante',
    tagline: 'Campus Walk, Aircon vs. Mainit na Rooms',
    icon: 'GraduationCap',
    description: 'Practical campus fits na may baong jacket para sa malamig na library o classroom.',
    defaultTransit: 'Backpack / Walking'
  },
  {
    id: 'office',
    name: 'Corporate / Office',
    tagline: 'Smart Casual, Formal & AC Transit',
    icon: 'Briefcase',
    description: 'Propesyonal tingnan habang hindi nabababad sa pawis o nababasa sa ulan papuntang opisina.',
    defaultTransit: 'UV Express / Car / Grab'
  },
  {
    id: 'casual',
    name: 'Gala / Coffee Hop',
    tagline: 'Mall, Cafe, Outdoor Hangout & Dates',
    icon: 'Coffee',
    description: 'OOTD-ready, aesthetic pero komportable sa climate ng siyudad.',
    defaultTransit: 'Tote Bag / Casual Stroll'
  },
  {
    id: 'workout',
    name: 'Athlete / Workout',
    tagline: 'Jogging, Cycling & Gym Commute',
    icon: 'Dumbbell',
    description: 'High-performance fabrics, UV shielding, at hydration-critical suggestions.',
    defaultTransit: 'Running Shoes / Bike'
  }
];

export function generateRuleBasedRecommendation(
  weather: WeatherData,
  persona: PersonaType
): RecommendationResult {
  const heatInfo = getPagasaHeatIndexInfo(weather.feelsLike);
  const rainInfo = getPagasaRainInfo(weather.rainChance, weather.weatherCode);

  const isRainingOrStorm = rainInfo.level === 'red' || rainInfo.level === 'orange' || rainInfo.level === 'yellow';
  const isExtremeHeat = heatInfo.level === 'danger' || heatInfo.level === 'extreme_danger';
  const isColdOrBaguio = weather.feelsLike <= 24;

  let vibeSummary = '';
  let topAdvice = '';
  let commuterTip = '';
  const outfitItems: OutfitItem[] = [];
  const recommendedActivities: { title: string; desc: string; type: 'indoor' | 'outdoor' | 'shaded' }[] = [];
  const toAvoidActivities: { title: string; desc: string }[] = [];
  const packingChecklist: string[] = [];
  let hydrationTarget = 2.0;

  // Hydration calculation
  if (isExtremeHeat) {
    hydrationTarget = 3.5;
  } else if (heatInfo.level === 'extreme_caution') {
    hydrationTarget = 2.8;
  } else if (isColdOrBaguio) {
    hydrationTarget = 1.8;
  } else {
    hydrationTarget = 2.2;
  }

  // --- SCENARIO A: MAULAN / BAGYO ---
  if (isRainingOrStorm) {
    vibeSummary = `Maulan at maputik ang panahon sa ${weather.cityName}! Mataas ang tsansa ng baha at traffic.`;
    topAdvice = 'Waterproof footwear at matibay na payong ang priority. Iwasan ang canvas at suede shoes!';

    if (persona === 'commuter') {
      commuterTip = 'Kung sasakay ng Angkas/MoveIt o Jeep, magbaon ng silicone shoe covers at kapote. Mag-ingat sa water splashes ng mga bus!';
      packingChecklist.push('Silicone Shoe Cover / Rain Booties', 'Matibay na Foldable Umbrella', 'Ziploc para sa cellphone at wallet', 'Pamalit na medyas');
    } else if (persona === 'student') {
      commuterTip = 'Takpan ang backpack ng rain cover para hindi mabasa ang laptop at notebooks sa campus walk.';
      packingChecklist.push('Backpack Rain Cover', 'Payong', 'Light Jacket para sa malamig na room', 'Pamalit na t-shirt');
    } else if (persona === 'office') {
      commuterTip = 'Mag-commute gamit ang waterproof shoes o sandals, at magpalit na lang ng leather/heels pagdating sa opisina.';
      packingChecklist.push('Executive Umbrella', 'Plastic pouch para sa basang payong', 'Shoe wipe / Towel');
    } else if (persona === 'workout') {
      commuterTip = 'Madulas ang kalsada para sa running o bike. Mas ligtas mag-indoor gym o treadmill workout.';
      packingChecklist.push('Waterproof gym bag', 'Quick-dry towel', 'Dry change of clothes');
    } else {
      commuterTip = 'Pumili ng mga mall o indoor spots na may connected covered walkways para hindi maipit sa ulan.';
      packingChecklist.push('Compact payong', 'Light windbreaker', 'Wet wipes');
    }

    outfitItems.push({
      category: 'Ulo / Mukha',
      item: 'Waterproof Bucket Hat o Cap',
      fabricOrNote: 'Mabilis matuyo at pinoprotektahan ang salamin sa patak ng ulan',
      iconName: 'Shield'
    });

    outfitItems.push({
      category: 'Pang-itaas (Top)',
      item: persona === 'office' ? 'Wrinkle-free Button-down' : 'Dri-FIT o Quick-dry T-Shirt',
      fabricOrNote: 'Polyester blend na hindi kumakapit ang amoy at mabilis matuyo kung mapatakan',
      iconName: 'Shirt'
    });

    outfitItems.push({
      category: 'Layers / Jacket',
      item: 'Lightweight Windbreaker o Waterproof Raincoat',
      fabricOrNote: 'Nylon / Ripstop material na hindi mabigat sa katawan',
      iconName: 'ShieldCheck'
    });

    outfitItems.push({
      category: 'Pang-ibaba (Bottom)',
      item: persona === 'commuter' || persona === 'student' ? 'Dark Cargo Pants o Chino Shorts' : 'Tailored Dark Trousers',
      fabricOrNote: 'Madilim na kulay para hindi halata ang putik at talsik ng tubig',
      iconName: 'Scissors'
    });

    outfitItems.push({
      category: 'Kasuotan sa Paa (Footwear)',
      item: 'Rubber-soled Waterproof Shoes o Non-slip Sandals',
      fabricOrNote: 'Mahalaga ang traction laban sa madudulas na tiles at basang kalsada',
      iconName: 'Footprints'
    });

    outfitItems.push({
      category: 'Gamit / Accessories',
      item: 'Heavy-Duty Windproof Umbrella + Waterproof Bag',
      fabricOrNote: 'Huwag gagamit ng canvas tote bag na tumatagos ang tubig',
      iconName: 'Umbrella'
    });

    recommendedActivities.push(
      { title: 'Cafe Work & Coffee Hopping', desc: 'Mainit na kape at cozy ambiance sa indoor cafe.', type: 'indoor' },
      { title: 'Mall Stroll & Grocery Run', desc: 'Ligtas sa baha at ulan habang naglalakad-lakad.', type: 'indoor' },
      { title: 'Indoor Workout / Yoga / Gym', desc: 'Panatilihing aktibo ang katawan sa tuyong fitness studio.', type: 'indoor' }
    );

    toAvoidActivities.push(
      { title: 'Outdoor Cycling o Long Run', desc: 'Madulas ang kalsada at mababa ang visibility ng mga motorista.' },
      { title: 'Tambay sa Al Fresco Spots', desc: 'Biglaang bugso ng hangin at ulan na pwedeng makabasa ng gamit.' }
    );
  }
  // --- SCENARIO B: EXTREME HEAT / DANGER HEAT INDEX ---
  else if (isExtremeHeat) {
    vibeSummary = `Delikado ang init sa ${weather.cityName}! Umabot sa ${weather.feelsLike}°C ang Damang Init (PAGASA Danger Zone).`;
    topAdvice = 'Iwasan ang mabibigat na outdoor tasks sa tanghali. Magsuot ng presko, maluwag, at light-colored na damit!';

    if (persona === 'commuter') {
      commuterTip = 'Bantayan ang siksikan sa LRT/Jeep dahil mataas ang dehydration risk. Magbaon ng portable fan, pamaypay, at 1L malamig na tubig.';
      packingChecklist.push('Rechargeable Mini Fan o Pamaypay', '1L Insulated Tumbler na may Yelo', 'Panyo / Gulaman Towel', 'Cooling Wipes');
    } else if (persona === 'student') {
      commuterTip = 'Huwag maglakad sa campus nang walang payong sa pagitan ng 10 AM at 3 PM. Uminom ng tubig bago pumasok sa klase.';
      packingChecklist.push('UV Protection Umbrella', 'Aquaflask / Water Bottle', 'Face mist / cooling wipes', 'Sunscreen SPF 50+');
    } else if (persona === 'office') {
      commuterTip = 'Magbaon ng pamalit na undershirt para presko kapag sumakay ng transit bago mag-suot ng pormal na blazer sa opisina.';
      packingChecklist.push('Extra Undershirt', 'Deodorant / Anti-sweat wipes', 'UV umbrella');
    } else if (persona === 'workout') {
      commuterTip = 'CRITICAL WARNING: Huwag mag-jogging sa tanghali! Gawin ang takbo bago mag-6:30 AM o pagkalubog ng araw.';
      packingChecklist.push('Electrolyte Drink / Gatorade', 'Cooling Towel', 'Running Cap & Polarized Shades');
    } else {
      commuterTip = 'Pumunta sa airconditioned na mga establisyimento at umiwas sa direct noon sunlight.';
      packingChecklist.push('Pamaypay', 'Sunscreen', 'Tumbler', 'Sunglasses');
    }

    outfitItems.push({
      category: 'Ulo / Mukha',
      item: 'UV Protective Cap o Wide-Brimmed Hat + Shades',
      fabricOrNote: 'Proteksyon sa UV Index at iwas masilaw sa tirik ng araw',
      iconName: 'Sun'
    });

    outfitItems.push({
      category: 'Pang-itaas (Top)',
      item: persona === 'office' ? 'Breathable Linen / Coolmax Polo' : 'Light-colored 100% Breathable Cotton o Linen Shirt',
      fabricOrNote: 'Puti, beige, o pastel colors upang mag-reflect ng init at mabilis magpahangin',
      iconName: 'Shirt'
    });

    outfitItems.push({
      category: 'Pang-ibaba (Bottom)',
      item: persona === 'office' ? 'Lightweight Tropical Wool / Linen Trousers' : 'Relaxed Linen Shorts o Loose Chino',
      fabricOrNote: 'Iwasan ang makakapal at masisikip na skinny jeans',
      iconName: 'Scissors'
    });

    outfitItems.push({
      category: 'Kasuotan sa Paa (Footwear)',
      item: 'Breathable Mesh Knit Sneakers o Open Sandals',
      fabricOrNote: 'May magandang air circulation para hindi magpawis ang paa',
      iconName: 'Footprints'
    });

    outfitItems.push({
      category: 'Layers / Jacket',
      item: 'UV-Cut Protection Arm Sleeves o Thin Unlined Overshirt',
      fabricOrNote: 'Proteksyon sa sun rays habang naglalakad o naka-angkas',
      iconName: 'SunMedium'
    });

    outfitItems.push({
      category: 'Gamit / Accessories',
      item: 'UV-Blocking Silver Coated Umbrella + Insulated Ice Water Bottle',
      fabricOrNote: 'Bumabawas ng hanggang 5°C sa direct heat ang UV coated fabric',
      iconName: 'ShieldAlert'
    });

    recommendedActivities.push(
      { title: 'Mall Walk & Indoor Window Shopping', desc: 'Sulitin ang centralized aircon at malamig na environment.', type: 'indoor' },
      { title: 'Swimming / Pool Lounging (Late PM)', desc: 'Magpalamig sa tubig pagdating ng 4:30 PM pataas.', type: 'shaded' },
      { title: 'Movie Marathon o Library Reading', desc: 'Chill indoor activities na walang physical exertion.', type: 'indoor' }
    );

    toAvoidActivities.push(
      { title: 'Outdoor Sports sa Tanghaling Tapat (11 AM - 3 PM)', desc: 'Napakataas ng banta ng heat cramps at heat stroke.' },
      { title: 'Mahabang Lakaran sa Concrete Pavement', desc: 'Nag-iipon ng init ang semento at nagpapataas ng ambient heat.' }
    );
  }
  // --- SCENARIO C: MALAMIG / BAGUIO / TAGAYTAY VIBE (<= 24°C) ---
  else if (isColdOrBaguio) {
    vibeSummary = `Malamig at presko sa ${weather.cityName}! Sarap magsuot ng stylish layers at maglakad-lakad.`;
    topAdvice = 'Tamang panahon para mag-hoodie, cardigan, o stylish jacket. Magsuot ng closed shoes!';

    commuterTip = 'Masarap maglakad at mag-commute dahil hindi pawisin. Magdala pa rin ng light jacket dahil lumalamig pa sa gabi.';
    packingChecklist.push('Light Hoodie / Jacket', 'Moisturizer / Lip balm', 'Tumbler para sa mainit na kape/tsaa');

    outfitItems.push({
      category: 'Ulo / Mukha',
      item: 'Beanie o Classic Baseball Cap',
      fabricOrNote: 'Pangdagdag estilo at panatilihing mainit ang ulo sa mahangin na panahon',
      iconName: 'Smile'
    });

    outfitItems.push({
      category: 'Pang-itaas (Top)',
      item: 'Layered T-shirt na may Waffle Knit o Polo Shirt',
      fabricOrNote: 'Komportableng base layer',
      iconName: 'Shirt'
    });

    outfitItems.push({
      category: 'Layers / Jacket',
      item: 'Fleece Pullover, Denim Jacket, o Zip Hoodie',
      fabricOrNote: 'Perpektong layer para sa 18°C - 24°C na temperatura',
      iconName: 'Layers'
    });

    outfitItems.push({
      category: 'Pang-ibaba (Bottom)',
      item: 'Classic Denim Jeans o Corduroy Pants',
      fabricOrNote: 'Makapal at panatilihing mainit ang mga binti sa hangin',
      iconName: 'Scissors'
    });

    outfitItems.push({
      category: 'Kasuotan sa Paa (Footwear)',
      item: 'Leather Boots, High-top Sneakers, o Classic Skater Shoes',
      fabricOrNote: 'May makapal na medyas para sa cozy feel',
      iconName: 'Footprints'
    });

    outfitItems.push({
      category: 'Gamit / Accessories',
      item: 'Canvas Tote / Backpack + Thermos para sa Mainit na Inumin',
      fabricOrNote: 'Paborito para sa Baguio o Tagaytay ridge stroll',
      iconName: 'Coffee'
    });

    recommendedActivities.push(
      { title: 'Al Fresco Dining & Coffee Tasting', desc: 'Tangkilikin ang malamig na simoy ng hangin sa labas.', type: 'outdoor' },
      { title: 'Night Market / Park Sightseeing', desc: 'Maglakad sa mga liwasan, strawberry farm, o pasyalan.', type: 'outdoor' },
      { title: 'Camping o Bonfire Gathering', desc: 'Cozy outdoor bonding kasama ang mga kaibigan.', type: 'outdoor' }
    );

    toAvoidActivities.push(
      { title: 'Paglabas nang walang dalang panangga sa gabi', desc: 'Mabilis bumagsak ang temperatura paglubog ng araw.' },
      { title: 'Pagsusuot ng manipis na tsinelas sa mahabang lakaran', desc: 'Madaling manlamig ang mga daliri sa paa.' }
    );
  }
  // --- SCENARIO D: REGULAR TROPICAL WARMTH (25°C - 37°C) ---
  else {
    vibeSummary = `Karaniwang maaliwalas na panahon sa ${weather.cityName} (${weather.temp}°C). Mainam sa mga paboritong aktibidad!`;
    topAdvice = 'Magsuot ng balanced tropical casual fits. Magbaon pa rin ng payong para sa panlaban sa araw o biglaang ambon.';

    if (persona === 'commuter') {
      commuterTip = 'Ihanda ang pamaypay para sa mga non-aircon jeep. Maglagay ng sunscreen sa braso kung sasakay sa may bintana.';
      packingChecklist.push('Pamaypay', 'Sunscreen SPF 30+', 'Maliit na tumbler', 'Hand sanitizer');
    } else if (persona === 'student') {
      commuterTip = 'Komportableng sneakers ang piliin para sa mahabang lakad sa mga hallway at building ng paaralan.';
      packingChecklist.push('Student ID & Lanyard', 'Tumbler', 'Foldable umbrella', 'Light sweater');
    } else if (persona === 'office') {
      commuterTip = 'Magdala ng cardigan o blazer na maiiwan sa opisina kapag malamig ang sentralisadong aircon.';
      packingChecklist.push('Office cardigan', 'Sunscreen', 'Mint / breath freshener');
    } else if (persona === 'workout') {
      commuterTip = 'Tamang panahon para sa outdoor run o ride sa umaga (6-8 AM) o pagkatapos ng 4:30 PM.';
      packingChecklist.push('Sweat wristband', 'Running belt', 'Water bottle');
    } else {
      commuterTip = 'Swak ang araw para mag-explore ng bagong cafes, park strolls, o food bazaars.';
      packingChecklist.push('Sunglasses', 'Tote bag', 'Sunscreen', 'Foldable payong');
    }

    outfitItems.push({
      category: 'Ulo / Mukha',
      item: 'Sun Hat o Modern Cap',
      fabricOrNote: 'Pananggalang sa sikat ng araw sa tanghali',
      iconName: 'Sun'
    });

    outfitItems.push({
      category: 'Pang-itaas (Top)',
      item: persona === 'office' ? 'Polo Shirt o Smart Blouse' : 'Cotton Crewneck o Relaxed Camp Collar Shirt',
      fabricOrNote: '100% Breathable cotton para presko maghapon',
      iconName: 'Shirt'
    });

    outfitItems.push({
      category: 'Pang-ibaba (Bottom)',
      item: persona === 'office' ? 'Chino Trousers' : 'Everyday Denim Shorts o Tailored Linen Pants',
      fabricOrNote: 'Madaling igalaw at hindi naiipit ang hangin',
      iconName: 'Scissors'
    });

    outfitItems.push({
      category: 'Kasuotan sa Paa (Footwear)',
      item: 'Comfortable Everyday Sneakers o Slip-ons',
      fabricOrNote: 'May magandang cushioning para sa paglalakad',
      iconName: 'Footprints'
    });

    outfitItems.push({
      category: 'Layers / Jacket',
      item: 'Light Cardigan o Unbuttoned Linen Overshirt (Optional)',
      fabricOrNote: 'Gamit panlaban sa malamig na aircon sa mall o sasakyan',
      iconName: 'Layers'
    });

    outfitItems.push({
      category: 'Gamit / Accessories',
      item: 'Pocket Foldable Umbrella + Sunscreen + Reusable Water Bottle',
      fabricOrNote: 'Ang tatlong bida para sa komportableng pag-ikot sa Maynila',
      iconName: 'Umbrella'
    });

    recommendedActivities.push(
      { title: 'Morning Jog / Park Walk', desc: 'Sariwang simoy ng hangin bago sumikat nang husto ang araw.', type: 'outdoor' },
      { title: 'Food Trip & Al Fresco Merienda', desc: 'Mag-ikot sa mga street food bazaar o outdoor night market.', type: 'outdoor' },
      { title: 'Cafe Work o Casual Catch-up', desc: 'Makipagkita sa barkada sa paboritong coffee spot.', type: 'shaded' }
    );

    toAvoidActivities.push(
      { title: 'Paglimot sa Sunscreen kapag lalabas sa tanghali', desc: 'Madaling magka-sunburn sa UV exposure sa bandang 11 AM.' },
      { title: 'Pag-inom ng sobrang matatamis na softdrinks imbes na tubig', desc: 'Hindi ito nakakapawi ng dehydration sa mainit na panahon.' }
    );
  }

  return {
    vibeSummary,
    topAdvice,
    heatIndexInfo: heatInfo,
    rainInfo,
    outfitItems,
    activities: {
      recommended: recommendedActivities,
      toAvoid: toAvoidActivities
    },
    commuterTip,
    packingChecklist,
    hydrationTargetLiters: hydrationTarget,
    isAiGenerated: false
  };
}
