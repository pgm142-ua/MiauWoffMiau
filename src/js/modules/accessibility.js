/**
 * Módulo de Accesibilidad, preferencias visuales/cognitivas, atajos de teclado
 * y salida rápida (Esc).
 */

import { $, all, on, show, visible } from '../core/dom.js';
import { background, closeModal, go, openModal, visiblePage } from '../core/router.js';
import { abortGemini } from '../services/gemini.js';
import { onLanguageChange, t } from '../services/i18n.js';
import {
  abortSpeechRecognition,
  isSpeaking,
  message,
  onSpeechStateChange,
  say,
  stopSpeaking,
} from '../services/speech.js';

const FONT_SIZES = [16, 19, 22];
const ADAPTATION_TOGGLE_IDS = [
  'gear-high-contrast',
  'gear-easy-read',
  'gear-motor-friendly',
  'gear-reduced-motion',
  'gear-deaf-mode',
  'gear-mute-mode',
];
const BODY_CLASS_TOGGLES = [
  ['high-contrast', 'contrast'],
  ['easy-read', 'easy'],
  ['motor-friendly', 'motor'],
  ['reduced-motion', 'still'],
];

let fontLevel = 0;

function extractReadableText(section) {
  if (!section) return '';
  const chunks = [];
  const pushText = (raw) => {
    const clean = (raw || '').replace(/\s+/g, ' ').trim();
    if (clean && !chunks.includes(clean)) chunks.push(clean);
  };

  const candidates = section.querySelectorAll(
    'h1, .lead, .lead-text, .calma-bubble, .soft-note, #adapted-summary-box, .info-banner, .urgent-alert, .choice-card, .toggle-dis-card, .visual-card, .emotion-card, .question-block legend, #chat-messages .bubble, .record, #full-explanation-panel .soft-box'
  );

  for (const el of candidates) {
    if (
      el.closest('.hidden, [hidden], .nav-actions, .quick-input-details') ||
      !visible(el)
    ) {
      continue;
    }
    if (el.matches('.choice-card, .toggle-dis-card, .visual-card, .emotion-card')) {
      const title = el.querySelector('.choice-title, .check-title, .visual-title, .emotion-label')?.innerText;
      const desc = el.querySelector('.choice-desc, .check-desc, .visual-sub, .emotion-sub')?.innerText;
      pushText([title, desc].filter(Boolean).join('. '));
    } else {
      pushText(el.innerText);
    }
  }

  return chunks.join('. ') || (section.innerText || '').trim();
}

function syncListenButton() {
  const btn = $('btn-read-page');
  if (!btn) return;
  const active = isSpeaking();
  btn.setAttribute('aria-pressed', String(active));

  const iconUse = $('read-page-icon');
  if (iconUse) iconUse.setAttribute('href', active ? '#i-stop' : '#i-speaker');

  const label = btn.querySelector('.tool-label');
  if (label) label.textContent = t(active ? 'a11y_stop' : 'a11y_listen');

  const tip = t(active ? 'a11y_stop_title' : 'a11y_listen_title');
  btn.title = tip;
  btn.setAttribute('aria-label', tip);
}

export function applyPreferences() {
  for (const [id, cls] of BODY_CLASS_TOGGLES) {
    document.body.classList.toggle(cls, Boolean($('gear-' + id)?.checked));
  }

  document.documentElement.style.fontSize = (FONT_SIZES[fontLevel] || FONT_SIZES[0]) + 'px';

  all('.font-seg-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(Number(btn.dataset.fontLevel) === fontLevel));
  });

  show('voice-status-badge', Boolean($('gear-voice-guide')?.checked && !$('gear-deaf-mode')?.checked));
  if ($('gear-deaf-mode')?.checked || !$('gear-voice-guide')?.checked) {
    stopSpeaking();
  }

  const anyA11y =
    ADAPTATION_TOGGLE_IDS.some((id) => Boolean($(id)?.checked)) || fontLevel > 0;
  show('adaptation-badge', anyA11y);

  const activeCount =
    [...ADAPTATION_TOGGLE_IDS, 'gear-voice-guide'].filter((id) => Boolean($(id)?.checked)).length +
    (fontLevel > 0 ? 1 : 0);
  const countBadge = $('a11y-active-count');
  if (countBadge) {
    countBadge.textContent = String(activeCount);
  }
  show('a11y-active-count', activeCount > 0);
}

export function applyDisabilitySupport() {
  const map = {
    ciega: 'voice-guide',
    sorda: 'deaf-mode',
    muda: 'mute-mode',
    intelectual: 'easy-read',
    motora: 'motor-friendly',
    tea: 'reduced-motion',
  };

  all('[data-dis-type][aria-pressed="true"]').forEach((btn) => {
    const targetId = 'gear-' + map[btn.dataset.disType];
    if ($(targetId)) $(targetId).checked = true;
    if (btn.dataset.disType === 'ciega') {
      fontLevel = Math.max(fontLevel, 1);
    }
  });

  applyPreferences();
  go('1-role');
}

export function quickExit() {
  abortGemini();
  abortSpeechRecognition();
  stopSpeaking();
  closeModal();
  show('toast', false);
  background(true);
  document.title = t('safe_exit_page_title');
  show('safe-exit-screen', true);
  $('return-from-safe-exit')?.focus();
}

export function initAccessibility() {
  on('btn-safe-exit', quickExit);
  on('return-from-safe-exit', () => {
    show('safe-exit-screen', false);
    background(false);
    document.title = t('page_title');
    $('btn-safe-exit')?.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !visible($('safe-exit-screen'))) {
      e.preventDefault();
      quickExit();
      return;
    }
    if (
      $('gear-keyboard-menu')?.checked &&
      /^\d$/.test(e.key) &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)
    ) {
      const btn = all('[data-key="' + e.key + '"]', visiblePage()).find(visible);
      if (btn) btn.click();
    }
  });

  all('#gear-modal input, #gear-speech-rate').forEach((el) =>
    el.addEventListener('change', applyPreferences)
  );

  all('.font-seg-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      fontLevel = Number(btn.dataset.fontLevel || 0);
      applyPreferences();
      const sizeLabel = btn.querySelector('[data-i18n]')?.textContent || '';
      if (sizeLabel) message(t('a11y_font_toast', { size: sizeLabel }));
    })
  );

  on('btn-gear-reset', () => {
    fontLevel = 0;
    [...ADAPTATION_TOGGLE_IDS, 'gear-voice-guide'].forEach((id) => {
      if ($(id)) $(id).checked = false;
    });
    if ($('gear-keyboard-menu')) $('gear-keyboard-menu').checked = true;
    if ($('gear-speech-rate')) $('gear-speech-rate').value = '1';
    applyPreferences();
    message(t('gear_reset_toast'));
  });

  on('btn-gear-settings', () => openModal('gear-modal'));
  ['btn-close-gear-modal', 'btn-gear-done', 'btn-close-api-modal'].forEach((id) =>
    on(id, closeModal)
  );
  on('btn-api-settings', () => openModal('api-modal'));
  all('.modal-backdrop').forEach((backdrop) =>
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    })
  );

  on('btn-read-page', () => {
    if (isSpeaking()) {
      stopSpeaking();
      return;
    }
    const text = extractReadableText(visiblePage());
    if (text) say(text);
  });

  on('btn-play-welcome-voice', () => {
    say(t('s0_welcome_spoken'));
  });

  on('btn-continue-from-dis', applyDisabilitySupport);

  onSpeechStateChange(syncListenButton);
  onLanguageChange(syncListenButton);
  syncListenButton();
  applyPreferences();
}
