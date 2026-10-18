import React from 'react';
import { Bike, GraduationCap, Briefcase, Coffee, Dumbbell, UserCheck } from 'lucide-react';
import type { PersonaType } from '../types';
import { PERSONAS } from '../utils/wardrobePresets';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona
}) => {
  const getIcon = (iconName: string, isSelected: boolean) => {
    const color = isSelected ? '#0284c7' : '#64748b';
    switch (iconName) {
      case 'Bike':
        return <Bike size={20} color={color} />;
      case 'GraduationCap':
        return <GraduationCap size={20} color={color} />;
      case 'Briefcase':
        return <Briefcase size={20} color={color} />;
      case 'Coffee':
        return <Coffee size={20} color={color} />;
      case 'Dumbbell':
        return <Dumbbell size={20} color={color} />;
      default:
        return <UserCheck size={20} color={color} />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
            Sino Ka Ngayong Araw? (Persona Selector)
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Nagbabago ang suhestiyon sa damit at payo base sa iyong araw-araw na routine
          </p>
        </div>
      </div>

      {/* Persona cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
        {PERSONAS.map((p) => {
          const isSelected = selectedPersona === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`persona-chip ${isSelected ? 'active' : ''}`}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isSelected ? '#e0f2fe' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(p.icon, isSelected)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#0369a1' : '#0f172a', margin: 0 }}>
                    {p.name}
                  </h3>
                  {isSelected && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7', boxShadow: '0 0 8px rgba(2, 132, 199, 0.4)' }} />
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: isSelected ? '#0284c7' : '#64748b', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.tagline}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
