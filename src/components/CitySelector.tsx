import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import type { CityData } from '../types';
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
          <MapPin size={18} color="#0284c7" />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
            Piliin ang Siyudad / Lokasyon
          </h2>
        </div>

        {/* GPS Button */}
        <button
          onClick={onUseGps}
          disabled={isGpsLoading}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#bae6fd', background: '#f0f9ff', color: '#0284c7', fontWeight: 600 }}
        >
          <Navigation size={13} className={isGpsLoading ? 'animate-spin' : ''} />
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
                border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, #e0f2fe, #bae6fd)' : '#ffffff',
                color: isSelected ? '#0369a1' : '#334155',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.2)' : '0 1px 3px rgba(15, 23, 42, 0.03)'
              }}
            >
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>

      {/* Location detail footer */}
      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={14} color="#64748b" />
          <span>Coordinates: {selectedCity.latitude.toFixed(4)}° N, {selectedCity.longitude.toFixed(4)}° E</span>
        </div>
        {isSimulated && (
          <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
            Naka-Simulate na Panahon
          </span>
        )}
      </div>
    </div>
  );
};
