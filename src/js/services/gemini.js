/**
 * Servicio de IA conversacional (Google Gemini opcional + motor empático local offline).
 */

import { $ } from '../core/dom.js';
import { read, save } from '../core/storage.js';

let config = read('gemini') || { key: '', model: 'gemini-2.5-flash' };
let conversation = [];
let controller = null;

const SYSTEM_PROMPT =
  'Eres un asistente escolar empático y breve para prevención del acoso escolar en alumnado con TEA. Responde en 2 frases sencillas y claras.';

export function getGeminiConfig() {
  return config;
}

export function setGeminiConfig(nextConfig, remember = false) {
  config = nextConfig;
  save('gemini', remember ? config : null);
}

export function clearGeminiConfig() {
  config.key = '';
  save('gemini', null);
}

export function abortGemini() {
  controller?.abort();
}

export function offlineReply(text) {
  if (/recreo|patio|solo|dejan/i.test(text)) {
    const placeEl = $('anon-place');
    if (placeEl) placeEl.value = 'Patio / Recreo';
    return 'Te entiendo. El recreo es donde más cuesta que los profesores lo vean. He marcado "Patio / Recreo" abajo. Pulsa el botón «📨 Enviar aviso 100% anónimo al profesor» para que vigilen el patio sin decir tu nombre.';
  }
  if (/pasillo|baño|cambio/i.test(text)) {
    const placeEl = $('anon-place');
    if (placeEl) placeEl.value = 'Pasillos / Baños';
    return 'He anotado que ocurre en los pasillos o cambios de clase. No tienes la culpa de lo que pasa. Puedes enviarlo de forma anónima justo aquí debajo.';
  }
  if (/calma|miedo|nervio|bloque/i.test(text)) {
    return 'Respira despacio, aquí estás a salvo. Puedes pulsar el botón verde «🌿 Calma» de arriba en cualquier momento o enviar el aviso anónimo a orientación.';
  }
  return 'Gracias por contármelo. He copiado tu mensaje en el buzón anónimo de abajo. Pulsa «📨 Enviar aviso 100% anónimo al profesor» cuando quieras.';
}

async function callGeminiApi(key, modelName, contents, signal) {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' +
      encodeURIComponent(modelName) +
      ':generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    }
  );
  if (!res.ok) throw Error('Error ' + res.status);
  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim() || offlineReply('')
  );
}

export async function askGemini(userMessage) {
  if (!config.key) {
    return offlineReply(userMessage);
  }
  const turn = { role: 'user', parts: [{ text: userMessage }] };
  controller = new AbortController();
  try {
    const reply = await callGeminiApi(
      config.key,
      config.model,
      [...conversation.slice(-6), turn],
      controller.signal
    );
    conversation.push(turn, { role: 'model', parts: [{ text: reply }] });
    return reply;
  } catch {
    return offlineReply(userMessage);
  }
}

export async function testGeminiConnection(key, modelName) {
  return callGeminiApi(key, modelName, [{ role: 'user', parts: [{ text: 'Hola' }] }]);
}
