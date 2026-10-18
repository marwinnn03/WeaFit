import React from 'react';
import { AlertTriangle, ShieldAlert, CloudRain, Flame, HeartPulse } from 'lucide-react';
import { PagasaHeatIndexInfo, PagasaRainInfo } from '../types';

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
          background: `linear-gradient(135deg, ${heatInfo.badgeColor}18, rgba(18, 26, 47, 0.95))`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: `${heatInfo.badgeColor}30`,
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
              <span className="badge" style={{ background: heatInfo.badgeColor, color: '#ffffff' }}>
                DOST-PAGASA Heat Index: {heatInfo.tagalogLabel}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Opisyal na Alerto sa Kalusugan
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#e2e8f0', margin: '0 0 6px 0', lineHeight: 1.5 }}>
              <strong>Epekto sa Katawan:</strong> {heatInfo.healthEffects}
            </p>
            <p style={{ fontSize: '0.825rem', color: '#cbd5e1', margin: 0, opacity: 0.9 }}>
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
            padding: '14px 20px',
            borderLeft: `5px solid ${rainInfo.color}`,
            background: `linear-gradient(135deg, ${rainInfo.color}15, rgba(18, 26, 47, 0.95))`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: `${rainInfo.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CloudRain size={20} color={rainInfo.color} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span className="badge" style={{ background: rainInfo.color, color: '#ffffff' }}>
                  {rainInfo.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Baha at Commute Risk
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0 }}>
                {rainInfo.description} <em>{rainInfo.floodingRisk}</em>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
