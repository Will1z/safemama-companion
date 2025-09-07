/**
 * Internationalization utilities for SafeMama
 * Simple i18n implementation with fallback to English
 */

export type SupportedLocale = 'en' | 'yo';

export interface Translations {
  [key: string]: string | Translations;
}

// English translations
const enTranslations: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try again',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
  },
  companion: {
    dailyCompanion: 'Daily Companion',
    howAreYouFeeling: 'How are you feeling?',
    breathingExercise: 'Breathing Exercise',
    moodCheckin: 'Mood Check-in',
    personalizedPlan: 'Personalized Plan',
    learn: 'Learn',
    community: 'Community',
  },
  mood: {
    happy: 'Happy',
    calm: 'Calm',
    tired: 'Tired',
    stressed: 'Stressed',
    sad: 'Sad',
    nauseous: 'Nauseous',
    doingWell: 'You are doing well. Small steps count.',
    thankYou: 'Thank you for taking care of yourself today.',
  },
  breathing: {
    breatheIn: 'Breathe in slowly',
    hold: 'Hold your breath',
    breatheOut: 'Breathe out gently',
    startBreathing: 'Start Breathing',
    stop: 'Stop',
    description: 'Take a moment to center yourself with this simple breathing exercise. Follow the 4-4-4 pattern: breathe in for 4, hold for 4, breathe out for 4.',
    warning: 'This is a relaxation technique. If you feel dizzy, stop and breathe normally.',
  },
  legal: {
    disclaimer: 'SafeMama gives general information only. It is not a diagnosis. In an emergency, go to the nearest clinic.',
  },
};

// Yoruba translations (partial)
const yoTranslations: Translations = {
  common: {
    loading: 'Nlo...',
    error: 'Nkan kan ko dara',
    retry: 'Gbiyanju lẹẹkansi',
    save: 'Fi pamọ',
    cancel: 'Fagilee',
    close: 'Pa',
  },
  companion: {
    dailyCompanion: 'Alabaṣepọ Ojoojumọ',
    howAreYouFeeling: 'Bawo ni o ṣe n ro?',
    breathingExercise: 'Idaraya Ifẹ',
    moodCheckin: 'Ayẹwo Ipo',
    personalizedPlan: 'Eto Ti Ara Ẹni',
    learn: 'Kọ',
    community: 'Agbegbe',
  },
  mood: {
    happy: 'Ayọ',
    calm: 'Dakẹ',
    tired: 'Lẹ',
    stressed: 'Ni wahala',
    sad: 'Banujẹ',
    nauseous: 'Ni aisan',
    doingWell: 'O n ṣe dara. Awọn igbesẹ kekere ṣe pataki.',
    thankYou: 'O ṣeun fun ṣiṣe itọju ara rẹ loni.',
  },
  breathing: {
    breatheIn: 'Fi ifẹ sinu laaye',
    hold: 'Duro ifẹ rẹ',
    breatheOut: 'Jade ifẹ laaye',
    startBreathing: 'Bẹrẹ Ifẹ',
    stop: 'Duro',
    description: 'Gba akoko lati duro pẹlu idaraya ifẹ yii. Tẹle apẹrẹ 4-4-4: fi ifẹ sinu fun 4, duro fun 4, jade ifẹ fun 4.',
    warning: 'Eyi jẹ ọna idaraya. Ti o ba ro pe o n yọ, duro ki o si fi ifẹ deede.',
  },
  legal: {
    disclaimer: 'SafeMama funni ni alaye gbogbo nikan. Kii ṣe akiyesi aisan. Ni ipo iyalẹnu, lọ si ile iwosan to sunmọ.',
  },
};

const translations: Record<SupportedLocale, Translations> = {
  en: enTranslations,
  yo: yoTranslations,
};

export function getTranslation(key: string, locale: SupportedLocale = 'en'): string {
  const keys = key.split('.');
  let translation: any = translations[locale] || translations.en;
  
  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k];
    } else {
      // Fallback to English
      translation = translations.en;
      for (const fallbackKey of keys) {
        if (translation && typeof translation === 'object' && fallbackKey in translation) {
          translation = translation[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof translation === 'string' ? translation : key;
}

export function useLang(locale?: SupportedLocale) {
  return (key: string) => getTranslation(key, locale);
}
