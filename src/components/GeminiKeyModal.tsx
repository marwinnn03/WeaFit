import React, { useState } from 'react';
import { X, Sparkles, Key, ExternalLink, Check, Trash2 } from 'lucide-react';
import { saveStoredGeminiKey } from '../utils/geminiService';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onKeySaved: (key: string) => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onKeySaved
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(currentKey);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredGeminiKey(apiKeyInput.trim());
    onKeySaved(apiKeyInput.trim());
    setStatusMessage('Matagumpay na na-save ang iyong Gemini API key!');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    saveStoredGeminiKey('');
    setApiKeyInput('');
    onKeySaved('');
    setStatusMessage('Na-clear na ang API key. Gagamitin ang Built-in Smart Local Engine.');
    setTimeout(() => {
      setStatusMessage(null);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', padding: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#faf5ff', border: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#9333ea" />
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Gemini AI Smart Advisor Setup
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Live LLM prompting gamit ang Google Generative AI
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Info card */}
        <div className="glass-panel-subtle" style={{ padding: '14px 16px', marginBottom: '18px', background: '#faf5ff', border: '1px solid #e9d5ff', borderLeft: '4px solid #a855f7' }}>
          <p style={{ fontSize: '0.85rem', color: '#581c87', margin: '0 0 6px 0', lineHeight: 1.5, fontWeight: 500 }}>
            Kapag may nakalagay na <strong>Gemini API Key</strong>, tatawag ang WeaFit nang direkta sa Gemini API gamit ang <code>gemini-2.5-flash</code> o <code>gemini-1.5-flash</code> na may structured JSON schema.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#7e22ce', margin: 0 }}>
            Kung walang key, awtomatikong gagana ang <strong>PAGASA Rule-Engine & Smart Offline Advisor</strong> kaya hindi masisira ang app!
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            I-paste ang iyong Gemini API Key:
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Key size={16} />
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 38px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
              }}
            />
          </div>
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.785rem' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <span>Kumuha ng libreng API key sa Google AI Studio</span>
              <ExternalLink size={12} />
            </a>
            <span style={{ color: '#94a3b8' }}>Naka-save lang sa iyong browser</span>
          </div>
        </div>

        {statusMessage && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <Check size={16} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          {currentKey ? (
            <button
              onClick={handleClear}
              className="btn-secondary"
              style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#dc2626', borderColor: '#fecdd3', background: '#fff1f2' }}
            >
              <Trash2 size={16} />
              <span>Burahin ang Key</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
              Isara
            </button>
            <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              <Check size={16} />
              <span>I-save ang Key</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
