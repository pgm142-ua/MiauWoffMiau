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
import { onLanguageChange, t } from '../services/i18n.js';
import { message, say } from '../services/speech.js';

let autoTts = true;
let lastAnonCode = '';

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
  const welcome = t(state.branch === 'testigo' ? 'chat_welcome_witness' : 'chat_welcome_victim');
  appendChatLine(welcome, false);
}

export function syncChat() {
  const config = getGeminiConfig();
  put('gemini-status-pill', t(config.key ? 'chat_status_gemini' : 'chat_status_local'));
}

function syncBotVoiceButton() {
  put('btn-toggle-auto-tts', t(autoTts ? 'chat_bot_voice_on' : 'chat_bot_voice_off'));
}

function syncKeyVisibilityButton() {
  const keyInput = $('gemini-api-key');
  if (!keyInput) return;
  put('btn-toggle-key-visibility', t(keyInput.type === 'text' ? 'api_hide' : 'api_show'));
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
    syncBotVoiceButton();
    if (!autoTts) window.speechSynthesis?.cancel();
  });

  // Panel de envío anónimo
  on('btn-open-anon-panel', () => show('anon-panel', !visible($('anon-panel'))));

  on('btn-submit-anon', () => {
    const chatLines = all('#chat-messages .bubble.own')
      .map((bubble) => bubble.textContent)
      .join(' | ');
    const text = value('anon-extra') || chatLines || t('chat_anon_default');
    const place = value('anon-place') || 'patio';
    const recipient = value('anon-recipient') || 'guidance';
    const code = addNotice(text, place, recipient, '', { contextKey: 'chat_anon_context' });
    lastAnonCode = code;

    put('anon-confirm-msg', t('chat_anon_confirm', { code }));
    show('anon-confirm-msg', true);
    if ($('anon-extra')) $('anon-extra').value = '';
    say(t('chat_anon_spoken'));
  });

  // Modal API Gemini
  $('gemini-model-select')?.addEventListener('change', () => {
    show('custom-model-group', value('gemini-model-select') === 'custom');
  });

  on('btn-toggle-key-visibility', () => {
    const keyInput = $('gemini-api-key');
    if (!keyInput) return;
    keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    syncKeyVisibilityButton();
  });

  on('btn-test-api-key', async () => {
    if (!value('gemini-api-key')) return setApiFeedback(t('api_err_nokey'));
    setApiFeedback(t('api_testing'));
    try {
      await testGeminiConnection(value('gemini-api-key'), currentModel());
      setApiFeedback(t('api_ok'));
    } catch (err) {
      setApiFeedback(t('api_err_conn', { error: err.message }));
    }
  });

  on('btn-save-api-key', () => {
    setGeminiConfig(
      { key: value('gemini-api-key'), model: currentModel() },
      Boolean($('gemini-remember-key')?.checked)
    );
    syncChat();
    closeModal();
    message(t('api_saved'));
  });

  on('btn-clear-api-key', () => {
    clearGeminiConfig();
    if ($('gemini-api-key')) $('gemini-api-key').value = '';
    syncChat();
    setApiFeedback(t('api_cleared'));
  });

  onLanguageChange(() => {
    syncChat();
    syncBotVoiceButton();
    syncKeyVisibilityButton();

    const box = $('chat-messages');
    if (box?.children.length && !box.querySelector('.bubble.own')) {
      initChatWelcome();
    }

    if (lastAnonCode && $('anon-confirm-msg') && !$('anon-confirm-msg').classList.contains('hidden')) {
      put('anon-confirm-msg', t('chat_anon_confirm', { code: lastAnonCode }));
    }
  });

  syncChat();
  syncBotVoiceButton();
}
