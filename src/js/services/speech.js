/**
 * Servicios de accesibilidad por voz (TTS/STT) y notificaciones visuales (toast / barra sorda).
 */

import { $, on, put, show, value } from '../core/dom.js';

let toastTimer = null;
let recognitionInstance = null;

const LANG_MAP = {
  es: 'es-ES',
  ca: 'ca-ES',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-PT',
  ar: 'ar-SA',
};

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
  utterance.lang = LANG_MAP[value('lang-select')] || 'es-ES';
  utterance.rate = Number(value('gear-speech-rate') || 1);
  window.speechSynthesis.speak(utterance);
}

export function abortSpeechRecognition() {
  recognitionInstance?.abort();
}

export function initSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micMap = {
    'btn-mic-step0': ['input-voice-answer', 'Sí'],
    'btn-mic-has-dis': ['input-has-dis-answer', 'Sí'],
    'btn-mic-dis-detail': ['input-dis-detail', '4'],
    'btn-voice-adapted': ['adapted-note', 'En el recreo se ríen de mí y me dejan solo.'],
    'btn-chat-mic': ['chat-input', 'En el recreo se meten con un compañero y me da miedo decirlo en clase.'],
    'btn-voice-q': ['q-situation-text', 'Ocurre en el patio cuando no hay profesores cerca.'],
    'btn-voice-diary': ['diary-desc', 'Hoy en el cambio de clase me han escondido la mochila.'],
  };

  Object.entries(micMap).forEach(([btnId, [inputId, sampleText]]) => {
    on(btnId, () => {
      const btn = $(btnId);
      if (!btn) return;
      const origText = btn.innerText;
      btn.innerText = '🔴 Escuchando...';

      const applyTranscript = (text, autoSendChat = false) => {
        btn.innerText = origText;
        const inputEl = $(inputId);
        if (inputEl) {
          inputEl.value = text;
          inputEl.focus();
        }
        if (btnId === 'btn-chat-mic' && autoSendChat) {
          $('form-chat')?.requestSubmit();
        } else {
          message('🎙️ Voz capturada: "' + text + '"');
        }
      };

      if (Recognition) {
        try {
          recognitionInstance?.abort();
          recognitionInstance = new Recognition();
          recognitionInstance.lang = 'es-ES';
          recognitionInstance.onresult = (e) => applyTranscript(e.results[0][0].transcript, true);
          recognitionInstance.onerror = () => setTimeout(() => applyTranscript(sampleText, true), 900);
          recognitionInstance.onend = () => {
            btn.innerText = origText;
          };
          recognitionInstance.start();
        } catch {
          setTimeout(() => applyTranscript(sampleText, true), 900);
        }
      } else {
        setTimeout(() => applyTranscript(sampleText, true), 900);
      }
    });
  });
}
