/**
 * Módulo del Panel Receptor del Profesorado (bandeja, filtros y mapa de puntos calientes).
 */

import { $, all, node, on, put, stamp } from '../core/dom.js';
import { addNotice, inbox, uiState, updateTeacherBadge } from '../core/state.js';
import { save } from '../core/storage.js';
import { registerPageHook } from '../core/router.js';
import {
  getLocale,
  onLanguageChange,
  t,
  translatePlace,
  translateRecipient,
} from '../services/i18n.js';
import { message } from '../services/speech.js';

export function setTeacherFilter(nextFilter) {
  uiState.filter = nextFilter;
  drawInbox();
}

export function drawInbox() {
  const area = $('teacher-inbox-list');
  if (!area) return;
  area.replaceChildren();
  updateTeacherBadge();

  all('[data-teacher-filter]').forEach((btn) =>
    btn.setAttribute('aria-pressed', String(btn.dataset.teacherFilter === uiState.filter))
  );

  const rows = inbox.filter((item) => uiState.filter === 'todos' || item.status === uiState.filter);
  if (!rows.length) {
    area.append(node('p', t('tp_empty')));
  }

  const locale = getLocale();
  const statuses = [
    ['pendiente', t('tp_status_pending')],
    ['seguimiento', t('tp_status_tracking')],
    ['resuelto', t('tp_status_resolved')],
  ];

  for (const item of rows) {
    const recipientLabel = translateRecipient(item.recipient);
    const placeLabel = translatePlace(item.place);
    const senderLabel = item.contextKey ? t(item.contextKey) : item.context || t('tp_anon_sender');
    const bodyText = item.textKey ? t(item.textKey) : item.text;

    const card = node('article', '', 'record');
    const select = node('select', '', 'form-control');
    select.style.marginTop = '8px';
    select.setAttribute('aria-label', `${item.id || 'SAFE'} — ${placeLabel}`);
    for (const [val, label] of statuses) {
      select.add(new Option(label, val));
    }
    select.value = item.status;
    select.onchange = () => {
      item.status = select.value;
      save('panel', inbox);
      drawInbox();
    };

    card.append(
      node(
        'strong',
        t('tp_item_header', {
          id: item.id || 'SAFE',
          recipient: recipientLabel,
          date: stamp(item.date, locale),
        })
      ),
      node('small', t('tp_item_meta', { place: placeLabel, sender: senderLabel })),
      node('p', bodyText),
      select
    );
    area.append(card);
  }

  const counts = new Map();
  inbox.forEach((item) => {
    const placeLabel = translatePlace(item.place || 'patio');
    counts.set(placeLabel, (counts.get(placeLabel) || 0) + 1);
  });

  put(
    'teacher-hotspot-bars',
    [...counts].map(([place, count]) => t('tp_hotspot_entry', { place, count })).join('  |  ') ||
      t('tp_hotspot_empty')
  );
}

export function initTeacherPanel() {
  registerPageHook('teacher-panel', drawInbox);
  onLanguageChange(drawInbox);

  on('btn-teacher-seed-demo', () => {
    addNotice(t('tp_demo_notice'), 'patio', 'guidance', t('tp_demo_context'), {
      textKey: 'tp_demo_notice',
      contextKey: 'tp_demo_context',
    });
    drawInbox();
    message(t('tp_demo_toast'));
  });

  on('btn-teacher-clear-resolved', () => {
    const hasResolved = inbox.some((item) => item.status === 'resuelto');
    if (!hasResolved) return message(t('tp_no_resolved'));

    for (let i = inbox.length - 1; i >= 0; i--) {
      if (inbox[i].status === 'resuelto') inbox.splice(i, 1);
    }
    save('panel', inbox);
    drawInbox();
    message(t('tp_cleared_toast'));
  });

  drawInbox();
}
