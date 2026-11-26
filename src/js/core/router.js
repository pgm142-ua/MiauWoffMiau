/**
 * Enrutador de pantallas, gestión accesible de modales, historial y barra de progreso.
 */

import { $, put, show } from './dom.js';
import { pages, state, uiState } from './state.js';
import { say } from '../services/speech.js';

const STEP_LIST = [
  '0-voice',
  '0-disability',
  '1-role',
  '2-mode',
  '3-situation-type',
  'adapted-1',
  'adapted-2',
  'adapted-3',
];

const pageHooks = new Map();

export function registerPageHook(pageName, fn) {
  pageHooks.set(pageName, fn);
}

export function visiblePage() {
  return $('screen-' + uiState.page);
}

export function background(inert) {
  document.querySelector('main').inert = inert;
  document.querySelector('header').inert = inert;
  document.querySelector('footer').inert = inert;
}

export function closeModal() {
  if (!uiState.modal) return;
  show(uiState.modal, false);
  uiState.modal = '';
  background(false);
  uiState.opener?.focus();
}

export function openModal(id) {
  closeModal();
  uiState.opener = document.activeElement;
  uiState.modal = id;
  background(true);
  show(id, true);
  $(id)?.querySelector('button')?.focus();
}

export function go(target, push = true) {
  if (!$('screen-' + target)) return;
  closeModal();
  window.speechSynthesis?.cancel();

  if (uiState.page !== target && push) {
    pages.push(uiState.page);
  }

  show('screen-' + uiState.page, false);
  uiState.page = target;
  show('screen-' + uiState.page, true);

  const vp = visiblePage();
  const heading = vp?.querySelector('h1');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  put('progress-label', vp?.querySelector('.step-badge')?.innerText || heading?.innerText || 'Contigo');
  const step = STEP_LIST.indexOf(uiState.page) + 1;
  const progressFill = $('progress-fill');
  if (progressFill) {
    progressFill.style.width = (step ? step * 12.5 : 100) + '%';
  }
  const progressBar = $('progress-bar');
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', String(step || 8));
  }

  if (uiState.page === 'adapted-3') {
    const roleLabel = state.branch === 'testigo' ? 'Lo he visto (Testigo)' : 'Me pasa a mí';
    put('adapted-summary-box', `📌 ${roleLabel} · ${state.feeling} · ${state.cause}`);
    show('adapted-sent-confirm', false);
  }

  const hook = pageHooks.get(uiState.page);
  if (hook) hook();

  if ($('gear-voice-guide')?.checked && !$('gear-deaf-mode')?.checked && heading) {
    const lead = vp.querySelector('.lead-text')?.innerText || '';
    say(heading.innerText + '. ' + lead);
  }
}
