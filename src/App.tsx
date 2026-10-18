import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';

import type { CityData, PersonaType, WeatherData, RecommendationResult } from './types';
import { DEFAULT_CITY } from './data/cities';
import { fetchLiveWeather, createSimulatedWeather } from './utils/weatherService';
import { generateRuleBasedRecommendation } from './utils/wardrobePresets';
import { 
  getStoredGeminiKey, 
  fetchGeminiOutfitRecommendation 
} from './utils/geminiService';
import { getPagasaHeatIndexInfo, getPagasaRainInfo } from './utils/pagasaEngine';

// Components
import { Header } from './components/Header';
import { CitySelector } from './components/CitySelector';
import { PersonaSelector } from './components/PersonaSelector';
import { WeatherOverviewCard } from './components/WeatherOverviewCard';
import { PagasaAlertBanner } from './components/PagasaAlertBanner';
import { OutfitRecommendationCard } from './components/OutfitRecommendationCard';
import { ActivityPlannerCard } from './components/ActivityPlannerCard';
import { HourlyForecastSection } from './components/HourlyForecastSection';
import { CommuterChecklistCard } from './components/CommuterChecklistCard';
import { WeatherSimulatorModal } from './components/WeatherSimulatorModal';
import { GeminiKeyModal } from './components/GeminiKeyModal';

const GithubIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const App: React.FC = () => {
  // Application State
  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('commuter');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  // Loading & Modals
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [geminiKey, setGeminiKey] = useState<string>('');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Initialize stored key on mount
  useEffect(() => {
    const key = getStoredGeminiKey();
    if (key) setGeminiKey(key);
  }, []);

  // Fetch Weather logic
  const loadWeather = useCallback(async (city: CityData) => {
    setIsLoadingWeather(true);
    setErrorMessage(null);
    try {
      const data = await fetchLiveWeather(city.latitude, city.longitude, city.name);
      setWeather(data);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setErrorMessage(`Hindi makuha ang live weather sa ${city.name}. Gumagamit ng backup data.`);
      // Fallback data
      const fallback = createSimulatedWeather({
        cityName: city.name,
        temp: 32,
        feelsLike: 37,
        rainChance: 40,
        humidity: 78,
        windSpeed: 14,
        weatherCode: 2,
        uvIndex: 7
      });
      setWeather(fallback);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Load weather when city changes
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Generate recommendations when weather, persona, or geminiKey changes
  const updateRecommendations = useCallback(async (currentWeather: WeatherData, persona: PersonaType, key: string) => {
    if (!currentWeather) return;

    if (key && key.trim() !== '') {
      setIsLoadingAi(true);
      try {
        const aiRec = await fetchGeminiOutfitRecommendation(currentWeather, persona, key);
        setRecommendation(aiRec);
        // Micro celebration on successful AI call
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (err: any) {
        console.warn('Gemini AI failed, using fallback engine:', err);
        const ruleRec = generateRuleBasedRecommendation(currentWeather, persona);
        setRecommendation(ruleRec);
      } finally {
        setIsLoadingAi(false);
      }
    } else {
      const ruleRec = generateRuleBasedRecommendation(currentWeather, persona);
      setRecommendation(ruleRec);
    }
  }, []);

  useEffect(() => {
    if (weather) {
      updateRecommendations(weather, selectedPersona, geminiKey);
    }
  }, [weather, selectedPersona, geminiKey, updateRecommendations]);

  // GPS Geolocation Handler
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Hindi suportado ng iyong browser ang Geolocation.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const gpsCity: CityData = {
          name: 'Kasalukuyang Lokasyon Ko (GPS)',
          province: 'Pilipinas',
          latitude: lat,
          longitude: lon,
          isPopular: false
        };
        setSelectedCity(gpsCity);
        await loadWeather(gpsCity);
        setIsGpsLoading(false);
      },
      (err) => {
        console.warn('GPS denied or timed out:', err);
        alert('Hindi makuha ang GPS. Ibabalik sa Caloocan / Metro Manila bilang default.');
        setSelectedCity(DEFAULT_CITY);
        setIsGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Weather Simulator Apply
  const handleApplySimulation = (simWeather: WeatherData) => {
    setWeather(simWeather);
    updateRecommendations(simWeather, selectedPersona, geminiKey);
  };

  // Dynamic Theme Class
  const getThemeClass = () => {
    if (!weather) return 'weather-bg-fair';
    if (weather.feelsLike >= 42) return 'weather-bg-heat';
    if (weather.rainChance >= 60 || weather.weatherCode >= 51) return 'weather-bg-storm';
    if (weather.feelsLike <= 24) return 'weather-bg-cool';
    return 'weather-bg-fair';
  };

  const heatInfo = weather ? getPagasaHeatIndexInfo(weather.feelsLike) : getPagasaHeatIndexInfo(32);
  const rainInfo = weather ? getPagasaRainInfo(weather.rainChance, weather.weatherCode) : getPagasaRainInfo(20, 1);

  return (
    <div className={`min-h-screen ${getThemeClass()}`} style={{ minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <div className="app-container">
        
        {/* Header */}
        <Header
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onOpenKeyModal={() => setIsKeyModalOpen(true)}
          onRefreshWeather={() => loadWeather(selectedCity)}
          isLoading={isLoadingWeather || isLoadingAi}
          hasGeminiKey={!!geminiKey}
          repoUrl="https://github.com/marwinnn03/WeaFit"
        />

        {/* Global Error Notice if any */}
        {errorMessage && (
          <div style={{ padding: '12px 18px', borderRadius: '12px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid: 2 Columns on Desktop */}
        <div className="grid-main-layout">
          
          {/* LEFT COLUMN: Controls & Meteorological Stats */}
          <div>
            {/* City Selection */}
            <CitySelector
              selectedCity={selectedCity}
              onSelectCity={(city) => setSelectedCity(city)}
              onUseGps={handleUseGps}
              isGpsLoading={isGpsLoading}
              isSimulated={weather?.isSimulated}
            />

            {/* Weather Overview Card */}
            {weather ? (
              <WeatherOverviewCard
                weather={weather}
                heatInfo={heatInfo}
              />
            ) : (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto' }} color="#0284c7" />
                <p>Kinukuha ang pinakabagong lagay ng panahon mula sa Open-Meteo...</p>
              </div>
            )}

            {/* Hourly Forecast Timeline */}
            {weather && weather.hourlyForecast && (
              <div style={{ marginTop: '20px' }}>
                <HourlyForecastSection forecast={weather.hourlyForecast} />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Recommender, Persona Filter & Lifestyle Insights */}
          <div>
            {/* Persona Selector */}
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelectPersona={(p) => setSelectedPersona(p)}
            />

            {/* PAGASA Heat & Rainfall Alert Banner */}
            <PagasaAlertBanner
              heatInfo={heatInfo}
              rainInfo={rainInfo}
            />

            {/* AI Status / Regenerate Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                <Sparkles size={14} color="#9333ea" />
                <span>
                  {geminiKey ? 'Aktibo ang Gemini AI Integration' : 'Naka-setup sa PAGASA Tropical Rule Engine'}
                </span>
              </div>

              <button
                onClick={() => weather && updateRecommendations(weather, selectedPersona, geminiKey)}
                disabled={isLoadingAi}
                className="btn-secondary"
                style={{ padding: '7px 14px', fontSize: '0.785rem', color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
              >
                <RefreshCw size={13} className={isLoadingAi ? 'animate-spin' : ''} />
                <span>{isLoadingAi ? 'Bumubuo ng AI payo...' : 'I-refresh ang Suhestiyon'}</span>
              </button>
            </div>

            {/* Outfit Recommendation Card */}
            {recommendation ? (
              <OutfitRecommendationCard
                recommendation={recommendation}
                personaName={selectedPersona.toUpperCase()}
              />
            ) : (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto' }} color="#0284c7" />
                <p>Pinoproseso ang suhestiyon sa kasuotan...</p>
              </div>
            )}

            {/* Activity Planner Card */}
            {recommendation && (
              <ActivityPlannerCard
                recommendation={recommendation}
                persona={selectedPersona}
              />
            )}

            {/* Commuter Checklist & Hydration Card */}
            {recommendation && (
              <CommuterChecklistCard
                recommendation={recommendation}
              />
            )}
          </div>

        </div>

        {/* Footer */}
        <footer style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.825rem', color: '#64748b' }}>
          <div>
            <strong style={{ color: '#0f172a' }}>WeaFit</strong> • Gawa para sa mga Pinoy commuters, estudyante, at professionals.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Data mula sa <strong>Open-Meteo</strong> & <strong>DOST-PAGASA</strong></span>
            <span>AI powered by <strong>Google Gemini</strong></span>
            <a
              href="https://github.com/marwinnn03/WeaFit"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <GithubIcon size={14} />
              <span>GitHub Repo</span>
            </a>
          </div>
        </footer>

      </div>

      {/* Modals */}
      <WeatherSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onApplySimulation={handleApplySimulation}
        currentWeather={weather || createSimulatedWeather({
          cityName: selectedCity.name,
          temp: 32,
          feelsLike: 37,
          rainChance: 30,
          humidity: 75,
          windSpeed: 12,
          weatherCode: 1,
          uvIndex: 6
        })}
      />

      <GeminiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentKey={geminiKey}
        onKeySaved={(newKey) => setGeminiKey(newKey)}
      />

    </div>
  );
};

export default App;
