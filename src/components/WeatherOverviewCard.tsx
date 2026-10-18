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
import { WeatherData, PagasaHeatIndexInfo } from '../types';

interface WeatherOverviewCardProps {
  weather: WeatherData;
  heatInfo: PagasaHeatIndexInfo;
}

export const WeatherOverviewCard: React.FC<WeatherOverviewCardProps> = ({
  weather,
  heatInfo
}) => {
  const getWeatherIcon = (code: number) => {
    if (code >= 95) return <CloudLightning size={52} color="#f59e0b" className="animate-pulse" />;
    if (code >= 51) return <CloudRain size={52} color="#38bdf8" className="animate-float" />;
    if (code >= 45) return <CloudFog size={52} color="#94a3b8" />;
    if (code >= 3) return <Cloud size={52} color="#cbd5e1" />;
    if (code >= 1) return <SunMedium size={52} color="#fbbf24" className="animate-spin-slow" />;
    return <Sun size={52} color="#f59e0b" className="animate-pulse-slow" />;
  };

  // Heat Index meter position percentage: maps 20°C to 55°C -> 0% to 100%
  const clampHeatPercent = Math.min(Math.max(((weather.feelsLike - 20) / (55 - 20)) * 100, 0), 100);

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header: City & Condition */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Weather Overview
          </span>
          <h2 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 800, margin: '2px 0 0 0', color: '#ffffff' }}>
            {weather.cityName}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            {weather.conditionText}
          </p>
        </div>

        <div style={{ padding: '8px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.04)' }}>
          {getWeatherIcon(weather.weatherCode)}
        </div>
      </div>

      {/* Main Temperature Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Actual Temp */}
        <div className="glass-panel-subtle" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>
            <Thermometer size={16} color="#38bdf8" />
            <span>Temperatura</span>
          </div>
          <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: '#ffffff' }}>
            {weather.temp}°<span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#64748b' }}>C</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Aktwal sa thermometer</span>
        </div>

        {/* Feels Like (Heat Index) */}
        <div className="glass-panel-subtle" style={{ padding: '16px', borderLeft: `4px solid ${heatInfo.badgeColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>
            <Gauge size={16} color={heatInfo.badgeColor} />
            <span style={{ fontWeight: 700, color: heatInfo.badgeColor }}>Damang Init (Heat Index)</span>
          </div>
          <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: heatInfo.badgeColor }}>
            {weather.feelsLike}°<span style={{ fontSize: '1.4rem', fontWeight: 600, color: '#64748b' }}>C</span>
          </div>
          <span className="badge" style={{ marginTop: '4px', background: `${heatInfo.badgeColor}25`, color: heatInfo.badgeColor, border: `1px solid ${heatInfo.badgeColor}40`, fontSize: '0.7rem' }}>
            {heatInfo.tagalogLabel}
          </span>
        </div>

      </div>

      {/* Heat Index Scale Gauge */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.785rem' }}>
          <span style={{ color: '#94a3b8' }}>PAGASA Heat Index Meter</span>
          <span style={{ fontWeight: 700, color: heatInfo.badgeColor }}>{weather.feelsLike}°C - {heatInfo.englishLabel}</span>
        </div>
        
        {/* Colorful gradient track */}
        <div style={{ position: 'relative', height: '10px', borderRadius: '6px', background: 'linear-gradient(to right, #10b981 0%, #f59e0b 28%, #f97316 55%, #ef4444 80%, #7f1d1d 100%)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
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
            border: `3px solid ${heatInfo.badgeColor}`,
            boxShadow: `0 0 10px ${heatInfo.badgeColor}`,
            transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: '#64748b' }}>
          <span>&lt;27° Presko</span>
          <span>27-32° Caution</span>
          <span>33-41° Ext. Caution</span>
          <span>42-51° Danger</span>
          <span>52°+ Extreme</span>
        </div>
      </div>

      {/* Atmospheric Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        {/* Rain Chance */}
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.775rem', marginBottom: '2px' }}>
            <Droplets size={14} />
            <span>Tsansa ng Ulan</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e0f2fe' }}>
            {weather.rainChance}%
          </div>
          <span style={{ fontSize: '0.675rem', color: weather.rainChance >= 60 ? '#f87171' : '#38bdf8' }}>
            {weather.rainChance >= 60 ? 'Mataas' : weather.rainChance >= 30 ? 'Katamtaman' : 'Mababa'}
          </span>
        </div>

        {/* Humidity */}
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#c084fc', fontSize: '0.775rem', marginBottom: '2px' }}>
            <Droplets size={14} />
            <span>Alinsangan</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f3e8ff' }}>
            {weather.humidity}%
          </div>
          <span style={{ fontSize: '0.675rem', color: '#c084fc' }}>
            Relative Humidity
          </span>
        </div>

        {/* Wind Speed / UV */}
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.775rem', marginBottom: '2px' }}>
            <Wind size={14} />
            <span>Hangin & UV</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef3c7' }}>
            {weather.windSpeed} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>km/h</span>
          </div>
          <span style={{ fontSize: '0.675rem', color: '#fbbf24' }}>
            UV Index: {weather.uvIndex}
          </span>
        </div>

      </div>

    </div>
  );
};
