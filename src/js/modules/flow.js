/**
 * Módulo del flujo guiado principal (Pasos 0..3, Modo Adaptado 1..3 y delegación global).
 */

import { $, all, on, put, show, submit, value } from '../core/dom.js';
import { addNotice, guidedReport, pages, state, uiState } from '../core/state.js';
import { go } from '../core/router.js';
import { t, translateCause, translateFeeling } from '../services/i18n.js';
import { message, say } from '../services/speech.js';
import { applyDisabilitySupport, applyPreferences } from './accessibility.js';
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
    case 'choose-voice':
      if ($('gear-voice-guide')) $('gear-voice-guide').checked = val === 'si';
      applyPreferences();
      return go('0-disability');
    case 'choose-user-type':
      state.role = val;
      if ($('q-user-type')) $('q-user-type').value = val;
      if (val === 'profesor') {
        const access = window.prompt('Código de acceso docente (demo: CONTIGO)');
        if (access !== 'CONTIGO') {
          message('Acceso no válido. Solo el personal autorizado puede entrar.');
          return;
        }
        sessionStorage.setItem('contigo.staffRole', 'docente');
        return go('teacher-panel');
      }
      if (val === 'padres') return go('parents');
      return go('2-mode');
    case 'choose-mode':
      state.mode = val;
      return go('3-situation-type');
    case 'choose-branch':
      state.branch = val;
      if (val !== 'cuestionario' && $('q-branch')) $('q-branch').value = val;
      if (val === 'cuestionario') return go('questionnaire');
      if (val === 'ayuda-inmediata') {
        const code = addNotice(
          'Ayuda inmediata: estudiante mal y no sabe explicar por qué.',
          state.place || 'patio',
          'guidance',
          'Ayuda inmediata',
          { priority: 'critica', contextKey: 'role_victim' }
        );
        uiState.lastReport = 'Ayuda inmediata sin causa definida';
        put('adapted-safe-code', code);
        show('adapted-sent-confirm', true);
        say(t('ad3_sent_spoken'));
        go('adapted-3');
        return;
      }
      return go(state.mode === 'adaptado' ? 'adapted-1' : 'no-adapted');
    case 'adapted-feeling':
      state.feeling = val;
      if (val === 'unknown' || val === 'sensory') return go('guided-help');
      return go('adapted-2');
    case 'adapted-cause':
      state.cause = val;
      if (val === 'unknown') return go('guided-help');
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

    if (data.disType || button.classList.contains('parent-signal-btn')) {
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

    if (data.guidedSensation) {
      const active = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!active));
      guidedReport.sensations = guidedReport.sensations.filter((item) => item !== data.guidedSensation);
      if (!active) guidedReport.sensations.push(data.guidedSensation);
    }

    if (data.guidedRoutine) {
      all('[data-guided-routine]').forEach((el) => {
        el.setAttribute('aria-pressed', String(el === button));
        el.classList.toggle('selected', el === button);
      });
      guidedReport.routine = data.guidedRoutine;
    }

    if (data.guidedAnswer) {
      const scene = button.closest('[data-guided-scene]');
      if (!scene) return;
      const sceneId = scene.dataset.guidedScene;
      scene.querySelectorAll('[data-guided-answer]').forEach((el) => {
        el.setAttribute('aria-pressed', String(el === button));
        el.classList.toggle('selected', el === button);
      });
      guidedReport.scenes[sceneId] = data.guidedAnswer;
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
    matches.forEach((btn) => btn.setAttribute('aria-pressed', 'true'));
    applyDisabilitySupport();
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

  on('btn-send-guided-help', () => {
    const sensationLabels = {
      'me-duele-tripa-cabeza': 'Me duele la tripa o la cabeza',
      'mucho-ruido-luz': 'Demasiado ruido o luz',
      'quiero-esconderme': 'Quiere esconderse o irse',
      'corazon-fuerte': 'Corazón latiendo fuerte',
      'no-me-salen-palabras': 'No le salen las palabras',
      'no-lo-se': 'No lo sabe',
    };
    const sceneLabels = {
      'burlas-risas': 'Burlas o risas',
      exclusion: 'Exclusión',
      'agresion-cosas': 'Empujones o daño a objetos',
      'ruido-gente': 'Ruido o mucha gente',
      'movil-mensajes': 'Problema por móvil o mensajes',
    };
    const answerLabels = { si: 'Sí', no: 'No', 'no-lo-se': 'No lo sé' };
    const sensations = guidedReport.sensations
      .map((value) => sensationLabels[value] || value)
      .join(', ') || 'No indicada';
    const scenes = Object.entries(guidedReport.scenes)
      .map(([scene, answer]) => `${sceneLabels[scene] || scene}: ${answerLabels[answer] || answer}`)
      .join(' · ') || 'No respondida';
    const routine = guidedReport.routine || 'No lo sabe';

    uiState.lastReport =
      'Malestar sin causa definida · ' +
      `Señales: ${sensations} · Rutina: ${routine} · Escenas: ${scenes}`;
    const code = addNotice(
      uiState.lastReport,
      state.place || 'patio',
      'guidance',
      'Estudiante con discapacidad · Sin causa definida',
      { priority: 'normal', structuredHelp: true }
    );
    put('adapted-safe-code', code);
    show('adapted-sent-confirm', true);
    say(t('ad3_sent_spoken'));
    go('adapted-3');
  });
}
