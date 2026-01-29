
import React, { useState } from 'react';
import { CartItem } from '../types';
import { MUG_STYLES } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClearCart }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
    // Clear items after a short delay so the user sees the success state
    setTimeout(() => {
      onClearCart();
    }, 100);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-8 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold">Shopping Bag</h2>
            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">
              {isSuccess ? 'Order Confirmed' : `${items.length} Designs Ready`}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full hover:bg-stone-50 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl animate-bounce">
                ✓
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2">Thank You</h3>
                <p className="text-sm text-stone-500 max-w-[250px] mx-auto">
                  Your custom rituals are being prepared. You'll receive a confirmation email shortly.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl w-full border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Order Reference</p>
                <p className="font-mono text-xs font-bold">#MC-{Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
              <button 
                onClick={handleClose}
                className="px-8 py-3 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
              >
                Continue Designing
              </button>
            </div>
          ) : isProcessing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin h-10 w-10 border-4 border-stone-900 border-t-transparent rounded-full"></div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Securing your payment...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-4">
              <span className="text-6xl">🛍️</span>
              <p className="text-xs uppercase font-bold tracking-[0.2em]">Your bag is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const styleInfo = MUG_STYLES.find(s => s.id === item.style);
                return (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-stone-100 hover:border-stone-200 transition-all group">
                    <div 
                      className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-stone-50"
                      style={{ backgroundColor: item.mugColor }}
                    >
                      {styleInfo?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm truncate">{styleInfo?.label}</h3>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <span className="text-xs">Remove</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-400 italic truncate mb-2">"{item.text}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-stone-50 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-all"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-all"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-serif font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && !isProcessing && !isSuccess && (
          <div className="p-8 bg-stone-50 border-t border-stone-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-lg pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 transition-all shadow-xl active:scale-[0.98]"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
