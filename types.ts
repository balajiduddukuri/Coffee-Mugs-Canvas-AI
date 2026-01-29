
export type MugStyle = 'classic' | 'travel' | 'espresso' | 'large-office';

export interface MugConfig {
  style: MugStyle;
  text: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  mugColor: string;
}

export interface CartItem extends MugConfig {
  id: string;
  price: number;
  quantity: number;
}

export interface AIAdvice {
  rating: number; // 1-5
  feedback: string;
  suggestions: string[];
}

export interface SuggestionTheme {
  id: string;
  label: string;
  prompt: string;
}
