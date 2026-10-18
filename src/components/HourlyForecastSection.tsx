import React from 'react';
import { Clock, Droplets, Sun, CloudRain, CloudLightning, SunMedium, Cloud } from 'lucide-react';
import { HourlyForecastItem } from '../types';

interface HourlyForecastSectionProps {
  forecast: HourlyForecastItem[];
}

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const getMiniIcon = (code: number) => {
    if (code >= 95) return <CloudLightning size={20} color="#f59e0b" />;
    if (code >= 51) return <CloudRain size={20} color="#38bdf8" />;
    if (code >= 3) return <Cloud size={20} color="#94a3b8" />;
    if (code >= 1) return <SunMedium size={20} color="#fbbf24" />;
    return <Sun size={20} color="#f59e0b" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Clock size={18} color="#38bdf8" />
        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
          Oras-Oras na Pagtataya (Hourly Forecast)
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
        {forecast.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel-subtle"
            style={{
              padding: '12px 14px',
              minWidth: '100px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
              {item.time}
            </span>

            <div style={{ margin: '4px 0' }}>
              {getMiniIcon(item.weatherCode)}
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              {item.temp}°C
            </div>

            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Damang: {item.feelsLike}°
            </span>

            {/* Rain chance pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.7rem',
              color: item.rainChance >= 50 ? '#38bdf8' : '#64748b',
              marginTop: '2px'
            }}>
              <Droplets size={12} />
              <span>{item.rainChance}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
