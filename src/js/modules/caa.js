/**
 * Módulo del Tablero CAA («Voz Prestada») con pictogramas.
 */

import { $, all, on, put, show } from '../core/dom.js';
import { addNotice, words } from '../core/state.js';
import { go } from '../core/router.js';
import { onLanguageChange, t } from '../services/i18n.js';
import { message, say } from '../services/speech.js';

const TONE_CLASSES = ['tone-y', 'tone-g', 'tone-b', 'tone-o', 'tone-p'];
const SHORT_TONES = new Set(['y', 'g', 'b', 'o', 'p']);
const wordMeta = [];
let lastSentCode = '';

function normalizeTone(rawTone, el) {
  if (rawTone) {
    if (SHORT_TONES.has(rawTone)) return `tone-${rawTone}`;
    return rawTone;
  }
  return TONE_CLASSES.find((cls) => el.classList.contains(cls)) || '';
}

function getWordMeta(idOrWord) {
  const btn = all('[data-caa-id], [data-caa]').find(
    (el) => el.dataset.caaId === idOrWord || el.dataset.caa === idOrWord
  );
  if (!btn) return { id: '', word: idOrWord, img: '', tone: '' };

  const id = btn.dataset.caaId || '';
  const word = id ? t('caa_say_' + id) : btn.dataset.caa || idOrWord;
  const img = btn.dataset.caaImg || btn.querySelector('img')?.getAttribute('src') || '';
  const tone = normalizeTone(btn.dataset.caaTone, btn);
  return { id, word, img, tone };
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
      placeholder.textContent = t('caa_placeholder');
      container.appendChild(placeholder);
    } else {
      words.forEach((word, index) => {
        const meta = wordMeta[index] || getWordMeta(word);
        const resolvedWord = meta.id ? t('caa_say_' + meta.id) : word;
        words[index] = resolvedWord;
        meta.word = resolvedWord;

        const chip = document.createElement('span');
        chip.className = meta.tone ? `caa-word ${meta.tone}` : 'caa-word';

        if (meta.img) {
          const img = document.createElement('img');
          img.src = meta.img;
          img.alt = '';
          chip.appendChild(img);
        }

        chip.appendChild(document.createTextNode(resolvedWord));

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'caa-word-del';
        delBtn.setAttribute('aria-label', t('caa_del_aria', { word: resolvedWord }));
        delBtn.title = t('delete');
        delBtn.textContent = '×';
        delBtn.addEventListener('click', () => {
          words.splice(index, 1);
          wordMeta.splice(index, 1);
          lastSentCode = '';
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

export function addCaaWord(idOrWord) {
  if (!idOrWord) return;
  const meta = getWordMeta(idOrWord);
  words.push(meta.word);
  wordMeta.push(meta);
  lastSentCode = '';
  drawWords();
  say(meta.word);
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
    lastSentCode = '';
    drawWords();
  });

  on('btn-caa-speak', () => {
    if (words.length) {
      say(words.join(' '));
    } else {
      message(t('caa_empty_toast'));
    }
  });

  on('btn-caa-use-chat', () => {
    if (!words.length) return message(t('caa_empty_toast'));
    const chatInput = $('chat-input');
    if (chatInput) chatInput.value = words.join(' ');
    go('no-adapted');
  });

  on('btn-caa-send-teacher', () => {
    if (!words.length) return message(t('caa_empty_toast'));
    const code = addNotice(
      t('caa_notice_prefix', { sentence: words.join(' ') }),
      'patio',
      'teacher',
      '',
      { contextKey: 'caa_context' }
    );
    lastSentCode = code;
    put('caa-sent-feedback', t('caa_sent_feedback', { code }));
    show('caa-sent-feedback', true);
    say(t('caa_sent_spoken'));
  });

  onLanguageChange(() => {
    const feedbackVisible = Boolean(
      lastSentCode && $('caa-sent-feedback') && !$('caa-sent-feedback').classList.contains('hidden')
    );
    drawWords();
    if (feedbackVisible) {
      put('caa-sent-feedback', t('caa_sent_feedback', { code: lastSentCode }));
      show('caa-sent-feedback', true);
    }
  });

  drawWords();
}
