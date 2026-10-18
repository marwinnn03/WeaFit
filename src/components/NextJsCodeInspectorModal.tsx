import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileCode, Terminal, ExternalLink } from 'lucide-react';
import { NEXTJS_CODE_SNIPPETS } from '../data/codeSnippets';

interface NextJsCodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextJsCodeInspectorModal: React.FC<NextJsCodeInspectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedSnippetId, setSelectedSnippetId] = useState(NEXTJS_CODE_SNIPPETS[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSnippet = NEXTJS_CODE_SNIPPETS.find(s => s.id === selectedSnippetId) || NEXTJS_CODE_SNIPPETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={22} color="#38bdf8" />
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Next.js Code Inspector (WeaFit Architecture)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Kopyahin ang Next.js App Router code para sa iyong sariling capstone o thesis project
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '16px', overflowX: 'auto' }}>
          {NEXTJS_CODE_SNIPPETS.map((snippet) => {
            const isActive = snippet.id === selectedSnippetId;
            return (
              <button
                key={snippet.id}
                onClick={() => setSelectedSnippetId(snippet.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileCode size={16} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{snippet.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px' }}>
          {currentSnippet.description}
        </p>

        {/* Code Block Container */}
        <div className="code-window" style={{ marginBottom: '16px' }}>
          <div className="code-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ marginLeft: '6px', fontWeight: 600 }}>{currentSnippet.filename}</span>
            </div>

            <button
              onClick={handleCopy}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.785rem' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Nakopya na!' : 'Kopyahin ang Code'}</span>
            </button>
          </div>

          <pre className="code-pre" style={{ maxHeight: '380px' }}>
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Terminal Setup Instructions */}
        <div className="glass-panel-subtle" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={18} color="#34d399" />
            <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
              Terminal Command: <code className="font-mono" style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8' }}>npm install @google/generative-ai</code>
            </span>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Kumuha ng Libreng Gemini Key</span>
            <ExternalLink size={12} />
          </a>
        </div>

      </div>
    </div>
  );
};
