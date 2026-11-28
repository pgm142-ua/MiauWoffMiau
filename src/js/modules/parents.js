/**
 * Módulo del Espacio Familias (detección temprana desde casa).
 */

import { $, all, put, show, submit, value } from '../core/dom.js';
import { addNotice, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { t } from '../services/i18n.js';
import { message } from '../services/speech.js';

export function initParents() {
  submit('form-parents', () => {
    const signals = all('.parent-signal-btn[aria-pressed="true"]').map((btn) => btn.dataset.signal);
    const child = value('parent-child-name') || t('par_default_child');
    const note = value('parent-note');
    const fullText = [...signals, note].filter(Boolean).join(' · ') || t('par_default_note');

    uiState.lastReport = t('par_report_prefix', { child, text: fullText });
    const place = $('parent-place')?.value || 'patio';
    const recipient = $('parent-recipient')?.value || 'guidance';
    const code = addNotice(
      uiState.lastReport,
      place,
      recipient,
      t('par_context_fmt', { child })
    );
    message(t('par_sent_toast'));
    put('last-family-safe-code', code);
    show('family-safe-confirm', true);
  });
}
