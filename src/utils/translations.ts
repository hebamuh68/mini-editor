// Translation utilities for MiniEditor
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
  preview: string;
}

export interface Translations {
  ar: TranslationConfig;
  en: TranslationConfig;
}

export const defaultTranslations: Translations = {
  ar: {
    switchLanguage: "تبديل اللغة",
    textColor: "لون النص",
    highlight: "تمييز",
    bold: "عريض",
    italic: "مائل",
    underline: "تحت خط",
    strike: "شطب",
    bulletList: "قائمة نقطية",
    numberedList: "قائمة مرقمة",
    alignRight: "محاذاة لليمين",
    alignCenter: "محاذاة للوسط",
    alignLeft: "محاذاة لليسار",
    heading1: "عنوان 1",
    heading2: "عنوان 2",
    heading3: "عنوان 3",
    heading4: "عنوان 4",
    heading5: "عنوان 5",
    insertMedia: "إدراج وسائط",
    undo: "تراجع",
    redo: "إعادة",
    clearFormatting: "مسح التنسيق",
    preview: "معاينة",
  },
  en: {
    switchLanguage: "Switch Language",
    textColor: "Text Color",
    highlight: "Highlight",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strike: "Strike",
    bulletList: "Bullet List",
    numberedList: "Numbered List",
    alignRight: "Align Right",
    alignCenter: "Align Center",
    alignLeft: "Align Left",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    heading4: "Heading 4",
    heading5: "Heading 5",
    insertMedia: "Insert Media",
    undo: "Undo",
    redo: "Redo",
    clearFormatting: "Clear Formatting",
    preview: "Preview",
  },
};

// Language configuration
export const langConfig = {
  ar: { shortLabel: "ع", label: "العربية" },
  en: { shortLabel: "EN", label: "English" },
};

// Helper function to merge custom translations with defaults
export function mergeTranslations(customTranslations?: Partial<Translations>): Translations {
  if (!customTranslations) {
    return defaultTranslations;
  }

  const merged: Translations = { ...defaultTranslations };

  // Merge Arabic translations
  if (customTranslations.ar) {
    merged.ar = { ...merged.ar, ...customTranslations.ar };
  }

  // Merge English translations
  if (customTranslations.en) {
    merged.en = { ...merged.en, ...customTranslations.en };
  }

  return merged;
}

// Helper function to get translation for a specific language and key
export function getTranslation(
  translations: Translations,
  language: 'ar' | 'en',
  key: keyof TranslationConfig
): string {
  return translations[language]?.[key] || defaultTranslations[language][key];
} 