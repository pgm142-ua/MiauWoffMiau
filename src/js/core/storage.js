/**
 * Persistencia local por sesión (sessionStorage) con prefijo aislado.
 * Diseñado para respetar la privacidad del alumnado al cerrar la pestaña.
 */

const PREFIX = 'contigo.';

export function read(key) {
  try {
    return JSON.parse(sessionStorage.getItem(PREFIX + key) || 'null');
  } catch {
    return null;
  }
}

export function save(key, data) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    // Silenciar errores de cuota o modo privado estricto
  }
}
