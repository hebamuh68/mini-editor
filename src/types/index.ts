export interface MiniEditorProps {
  modelValue: {
    [key: string]: string;
  };
  label?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  translations?: {
    ar?: Partial<TranslationConfig>;
    en?: Partial<TranslationConfig>;
  };
  showLanguageSwitcher?: boolean;
  defaultLanguage?: 'ar' | 'en';
}

export interface ColorState {
  hue: number;
  saturation: number;
  lightness: number;
}

export interface LangConfig {
  [key: string]: {
    shortLabel: string;
    label: string;
  };
}

export interface TranslationConfig {
  switchLanguage: string;
  textColor: string;
  highlight: string;
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  bulletList: string;
  numberedList: string;
  alignRight: string;
  alignCenter: string;
  alignLeft: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  heading5: string;
  insertMedia: string;
  undo: string;
  redo: string;
  clearFormatting: string;
}

export interface Translations {
  ar: TranslationConfig;
  en: TranslationConfig;
} 