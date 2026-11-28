/**
 * Módulo del Cuestionario Completo paso a paso y detección de peligro inmediato.
 */

import { $, put, show, submit, value } from '../core/dom.js';
import { addNotice, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { t, translateCause, translatePlace } from '../services/i18n.js';
import { message } from '../services/speech.js';

function checkedLabel(name, fallback = '') {
  return (
    document
      .querySelector(`[name="${name}"]:checked`)
      ?.closest('.pill-option')
      ?.querySelector('span')
      ?.textContent?.trim() || fallback
  );
}

export function initQuestionnaire() {
  $('form-questionnaire')?.addEventListener('change', () => {
    const isUrgent = document.querySelector('[name="qq_safety"]:checked')?.value === 'danger';
    show('urgent-help-alert', isUrgent);
  });

  submit('form-questionnaire', () => {
    const formData = new FormData($('form-questionnaire'));
    const place = formData.get('qq_place') || 'patio';
    const branchLabel = t(value('q-branch') === 'testigo' ? 'q_branch_witness' : 'q_branch_victim');
    const causeLabel = $('q-cause')?.selectedOptions?.[0]?.textContent?.trim() || translateCause(value('q-cause'));

    uiState.lastReport = [
      t('q_rpt_branch', { value: branchLabel }),
      t('q_rpt_cause', { value: causeLabel }),
      t('q_rpt_mockery', { value: checkedLabel('qq_tea_burla', formData.get('qq_tea_burla')) }),
      t('q_rpt_place', { value: translatePlace(place) }),
      t('q_rpt_duration', { value: checkedLabel('qq_duration', formData.get('qq_duration')) }),
      t('q_rpt_freq', { value: checkedLabel('qq_frequency', formData.get('qq_frequency')) }),
      t('q_rpt_safety', { value: checkedLabel('qq_safety', formData.get('qq_safety')) }),
      value('q-situation-text'),
    ]
      .filter(Boolean)
      .join(' · ');

    const isAnon = formData.get('qq_delivery') === 'anonimo';
    const school = value('q-school');
    const isUrgent = formData.get('qq_safety') === 'danger';
    const code = addNotice(
      uiState.lastReport,
      place,
      'guidance_tutor',
      isAnon ? '' : school || '',
      {
        ...(isAnon ? { contextKey: 'q_anon_sender' } : school ? {} : { contextKey: 'q_default_sender' }),
        priority: isUrgent ? 'critica' : 'normal',
      }
    );

    message(t('q_sent_toast'));
    put('q-safe-confirm', `Cuestionario enviado. Código seguro: ${code}${isUrgent ? ' · Prioridad crítica' : ''}`);
    show('q-safe-confirm', true);
  });
}
