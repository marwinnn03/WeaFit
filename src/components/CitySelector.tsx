import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { CityData } from '../types';
import { PHILIPPINE_CITIES } from '../data/cities';

interface CitySelectorProps {
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onUseGps: () => void;
  isGpsLoading: boolean;
  isSimulated?: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onSelectCity,
  onUseGps,
  isGpsLoading,
  isSimulated
}) => {
  return (
    <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="#38bdf8" />
          <h2 style={{ fontSize: '0.975rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
            Piliin ang Siyudad / Lokasyon
          </h2>
        </div>

        {/* GPS Button */}
        <button
          onClick={onUseGps}
          disabled={isGpsLoading}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
        >
          <Navigation size={14} className={isGpsLoading ? 'animate-spin' : ''} />
          <span>{isGpsLoading ? 'Kinukuha ang GPS...' : 'Lokasyon Ko (GPS)'}</span>
        </button>
      </div>

      {/* Preset Cities Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {PHILIPPINE_CITIES.map((city) => {
          const isSelected = selectedCity.name === city.name && !isSimulated;
          return (
            <button
              key={city.name}
              onClick={() => onSelectCity(city)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35), rgba(59, 130, 246, 0.25))' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#ffffff' : '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>

      {/* Location detail footer */}
      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={14} />
          <span>Coordinates: {selectedCity.latitude.toFixed(4)}° N, {selectedCity.longitude.toFixed(4)}° E</span>
        </div>
        {isSimulated && (
          <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            Naka-Simulate na Panahon
          </span>
        )}
      </div>
    </div>
  );
};
