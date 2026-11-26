/**
 * Módulo del Rincón de Calma (respiración guiada visual y por voz).
 */

import { $, on } from '../core/dom.js';
import { uiState } from '../core/state.js';
import { say } from '../services/speech.js';

export function initCalm() {
  setInterval(() => {
    if (uiState.page === 'calm') {
      const el = $('breathing-text');
      if (el) {
        el.textContent = el.textContent.includes('Inspira') ? 'Suelta el aire...' : 'Inspira...';
      }
    }
  }, 4000);

  on('btn-calm-sound', () =>
    say('Inspira despacio contando hasta cuatro... y suelta el aire suavemente. Estás en un espacio seguro.')
  );
}
