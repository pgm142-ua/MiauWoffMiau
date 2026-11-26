/**
 * Módulo del Espacio Familias (detección temprana desde casa).
 */

import { all, submit, value } from '../core/dom.js';
import { addNotice, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { message } from '../services/speech.js';

export function initParents() {
  submit('form-parents', () => {
    const signals = all('.parent-signal-btn[aria-pressed="true"]').map((btn) => btn.dataset.signal);
    const child = value('parent-child-name') || 'Alumno/a';
    const note = value('parent-note');
    const fullText =
      [...signals, note].filter(Boolean).join(' · ') ||
      'Preocupación comunicada por la familia desde casa.';

    uiState.lastReport = `Familia de ${child}: ${fullText}`;
    addNotice(uiState.lastReport, 'Patio / Recreo', 'Tutor/a y Orientación', `Familia (${child})`);
    message('✅ Aviso de familia enviado al centro.');
    go('feedback');
  });
}
