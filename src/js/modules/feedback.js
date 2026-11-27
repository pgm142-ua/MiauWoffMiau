/**
 * Módulo de Feedback Emocional (4 caras), plan de apoyo personalizado y exportación.
 */

import { $, all, on, put, show } from '../core/dom.js';
import { state, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import {
  onLanguageChange,
  t,
  translateCause,
  translateFeeling,
  translatePlace,
} from '../services/i18n.js';
import { message, say } from '../services/speech.js';

let selectedEmotionButton = null;

function renderExplanation(button, speak = false) {
  if (!button) return;
  const label = button.querySelector('.emotion-label')?.innerText.replace(/^\d+\.\s*/, '') || '';
  const fallbackReport = [
    translateFeeling(state.feeling),
    translateCause(state.cause),
    translatePlace(state.place),
  ]
    .filter(Boolean)
    .join(' · ');

  put('explanation-emotion-title', t('fb_plan_title'));
  put('explanation-emotion-meaning', t('fb_meaning', { emotion: label }));
  put('explanation-summary', t('fb_summary', { report: uiState.lastReport || fallbackReport }));
  put('explanation-plan', t('fb_plan_body', { place: translatePlace(state.place || 'patio') }));
  put('explanation-resources', t('fb_resources'));

  show('full-explanation-panel', true);
  if (speak) say(t('fb_spoken_thanks'));
}

export function selectFeedbackEmotion(card) {
  if (!card) return;
  selectedEmotionButton = card;
  const radio = card.querySelector('.emotion-radio');
  if (radio && !radio.checked) radio.checked = true;
  all('[data-emotion]').forEach((el) => el.classList.toggle('sel', el === card));
  renderExplanation(card, true);
}

function reportText() {
  return [
    'explanation-emotion-meaning',
    'explanation-summary',
    'explanation-plan',
    'explanation-resources',
  ]
    .map((id) => $(id)?.textContent || '')
    .join('\n');
}

export function initFeedback() {
  all('.emotion-radio').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) {
        selectFeedbackEmotion(input.closest('[data-emotion]'));
      }
    });
  });

  on('btn-read-explanation', () => say(reportText()));

  on('btn-copy-report', async () => {
    try {
      await navigator.clipboard.writeText(reportText());
      message(t('fb_copied_toast'));
    } catch {
      message(t('fb_copy_fallback'));
    }
  });

  on('btn-print-report', () => window.print());
  on('btn-restart', () => go('home'));

  onLanguageChange(() => {
    if (
      selectedEmotionButton &&
      $('full-explanation-panel') &&
      !$('full-explanation-panel').classList.contains('hidden')
    ) {
      renderExplanation(selectedEmotionButton, false);
    }
  });
}
