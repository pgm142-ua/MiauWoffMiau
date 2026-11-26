/**
 * Módulo del Rincón de Calma (respiración guiada visual y por voz).
 */

import { $, all, on, put } from '../core/dom.js';
import { registerPageHook } from '../core/router.js';
import { uiState } from '../core/state.js';
import { say } from '../services/speech.js';

const INHALE_TEXT = 'Coge aire despacio…';
const EXHALE_TEXT = 'Suelta el aire despacio…';
const CYCLE_MAX = 5;

let breathingTimer = null;
let isInhaling = true;
let progressStep = 0;
let isPaused = false;

function setPauseButtonLabel(btn, paused) {
  if (!btn) return;
  const label = paused ? 'Seguir' : 'Pausa';
  const span = all('span', btn).find(
    (el) => el.getAttribute('aria-hidden') !== 'true' && el.textContent.trim().length > 0
  );
  if (span) {
    span.textContent = label;
    return;
  }

  const textNode = Array.from(btn.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
  );
  if (textNode) {
    const leading = textNode.textContent.match(/^\s*/)?.[0] || '';
    textNode.textContent = leading + label;
    return;
  }

  const created = document.createElement('span');
  created.textContent = label;
  btn.appendChild(created);
}

function renderCalmState() {
  put('breathing-text', isInhaling ? INHALE_TEXT : EXHALE_TEXT);

  const circle = $('breathing-circle');
  if (circle) {
    circle.classList.toggle('inhale', isInhaling);
    circle.classList.toggle('exhale', !isInhaling);
    circle.classList.toggle('paused', isPaused);
  }

  all('.calm-prog i').forEach((bar, index) => {
    bar.classList.toggle('on', index < progressStep);
    bar.classList.toggle('half', index === progressStep);
  });

  const pauseBtn = $('btn-calm-pause');
  if (pauseBtn) {
    pauseBtn.setAttribute('aria-pressed', String(isPaused));
    setPauseButtonLabel(pauseBtn, isPaused);
  }
}

function resetCalmCycle() {
  isInhaling = true;
  progressStep = 0;
  isPaused = false;
  renderCalmState();
}

export function initCalm() {
  clearInterval(breathingTimer);
  resetCalmCycle();

  registerPageHook('calm', resetCalmCycle);

  breathingTimer = setInterval(() => {
    if (uiState.page !== 'calm' || isPaused) return;
    isInhaling = !isInhaling;
    progressStep = (progressStep + 1) % (CYCLE_MAX + 1);
    renderCalmState();
  }, 4000);

  on('btn-calm-pause', () => {
    isPaused = !isPaused;
    renderCalmState();
  });

  on('btn-calm-sound', () =>
    say('Coge aire despacio contando hasta cuatro... y suelta el aire suavemente. Estás en un espacio seguro.')
  );
}
