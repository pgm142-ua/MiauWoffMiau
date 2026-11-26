/**
 * Módulo de Modo No Adaptado: Chatbot con voz, envío anónimo y configuración de API Gemini.
 */

import { $, all, node, on, put, show, submit, value, visible } from '../core/dom.js';
import { addNotice, state } from '../core/state.js';
import { closeModal, registerPageHook } from '../core/router.js';
import {
  askGemini,
  clearGeminiConfig,
  getGeminiConfig,
  setGeminiConfig,
  testGeminiConnection,
} from '../services/gemini.js';
import { message, say } from '../services/speech.js';

let autoTts = true;

function appendChatLine(text, own = false) {
  const box = $('chat-messages');
  if (!box) return;
  box.append(node('p', text, 'bubble' + (own ? ' own' : '')));
  box.scrollTop = box.scrollHeight;
}

export function initChatWelcome() {
  const box = $('chat-messages');
  if (!box) return;
  box.replaceChildren();
  const welcome =
    state.branch === 'testigo'
      ? '¡Hola! 👋 Gracias por ayudar a un compañero. Este chat es 100% anónimo. Pulsa «🎙️ Hablar por voz» o escribe qué has visto.'
      : '¡Hola! 👋 Estás en un espacio seguro y 100% anónimo. Pulsa «🎙️ Hablar por voz» o escribe qué te ha pasado.';
  appendChatLine(welcome, false);
}

export function syncChat() {
  const config = getGeminiConfig();
  put('gemini-status-pill', config.key ? '✨ IA Gemini activa' : '🔒 Modo Anónimo Local');
}

function setApiFeedback(text) {
  put('api-test-result', text);
  show('api-test-result', true);
}

function currentModel() {
  return value('gemini-model-select') === 'custom'
    ? value('gemini-custom-model')
    : value('gemini-model-select');
}

export function initChat() {
  registerPageHook('no-adapted', () => {
    if (!$('chat-messages')?.children.length) {
      initChatWelcome();
    }
  });

  submit('form-chat', async () => {
    const text = value('chat-input');
    if (!text) return;
    if ($('chat-input')) $('chat-input').value = '';
    if ($('anon-extra')) $('anon-extra').value = text;
    appendChatLine(text, true);

    const reply = await askGemini(text);
    appendChatLine(reply, false);
    if (autoTts && !$('gear-deaf-mode')?.checked) {
      say(reply);
    }
  });

  on('btn-toggle-auto-tts', () => {
    autoTts = !autoTts;
    $('btn-toggle-auto-tts')?.setAttribute('aria-pressed', String(autoTts));
    put('btn-toggle-auto-tts', '🔊 Voz bot: ' + (autoTts ? 'Sí' : 'No'));
    if (!autoTts) window.speechSynthesis?.cancel();
  });

  // Panel de envío anónimo
  on('btn-open-anon-panel', () => show('anon-panel', !visible($('anon-panel'))));

  on('btn-submit-anon', () => {
    const chatLines = all('#chat-messages .bubble.own')
      .map((bubble) => bubble.textContent)
      .join(' | ');
    const text = value('anon-extra') || chatLines || 'Aviso anónimo enviado desde el asistente de voz.';
    const place = value('anon-place') || 'Patio / Recreo';
    const recipient = value('anon-recipient') || 'Orientación y Bienestar';
    const code = addNotice(text, place, recipient, '100% Anónimo (Modo No Adaptado)');

    put('anon-confirm-msg', `✅ ¡Aviso anónimo enviado al profesorado! Código de seguimiento: ${code}`);
    show('anon-confirm-msg', true);
    if ($('anon-extra')) $('anon-extra').value = '';
    say('Aviso anónimo enviado correctamente.');
  });

  // Modal API Gemini
  $('gemini-model-select')?.addEventListener('change', () => {
    show('custom-model-group', value('gemini-model-select') === 'custom');
  });

  on('btn-toggle-key-visibility', () => {
    const keyInput = $('gemini-api-key');
    if (!keyInput) return;
    keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    put('btn-toggle-key-visibility', keyInput.type === 'text' ? 'Ocultar' : 'Mostrar');
  });

  on('btn-test-api-key', async () => {
    if (!value('gemini-api-key')) return setApiFeedback('Introduce una clave primero.');
    setApiFeedback('Probando conexión...');
    try {
      await testGeminiConnection(value('gemini-api-key'), currentModel());
      setApiFeedback('✅ Conexión correcta con Gemini.');
    } catch (err) {
      setApiFeedback('No se pudo conectar: ' + err.message);
    }
  });

  on('btn-save-api-key', () => {
    setGeminiConfig(
      { key: value('gemini-api-key'), model: currentModel() },
      Boolean($('gemini-remember-key')?.checked)
    );
    syncChat();
    closeModal();
    message('Configuración guardada.');
  });

  on('btn-clear-api-key', () => {
    clearGeminiConfig();
    if ($('gemini-api-key')) $('gemini-api-key').value = '';
    syncChat();
    setApiFeedback('Clave eliminada. Usando modo local.');
  });

  syncChat();
}
