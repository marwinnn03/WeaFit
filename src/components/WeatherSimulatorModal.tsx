import React, { useState } from 'react';
import { X, Flame, CloudRain, Sun, Mountain, Zap, SlidersHorizontal, Check } from 'lucide-react';
import { WeatherData } from '../types';
import { createSimulatedWeather } from '../utils/weatherService';

interface WeatherSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySimulation: (weather: WeatherData) => void;
  currentWeather: WeatherData;
}

export const WeatherSimulatorModal: React.FC<WeatherSimulatorModalProps> = ({
  isOpen,
  onClose,
  onApplySimulation,
  currentWeather
}) => {
  const [temp, setTemp] = useState(currentWeather.temp);
  const [feelsLike, setFeelsLike] = useState(currentWeather.feelsLike);
  const [rainChance, setRainChance] = useState(currentWeather.rainChance);
  const [humidity, setHumidity] = useState(currentWeather.humidity);
  const [windSpeed, setWindSpeed] = useState(currentWeather.windSpeed);
  const [weatherCode, setWeatherCode] = useState(currentWeather.weatherCode);

  if (!isOpen) return null;

  const presets = [
    {
      title: '🔥 44°C Danger Heatwave (Tanghaling Tapat)',
      desc: 'PAGASA Danger Level. Matinding alinsangan at panganib sa heat stroke.',
      data: {
        cityName: 'Metro Manila (Simulated Heatwave)',
        temp: 36,
        feelsLike: 44,
        rainChance: 10,
        humidity: 78,
        windSpeed: 8,
        weatherCode: 0,
        uvIndex: 11
      }
    },
    {
      title: '🌧️ 92% Tropical Storm / Bagyo Signal #1',
      desc: 'Baha sa mga kalsada, malalakas na hangin at tuluy-tuloy na ulan.',
      data: {
        cityName: 'Caloocan / NCR (Simulated Storm)',
        temp: 26,
        feelsLike: 27,
        rainChance: 92,
        humidity: 95,
        windSpeed: 45,
        weatherCode: 65,
        uvIndex: 2
      }
    },
    {
      title: '🌲 17°C Preskong Baguio Morning',
      desc: 'Malamig na hangin sa kabundukan, masarap mag-hoodie at kape.',
      data: {
        cityName: 'Baguio City (Simulated Morning)',
        temp: 18,
        feelsLike: 17,
        rainChance: 5,
        humidity: 60,
        windSpeed: 12,
        weatherCode: 1,
        uvIndex: 6
      }
    },
    {
      title: '🌊 30°C Maaliwalas sa Baybayin ng Cebu',
      desc: 'Katamtamang init, banayad na hangin, perpekto sa outdoor walk.',
      data: {
        cityName: 'Cebu City (Simulated Sunny)',
        temp: 30,
        feelsLike: 33,
        rainChance: 15,
        humidity: 68,
        windSpeed: 18,
        weatherCode: 1,
        uvIndex: 8
      }
    },
    {
      title: '⚡ Biglaang Thunderstorm sa Hapon (Habagat)',
      desc: 'Mainit sa umaga pero biglang buhos at kulog bandang alas-tres ng hapon.',
      data: {
        cityName: 'Quezon City (Simulated Thunderstorm)',
        temp: 32,
        feelsLike: 38,
        rainChance: 80,
        humidity: 86,
        windSpeed: 28,
        weatherCode: 95,
        uvIndex: 4
      }
    }
  ];

  const handleApplyPreset = (presetData: any) => {
    const simWeather = createSimulatedWeather(presetData);
    onApplySimulation(simWeather);
    onClose();
  };

  const handleApplyCustom = () => {
    const simWeather = createSimulatedWeather({
      cityName: `${currentWeather.cityName} (Custom Sim)`,
      temp,
      feelsLike,
      rainChance,
      humidity,
      windSpeed,
      weatherCode,
      uvIndex: feelsLike >= 40 ? 11 : 6
    });
    onApplySimulation(simWeather);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlidersHorizontal size={20} color="#f59e0b" />
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Weather Simulator (Subukan ang Iba't Ibang Panahon)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                I-test agad ang tugon ng PAGASA Rule Engine at Gemini AI sa matitinding klima
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', display: 'block', marginBottom: '10px' }}>
            Mabilisang Scenarios (Presets):
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(p.data)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Sliders */}
        <div className="glass-panel-subtle" style={{ padding: '18px', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b', display: 'block', marginBottom: '14px' }}>
            Custom Weather Sliders:
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            {/* Temp Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                <span>Temperatura (°C)</span>
                <strong>{temp}°C</strong>
              </div>
              <input
                type="range"
                min="14"
                max="45"
                value={temp}
                onChange={e => setTemp(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Feels like Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                <span>Damang Init / Heat Index (°C)</span>
                <strong style={{ color: feelsLike >= 42 ? '#ef4444' : feelsLike >= 33 ? '#f97316' : '#10b981' }}>{feelsLike}°C</strong>
              </div>
              <input
                type="range"
                min="14"
                max="54"
                value={feelsLike}
                onChange={e => setFeelsLike(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
            </div>

            {/* Rain chance Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                <span>Tsansa ng Ulan (%)</span>
                <strong>{rainChance}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainChance}
                onChange={e => {
                  const val = Number(e.target.value);
                  setRainChance(val);
                  if (val >= 60) setWeatherCode(63);
                  else if (val >= 40) setWeatherCode(51);
                  else setWeatherCode(1);
                }}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
            </div>

            {/* Humidity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                <span>Alinsangan / Humidity (%)</span>
                <strong>{humidity}%</strong>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={humidity}
                onChange={e => setHumidity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#a855f7' }}
              />
            </div>

          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleApplyCustom}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Check size={16} />
              <span>Ilapat ang Custom Panahon</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
