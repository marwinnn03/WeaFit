import React, { useState } from 'react';
import { Briefcase, Droplets, CheckSquare, Square, Plus, GlassWater } from 'lucide-react';
import { RecommendationResult } from '../types';

interface CommuterChecklistCardProps {
  recommendation: RecommendationResult;
}

export const CommuterChecklistCard: React.FC<CommuterChecklistCardProps> = ({
  recommendation
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [waterCupsDrank, setWaterCupsDrank] = useState(2);

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const totalCups = Math.round((recommendation.hydrationTargetLiters * 1000) / 250); // 250ml per cup

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Packing Checklist */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Briefcase size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              🎒 Mga Dapat Dalhin sa Bag (Baon Checklist)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendation.packingChecklist.map((item, idx) => {
              const isChecked = !!checkedItems[item];
              return (
                <div
                  key={idx}
                  onClick={() => toggleItem(item)}
                  className={`checklist-item ${isChecked ? 'checked' : ''}`}
                >
                  <div style={{ color: isChecked ? '#10b981' : '#64748b' }}>
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: isChecked ? '#94a3b8' : '#e2e8f0', fontWeight: isChecked ? 400 : 500 }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="glass-panel-subtle" style={{ padding: '18px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GlassWater size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                💧 Hydration Target Tracker
              </h3>
            </div>
            <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
              Target: {recommendation.hydrationTargetLiters} Liters
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 14px 0' }}>
            I-log ang bawat baso (250ml) na naiinom mo ngayong araw laban sa dehydration:
          </p>

          {/* Cup icons counter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {Array.from({ length: totalCups }).map((_, i) => {
              const isFilled = i < waterCupsDrank;
              return (
                <button
                  key={i}
                  onClick={() => setWaterCupsDrank(i + 1)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: isFilled ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isFilled ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: isFilled ? '#38bdf8' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                  title={`Baso #${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: '#94a3b8' }}>
              Nainom: <strong>{(waterCupsDrank * 0.25).toFixed(2)}L</strong> / {recommendation.hydrationTargetLiters}L
            </span>
            <button
              onClick={() => setWaterCupsDrank(prev => Math.min(prev + 1, totalCups))}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              + Uminom ng Baso
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
