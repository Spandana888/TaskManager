import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import fr from './locales/fr.json'

const locales = RNLocalize.getLocales();
const defaultLang = locales.length > 0 ? locales[0].languageCode : 'en';

i18n
  .use(initReactI18next)
  .init({
    lng: defaultLang,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
