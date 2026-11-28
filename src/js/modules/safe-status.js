import { $, put, show, submit, value } from '../core/dom.js';
import { inbox } from '../core/state.js';
import { t } from '../services/i18n.js';

export function initSafeStatus() {
  submit('form-safe-status', async () => {
    const code = value('safe-status-code').trim().toUpperCase();
    if (!/^SAFE-\d{3,6}$/.test(code)) {
      put('safe-status-result', 'No reconocemos ese código. Comprueba las letras SAFE y los números.');
      show('safe-status-result', true);
      return;
    }

    let result = null;
    try {
      const response = await fetch('/api/reports?id=' + encodeURIComponent(code), {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) result = await response.json();
    } catch {
      result = null;
    }

    const local = inbox.find((item) => item.id === code);
    const report = result || (local ? {
      id: local.id,
      status: local.status,
      priority: local.priority,
      date: local.date,
    } : null);

    if (!report) {
      put('safe-status-result', 'No existe ningún aviso con ese código en esta sesión.');
    } else {
      const statusLabel = {
        pendiente: 'Pendiente',
        seguimiento: 'En seguimiento',
        resuelto: 'Resuelto',
      }[report.status] || 'Pendiente';
      put(
        'safe-status-result',
        `${report.id}: ${statusLabel}${report.priority === 'critica' ? ' · Atención crítica' : ''}`
      );
    }
    show('safe-status-result', true);
  });
}
