import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Search, X, Loader2, Building2 } from 'lucide-react';
import type { CityData } from '../types';
import { PHILIPPINE_CITIES } from '../data/cities';
import { searchLocations } from '../utils/weatherService';

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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        // Also check if any local preset matches
        const localMatches = PHILIPPINE_CITIES.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.province.toLowerCase().includes(query.toLowerCase())
        );

        const apiMatches = await searchLocations(query);

        // Merge and avoid duplicates by name
        const combined = [...localMatches];
        for (const item of apiMatches) {
          if (!combined.some(c => c.name.toLowerCase() === item.name.toLowerCase())) {
            combined.push(item);
          }
        }

        setResults(combined);
      } catch (err) {
        console.warn('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectLocation = (location: CityData) => {
    onSelectCity(location);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', position: 'relative' }}>
      
      {/* Header bar */}
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
          title="Kuhanin ang eksaktong panahon gamit ang iyong GPS"
        >
          <Navigation size={13} className={isGpsLoading ? 'animate-spin' : ''} />
          <span>{isGpsLoading ? 'Kinukuha ang GPS...' : 'Lokasyon Ko (GPS)'}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div ref={searchContainerRef} style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
            {isSearching ? <Loader2 size={16} className="animate-spin" color="#0284c7" /> : <Search size={16} />}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim().length >= 2) setIsOpen(true); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length > 0) {
                e.preventDefault();
                handleSelectLocation(results[0]);
              } else if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            placeholder="Maghanap ng lugar (hal. Makati, Pasig, Cavite, Antipolo)..."
            style={{
              width: '100%',
              padding: '10px 36px 10px 36px',
              borderRadius: '12px',
              border: isOpen ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.875rem',
              color: '#0f172a',
              outline: 'none',
              boxShadow: isOpen ? '0 0 0 3px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.15s ease'
            }}
          />

          {query && (
            <button
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Burahin ang search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.15), 0 5px 15px -5px rgba(15, 23, 42, 0.08)',
              zIndex: 100,
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '6px'
            }}
          >
            {results.length > 0 ? (
              results.map((loc, i) => (
                <div
                  key={`${loc.name}-${loc.latitude}-${i}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectLocation(loc);
                  }}
                  onClick={() => handleSelectLocation(loc)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        {loc.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                        {loc.province}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.725rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    Piliin
                  </span>
                </div>
              ))
            ) : !isSearching ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Walang nahanap na lugar para sa "{query}".
              </div>
            ) : null}
          </div>
        )}
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
