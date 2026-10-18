import React from 'react';
import { Clock, Droplets, Sun, CloudRain, CloudLightning, SunMedium, Cloud } from 'lucide-react';
import type { HourlyForecastItem } from '../types';

interface HourlyForecastSectionProps {
  forecast: HourlyForecastItem[];
}

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const getMiniIcon = (code: number) => {
    if (code >= 95) return <CloudLightning size={20} color="#d97706" />;
    if (code >= 51) return <CloudRain size={20} color="#0284c7" />;
    if (code >= 3) return <Cloud size={20} color="#64748b" />;
    if (code >= 1) return <SunMedium size={20} color="#f59e0b" />;
    return <Sun size={20} color="#ea580c" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Clock size={18} color="#0284c7" />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
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
              flexShrink: 0,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
              {item.time}
            </span>

            <div style={{ margin: '4px 0' }}>
              {getMiniIcon(item.weatherCode)}
            </div>

            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {item.temp}°C
            </div>

            <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 500 }}>
              Damang: {item.feelsLike}°
            </span>

            {/* Rain chance pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.725rem',
              color: item.rainChance >= 50 ? '#0284c7' : '#94a3b8',
              fontWeight: item.rainChance >= 50 ? 700 : 500,
              marginTop: '2px'
            }}>
              <Droplets size={12} color={item.rainChance >= 50 ? '#0284c7' : '#94a3b8'} />
              <span>{item.rainChance}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
