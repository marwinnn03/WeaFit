import React, { useState } from 'react';
import { 
  Sparkles, 
  Shirt, 
  Footprints, 
  Scissors, 
  ShieldCheck, 
  Umbrella, 
  Sun, 
  Copy, 
  Check, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import type { RecommendationResult } from '../types';

interface OutfitRecommendationCardProps {
  recommendation: RecommendationResult;
  personaName: string;
}

export const OutfitRecommendationCard: React.FC<OutfitRecommendationCardProps> = ({
  recommendation,
  personaName
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (itemTitle: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const copyToClipboard = () => {
    const text = `
🌤️ WEAFIT OUTFIT ADVICE (${personaName})
Vibe: ${recommendation.vibeSummary}
Payo: ${recommendation.topAdvice}

SUHESTIYON SA DAMIT:
${recommendation.outfitItems.map(i => `• [${i.category}] ${i.item} - ${i.fabricOrNote}`).join('\n')}

COMMUTER TIP:
${recommendation.commuterTip}

Hydration Target: ${recommendation.hydrationTargetLiters} Liters
Source: WeaFit PH
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Pang-itaas') || category.includes('Top')) return <Shirt size={20} color="#0284c7" />;
    if (category.includes('Pang-ibaba') || category.includes('Bottom')) return <Scissors size={20} color="#6366f1" />;
    if (category.includes('Paa') || category.includes('Footwear')) return <Footprints size={20} color="#059669" />;
    if (category.includes('Layers') || category.includes('Jacket')) return <ShieldCheck size={20} color="#d97706" />;
    if (category.includes('Ulo') || category.includes('Mukha')) return <Sun size={20} color="#ea580c" />;
    return <Umbrella size={20} color="#0284c7" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              👕 Rekomendasyon sa Kasuotan (Outfit Guide)
            </h2>
            {recommendation.isAiGenerated ? (
              <span className="badge" style={{ background: '#fdf4ff', color: '#a21caf', border: '1px solid #f0abfc' }}>
                <Sparkles size={12} /> Gemini AI Custom Fit
              </span>
            ) : (
              <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                PAGASA Heat Rule Verified
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Naka-angkop sa kondisyon ng panahon at profile ng isang <strong>{personaName}</strong>
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.825rem', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}
          title="Kopyahin ang buong outfit summary"
        >
          {copied ? <Check size={16} color="#059669" /> : <Copy size={16} color="#0284c7" />}
          <span style={{ fontWeight: 600 }}>{copied ? 'Nakopya na!' : 'Kopyahin ang Outfit'}</span>
        </button>
      </div>

      {/* Vibe Summary Callout */}
      <div style={{
        padding: '16px 18px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)',
        border: '1px solid #bae6fd',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Sparkles size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '0.975rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              "{recommendation.vibeSummary}"
            </p>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, fontWeight: 500 }}>
              💡 {recommendation.topAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Outfit Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {recommendation.outfitItems.map((item, idx) => {
          const isChecked = !!checkedItems[item.item];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(item.item)}
              style={{
                padding: '16px',
                borderRadius: '14px',
                background: isChecked ? '#f1f5f9' : '#ffffff',
                border: isChecked ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                opacity: isChecked ? 0.6 : 1,
                boxShadow: isChecked ? 'none' : '0 2px 6px rgba(15, 23, 42, 0.02)'
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getCategoryIcon(item.category)}
              </div>

              {/* Item Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0284c7' }}>
                  {item.category}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isChecked ? '#64748b' : '#0f172a', margin: '2px 0 4px 0', textDecoration: isChecked ? 'line-through' : 'none' }}>
                  {item.item}
                </h4>
                <p style={{ fontSize: '0.785rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {item.fabricOrNote}
                </p>
              </div>

              {/* Checked Indicator */}
              <div style={{ color: isChecked ? '#059669' : '#cbd5e1', marginTop: '2px' }}>
                {isChecked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.775rem', color: '#64748b' }}>
        Pindutin ang kahit anong damit sa itaas para mamarkahan kung meron ka nito sa iyong kabinet!
      </div>

    </div>
  );
};
