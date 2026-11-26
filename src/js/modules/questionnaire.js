/**
 * Módulo del Cuestionario Completo paso a paso y detección de peligro inmediato.
 */

import { $, show, submit, value } from '../core/dom.js';
import { addNotice, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { message } from '../services/speech.js';

export function initQuestionnaire() {
  $('form-questionnaire')?.addEventListener('change', () => {
    const isUrgent =
      document.querySelector('[name="qq_safety"]:checked')?.value === 'Siento peligro inmediato';
    show('urgent-help-alert', isUrgent);
  });

  submit('form-questionnaire', () => {
    const formData = new FormData($('form-questionnaire'));
    const place = formData.get('qq_place') || 'Patio / Recreo';

    uiState.lastReport = [
      `Situación: ${value('q-branch')}`,
      `Causa: ${value('q-cause')}`,
      `Burla/Aislamiento: ${formData.get('qq_tea_burla')}`,
      `Lugar: ${place}`,
      `Desde: ${formData.get('qq_duration')}`,
      `Frecuencia: ${formData.get('qq_frequency')}`,
      `Seguridad: ${formData.get('qq_safety')}`,
      value('q-situation-text'),
    ]
      .filter(Boolean)
      .join(' · ');

    const isAnon = formData.get('qq_delivery') === 'anonimo';
    addNotice(
      uiState.lastReport,
      place,
      'Orientación y Tutoría',
      isAnon ? 'Cuestionario Anónimo' : value('q-school') || 'Alumno/a'
    );

    message('✅ Cuestionario enviado al profesor.');
    go('feedback');
  });
}
