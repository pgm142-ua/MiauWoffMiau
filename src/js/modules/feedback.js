/**
 * Módulo de Feedback Emocional (4 caras), plan de apoyo personalizado y exportación.
 */

import { $, all, on, put, show } from '../core/dom.js';
import { state, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { message, say } from '../services/speech.js';

export function selectFeedbackEmotion(button) {
  all('[data-emotion]').forEach((el) => el.setAttribute('aria-checked', String(el === button)));
  const label = button.querySelector('.emotion-label')?.innerText.replace(/^\d+\.\s*/, '') || '';

  put('explanation-emotion-title', 'Tu plan de apoyo personalizado');
  put('explanation-emotion-meaning', '💛 Cómo te sientes hoy: ' + label);
  put(
    'explanation-summary',
    '📋 Resumen del aviso enviado al profesor: ' +
      (uiState.lastReport || `${state.feeling} · ${state.cause} en ${state.place}`)
  );
  put(
    'explanation-plan',
    '🛡️ Qué hará el centro: Tu profesor u orientador vigilará la zona (' +
      (state.place || 'Patio / Recreo') +
      ') de forma discreta sin exponerte delante de tus compañeros.'
  );
  put(
    'explanation-resources',
    '📞 Teléfono gratuito y confidencial contra el acoso escolar: 900 018 018 (funciona 24 horas).'
  );

  show('full-explanation-panel', true);
  say('Gracias por contarlo. Tu profesor ya tiene el aviso para ayudarte.');
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
  on('btn-read-explanation', () => say(reportText()));

  on('btn-copy-report', async () => {
    try {
      await navigator.clipboard.writeText(reportText());
      message('📋 Resumen copiado al portapapeles.');
    } catch {
      message('Resumen listo.');
    }
  });

  on('btn-print-report', () => window.print());
  on('btn-restart', () => go('home'));
}
