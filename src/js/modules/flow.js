/**
 * Módulo del flujo guiado principal (Pasos 0..3, Modo Adaptado 1..3 y delegación global).
 */

import { $, all, on, put, show, submit, value } from '../core/dom.js';
import { addNotice, pages, state, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { t, translateCause, translateFeeling } from '../services/i18n.js';
import { message, say } from '../services/speech.js';
import { chooseVoice, finishAccessibilitySetup, setDisabilitySupport, startTalk } from './accessibility.js';
import { addCaaWord } from './caa.js';
import { setTeacherFilter } from './teacher-panel.js';

const YES_TOKENS = new Set(['1', 'sí', 'si', 's', 'yes', 'y', 'oui', 'o', 'ja', 'j', 'sim', 'نعم', 'أجل', 'ايوه', 'اي']);
const NO_TOKENS = new Set(['2', 'no', 'n', 'non', 'nein', 'não', 'nao', 'لا']);

const DIRECT_ROUTES = {
  'btn-open-caa-from-adapted': 'caa',
  'btn-adapted-to-feedback': 'feedback',
  'btn-adapted-to-teacher-panel': 'teacher-panel',
  'btn-chat-to-diary': 'diary',
  'btn-chat-to-questionnaire': 'questionnaire',
  'btn-to-feedback': 'feedback',
  'btn-q-to-chat': 'no-adapted',
  'btn-go-chat-from-feedback': 'no-adapted',
  'btn-nav-teacher': 'teacher-panel',
  'btn-nav-parents': 'parents',
};

function choose(button) {
  if (!button) return;
  const val = button.dataset.value;

  switch (button.dataset.action) {
    case 'go-back':
      return go(pages.pop() || 'home', false);
    case 'start-talk':
      return startTalk();
    case 'choose-voice':
      return chooseVoice(val === 'si');
    case 'choose-user-type':
      state.role = val;
      if ($('q-user-type')) $('q-user-type').value = val;
      if (val === 'profesor') return go('teacher-panel');
      if (val === 'padres') return go('parents');
      return go('2-mode');
    case 'choose-mode':
      state.mode = val;
      return go('3-situation-type');
    case 'choose-guided-story':
      state.mode = 'adaptado';
      state.branch = 'victima';
      return go('daily-story');
    case 'choose-branch':
      state.branch = val;
      if (val !== 'cuestionario' && $('q-branch')) $('q-branch').value = val;
      if (val === 'cuestionario') return go('questionnaire');
      return go(state.mode === 'adaptado' ? 'adapted-1' : 'no-adapted');
    case 'adapted-feeling':
      state.feeling = val;
      return go('adapted-2');
    case 'adapted-cause':
      state.cause = val;
      return go('adapted-3');
  }
}

export function initFlow() {
  // Delegación global de clics
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const data = button.dataset;

    if (data.go) return go(data.go);
    if (data.action) return choose(button);

    if (data.disType) return setDisabilitySupport(data.disType, button.getAttribute('aria-pressed') !== 'true');

    if (button.classList.contains('parent-signal-btn')) {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    }

    if (data.adaptedPlace) {
      all('[data-adapted-place]').forEach((el) => {
        const active = el === button;
        el.classList.toggle('selected', active);
        el.setAttribute('aria-pressed', String(active));
      });
      state.place = data.adaptedPlace;
    }

    if (data.text) {
      if ($('adapted-note')) $('adapted-note').value = data.text;
      message(t('ad3_phrase_added'));
    }

    if (data.caaId || data.caa) addCaaWord(data.caaId || data.caa);
    if (data.teacherFilter) setTeacherFilter(data.teacherFilter);

    if (data.prompt) {
      if ($('chat-input')) $('chat-input').value = data.prompt;
      $('form-chat')?.requestSubmit();
    }
  });

  // Rutas directas de botones
  Object.entries(DIRECT_ROUTES).forEach(([id, targetPage]) => on(id, () => go(targetPage)));

  // Respuesta rápida por texto en paso 0
  submit('form-voice-text-answer', () => {
    const normalized = value('input-voice-answer').toLowerCase().replace(/١/g, '1').replace(/٢/g, '2');
    const tokens = normalized.split(/[\s,.;!?،]+/).filter(Boolean);
    const answer = tokens.some((tok) => YES_TOKENS.has(tok))
      ? 'si'
      : tokens.some((tok) => NO_TOKENS.has(tok))
        ? 'no'
        : '';
    if (!answer) return message(t('flow_yesno_error'));
    choose(document.querySelector(`[data-action="choose-voice"][data-value="${answer}"]`));
  });

  submit('form-dis-detail-text', () => {
    const normalized = value('input-dis-detail')
      .toLowerCase()
      .replace(/[١-٦]/g, (d) => String('١٢٣٤٥٦'.indexOf(d) + 1));
    const parts = normalized.split(/[\s,;،]+/);
    const matches = all('[data-dis-type]').filter(
      (btn) => parts.includes(btn.dataset.key) || parts.includes(btn.dataset.disType)
    );
    if (!matches.length) return message(t('flow_dis_error'));
    matches.forEach((btn) => setDisabilitySupport(btn.dataset.disType, true));
    finishAccessibilitySetup();
  });

  // Pantalla Adaptado 3: envío al profesor
  on('btn-send-to-teacher', () => {
    const roleStr = t(state.branch === 'testigo' ? 'role_witness' : 'role_victim');
    uiState.lastReport = [
      translateFeeling(state.feeling),
      translateCause(state.cause),
      value('adapted-note'),
    ]
      .filter(Boolean)
      .join(' · ');

    const school = value('adapted-school');
    const sender = school
      ? t('ad3_sender_named', { school, role: roleStr })
      : t('ad3_sender_anon', { role: roleStr });

    const code = addNotice(uiState.lastReport, state.place || 'patio', 'teacher_tutor', sender);

    put('adapted-safe-code', code);
    show('adapted-sent-confirm', true);
    say(t('ad3_sent_spoken'));
  });

  on('btn-speak-for-me', () => say(uiState.lastReport || t('ad3_speak_fallback')));
}
