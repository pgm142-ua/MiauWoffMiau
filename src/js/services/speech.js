/**
 * Servicios de accesibilidad por voz (TTS/STT) y notificaciones visuales (toast / barra sorda).
 */

import { $, on, put, show, value } from '../core/dom.js';
import { getLocale, t } from './i18n.js';

let toastTimer = null;
let recognitionInstance = null;

export function message(text) {
  put('toast', text);
  show('toast', true);
  if ($('gear-deaf-mode')?.checked) {
    put('visual-alert-strip', '🔔 ' + text);
    show('visual-alert-strip', true);
  }
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    show('toast', false);
    show('visual-alert-strip', false);
  }, 3600);
}

export function say(text) {
  if ($('gear-deaf-mode')?.checked) {
    message(text);
    return;
  }
  if (!window.speechSynthesis) {
    message(text);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLocale();
  utterance.rate = Number(value('gear-speech-rate') || 1);
  window.speechSynthesis.speak(utterance);
}

export function abortSpeechRecognition() {
  recognitionInstance?.abort();
}

function getButtonLabelElement(btn) {
  const span = btn.querySelector('span[data-i18n], span:not([aria-hidden="true"])');
  return span || btn;
}

export function initSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micMap = {
    'btn-mic-step0': ['input-voice-answer', 'mic_sample_step0'],
    'btn-mic-has-dis': ['input-has-dis-answer', 'mic_sample_has_dis'],
    'btn-mic-dis-detail': ['input-dis-detail', 'mic_sample_dis_detail'],
    'btn-voice-adapted': ['adapted-note', 'mic_sample_adapted'],
    'btn-chat-mic': ['chat-input', 'mic_sample_chat'],
    'btn-voice-q': ['q-situation-text', 'mic_sample_q'],
    'btn-voice-diary': ['diary-desc', 'mic_sample_diary'],
  };

  Object.entries(micMap).forEach(([btnId, [inputId, sampleKey]]) => {
    on(btnId, () => {
      const btn = $(btnId);
      if (!btn) return;
      const labelEl = getButtonLabelElement(btn);
      const origText = labelEl.textContent;
      const restoreLabel = () => {
        const key = labelEl.dataset?.i18n;
        labelEl.textContent = key ? t(key) : origText;
      };
      labelEl.textContent = t('mic_listening');

      const applyTranscript = (text, autoSendChat = false) => {
        restoreLabel();
        const inputEl = $(inputId);
        if (inputEl) {
          inputEl.value = text;
          inputEl.focus();
        }
        if (btnId === 'btn-chat-mic' && autoSendChat) {
          $('form-chat')?.requestSubmit();
        } else {
          message(t('mic_captured', { text }));
        }
      };

      if (Recognition) {
        try {
          recognitionInstance?.abort();
          recognitionInstance = new Recognition();
          recognitionInstance.lang = getLocale();
          recognitionInstance.onresult = (e) => applyTranscript(e.results[0][0].transcript, true);
          recognitionInstance.onerror = () => setTimeout(() => applyTranscript(t(sampleKey), true), 900);
          recognitionInstance.onend = restoreLabel;
          recognitionInstance.start();
        } catch {
          setTimeout(() => applyTranscript(t(sampleKey), true), 900);
        }
      } else {
        setTimeout(() => applyTranscript(t(sampleKey), true), 900);
      }
    });
  });
}
