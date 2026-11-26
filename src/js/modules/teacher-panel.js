/**
 * Módulo del Panel Receptor del Profesorado (bandeja, filtros y mapa de puntos calientes).
 */

import { $, all, node, on, put, stamp } from '../core/dom.js';
import { addNotice, inbox, uiState, updateTeacherBadge } from '../core/state.js';
import { save } from '../core/storage.js';
import { registerPageHook } from '../core/router.js';
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
    area.append(node('p', 'No hay avisos en este filtro.'));
  }

  for (const item of rows) {
    const card = node('article', '', 'record');
    const select = node('select', '', 'form-control');
    select.style.marginTop = '8px';
    const statuses = [
      ['pendiente', '🔴 Pendiente de atender'],
      ['seguimiento', '🟡 En seguimiento'],
      ['resuelto', '🟢 Resuelto'],
    ];
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
      node('strong', `[${item.id || 'SAFE'}] Para: ${item.recipient} · ${stamp(item.date)}`),
      node('small', `📍 Lugar: ${item.place || 'Patio / Recreo'} · Remitente: ${item.context || 'Anónimo'}`),
      node('p', item.text),
      select
    );
    area.append(card);
  }

  const counts = new Map();
  inbox.forEach((item) => {
    const place = item.place || 'Patio / Recreo';
    counts.set(place, (counts.get(place) || 0) + 1);
  });

  put(
    'teacher-hotspot-bars',
    [...counts].map(([place, total]) => `${place}: ${total} aviso(s)`).join('  |  ') ||
      'Sin avisos registrados.'
  );
}

export function initTeacherPanel() {
  registerPageHook('teacher-panel', drawInbox);

  on('btn-teacher-seed-demo', () => {
    addNotice(
      'Ejemplo en directo: Alumno con TEA solicita apoyo en el recreo por aislamiento.',
      'Patio / Recreo',
      'Orientación y Bienestar',
      'Modo Adaptado'
    );
    drawInbox();
    message('Aviso de ejemplo añadido.');
  });

  on('btn-teacher-clear-resolved', () => {
    const hasResolved = inbox.some((item) => item.status === 'resuelto');
    if (!hasResolved) return message('No hay avisos marcados como resueltos.');

    for (let i = inbox.length - 1; i >= 0; i--) {
      if (inbox[i].status === 'resuelto') inbox.splice(i, 1);
    }
    save('panel', inbox);
    drawInbox();
    message('Avisos resueltos eliminados.');
  });

  drawInbox();
}
