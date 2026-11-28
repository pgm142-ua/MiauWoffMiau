/**
 * Estado global de la sesión, historial de pantallas y colecciones de datos.
 */

import { put } from './dom.js';
import { read, save } from './storage.js';

export const pages = [];
export const words = [];

export const state = {
  role: 'alumno',
  mode: 'adaptado',
  branch: 'victima',
  feeling: 'sad',
  cause: 'social',
  place: 'patio',
};

export const uiState = {
  page: 'home',
  modal: '',
  opener: null,
  lastReport: '',
  filter: 'todos',
};

export const guidedReport = {
  sensations: [],
  routine: '',
  scenes: {},
};

const defaultInbox = [
  {
    id: 'SAFE-104',
    textKey: 'tp_seed_1_text',
    text: 'Modo Adaptado · Triste / Con miedo · Social (exclusión o burlas)',
    place: 'patio',
    contextKey: 'tp_seed_1_ctx',
    context: 'Alumno/a (Víctima)',
    recipient: 'tutor',
    status: 'pendiente',
    date: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'SAFE-103',
    textKey: 'tp_seed_2_text',
    text: 'Aviso Anónimo por Voz: "En el cambio de clase varios compañeros han acorralado a un chico en el pasillo."',
    place: 'hallways',
    contextKey: 'tp_seed_2_ctx',
    context: 'Testigo Anónimo',
    recipient: 'guidance',
    status: 'pendiente',
    date: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'SAFE-101',
    textKey: 'tp_seed_3_text',
    text: 'Aviso Familia: No quiere ir al colegio por las mañanas y dice que en el recreo siempre está solo.',
    place: 'patio',
    contextKey: 'tp_seed_3_ctx',
    context: 'Familia de Mateo (1.º ESO A)',
    recipient: 'guidance',
    status: 'seguimiento',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
];

const defaultDiary = [
  {
    textKey: 'diary_seed_1',
    text: 'En el recreo no me dejaron jugar y se rieron cuando pregunté por qué.',
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 16),
    place: 'patio',
    level: '2',
  },
];

export const diary = (read('diario') || defaultDiary).filter((item) => {
  const age = Date.now() - new Date(item.date).getTime();
  return !Number.isFinite(age) || age < 30 * 24 * 60 * 60 * 1000;
});
export const inbox = (read('panel') || defaultInbox).filter((item) => {
  const age = Date.now() - new Date(item.date).getTime();
  return !Number.isFinite(age) || age < 30 * 24 * 60 * 60 * 1000;
});

save('diario', diary);
save('panel', inbox);

let reportApiAvailable = null;

async function syncReportToServer(item) {
  if (reportApiAvailable === false) return;
  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(item),
    });
    reportApiAvailable = response.ok;
  } catch {
    reportApiAvailable = false;
  }
}

export function updateTeacherBadge() {
  put('home-teacher-count', inbox.length);
}

export function addNotice(
  text,
  place = 'patio',
  recipient = 'guidance',
  context = '',
  extra = {}
) {
  const code = 'SAFE-' + Math.floor(200 + Math.random() * 799);
  inbox.unshift({
    id: code,
    text,
    place,
    context,
    recipient,
    status: 'pendiente',
    priority: extra.priority || 'normal',
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'pendiente', date: new Date().toISOString(), note: 'Aviso recibido' },
    ],
    date: new Date().toISOString(),
    ...extra,
  });
  save('panel', inbox);
  updateTeacherBadge();
  syncReportToServer(inbox[0]);
  return code;
}
