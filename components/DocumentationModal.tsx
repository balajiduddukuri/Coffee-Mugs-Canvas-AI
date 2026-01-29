
import React from 'react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-6 border-b border-stone-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold">Design Standards</h2>
            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Mastering the Ritual Canvas</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-50 flex items-center justify-center transition-colors">✕</button>
        </div>

        <div className="p-8 space-y-10">
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-4 border-l-2 border-amber-400 pl-4">1. Technical Specifications</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-stone-600">
              <div className="space-y-2">
                <p className="font-bold text-stone-900">Print Area</p>
                <p>Mugs feature a 150px wrap-around zone. Keep critical text within the center 80px for maximum visibility.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-stone-900">Bleed Zones</p>
                <p>We apply a 2mm safety bleed. Avoid placing fine details near the top or bottom rim.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-4 border-l-2 border-amber-400 pl-4">2. Color & Typography</h3>
            <div className="space-y-4 text-sm text-stone-600">
              <p>For the most "premium" look, we recommend high-contrast pairings (e.g., Charcoal text on Snow White ceramic). </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-bold">Serif Fonts:</span> Best for short, poetic quotes.</li>
                <li><span className="font-bold">Sans-Serif:</span> Best for modern, bold statements.</li>
                <li><span className="font-bold">Contrast:</span> Our AI validates WCAG 2.1 standards to ensure your design pop.</li>
              </ul>
            </div>
          </section>

          <section className="bg-stone-50 p-6 rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-4">3. Material Care</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">🧼</div>
                <p className="text-[10px] font-bold uppercase">Dishwasher Safe</p>
              </div>
              <div>
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-[10px] font-bold uppercase">Microwave Safe</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🌱</div>
                <p className="text-[10px] font-bold uppercase">BPA Free</p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-stone-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
          >
            Got it, let's design
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
