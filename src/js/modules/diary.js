/**
 * Módulo del Diario de Evidencias y detector de escalada.
 */

import { $, localDate, node, on, put, show, stamp, submit, value } from '../core/dom.js';
import { diary } from '../core/state.js';
import { save } from '../core/storage.js';
import { registerPageHook } from '../core/router.js';
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
    area.append(node('p', 'Tu diario está vacío.'));
    return;
  }

  for (const entry of diary.slice().sort((a, b) => b.date.localeCompare(a.date))) {
    const card = node('article', '', 'record');
    const del = node('button', '🗑️ Eliminar', 'btn-mini');
    del.type = 'button';
    del.onclick = () => {
      diary.splice(diary.indexOf(entry), 1);
      save('diario', diary);
      drawDiary();
    };
    card.append(
      node('strong', `📍 ${entry.place} · Nivel ${entry.level}`),
      node('small', stamp(entry.date)),
      node('p', entry.text),
      del
    );
    area.append(card);
  }
}

export function initDiary() {
  registerPageHook('diary', drawDiary);

  submit('form-diary-entry', () => {
    const text = value('diary-desc') || 'Incidente registrado en el diario.';
    diary.push({
      text,
      date: value('diary-date') || localDate(),
      place: value('diary-place') || 'Patio / Recreo',
      level: value('diary-severity') || '2',
    });
    save('diario', diary);
    if ($('diary-desc')) $('diary-desc').value = '';
    drawDiary();
    message('✅ Guardado en tu diario.');
  });

  on('btn-diary-seed-demo', () => {
    if ($('diary-date')) $('diary-date').value = localDate();
    if ($('diary-desc')) {
      $('diary-desc').value = 'Durante el recreo me dejaron fuera del grupo y se burlaron de cómo hablo.';
      $('diary-desc').focus();
    }
  });

  on('btn-analyze-diary', () => {
    const sorted = diary.slice().sort((a, b) => b.date.localeCompare(a.date));
    const [latest, previous] = sorted;
    let analysis = 'Añade un registro para analizar la evolución.';

    if (latest) {
      analysis = `📊 Análisis: Tienes ${diary.length} registro(s). El último fue en ${latest.place} (Nivel ${latest.level}/3).`;
      if (previous) {
        analysis +=
          latest.level >= previous.level
            ? ' ⚠️ Se observa repetición/escalada en momentos no estructurados. Recomendamos pulsar Enviar al Profesor.'
            : ' Se observa menor intensidad respecto al registro anterior.';
      }
    }

    put('diary-analysis-box', analysis);
    show('diary-analysis-box', true);
    say(analysis);
  });

  drawDiary();
}
