import React from 'react';
import { CloudRain, Flame, HeartPulse } from 'lucide-react';
import type { PagasaHeatIndexInfo, PagasaRainInfo } from '../types';

interface PagasaAlertBannerProps {
  heatInfo: PagasaHeatIndexInfo;
  rainInfo: PagasaRainInfo;
}

export const PagasaAlertBanner: React.FC<PagasaAlertBannerProps> = ({
  heatInfo,
  rainInfo
}) => {
  const isHighHeat = heatInfo.level === 'danger' || heatInfo.level === 'extreme_danger' || heatInfo.level === 'extreme_caution';
  const isRainWarning = rainInfo.level === 'red' || rainInfo.level === 'orange' || rainInfo.level === 'yellow';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      
      {/* Heat Index Advisory Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          borderLeft: `5px solid ${heatInfo.badgeColor}`,
          background: `linear-gradient(135deg, ${heatInfo.badgeColor}0f, #ffffff)`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: `${heatInfo.badgeColor}18`,
            border: `1px solid ${heatInfo.badgeColor}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isHighHeat ? (
              <Flame size={20} color={heatInfo.badgeColor} className="animate-pulse" />
            ) : (
              <HeartPulse size={20} color={heatInfo.badgeColor} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span className="badge" style={{ background: heatInfo.badgeColor, color: '#ffffff', boxShadow: `0 2px 6px ${heatInfo.badgeColor}40` }}>
                DOST-PAGASA Heat Index: {heatInfo.tagalogLabel}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                Opisyal na Alerto sa Kalusugan
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#1e293b', margin: '0 0 6px 0', lineHeight: 1.5 }}>
              <strong style={{ color: '#0f172a' }}>Epekto sa Katawan:</strong> {heatInfo.healthEffects}
            </p>
            <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0, fontWeight: 500 }}>
              💡 <strong>Rekomendasyon:</strong> {heatInfo.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Rainfall Advisory Banner (if raining or high risk) */}
      {isRainWarning && (
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderLeft: `5px solid ${rainInfo.color}`,
            background: `linear-gradient(135deg, ${rainInfo.color}0f, #ffffff)`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: `${rainInfo.color}18`,
              border: `1px solid ${rainInfo.color}35`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CloudRain size={20} color={rainInfo.color} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span className="badge" style={{ background: rainInfo.color, color: '#ffffff', boxShadow: `0 2px 6px ${rainInfo.color}40` }}>
                  {rainInfo.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Baha at Commute Risk
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1e293b', margin: 0, lineHeight: 1.5 }}>
                {rainInfo.description} <em>{rainInfo.floodingRisk}</em>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
