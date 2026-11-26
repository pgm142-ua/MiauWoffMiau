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
  feeling: 'Triste / Con miedo',
  cause: 'Social (exclusión o burlas)',
  place: 'Patio / Recreo',
};

export const uiState = {
  page: 'home',
  modal: '',
  opener: null,
  lastReport: '',
  filter: 'todos',
};

const defaultInbox = [
  {
    id: 'SAFE-104',
    text: 'Modo Adaptado · Triste / Con miedo · Social (exclusión o burlas)',
    place: 'Patio / Recreo',
    context: 'Alumno/a (Víctima)',
    recipient: 'Tutor/a del grupo',
    status: 'pendiente',
    date: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'SAFE-103',
    text: 'Aviso Anónimo por Voz: "En el cambio de clase varios compañeros han acorralado a un chico en el pasillo."',
    place: 'Pasillos / Baños',
    context: 'Testigo Anónimo',
    recipient: 'Orientación y Bienestar',
    status: 'pendiente',
    date: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'SAFE-101',
    text: 'Aviso Familia: No quiere ir al colegio por las mañanas y dice que en el recreo siempre está solo.',
    place: 'Patio / Recreo',
    context: 'Familia de Mateo (1.º ESO A)',
    recipient: 'Orientación y Bienestar',
    status: 'seguimiento',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
];

const defaultDiary = [
  {
    text: 'En el recreo no me dejaron jugar y se rieron cuando pregunté por qué.',
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 16),
    place: 'Patio / Recreo',
    level: '2',
  },
];

export const diary = read('diario') || defaultDiary;
export const inbox = read('panel') || defaultInbox;

export function updateTeacherBadge() {
  put('home-teacher-count', inbox.length);
}

export function addNotice(
  text,
  place = 'Patio / Recreo',
  recipient = 'Orientación y Bienestar',
  context = 'Anónimo'
) {
  const code = 'SAFE-' + Math.floor(200 + Math.random() * 799);
  inbox.unshift({
    id: code,
    text,
    place,
    context,
    recipient,
    status: 'pendiente',
    date: new Date().toISOString(),
  });
  save('panel', inbox);
  updateTeacherBadge();
  return code;
}
