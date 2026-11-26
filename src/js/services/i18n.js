/**
 * Servicio de internacionalización multilingüe (7 idiomas, incluido soporte RTL para árabe).
 */

import { $, all, node, value } from '../core/dom.js';

const LANGUAGE_TEXT = {
  en: 'Safe Space|Hello! 👋|Contigo.|We are here to help you.|Start ➔|Hello! 👋 Want voice?|1. Yes, with voice|2. No, silent|Need any support?|Hello! Who are you?|How do you want to talk?|What happens?|← Back',
  ca: 'Espai Segur|Hola! 👋|Contigo.|Estem ací per a ajudar-te.|Començar ➔|Hola! 👋 Vols veu?|1. Sí, amb veu|2. No, en silenci|Necessites algun suport?|Hola! Qui eres?|Com vols parlar?|Què passa?|← Tornar',
  fr: 'Espace Sûr|Bonjour ! 👋|Contigo.|Nous sommes là pour t’aider.|Commencer ➔|Bonjour ! 👋 Voix ?|1. Oui, avec voix|2. Non, silence|Besoin d’aide ?|Qui es-tu ?|Comment parler ?|Que se passe-t-il ?|← Retour',
  de: 'Sicherer Ort|Hallo! 👋|Contigo.|Wir helfen dir.|Starten ➔|Hallo! 👋 Mit Stimme?|1. Ja, mit Stimme|2. Nein, lautlos|Brauchst du Hilfe?|Wer bist du?|Wie möchtest du reden?|Was ist los?|← Zurück',
  pt: 'Espaço Seguro|Olá! 👋|Contigo.|Estamos aqui para ajudar.|Começar ➔|Olá! 👋 Queres voz?|1. Sim, com voz|2. Não, silêncio|Precisas de apoio?|Olá! Quem és?|Como queres falar?|O que acontece?|← Voltar',
  ar: 'مساحة آمنة|مرحباً! 👋|Contigo.|نحن هنا لمساعدتك.|ابدأ ➔|مرحباً! 👋 هل تريد صوتاً؟|1. نعم بالصوت|2. لا، صامت|هل تحتاج لدعم؟|من أنت؟|كيف تريد التحدث؟|ماذا يحدث؟|← رجوع',
};

const I18N_SELECTORS = [
  '.eyebrow',
  '.hero-copy > p',
  '.hero-cta',
  '#title-screen-0',
  '[data-action="choose-voice"][data-value="si"] .choice-title',
  '[data-action="choose-voice"][data-value="no"] .choice-title',
  '#title-screen-0b',
  '#title-screen-1',
  '#title-screen-2',
  '#title-screen-3',
  '[data-i18n="back"]',
];

export function initI18n() {
  const headline = document.querySelector('.hero h1');
  const originals = [headline, ...I18N_SELECTORS.flatMap((s) => all(s))].map((el) => [
    el,
    el?.innerHTML || '',
  ]);

  $('lang-select')?.addEventListener('change', () => {
    const lang = value('lang-select');
    const tokens = LANGUAGE_TEXT[lang]?.split('|');

    originals.forEach(([el, html]) => {
      if (!el) return;
      el.innerHTML = html;
      el.lang = lang;
      el.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });

    if (!tokens) return;
    if (headline) {
      headline.replaceChildren(
        document.createTextNode(tokens[1]),
        node('br', ''),
        node('em', tokens[2])
      );
    }

    const values = [
      tokens[0],
      tokens[3],
      tokens[4],
      tokens[5],
      tokens[6],
      tokens[7],
      tokens[8],
      tokens[9],
      tokens[10],
      tokens[11],
      tokens[12],
    ];
    I18N_SELECTORS.forEach((selector, index) => {
      all(selector).forEach((el) => {
        el.textContent = values[index];
      });
    });
  });
}
