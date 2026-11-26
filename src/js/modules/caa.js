/**
 * Módulo del Tablero CAA («Voz Prestada») con pictogramas.
 */

import { $, all, on, put, show } from '../core/dom.js';
import { addNotice, words } from '../core/state.js';
import { go } from '../core/router.js';
import { message, say } from '../services/speech.js';

const TONE_CLASSES = ['tone-y', 'tone-g', 'tone-b', 'tone-o', 'tone-p'];
const SHORT_TONES = new Set(['y', 'g', 'b', 'o', 'p']);
const wordMeta = [];

function normalizeTone(rawTone, el) {
  if (rawTone) {
    if (SHORT_TONES.has(rawTone)) return `tone-${rawTone}`;
    return rawTone;
  }
  return TONE_CLASSES.find((cls) => el.classList.contains(cls)) || '';
}

function getWordMeta(word) {
  const btn = all('[data-caa]').find((el) => el.dataset.caa === word);
  if (!btn) return { word, img: '', tone: '' };

  const img = btn.dataset.caaImg || btn.querySelector('img')?.getAttribute('src') || '';
  const tone = normalizeTone(btn.dataset.caaTone, btn);
  return { word, img, tone };
}

function selectCaaTab(activeCategory) {
  all('[data-caa-tab]').forEach((tab) => {
    const isActive = tab.dataset.caaTab === activeCategory;
    tab.classList.toggle('on', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
    tab.setAttribute('aria-selected', String(isActive));
  });

  all('.caa-tile').forEach((tile) => {
    const cat = tile.dataset.caaCat || '';
    const isVisible =
      activeCategory === 'todos' || cat.split(/\s+/).filter(Boolean).includes(activeCategory);
    tile.classList.toggle('hidden', !isVisible);
  });
}

export function drawWords() {
  const container = $('caa-sentence-chips');
  if (container) {
    container.replaceChildren();

    if (!words.length) {
      const placeholder = document.createElement('span');
      placeholder.className = 'caa-placeholder';
      placeholder.textContent = 'Toca un dibujo abajo...';
      container.appendChild(placeholder);
    } else {
      words.forEach((word, index) => {
        const meta = wordMeta[index]?.word === word ? wordMeta[index] : getWordMeta(word);
        const chip = document.createElement('span');
        chip.className = meta.tone ? `caa-word ${meta.tone}` : 'caa-word';

        if (meta.img) {
          const img = document.createElement('img');
          img.src = meta.img;
          img.alt = '';
          chip.appendChild(img);
        }

        chip.appendChild(document.createTextNode(word));

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'caa-word-del';
        delBtn.setAttribute('aria-label', `Eliminar ${word}`);
        delBtn.title = 'Eliminar';
        delBtn.textContent = '×';
        delBtn.addEventListener('click', () => {
          words.splice(index, 1);
          wordMeta.splice(index, 1);
          drawWords();
        });
        chip.appendChild(delBtn);

        container.appendChild(chip);
      });
    }
  }

  put('caa-sentence-text', words.join(' '));
  show('caa-sent-feedback', false);
}

export function addCaaWord(word) {
  if (!word) return;
  words.push(word);
  wordMeta.push(getWordMeta(word));
  drawWords();
  say(word);
}

export function initCaa() {
  const tabs = all('[data-caa-tab]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectCaaTab(tab.dataset.caaTab || 'todos');
    });
  });

  const activeTab = tabs.find(
    (tab) =>
      tab.classList.contains('on') ||
      tab.getAttribute('aria-pressed') === 'true' ||
      tab.getAttribute('aria-selected') === 'true'
  );
  selectCaaTab(activeTab?.dataset.caaTab || 'todos');

  on('btn-caa-clear', () => {
    words.length = 0;
    wordMeta.length = 0;
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
