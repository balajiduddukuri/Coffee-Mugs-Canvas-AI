
import React, { useMemo } from 'react';
import { MugConfig } from '../types';

interface MugPreviewProps {
  config: MugConfig;
}

const MugPreview: React.FC<MugPreviewProps> = ({ config }) => {
  // Refined auto-scaling logic for consistent visual weight and premium feel
  const adjustedFontSize = useMemo(() => {
    const textLength = config.text.length || 1;
    let baseSize = config.fontSize;
    
    // 1. Style-based multiplier: Adjusts base size based on the physical canvas of the mug type
    const styleMultipliers: Record<string, number> = {
      'espresso': 0.65,      // Small but focused
      'travel': 0.85,        // Tall but narrow printable width
      'large-office': 1.15,  // Expansive canvas
      'classic': 1.0         // Standard baseline
    };
    
    baseSize *= (styleMultipliers[config.style] || 1.0);

    // 2. Length-based dynamic scaling
    // We want short quotes to feel "punchy" and large, while long ones scale down gracefully
    let lengthFactor = 1.0;
    
    if (textLength < 8) {
      lengthFactor = 1.15; // Punchy boost for very short quotes
    } else if (textLength <= 15) {
      lengthFactor = 1.0;  // Standard weight
    } else if (textLength <= 25) {
      lengthFactor = 0.82; // Start tapering
    } else if (textLength <= 40) {
      lengthFactor = 0.68; // Significant reduction to fit
    } else if (textLength <= 60) {
      lengthFactor = 0.55; // Multi-line focus
    } else {
      lengthFactor = 0.45; // Minimum size threshold for very long text
    }
    
    const finalSize = baseSize * lengthFactor;
    
    // Safety clamp: Ensure readability but prevent massive overflow
    return Math.max(Math.min(finalSize, 48), 9);
  }, [config.text, config.fontSize, config.style]);

  const renderMugShape = () => {
    switch (config.style) {
      case 'travel':
        return (
          <svg viewBox="0 0 200 300" className="w-64 h-80 drop-shadow-2xl">
            <path d="M40,20 L160,20 L150,280 L50,280 Z" fill={config.mugColor} />
            <rect x="35" y="10" width="130" height="20" rx="5" fill="#333" />
            {/* Subtle shadow for depth */}
            <path d="M40,20 L50,280 L60,280 L50,20 Z" fill="rgba(0,0,0,0.03)" />
          </svg>
        );
      case 'espresso':
        return (
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xl">
            <path d="M140,70 C165,70 165,110 140,110" fill="none" stroke={config.mugColor} strokeWidth="10" strokeLinecap="round" />
            <path d="M60,40 L140,40 Q140,160 100,160 Q60,160 60,40" fill={config.mugColor} />
            <ellipse cx="100" cy="165" rx="60" ry="8" fill="rgba(0,0,0,0.05)" stroke="#DDD" strokeWidth="1" />
          </svg>
        );
      case 'large-office':
        return (
          <svg viewBox="0 0 200 200" className="w-80 h-80 drop-shadow-2xl">
            <path d="M160,40 C210,40 210,140 160,140" fill="none" stroke={config.mugColor} strokeWidth="18" strokeLinecap="round" />
            <rect x="30" y="20" width="140" height="150" rx="10" fill={config.mugColor} />
            <rect x="30" y="20" width="140" height="15" rx="10" fill="rgba(255,255,255,0.1)" />
          </svg>
        );
      case 'classic':
      default:
        return (
          <svg viewBox="0 0 200 200" className="w-72 h-72 drop-shadow-2xl">
            <path d="M150,50 C190,50 190,130 150,130" fill="none" stroke={config.mugColor} strokeWidth="14" strokeLinecap="round" />
            <rect x="40" y="20" width="120" height="140" rx="15" fill={config.mugColor} />
            <ellipse cx="100" cy="20" rx="60" ry="10" fill={config.mugColor} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>
        );
    }
  };

  const textContainerStyles = useMemo(() => {
    let topOffset = '45%';
    let maxWidth = '140px';
    
    if (config.style === 'travel') {
      topOffset = '42%';
      maxWidth = '105px';
    } else if (config.style === 'espresso') {
      topOffset = '46%';
      maxWidth = '75px';
    } else if (config.style === 'large-office') {
      topOffset = '50%';
      maxWidth = '150px';
    }
    
    return {
      top: topOffset,
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      maxWidth: maxWidth,
    };
  }, [config.style]);

  return (
    <div className="relative w-full h-full min-h-[450px] flex items-center justify-center bg-stone-50/30">
      <div className="relative z-10 flex flex-col items-center justify-center float-animation">
        {renderMugShape()}
        <div 
          className="absolute text-center pointer-events-none flex items-center justify-center px-1 select-none"
          style={{ 
            ...textContainerStyles,
            color: config.textColor, 
            fontFamily: config.fontFamily,
            fontSize: `${adjustedFontSize}px`,
            lineHeight: '1.25',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <span className="w-full text-center block">
            {config.text || 'Your Quote Here'}
          </span>
        </div>
      </div>
      <div className="absolute bottom-6 left-6 text-[10px] text-stone-300 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
        <span className="w-6 h-px bg-stone-200"></span>
        Studio Grade Preview
      </div>
    </div>
  );
};

export default MugPreview;
