/**
 * Módulo de Accesibilidad, preferencias visuales/cognitivas, atajos de teclado
 * y salida rápida (Esc).
 */

import { $, all, on, show, visible } from '../core/dom.js';
import { background, closeModal, go, openModal, visiblePage } from '../core/router.js';
import { read, remove, save } from '../core/storage.js';
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
const PROFILE_KEY = 'accessibility';
const DEVICE_STORAGE = { persistent: true };
const ADAPTATION_TOGGLE_IDS = [
  'gear-high-contrast',
  'gear-easy-read',
  'gear-motor-friendly',
  'gear-reduced-motion',
  'gear-deaf-mode',
  'gear-mute-mode',
];
const PROFILE_TOGGLE_IDS = [...ADAPTATION_TOGGLE_IDS, 'gear-voice-guide', 'gear-keyboard-menu'];
const SUPPORT_TOGGLE_IDS = {
  ciega: 'gear-high-contrast',
  sorda: 'gear-deaf-mode',
  muda: 'gear-mute-mode',
  intelectual: 'gear-easy-read',
  tea: 'gear-reduced-motion',
  motora: 'gear-motor-friendly',
};
const BODY_CLASS_TOGGLES = [
  ['high-contrast', 'contrast'],
  ['easy-read', 'easy'],
  ['motor-friendly', 'motor'],
  ['reduced-motion', 'still'],
];

let fontLevel = 0;
let onboardingComplete = false;

function loadPreferences(profile) {
  fontLevel = Number.isInteger(profile?.fontLevel) && FONT_SIZES[profile.fontLevel] ? profile.fontLevel : 0;
  onboardingComplete = profile?.onboardingComplete === true;

  for (const id of PROFILE_TOGGLE_IDS) {
    const toggle = $(id);
    if (toggle) {
      const saved = profile?.toggles?.[id];
      toggle.checked = typeof saved === 'boolean' ? saved : toggle.defaultChecked;
    }
  }

  const rate = $('gear-speech-rate');
  if (rate) {
    rate.value = Array.from(rate.options).some((option) => option.value === profile?.speechRate)
      ? profile.speechRate
      : '1';
  }
}

function savePreferences() {
  const toggles = Object.fromEntries(PROFILE_TOGGLE_IDS.map((id) => [id, Boolean($(id)?.checked)]));
  save(PROFILE_KEY, {
    fontLevel,
    speechRate: $('gear-speech-rate')?.value,
    toggles,
    onboardingComplete,
  }, DEVICE_STORAGE);
}

function updateModeRecommendations() {
  const useCaa = Boolean($('gear-mute-mode')?.checked);
  const useGuidedStory = Boolean($('gear-easy-read')?.checked || $('gear-reduced-motion')?.checked);
  show('mode-caa', useCaa);
  show('mode-guided-story', useGuidedStory);
  show('mode-adapted-recommendation', useGuidedStory && !useCaa);
  show('mode-guided-recommendation', useGuidedStory && !useCaa);
}

function isSupportActive(type) {
  if (!$(SUPPORT_TOGGLE_IDS[type])?.checked) return false;
  return type !== 'ciega' || (fontLevel >= 1 && Boolean($('gear-voice-guide')?.checked));
}

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
      const recommendation = el.querySelector('.choice-recommendation:not(.hidden)')?.innerText;
      pushText([title, desc, recommendation].filter(Boolean).join('. '));
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

function applyPreferences() {
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

  all('[data-dis-type]').forEach((button) => {
    button.setAttribute('aria-pressed', String(isSupportActive(button.dataset.disType)));
  });
  updateModeRecommendations();
}

function updatePreferences() {
  applyPreferences();
  savePreferences();
}

export function chooseVoice(enabled) {
  $('gear-voice-guide').checked = enabled;
  updatePreferences();
  go('0-disability');
}

export function startTalk() {
  go(onboardingComplete ? '1-role' : '0-voice');
}

export function setDisabilitySupport(type, enabled) {
  const toggle = $(SUPPORT_TOGGLE_IDS[type]);
  if (!toggle || isSupportActive(type) === enabled) return;

  toggle.checked = enabled;
  if (type === 'ciega') {
    $('gear-voice-guide').checked = enabled;
    fontLevel = enabled ? Math.max(fontLevel, 1) : 0;
  }
  updatePreferences();
}

export function finishAccessibilitySetup() {
  onboardingComplete = true;
  savePreferences();
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
  const safeExit = $('safe-exit-screen');
  show('safe-exit-screen', true);
  if (typeof safeExit?.showModal === 'function' && !safeExit.open) {
    safeExit.showModal();
  }
  $('return-from-safe-exit')?.focus();
}

export function initAccessibility() {
  on('btn-safe-exit', quickExit);
  on('return-from-safe-exit', () => {
    const safeExit = $('safe-exit-screen');
    if (safeExit?.open && typeof safeExit.close === 'function') {
      safeExit.close();
    }
    show('safe-exit-screen', false);
    background(false);
    document.title = t('page_title');
    $('btn-safe-exit')?.focus();
  });

  $('safe-exit-screen')?.addEventListener('cancel', (e) => {
    e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !visible($('safe-exit-screen'))) {
      e.preventDefault();
      quickExit();
      return;
    }
    if (
      !visible($('gear-modal')) &&
      !visible($('api-modal')) &&
      !visible($('safe-exit-screen')) &&
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

  [...PROFILE_TOGGLE_IDS, 'gear-speech-rate'].forEach((id) =>
    $(id)?.addEventListener('change', updatePreferences)
  );

  all('.font-seg-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      fontLevel = Number(btn.dataset.fontLevel || 0);
      updatePreferences();
      const sizeLabel = btn.querySelector('[data-i18n]')?.textContent || '';
      if (sizeLabel) message(t('a11y_font_toast', { size: sizeLabel }));
    })
  );

  on('btn-gear-reset', () => {
    remove(PROFILE_KEY, DEVICE_STORAGE);
    loadPreferences(null);
    applyPreferences();
    message(t('gear_reset_toast'));
  });

  on('btn-gear-settings', () => openModal('gear-modal'));
  ['btn-close-gear-modal', 'btn-gear-done', 'btn-close-api-modal'].forEach((id) =>
    on(id, closeModal)
  );
  on('btn-api-settings', () => openModal('api-modal'));
  all('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    backdrop.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

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

  on('btn-continue-from-dis', finishAccessibilitySetup);

  onSpeechStateChange(syncListenButton);
  onLanguageChange(syncListenButton);
  syncListenButton();
  loadPreferences(read(PROFILE_KEY, DEVICE_STORAGE));
  applyPreferences();
}
