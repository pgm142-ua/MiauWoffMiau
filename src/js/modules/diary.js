/**
 * Módulo del Diario de Evidencias y detector de escalada.
 */

import { $, localDate, node, on, put, show, stamp, submit, value } from '../core/dom.js';
import { diary } from '../core/state.js';
import { save } from '../core/storage.js';
import { registerPageHook } from '../core/router.js';
import { getLocale, onLanguageChange, t, translatePlace } from '../services/i18n.js';
import { message, say } from '../services/speech.js';

export function drawDiary() {
  const area = $('diary-entries-list');
  if (!area) return;
  area.replaceChildren();
  put('diary-count', diary.length);

  if (!value('diary-date') && $('diary-date')) {
    $('diary-date').value = localDate();
  }

  if (!diary.length) {
    area.append(node('p', t('diary_empty')));
    return;
  }

  const locale = getLocale();

  for (const entry of diary.slice().sort((a, b) => b.date.localeCompare(a.date))) {
    const card = node('article', '', 'record');
    const del = node('button', t('diary_delete_btn'), 'btn-mini');
    del.type = 'button';
    del.onclick = () => {
      diary.splice(diary.indexOf(entry), 1);
      save('diario', diary);
      drawDiary();
    };
    card.append(
      node('strong', t('diary_entry_meta', { place: translatePlace(entry.place), level: entry.level })),
      node('small', stamp(entry.date, locale)),
      node('p', entry.textKey ? t(entry.textKey) : entry.text),
      del
    );
    area.append(card);
  }
}

function renderDiaryAnalysis(speak = false) {
  const sorted = diary.slice().sort((a, b) => b.date.localeCompare(a.date));
  const [latest, previous] = sorted;
  let analysis = t('diary_analysis_empty');

  if (latest) {
    analysis = t('diary_analysis_summary', {
      count: diary.length,
      place: translatePlace(latest.place),
      level: latest.level,
    });
    if (previous) {
      analysis += t(latest.level >= previous.level ? 'diary_analysis_escalation' : 'diary_analysis_calmer');
    }
  }

  put('diary-analysis-box', analysis);
  show('diary-analysis-box', true);
  if (speak) say(analysis);
}

export function initDiary() {
  registerPageHook('diary', drawDiary);

  submit('form-diary-entry', () => {
    const rawText = value('diary-desc');
    diary.push({
      ...(rawText ? {} : { textKey: 'diary_default_text' }),
      text: rawText || t('diary_default_text'),
      date: value('diary-date') || localDate(),
      place: value('diary-place') || 'patio',
      level: value('diary-severity') || '2',
    });
    save('diario', diary);
    if ($('diary-desc')) $('diary-desc').value = '';
    drawDiary();
    message(t('diary_saved_toast'));
  });

  on('btn-diary-seed-demo', () => {
    if ($('diary-date')) $('diary-date').value = localDate();
    if ($('diary-desc')) {
      $('diary-desc').value = t('diary_demo_text');
      $('diary-desc').focus();
    }
  });

  on('btn-analyze-diary', () => renderDiaryAnalysis(true));

  onLanguageChange(() => {
    drawDiary();
    if ($('diary-analysis-box') && !$('diary-analysis-box').classList.contains('hidden')) {
      renderDiaryAnalysis(false);
    }
  });

  drawDiary();
}
