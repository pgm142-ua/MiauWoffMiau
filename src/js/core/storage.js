/**
 * Almacenamiento con prefijo aislado. Por defecto, los datos duran una sesión.
 */

const PREFIX = 'contigo.';

function getStorage(persistent) {
  return persistent ? localStorage : sessionStorage;
}

export function read(key, { persistent = false } = {}) {
  try {
    return JSON.parse(getStorage(persistent).getItem(PREFIX + key) || 'null');
  } catch {
    return null;
  }
}

export function save(key, data, { persistent = false } = {}) {
  try {
    getStorage(persistent).setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    // Silenciar errores de cuota o modo privado estricto
  }
}

export function remove(key, { persistent = false } = {}) {
  try {
    getStorage(persistent).removeItem(PREFIX + key);
  } catch {
    // El navegador puede bloquear el almacenamiento.
  }
}
