import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './translation/en.json';
import ru from './translation/ru.json';
import cn from './translation/cn.json';
import fa from './translation/fa.json';
import ar from './translation/ar.json';
import tr from './translation/tr.json';
import hi from './translation/hi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      ru: {
        translation: ru
      },
      cn: {
        translation: cn
      },
      fa: {
        translation: fa
      },
      ar: {
        translation: ar
      },
      tr: {
        translation: tr
      },
      hi: {
        translation: hi
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
