
import { MugStyle, SuggestionTheme } from './types';

export const MUG_STYLES: { id: MugStyle; label: string; icon: string; price: number }[] = [
  { id: 'classic', label: 'Ceramic Mug', icon: '☕', price: 19.99 },
  { id: 'travel', label: 'Travel Mug', icon: '🥤', price: 29.99 },
  { id: 'espresso', label: 'Espresso Cup', icon: '🍵', price: 14.99 },
  { id: 'large-office', label: 'Large Office Mug', icon: '🍺', price: 24.99 },
];

export const FONT_OPTIONS = [
  { label: 'Serif Elegant', value: 'Playfair Display' },
  { label: 'Modern Sans', value: 'Inter' },
  { label: 'Classic Monospace', value: 'monospace' },
  { label: 'Handwritten', value: 'cursive' },
];

export const SUGGESTION_THEMES: SuggestionTheme[] = [
  { id: 'motivation', label: 'Motivation', prompt: 'Inspirational coffee quotes for high achievers.' },
  { id: 'funny', label: 'Funny', prompt: 'Hilarious and witty coffee humor.' },
  { id: 'mindfulness', label: 'Mindfulness', prompt: 'Quotes about presence and peaceful coffee moments.' },
  { id: 'health', label: 'Health', prompt: 'Quotes about health, wellness, and clean energy.' },
  { id: 'sugar-free', label: 'Sugar-Free', prompt: 'Quotes about pure black coffee or sugar-free living.' },
  { id: 'freshness', label: 'Freshness', prompt: 'Quotes about freshly brewed coffee and morning aroma.' },
  { id: 'minimal', label: 'Minimal', prompt: 'Short, one or two-word minimalist coffee quotes.' },
  { id: 'corporate', label: 'Corporate', prompt: 'Professional yet slightly witty office coffee culture quotes.' },
  { id: 'eco', label: 'Eco', prompt: 'Quotes about sustainability, nature, and organic beans.' },
  { id: 'positivity', label: 'Positivity', prompt: 'Upbeat and happy quotes to start the day.' },
];

export const MUG_COLORS = [
  '#FFFFFF', // Snow White
  '#2C2C2C', // Charcoal (Matte/Black)
  '#F5F5DC', // Beige
  '#A0A0A0', // Steel (Silver)
  '#4A5D4E', // Forest Green
  '#D4A373', // Earth Brown
];

export const TEXT_COLORS = [
  '#000000',
  '#FFFFFF',
  '#4B3621',
  '#C0A080',
  '#5C5C5C',
];
