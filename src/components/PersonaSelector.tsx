import React from 'react';
import { Bike, GraduationCap, Briefcase, Coffee, Dumbbell, UserCheck } from 'lucide-react';
import { PersonaType } from '../types';
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
    const color = isSelected ? '#38bdf8' : '#94a3b8';
    switch (iconName) {
      case 'Bike':
        return <Bike size={22} color={color} />;
      case 'GraduationCap':
        return <GraduationCap size={22} color={color} />;
      case 'Briefcase':
        return <Briefcase size={22} color={color} />;
      case 'Coffee':
        return <Coffee size={22} color={color} />;
      case 'Dumbbell':
        return <Dumbbell size={22} color={color} />;
      default:
        return <UserCheck size={22} color={color} />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '0.975rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
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
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(p.icon, isSelected)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0', margin: 0 }}>
                    {p.name}
                  </h3>
                  {isSelected && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: isSelected ? '#bae6fd' : '#94a3b8', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
