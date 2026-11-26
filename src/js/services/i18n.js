/**
 * Servicio centralizado de internacionalización multilingüe
 * (7 idiomas: es, ca, en, fr, de, pt, ar con soporte RTL completo).
 */

import { $, all, value } from '../core/dom.js';
import { read, save } from '../core/storage.js';
import es from './locales/es.js';
import ca from './locales/ca.js';
import en from './locales/en.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import pt from './locales/pt.js';
import ar from './locales/ar.js';

export const SUPPORTED_LANGS = ['es', 'ca', 'en', 'fr', 'de', 'pt', 'ar'];

const DICTIONARIES = { es, ca, en, fr, de, pt, ar };

const LOCALES = {
  es: 'es-ES',
  ca: 'ca-ES',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-PT',
  ar: 'ar-SA',
};

const PLACE_ALIASES = {
  patio: 'place_patio',
  'Patio / Recreo': 'place_patio',
  hallways: 'place_hallways',
  'Pasillos / Baños': 'place_hallways',
  class: 'place_class',
  'En clase': 'place_class',
  entrance: 'place_entrance',
  'Entrada / Salida': 'place_entrance',
  digital: 'place_digital',
  'Móvil / Redes': 'place_digital',
};

const FEELING_ALIASES = {
  calm: 'val_feeling_calm',
  'Tranquilo / Bien': 'val_feeling_calm',
  sad: 'val_feeling_sad',
  Triste: 'val_feeling_sad',
  scared: 'val_feeling_scared',
  'Con miedo': 'val_feeling_scared',
  angry: 'val_feeling_angry',
  'Enfadado / Molesto': 'val_feeling_angry',
};

const CAUSE_ALIASES = {
  social: 'val_cause_social',
  'Social (exclusión o burlas)': 'val_cause_social',
  internal: 'val_cause_internal',
  'Interno (miedo o bloqueo)': 'val_cause_internal',
  physical: 'val_cause_physical',
  'Físico (empujones o cosas)': 'val_cause_physical',
  digital: 'val_cause_digital',
  'Digital / Móvil': 'val_cause_digital',
  noise: 'val_cause_noise',
  'Mucho ruido / Recreo': 'val_cause_noise',
  other: 'val_cause_other',
  'Otra causa': 'val_cause_other',
};

const RECIPIENT_ALIASES = {
  guidance: 'recipient_guidance',
  'Orientación y Bienestar': 'recipient_guidance',
  tutor: 'recipient_tutor',
  'Tutor/a del grupo': 'recipient_tutor',
  director: 'recipient_director',
  'Dirección / Convivencia': 'recipient_director',
  teacher: 'recipient_teacher',
  Docente: 'recipient_teacher',
  teacher_tutor: 'recipient_teacher_tutor',
  'Profesor / Tutor': 'recipient_teacher_tutor',
  tutor_guidance: 'recipient_tutor_guidance',
  'Tutor/a y Orientación': 'recipient_tutor_guidance',
  guidance_tutor: 'recipient_guidance_tutor',
  'Orientación y Tutoría': 'recipient_guidance_tutor',
};

let currentLang = 'es';
const listeners = new Set();

function interpolate(template, params) {
  return String(template).replace(/\{(\w+)\}/g, (_, name) =>
    params[name] !== undefined && params[name] !== null ? String(params[name]) : ''
  );
}

export function getLang() {
  return currentLang;
}

export function getLocale(lang = currentLang) {
  return LOCALES[lang] || 'es-ES';
}

export function t(key, params = {}) {
  const dict = DICTIONARIES[currentLang] || DICTIONARIES.es;
  const raw = dict[key] ?? DICTIONARIES.es[key] ?? key;
  return interpolate(raw, params);
}

export function translatePlace(val) {
  const key = PLACE_ALIASES[val];
  return key ? t(key) : val || t('place_patio');
}

export function translateFeeling(val) {
  const key = FEELING_ALIASES[val];
  return key ? t(key) : val || '';
}

export function translateCause(val) {
  const key = CAUSE_ALIASES[val];
  return key ? t(key) : val || '';
}

export function translateRecipient(val) {
  const key = RECIPIENT_ALIASES[val];
  return key ? t(key) : val || t('recipient_guidance');
}

export function onLanguageChange(listener) {
  if (typeof listener === 'function') {
    listeners.add(listener);
  }
  return () => listeners.delete(listener);
}

export function applyTranslations(root = document) {
  const lang = currentLang;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (root === document) {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    const safeExitVisible = Boolean($('safe-exit-screen') && !$('safe-exit-screen').classList.contains('hidden'));
    document.title = t(safeExitVisible ? 'safe_exit_page_title' : 'page_title');
  }

  all('[data-i18n]', root).forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  all('[data-i18n-html]', root).forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key) el.innerHTML = t(key);
  });

  all('[data-i18n-placeholder]', root).forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = t(key);
  });

  all('[data-i18n-title]', root).forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) el.title = t(key);
  });

  all('[data-i18n-aria-label]', root).forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (key) el.setAttribute('aria-label', t(key));
  });

  all('[data-i18n-prompt]', root).forEach((el) => {
    const key = el.dataset.i18nPrompt;
    if (key) el.dataset.prompt = t(key);
  });

  all('[data-i18n-text]', root).forEach((el) => {
    const key = el.dataset.i18nText;
    if (key) el.dataset.text = t(key);
  });

  all('[data-i18n-signal]', root).forEach((el) => {
    const key = el.dataset.i18nSignal;
    if (key) el.dataset.signal = t(key);
  });

  all('[data-i18n-caa]', root).forEach((el) => {
    const key = el.dataset.i18nCaa;
    if (key) el.dataset.caa = t(key);
  });
}

export function setLanguage(lang) {
  const nextLang = SUPPORTED_LANGS.includes(lang) ? lang : 'es';
  currentLang = nextLang;
  save('lang', nextLang);

  const select = $('lang-select');
  if (select && select.value !== nextLang) {
    select.value = nextLang;
  }

  applyTranslations(document);
  listeners.forEach((fn) => fn(nextLang));
}

export function initI18n() {
  const saved = read('lang');
  const initial = SUPPORTED_LANGS.includes(saved) ? saved : value('lang-select') || 'es';

  const select = $('lang-select');
  if (select) {
    select.addEventListener('change', () => {
      setLanguage(select.value);
    });
  }

  setLanguage(initial);
}
