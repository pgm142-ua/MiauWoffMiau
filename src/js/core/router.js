/**
 * Enrutador de pantallas, gestión accesible de modales, historial y barra de progreso.
 */

import { $, all, put, show } from './dom.js';
import { pages, state, uiState } from './state.js';
import { onLanguageChange, t, translateCause, translateFeeling } from '../services/i18n.js';
import { say, stopSpeaking } from '../services/speech.js';

const FLOW_STEPS = {
  '0-voice': { current: 1, total: 5 },
  '0-disability': { current: 2, total: 5 },
  '1-role': { current: 3, total: 5 },
  '2-mode': { current: 4, total: 5 },
  '3-situation-type': { current: 5, total: 5 },
  'adapted-1': { current: 1, total: 3 },
  'adapted-2': { current: 2, total: 3 },
  'adapted-3': { current: 3, total: 3 },
};

const NAV_TAB_MAP = {
  home: 'home',
  caa: 'caa',
  diary: 'diary',
  calm: 'calm',
  '0-voice': 'talk',
  '0-disability': 'talk',
  '1-role': 'talk',
  '2-mode': 'talk',
  '3-situation-type': 'talk',
  'adapted-1': 'talk',
  'adapted-2': 'talk',
  'adapted-3': 'talk',
  'no-adapted': 'talk',
  questionnaire: 'talk',
  feedback: 'talk',
};

const pageHooks = new Map();

export function registerPageHook(pageName, fn) {
  pageHooks.set(pageName, fn);
}

export function visiblePage() {
  return $('screen-' + uiState.page);
}

export function initialPageFromHash() {
  const raw = window.location.hash.replace(/^#/, '').trim();
  return raw && $('screen-' + raw) ? raw : 'home';
}

function syncNavTabs(page) {
  const activeTab = NAV_TAB_MAP[page] || '';
  all('[data-nav-tab]').forEach((btn) => {
    const isActive = Boolean(activeTab && btn.dataset.navTab === activeTab);
    btn.classList.toggle('active', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });
}

function updateProgressLabel() {
  const stepInfo = FLOW_STEPS[uiState.page];
  show('flow-bar', Boolean(stepInfo));
  if (!stepInfo) return;

  const vp = visiblePage();
  const badgeText = vp?.querySelector('.step-badge')?.innerText;
  put('progress-label', badgeText || t('step_progress', stepInfo));

  const progressFill = $('progress-fill');
  if (progressFill) {
    progressFill.style.width = (stepInfo.current / stepInfo.total) * 100 + '%';
  }
  const progressBar = $('progress-bar');
  if (progressBar) {
    progressBar.setAttribute('aria-valuemin', '1');
    progressBar.setAttribute('aria-valuemax', String(stepInfo.total));
    progressBar.setAttribute('aria-valuenow', String(stepInfo.current));
  }
}

function renderAdaptedSummary() {
  if (uiState.page !== 'adapted-3') return;
  const roleLabel = t(state.branch === 'testigo' ? 'ad3_summary_witness' : 'ad3_summary_victim');
  put(
    'adapted-summary-box',
    `📌 ${roleLabel} · ${translateFeeling(state.feeling)} · ${translateCause(state.cause)}`
  );
}

onLanguageChange(() => {
  updateProgressLabel();
  renderAdaptedSummary();
});

export function background(inert) {
  document.querySelector('main').inert = inert;
  document.querySelector('header').inert = inert;
  document.querySelector('footer').inert = inert;
  const mobileNav = document.querySelector('.mobile-bottom-nav');
  if (mobileNav) mobileNav.inert = inert;
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

export function go(target, push = true, syncHash = true) {
  if (!$('screen-' + target)) return;
  closeModal();
  stopSpeaking();

  if (target === 'home') {
    pages.length = 0;
  } else if (uiState.page !== target && push && pages[pages.length - 1] !== uiState.page) {
    pages.push(uiState.page);
  }

  show('screen-' + uiState.page, false);
  uiState.page = target;
  show('screen-' + uiState.page, true);

  if (syncHash && window.history?.replaceState) {
    const nextHash = '#' + uiState.page;
    if (window.location.hash !== nextHash) {
      if (push) {
        window.history.pushState({ page: uiState.page }, '', nextHash);
      } else {
        window.history.replaceState({ page: uiState.page }, '', nextHash);
      }
    }
  }

  const vp = visiblePage();
  const heading = vp?.querySelector('h1');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  window.scrollTo({
    top: 0,
    behavior: document.body.classList.contains('still') ? 'auto' : 'smooth',
  });

  syncNavTabs(uiState.page);
  updateProgressLabel();

  if (uiState.page === 'adapted-3') {
    renderAdaptedSummary();
    show('adapted-sent-confirm', false);
  }

  const hook = pageHooks.get(uiState.page);
  if (hook) hook();

  if ($('gear-voice-guide')?.checked && !$('gear-deaf-mode')?.checked && heading) {
    const lead = vp.querySelector('.lead-text, .lead')?.innerText || '';
    say(heading.innerText + (lead ? '. ' + lead : ''));
  }
}

window.addEventListener('popstate', () => {
  const target = initialPageFromHash();
  if (target !== uiState.page) {
    go(target, false, false);
  }
});
