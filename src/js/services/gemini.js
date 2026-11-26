/**
 * Servicio de IA conversacional (Google Gemini opcional + motor empático local offline).
 */

import { $ } from '../core/dom.js';
import { read, save } from '../core/storage.js';
import { t } from './i18n.js';

let config = read('gemini') || { key: '', model: 'gemini-2.5-flash' };
let conversation = [];
let controller = null;

const PATIO_RE =
  /recreo|patio|solo|dejan|esbarjo|pati|recess|playground|alone|r[eé]cr[eé]|cour|seul|pause|hof|allein|p[aá]tio|sozinho|استراحة|ساحة|وحده|وحدي/i;
const HALLWAY_RE =
  /pasillo|baño|cambio|passad[ií]s|banys|hallway|restroom|corridor|couloir|toilette|flur|wechsel|corredor|ممر|ممرات|تبديل/i;
const CALM_RE =
  /calma|miedo|nervio|bloque|por|bloq|calm|scared|afraid|fear|peur|effray|angst|ruhig|medo|خوف|خائف|هدوء|أهدأ|تجم/i;

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
  if (PATIO_RE.test(text)) {
    const placeEl = $('anon-place');
    if (placeEl) placeEl.value = 'patio';
    return t('chat_offline_patio');
  }
  if (HALLWAY_RE.test(text)) {
    const placeEl = $('anon-place');
    if (placeEl) placeEl.value = 'hallways';
    return t('chat_offline_hallway');
  }
  if (CALM_RE.test(text)) {
    return t('chat_offline_calm');
  }
  return t('chat_offline_default');
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
        systemInstruction: { parts: [{ text: t('gemini_system_prompt') }] },
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
  return callGeminiApi(key, modelName, [{ role: 'user', parts: [{ text: t('gemini_test_ping') }] }]);
}
