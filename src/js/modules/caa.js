/**
 * Módulo del Tablero CAA («Voz Prestada») con pictogramas.
 */

import { $, on, put, show } from '../core/dom.js';
import { addNotice, words } from '../core/state.js';
import { go } from '../core/router.js';
import { message, say } from '../services/speech.js';

export function drawWords() {
  put('caa-sentence-chips', words.join(' · ') || 'Toca un dibujo abajo...');
  put('caa-sentence-text', words.join(' '));
  show('caa-sent-feedback', false);
}

export function addCaaWord(word) {
  words.push(word);
  drawWords();
  say(word);
}

export function initCaa() {
  on('btn-caa-backspace', () => {
    words.pop();
    drawWords();
  });

  on('btn-caa-clear', () => {
    words.length = 0;
    drawWords();
  });

  on('btn-caa-speak', () => {
    if (words.length) {
      say(words.join(' '));
    } else {
      message('Toca primero un pictograma.');
    }
  });

  on('btn-caa-use-chat', () => {
    if (!words.length) return message('Toca primero un pictograma.');
    const chatInput = $('chat-input');
    if (chatInput) chatInput.value = words.join(' ');
    go('no-adapted');
  });

  on('btn-caa-send-teacher', () => {
    if (!words.length) return message('Toca primero un pictograma.');
    const code = addNotice('Tablero CAA: ' + words.join(' '), 'Patio / Recreo', 'Docente', 'Pictogramas CAA');
    put('caa-sent-feedback', '✅ Enviado al profesor con código ' + code);
    show('caa-sent-feedback', true);
    say('Enviado al profesor');
  });

  drawWords();
}
