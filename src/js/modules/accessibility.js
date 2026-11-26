/**
 * Módulo de Accesibilidad, preferencias visuales/cognitivas, atajos de teclado
 * y salida rápida (Esc).
 */

import { $, all, on, show, value, visible } from '../core/dom.js';
import { background, closeModal, go, openModal, visiblePage } from '../core/router.js';
import { abortGemini } from '../services/gemini.js';
import { t } from '../services/i18n.js';
import { abortSpeechRecognition, message, say } from '../services/speech.js';

export function applyPreferences() {
  const toggles = [
    ['high-contrast', 'contrast'],
    ['easy-read', 'easy'],
    ['motor-friendly', 'motor'],
    ['reduced-motion', 'still'],
  ];

  for (const [id, cls] of toggles) {
    document.body.classList.toggle(cls, Boolean($('gear-' + id)?.checked));
  }

  const fontSizes = [18, 21, 24];
  document.documentElement.style.fontSize = fontSizes[Number(value('gear-font-select') || 0)] + 'px';

  $('btn-contrast')?.setAttribute('aria-pressed', String(Boolean($('gear-high-contrast')?.checked)));
  $('btn-easy-read')?.setAttribute('aria-pressed', String(Boolean($('gear-easy-read')?.checked)));
  $('btn-font-size')?.setAttribute('aria-pressed', String(Number(value('gear-font-select')) > 0));

  show('voice-status-badge', Boolean($('gear-voice-guide')?.checked && !$('gear-deaf-mode')?.checked));
  if ($('gear-deaf-mode')?.checked || !$('gear-voice-guide')?.checked) {
    window.speechSynthesis?.cancel();
  }

  const anyA11y = all('.gear-toggle input:checked').some(
    (el) => !['gear-keyboard-menu', 'gear-voice-guide'].includes(el.id)
  );
  show('adaptation-badge', anyA11y);
}

export function toggleDisabilityDetail(showDetails) {
  show('disability-yesno-panel', !showDetails);
  show('disability-types-panel', showDetails);
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
    if (btn.dataset.disType === 'ciega' && $('gear-font-select')) {
      $('gear-font-select').value = '1';
    }
  });

  applyPreferences();
  go('1-role');
}

export function quickExit() {
  abortGemini();
  abortSpeechRecognition();
  window.speechSynthesis?.cancel();
  closeModal();
  show('toast', false);
  background(true);
  document.title = t('safe_exit_page_title');
  show('safe-exit-screen', true);
  $('return-from-safe-exit')?.focus();
}

export function initAccessibility() {
  // Salida rápida (tecla Esc y botón)
  on('btn-safe-exit', quickExit);
  on('return-from-safe-exit', () => {
    show('safe-exit-screen', false);
    background(false);
    document.title = t('page_title');
    $('btn-safe-exit')?.focus();
  });

  // Atajos de teclado (Esc y teclas numéricas 1..9)
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

  // Preferencias del modal de ajustes
  all('#gear-modal input, #gear-modal select').forEach((el) =>
    el.addEventListener('change', applyPreferences)
  );

  // Modales
  on('btn-gear-settings', () => openModal('gear-modal'));
  ['btn-close-gear-modal', 'btn-gear-done', 'btn-close-api-modal'].forEach((id) =>
    on(id, closeModal)
  );
  ['btn-api-settings', 'btn-open-api-modal'].forEach((id) =>
    on(id, () => openModal('api-modal'))
  );
  all('.modal-backdrop').forEach((backdrop) =>
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    })
  );

  // Controles rápidos en barra superior
  on('btn-font-size', () => {
    const select = $('gear-font-select');
    if (!select) return;
    select.selectedIndex = (select.selectedIndex + 1) % 3;
    applyPreferences();
    message(t('a11y_font_toast', { size: select.options[select.selectedIndex].text }));
  });

  on('btn-contrast', () => {
    const checkbox = $('gear-high-contrast');
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;
    applyPreferences();
  });

  on('btn-easy-read', () => {
    const checkbox = $('gear-easy-read');
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;
    applyPreferences();
  });

  on('btn-read-page', () => {
    const vp = visiblePage();
    if (vp) say(vp.innerText);
  });

  on('btn-play-welcome-voice', () => {
    say(t('s0_welcome_spoken'));
  });

  // Paso 0B: apoyos de discapacidad
  on('btn-continue-from-dis', applyDisabilitySupport);
  on('btn-back-dis-yesno', () => toggleDisabilityDetail(false));

  applyPreferences();
}
