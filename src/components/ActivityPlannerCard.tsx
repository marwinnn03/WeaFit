import React from 'react';
import { CheckCircle, XCircle, Compass, Bus, MapPin } from 'lucide-react';
import { RecommendationResult, PersonaType } from '../types';

interface ActivityPlannerCardProps {
  recommendation: RecommendationResult;
  persona: PersonaType;
}

export const ActivityPlannerCard: React.FC<ActivityPlannerCardProps> = ({
  recommendation,
  persona
}) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '18px' }}>
        <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
          🏃 Suhestiyon sa Aktibidad at Commute Guide
        </h2>
        <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
          Mga ligtas at masayang pwedeng gawin base sa lagay ng panahon ngayon
        </p>
      </div>

      {/* Commuter Strategy Callout */}
      <div style={{
        padding: '16px',
        borderRadius: '14px',
        background: 'rgba(2, 132, 199, 0.1)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Bus size={18} color="#38bdf8" />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8' }}>
            Biyahe & Commute Strategy
          </span>
          <p style={{ fontSize: '0.875rem', color: '#f1f5f9', margin: '3px 0 0 0', lineHeight: 1.5 }}>
            {recommendation.commuterTip}
          </p>
        </div>
      </div>

      {/* Activities Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Recommended activities */}
        <div className="glass-panel-subtle" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CheckCircle size={18} color="#10b981" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Mga Magagandang Gawin (Do's)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendation.activities.recommended.map((act, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                    {act.title}
                  </span>
                  <span className="badge" style={{
                    fontSize: '0.65rem',
                    background: act.type === 'indoor' ? 'rgba(59, 130, 246, 0.15)' : act.type === 'outdoor' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: act.type === 'indoor' ? '#60a5fa' : act.type === 'outdoor' ? '#34d399' : '#fbbf24'
                  }}>
                    {act.type.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                  {act.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities to Avoid */}
        <div className="glass-panel-subtle" style={{ padding: '18px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <XCircle size={18} color="#ef4444" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Dapat Iwasan (Don'ts)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendation.activities.toAvoid.map((act, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fca5a5', margin: '0 0 3px 0' }}>
                  ⚠️ {act.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                  {act.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
