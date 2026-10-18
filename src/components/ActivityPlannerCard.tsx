import React from 'react';
import { CheckCircle, XCircle, Bus } from 'lucide-react';
import type { RecommendationResult, PersonaType } from '../types';

interface ActivityPlannerCardProps {
  recommendation: RecommendationResult;
  persona: PersonaType;
}

export const ActivityPlannerCard: React.FC<ActivityPlannerCardProps> = ({
  recommendation
}) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '18px' }}>
        <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          🏃 Suhestiyon sa Aktibidad at Commute Guide
        </h2>
        <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '2px 0 0 0' }}>
          Mga ligtas at masayang pwedeng gawin base sa lagay ng panahon ngayon
        </p>
      </div>

      {/* Commuter Strategy Callout */}
      <div style={{
        padding: '16px',
        borderRadius: '14px',
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: '#e0f2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Bus size={18} color="#0284c7" />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0369a1' }}>
            Biyahe & Commute Strategy
          </span>
          <p style={{ fontSize: '0.875rem', color: '#1e293b', margin: '3px 0 0 0', lineHeight: 1.5, fontWeight: 500 }}>
            {recommendation.commuterTip}
          </p>
        </div>
      </div>

      {/* Activities Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Recommended activities */}
        <div className="glass-panel-subtle" style={{ padding: '18px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CheckCircle size={18} color="#059669" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Mga Magagandang Gawin (Do's)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendation.activities.recommended.map((act, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    {act.title}
                  </span>
                  <span className="badge" style={{
                    fontSize: '0.65rem',
                    background: act.type === 'indoor' ? '#eff6ff' : act.type === 'outdoor' ? '#ecfdf5' : '#fffbeb',
                    color: act.type === 'indoor' ? '#1d4ed8' : act.type === 'outdoor' ? '#047857' : '#b45309',
                    border: `1px solid ${act.type === 'indoor' ? '#bfdbfe' : act.type === 'outdoor' ? '#a7f3d0' : '#fde68a'}`
                  }}>
                    {act.type.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  {act.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities to Avoid */}
        <div className="glass-panel-subtle" style={{ padding: '18px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #e11d48' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <XCircle size={18} color="#e11d48" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Dapat Iwasan (Don'ts)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendation.activities.toAvoid.map((act, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#be123c', margin: '0 0 3px 0' }}>
                  ⚠️ {act.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
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
