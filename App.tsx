
import React, { useState, useEffect, useMemo } from 'react';
import { MugConfig, MugStyle, AIAdvice, CartItem } from './types';
import { MUG_STYLES, FONT_OPTIONS, MUG_COLORS, TEXT_COLORS, SUGGESTION_THEMES } from './constants';
import MugPreview from './components/MugPreview';
import CartDrawer from './components/CartDrawer';
import DocumentationModal from './components/DocumentationModal';
import ShareModal from './components/ShareModal';
import { gemini } from './services/geminiService';

type ViewMode = 'studio' | 'lifestyle' | 'split';

const getLuminance = (hex: string) => {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  const values = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
};

const getContrastRatio = (c1: string, c2: string) => {
  const l1 = getLuminance(c1);
  const l2 = getLuminance(c2);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
};

const App: React.FC = () => {
  const [config, setConfig] = useState<MugConfig>({
    style: 'travel',
    text: 'Fresh Brew. Fresh Start.',
    fontFamily: 'Inter',
    fontSize: 20,
    textColor: '#5C5C5C',
    mugColor: '#FFFFFF',
  });

  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('studio');
  
  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // New Modals State
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const contrastRatio = useMemo(() => getContrastRatio(config.mugColor, config.textColor), [config.mugColor, config.textColor]);
  const isLowContrast = contrastRatio < 4.5;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAnalyze();
    }, 1500);
    return () => clearTimeout(timer);
  }, [config.text, config.mugColor, config.textColor, config.style, config.fontFamily]);

  const handleAnalyze = async () => {
    if (!config.text.trim()) return;
    setIsAnalyzing(true);
    const advice = await gemini.analyzeDesign(config);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  const fetchSuggestions = async (themePrompt: string) => {
    setIsSuggesting(true);
    const quotes = await gemini.getQuotes(themePrompt);
    setSuggestions(quotes);
    setIsSuggesting(false);
  };

  const generateLifestyle = async () => {
    setIsGeneratingMockup(true);
    setViewMode('lifestyle');
    const url = await gemini.generateLifestyleMockup(config);
    setMockupUrl(url);
    setIsGeneratingMockup(false);
  };

  const addToCart = () => {
    const styleInfo = MUG_STYLES.find(s => s.id === config.style);
    const newItem: CartItem = {
      ...config,
      id: Math.random().toString(36).substr(2, 9),
      price: styleInfo?.price || 19.99,
      quantity: 1
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const updateConfig = (updates: Partial<MugConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-stone-800 bg-[#FDFBF7]">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[420px] bg-white border-r border-stone-200 lg:h-screen overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar relative z-30 shadow-xl lg:shadow-none">
        <header>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-stone-800 text-white p-1 rounded font-bold text-lg">MC</span>
              <h1 className="text-2xl font-serif font-bold tracking-tight">MugCanvas AI</h1>
            </div>
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors"
            >
              Guide
            </button>
          </div>
          <p className="text-stone-500 text-sm">Elevate your ritual with premium design.</p>
        </header>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">1. Select Cup Style</h2>
          <div className="grid grid-cols-2 gap-3">
            {MUG_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => updateConfig({ style: style.id })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  config.style === style.id 
                    ? 'border-stone-800 bg-stone-50 shadow-sm' 
                    : 'border-stone-100 hover:border-stone-200'
                }`}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className="text-2xl">{style.icon}</span>
                  <span className="text-[9px] font-bold text-stone-400">${style.price}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-tight text-left w-full">{style.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">2. Customize Visualization</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quote Content</label>
            <textarea
              value={config.text}
              onChange={(e) => updateConfig({ text: e.target.value })}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-400 focus:outline-none transition-all resize-none h-20 text-sm"
              placeholder="Enter your quote..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Font</label>
              <select 
                value={config.fontFamily}
                onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              >
                {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Size ({config.fontSize}px)</label>
              <input 
                type="range" 
                min="12" 
                max="40" 
                value={config.fontSize}
                onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-stone-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">Mug Color</label>
              <div className="flex gap-2 flex-wrap">
                {MUG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => updateConfig({ mugColor: color })}
                    className={`w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${config.mugColor === color ? 'ring-2 ring-stone-800 ring-offset-2' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Text Color</label>
              <div className="flex gap-2 flex-wrap">
                {TEXT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => updateConfig({ textColor: color })}
                    className={`w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${config.textColor === color ? 'ring-2 ring-stone-800 ring-offset-2' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">3. Quote Categories</h2>
            {isSuggesting && <span className="text-[9px] animate-pulse text-stone-500 uppercase">Consulting AI...</span>}
          </div>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {SUGGESTION_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => fetchSuggestions(theme.prompt)}
                className="px-2 py-0.5 bg-stone-100 rounded-full text-[9px] font-bold text-stone-500 hover:bg-stone-200 transition-colors uppercase tracking-tight"
              >
                {theme.label}
              </button>
            ))}
          </div>
          {suggestions.length > 0 && (
            <div className="grid gap-2 border-l-2 border-stone-100 pl-4 py-1">
              {suggestions.map((quote, idx) => (
                <button
                  key={idx}
                  onClick={() => updateConfig({ text: quote })}
                  className="text-left p-2 rounded-lg text-xs bg-stone-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-100 transition-all italic text-stone-500 hover:text-stone-900"
                >
                  "{quote}"
                </button>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-auto pt-8 border-t border-stone-100 flex flex-col gap-3">
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={generateLifestyle}
                disabled={isGeneratingMockup}
                className="py-4 bg-stone-100 text-stone-800 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-stone-200 transition-all disabled:opacity-50"
              >
                {isGeneratingMockup ? 'Rendering...' : 'Lifestyle Mockup'}
              </button>
              <button 
                onClick={addToCart}
                className="py-4 bg-stone-800 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-stone-700 transition-all shadow-lg active:scale-[0.98]"
              >
                Add to Cart
              </button>
           </div>
           {mockupUrl && !isGeneratingMockup && (
             <button 
               onClick={() => setMockupUrl(null)}
               className="text-[10px] text-stone-400 hover:text-red-500 uppercase font-bold text-center tracking-widest transition-colors mt-2"
             >
               Discard Current Mockup
             </button>
           )}
        </footer>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Control Bar */}
        <header className="px-8 py-6 bg-white/80 backdrop-blur-md border-b border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6 z-20">
          <div>
             <h2 className="text-2xl font-serif font-bold">Studio Canvas</h2>
             <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">Visualization Engine</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-stone-100 p-1 rounded-full border border-stone-200">
              <button 
                onClick={() => setViewMode('studio')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all ${viewMode === 'studio' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Studio
              </button>
              {mockupUrl && (
                <>
                  <button 
                    onClick={() => setViewMode('lifestyle')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all ${viewMode === 'lifestyle' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    Lifestyle
                  </button>
                  <button 
                    onClick={() => setViewMode('split')}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all ${viewMode === 'split' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    Compare
                  </button>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-stone-200 hidden md:block"></div>

            {/* Actions: Share & Cart */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsShareOpen(true)}
                className="relative w-10 h-10 bg-white rounded-full border border-stone-100 shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors"
                title="Share Design"
              >
                <span className="text-lg">📤</span>
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 bg-white rounded-full border border-stone-100 shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors"
              >
                <span className="text-lg">🛍️</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Display Grid */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12 bg-stone-50/30">
          <section className="relative w-full h-full min-h-[550px]">
            {viewMode === 'studio' && (
              <div className="h-full w-full bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <MugPreview config={config} />
              </div>
            )}

            {viewMode === 'lifestyle' && (
              <div className="h-full w-full bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden relative group">
                {mockupUrl ? (
                  <img src={mockupUrl} alt="AI Mockup" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-4">
                    <span className="text-5xl opacity-20">✨</span>
                    <p className="text-xs uppercase font-bold tracking-widest opacity-50">Lifestyle view ready for generation</p>
                  </div>
                )}
                {isGeneratingMockup && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-40">
                    <div className="animate-spin h-10 w-10 border-4 border-stone-800 border-t-transparent rounded-full"></div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Rendering your unique ritual...</p>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full w-full">
                <div className="h-full bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                   <div className="p-4 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Blueprint</span>
                      <span className="w-2 h-2 rounded-full bg-stone-200"></span>
                   </div>
                   <MugPreview config={config} />
                </div>
                <div className="h-full bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden relative group">
                   <div className="p-4 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Reality Check</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                   </div>
                   {mockupUrl && <img src={mockupUrl} alt="AI Mockup" className="w-full h-full object-cover" />}
                   {isGeneratingMockup && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-40">
                      <div className="animate-spin h-6 w-6 border-2 border-stone-800 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Detailed Design Feedback */}
          <section className="bg-white rounded-3xl p-10 border border-stone-100 shadow-sm max-w-5xl mx-auto w-full mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">AI</div>
              <div>
                <h3 className="font-bold text-base">Expert Validation</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] font-bold">Print Optimization Insights</p>
              </div>
            </div>

            {isAnalyzing ? (
               <div className="space-y-4 animate-pulse">
                  <div className="h-3 bg-stone-100 rounded w-full"></div>
                  <div className="h-3 bg-stone-100 rounded w-5/6"></div>
                  <div className="h-3 bg-stone-100 rounded w-4/6"></div>
               </div>
            ) : aiAdvice ? (
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-sm leading-relaxed text-stone-600 italic">"{aiAdvice.feedback}"</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tight ${isLowContrast ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                      {isLowContrast ? 'Low Contrast' : 'Safe Contrast'}
                    </span>
                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold rounded-full uppercase tracking-tight border border-stone-200">
                      {config.style.replace('-', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold rounded-full uppercase tracking-tight border border-stone-200">
                      {config.fontFamily}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-4 h-px bg-stone-200"></span>
                    Strategic Enhancements
                  </h4>
                  <ul className="grid gap-3">
                    {aiAdvice.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-4 p-3 bg-stone-50/50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-100 transition-all">
                        <span className="text-amber-500 text-sm">✦</span>
                        <span className="text-xs font-semibold text-stone-700 leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-stone-300">
                <p className="text-xs uppercase font-bold tracking-[0.2em]">Awaiting design input for deep analysis...</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeCartItem}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />

      {/* New Modals */}
      <DocumentationModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
      />
      
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        config={config}
      />
    </div>
  );
};

export default App;
