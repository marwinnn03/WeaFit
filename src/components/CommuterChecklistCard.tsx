import React, { useState } from 'react';
import { Briefcase, CheckSquare, Square, GlassWater } from 'lucide-react';
import type { RecommendationResult } from '../types';

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
            <Briefcase size={18} color="#0284c7" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
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
                  <div style={{ color: isChecked ? '#059669' : '#94a3b8' }}>
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: isChecked ? '#94a3b8' : '#1e293b', fontWeight: isChecked ? 400 : 600 }}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="glass-panel-subtle" style={{ padding: '18px', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GlassWater size={18} color="#0284c7" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                💧 Hydration Target Tracker
              </h3>
            </div>
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
              Target: {recommendation.hydrationTargetLiters} Liters
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0' }}>
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
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: isFilled ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: isFilled ? '#e0f2fe' : '#f8fafc',
                    color: isFilled ? '#0369a1' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    transition: 'all 0.15s ease'
                  }}
                  title={`Baso #${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
            <span style={{ color: '#475569' }}>
              Nainom: <strong style={{ color: '#0f172a' }}>{(waterCupsDrank * 0.25).toFixed(2)}L</strong> / {recommendation.hydrationTargetLiters}L
            </span>
            <button
              onClick={() => setWaterCupsDrank(prev => Math.min(prev + 1, totalCups))}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.785rem', color: '#0284c7', borderColor: '#bae6fd' }}
            >
              + Uminom ng Baso
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
