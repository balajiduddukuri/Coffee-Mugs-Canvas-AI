
import React, { useState } from 'react';
import { MugConfig } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MugConfig;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const shareText = `Check out my custom ${config.style} design: "${config.text}" - Created with MugCanvas AI ✨`;
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    { 
      name: 'Pinterest', 
      icon: '📌', 
      color: 'bg-[#E60023]',
      link: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`
    },
    { 
      name: 'X (Twitter)', 
      icon: '𝕏', 
      color: 'bg-black',
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="p-8 text-center border-b border-stone-50">
          <h2 className="text-xl font-serif font-bold mb-1">Share Your Ritual</h2>
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Inspire the community</p>
        </div>

        <div className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {platforms.map(p => (
              <a 
                key={p.name}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-4 rounded-2xl text-white transition-transform hover:scale-105 ${p.color}`}
              >
                <span className="text-xl mb-1">{p.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-tight">{p.name}</span>
              </a>
            ))}
          </div>

          <button 
            onClick={handleCopy}
            className={`w-full py-4 rounded-2xl border-2 font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
              copied ? 'border-green-500 text-green-600 bg-green-50' : 'border-stone-100 hover:border-stone-200 text-stone-600'
            }`}
          >
            {copied ? '✓ Link Copied' : '📋 Copy Design Link'}
          </button>
        </div>

        <div className="p-4 bg-stone-50 text-center">
          <button onClick={onClose} className="text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
