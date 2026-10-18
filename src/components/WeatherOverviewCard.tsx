import React from 'react';
import { 
  Sun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Gauge, 
  Thermometer, 
  SunMedium, 
  CloudLightning, 
  CloudFog, 
  Cloud
} from 'lucide-react';
import type { WeatherData, PagasaHeatIndexInfo } from '../types';

interface WeatherOverviewCardProps {
  weather: WeatherData;
  heatInfo: PagasaHeatIndexInfo;
}

export const WeatherOverviewCard: React.FC<WeatherOverviewCardProps> = ({
  weather,
  heatInfo
}) => {
  const getWeatherIcon = (code: number) => {
    if (code >= 95) return <CloudLightning size={48} color="#d97706" className="animate-pulse" />;
    if (code >= 51) return <CloudRain size={48} color="#0284c7" className="animate-float" />;
    if (code >= 45) return <CloudFog size={48} color="#64748b" />;
    if (code >= 3) return <Cloud size={48} color="#94a3b8" />;
    if (code >= 1) return <SunMedium size={48} color="#f59e0b" className="animate-pulse-slow" />;
    return <Sun size={48} color="#ea580c" className="animate-pulse-slow" />;
  };

  // Heat Index meter position percentage: maps 20°C to 55°C -> 0% to 100%
  const clampHeatPercent = Math.min(Math.max(((weather.feelsLike - 20) / (55 - 20)) * 100, 0), 100);

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header: City & Condition */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.785rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Weather Overview
          </span>
          <h2 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0f172a' }}>
            {weather.cityName}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 500 }}>
            {weather.conditionText}
          </p>
        </div>

        <div style={{ padding: '10px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)' }}>
          {getWeatherIcon(weather.weatherCode)}
        </div>
      </div>

      {/* Main Temperature Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Actual Temp */}
        <div className="glass-panel-subtle" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', marginBottom: '4px' }}>
            <Thermometer size={16} color="#0284c7" />
            <span style={{ fontWeight: 600 }}>Temperatura</span>
          </div>
          <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: '#0f172a' }}>
            {weather.temp}°<span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#94a3b8' }}>C</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Aktwal sa thermometer</span>
        </div>

        {/* Feels Like (Heat Index) */}
        <div className="glass-panel-subtle" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: `4px solid ${heatInfo.badgeColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: heatInfo.textColor, fontSize: '0.8rem', marginBottom: '4px' }}>
            <Gauge size={16} color={heatInfo.badgeColor} />
            <span style={{ fontWeight: 700 }}>Damang Init (Heat Index)</span>
          </div>
          <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: heatInfo.badgeColor }}>
            {weather.feelsLike}°<span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#94a3b8' }}>C</span>
          </div>
          <span className="badge" style={{ marginTop: '4px', background: `${heatInfo.badgeColor}18`, color: heatInfo.badgeColor, border: `1px solid ${heatInfo.badgeColor}35`, fontSize: '0.7rem' }}>
            {heatInfo.tagalogLabel}
          </span>
        </div>

      </div>

      {/* Heat Index Scale Gauge */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.785rem' }}>
          <span style={{ color: '#475569', fontWeight: 600 }}>PAGASA Heat Index Meter</span>
          <span style={{ fontWeight: 700, color: heatInfo.badgeColor }}>{weather.feelsLike}°C - {heatInfo.englishLabel}</span>
        </div>
        
        {/* Colorful gradient track */}
        <div style={{ position: 'relative', height: '10px', borderRadius: '6px', background: 'linear-gradient(to right, #10b981 0%, #f59e0b 28%, #f97316 55%, #ef4444 80%, #991b1b 100%)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Indicator pin */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: `${clampHeatPercent}%`,
            transform: 'translateX(-50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `3.5px solid ${heatInfo.badgeColor}`,
            boxShadow: `0 2px 8px rgba(15, 23, 42, 0.25)`,
            transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
          <span>&lt;27° Presko</span>
          <span>27-32° Caution</span>
          <span>33-41° Ext. Caution</span>
          <span>42-51° Danger</span>
          <span>52°+ Extreme</span>
        </div>
      </div>

      {/* Atmospheric Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
        
        {/* Rain Chance */}
        <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '12px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#0369a1', fontSize: '0.775rem', fontWeight: 600, marginBottom: '2px' }}>
            <Droplets size={14} />
            <span>Tsansa ng Ulan</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>
            {weather.rainChance}%
          </div>
          <span style={{ fontSize: '0.675rem', fontWeight: 600, color: weather.rainChance >= 60 ? '#dc2626' : '#0369a1' }}>
            {weather.rainChance >= 60 ? 'Mataas' : weather.rainChance >= 30 ? 'Katamtaman' : 'Mababa'}
          </span>
        </div>

        {/* Humidity */}
        <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '12px', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#7e22ce', fontSize: '0.775rem', fontWeight: 600, marginBottom: '2px' }}>
            <Droplets size={14} />
            <span>Alinsangan</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#9333ea' }}>
            {weather.humidity}%
          </div>
          <span style={{ fontSize: '0.675rem', color: '#7e22ce', fontWeight: 500 }}>
            Humidity
          </span>
        </div>

        {/* Wind Speed / UV */}
        <div style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '12px', background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#b45309', fontSize: '0.775rem', fontWeight: 600, marginBottom: '2px' }}>
            <Wind size={14} />
            <span>Hangin & UV</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#d97706' }}>
            {weather.windSpeed} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>km/h</span>
          </div>
          <span style={{ fontSize: '0.675rem', color: '#b45309', fontWeight: 600 }}>
            UV: {weather.uvIndex}
          </span>
        </div>

      </div>

    </div>
  );
};
