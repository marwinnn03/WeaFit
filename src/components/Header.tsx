import React from 'react';
import { CloudSun, Sparkles, Sliders, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator: () => void;
  onOpenKeyModal: () => void;
  onRefreshWeather: () => void;
  isLoading: boolean;
  hasGeminiKey: boolean;
  repoUrl?: string;
}

const GithubIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  onOpenSimulator,
  onOpenKeyModal,
  onRefreshWeather,
  isLoading,
  hasGeminiKey,
  repoUrl = 'https://github.com/marwinnn03/WeaFit'
}) => {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(2, 132, 199, 0.25)'
          }}>
            <CloudSun size={26} color="#ffffff" className="animate-float" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #0284c7, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                WeaFit
              </h1>
              <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.7rem' }}>
                v2.0
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
              Smart Weather Outfit & Activity Advisor para sa Pilipinas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Refresh live weather */}
          <button
            onClick={onRefreshWeather}
            disabled={isLoading}
            className="btn-secondary"
            title="I-refresh ang live weather data"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} color="#0284c7" />
            <span>I-refresh</span>
          </button>

          {/* Simulator button */}
          <button
            onClick={onOpenSimulator}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: '#fde68a', background: '#fffbeb', color: '#b45309' }}
          >
            <Sliders size={15} color="#d97706" />
            <span>Weather Simulator</span>
          </button>

          {/* Gemini AI Key */}
          <button
            onClick={onOpenKeyModal}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderColor: hasGeminiKey ? '#a7f3d0' : '#e9d5ff',
              background: hasGeminiKey ? '#ecfdf5' : '#faf5ff',
              color: hasGeminiKey ? '#065f46' : '#6b21a8'
            }}
          >
            <Sparkles size={15} color={hasGeminiKey ? '#059669' : '#9333ea'} />
            <span>{hasGeminiKey ? 'Gemini AI Aktibo' : 'Gemini AI (Paganahin)'}</span>
          </button>

          {/* GitHub link */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '8px 12px', color: '#334155' }}
            title="Tingnan sa GitHub"
          >
            <GithubIcon size={16} />
          </a>

        </div>
      </div>
    </header>
  );
};
