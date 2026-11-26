/**
 * Utilidades de manipulación del DOM y formato de fechas.
 */

export const $ = (id) => document.getElementById(id);

export const all = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

export const show = (id, yes = true) => {
  const el = $(id);
  if (el) el.classList.toggle('hidden', !yes);
};

export const value = (id) => ($(id)?.value || '').trim();

export const put = (id, text) => {
  const el = $(id);
  if (el) el.textContent = text;
};

export const visible = (el) => Boolean(el && el.getClientRects().length);

export const on = (id, fn) => $(id)?.addEventListener('click', fn);

export const submit = (id, fn) => {
  $(id)?.addEventListener('submit', (e) => {
    e.preventDefault();
    fn(e);
  });
};

export const node = (tag, text, cls = '') => {
  const el = document.createElement(tag);
  el.textContent = text;
  if (cls) el.className = cls;
  return el;
};

export const stamp = (isoDate) =>
  new Date(isoDate).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export function localDate() {
  const now = new Date();
  return new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
