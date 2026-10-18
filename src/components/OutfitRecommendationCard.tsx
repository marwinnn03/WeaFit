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
  Share2, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { RecommendationResult, OutfitItem } from '../types';

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
🌤️ KLIMAFIT PH OUTFIT ADVICE (${personaName})
Vibe: ${recommendation.vibeSummary}
Payo: ${recommendation.topAdvice}

SUHESTIYON SA DAMIT:
${recommendation.outfitItems.map(i => `• [${i.category}] ${i.item} - ${i.fabricOrNote}`).join('\n')}

COMMUTER TIP:
${recommendation.commuterTip}

Hydration Target: ${recommendation.hydrationTargetLiters} Liters
Source: KlimaFit PH (WeaFit)
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Pang-itaas') || category.includes('Top')) return <Shirt size={20} color="#38bdf8" />;
    if (category.includes('Pang-ibaba') || category.includes('Bottom')) return <Scissors size={20} color="#818cf8" />;
    if (category.includes('Paa') || category.includes('Footwear')) return <Footprints size={20} color="#34d399" />;
    if (category.includes('Layers') || category.includes('Jacket')) return <ShieldCheck size={20} color="#fbbf24" />;
    if (category.includes('Ulo') || category.includes('Mukha')) return <Sun size={20} color="#f472b6" />;
    return <Umbrella size={20} color="#60a5fa" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              👕 Rekomendasyon sa Kasuotan (Outfit Guide)
            </h2>
            {recommendation.isAiGenerated ? (
              <span className="badge" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.4)' }}>
                <Sparkles size={12} /> Gemini AI Custom Fit
              </span>
            ) : (
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                PAGASA Heat Rule Verified
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
            Naka-angkop sa kondisyon ng panahon at profile ng isang <strong>{personaName}</strong>
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.825rem' }}
          title="Kopyahin ang buong outfit summary"
        >
          {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
          <span>{copied ? 'Nakopya na!' : 'Kopyahin ang Outfit'}</span>
        </button>
      </div>

      {/* Vibe Summary Callout */}
      <div style={{
        padding: '16px 18px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(139, 92, 246, 0.12))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Sparkles size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '0.975rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px 0' }}>
              "{recommendation.vibeSummary}"
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
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
                background: isChecked ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                border: isChecked ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                opacity: isChecked ? 0.6 : 1
              }}
            >
              {/* Category Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getCategoryIcon(item.category)}
              </div>

              {/* Item Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8' }}>
                  {item.category}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isChecked ? '#94a3b8' : '#ffffff', margin: '2px 0 4px 0', textDecoration: isChecked ? 'line-through' : 'none' }}>
                  {item.item}
                </h4>
                <p style={{ fontSize: '0.785rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {item.fabricOrNote}
                </p>
              </div>

              {/* Checked Indicator */}
              <div style={{ color: isChecked ? '#34d399' : '#475569', marginTop: '2px' }}>
                {isChecked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
        Pindutin ang kahit anong damit sa itaas para mamarkahan kung meron ka nito sa iyong kabinet!
      </div>

    </div>
  );
};
