/**
 * Módulo de "Contar mi día" (US-ED-14):
 * Narrativa libre en Lectura Fácil con análisis asistido (Gemini o local),
 * tarjetas de confirmación accesibles (Sí / No / No lo sé) y envío no bloqueante al docente.
 */

import { $, node, on, put, show, value } from '../core/dom.js';
import { addNotice, state, uiState } from '../core/state.js';
import { analyzeDailyStory } from '../services/gemini.js';
import {
  getLang,
  onLanguageChange,
  t,
  translateFeeling,
  translatePlace,
} from '../services/i18n.js';
import { message, say } from '../services/speech.js';

const VALID_PLACES = new Set(['patio', 'hallways', 'class', 'entrance', 'digital']);
const VALID_ALERTS = new Set(['low', 'medium', 'high']);

const CONFIRM_OPTIONS = [
  { key: 'yes', i18nKey: 'story_confirm_yes', activeClass: 'is-yes' },
  { key: 'no', i18nKey: 'story_confirm_no', activeClass: 'is-no' },
  { key: 'unsure', i18nKey: 'story_confirm_unsure', activeClass: 'is-unsure' },
];

let currentAnalysis = null;
let currentStoryText = '';
let confirmations = new Map();
let isAnalyzing = false;

function formatLabelValue(i18nKey, val) {
  const cleanVal = String(val || '').trim();
  const translated = t(i18nKey, {
    value: cleanVal,
    items: cleanVal,
    text: cleanVal,
    causes: cleanVal,
    emotion: cleanVal,
    place: cleanVal,
    alert: cleanVal,
  });
  if (cleanVal && !translated.includes(cleanVal)) {
    return `${translated}: ${cleanVal}`.trim();
  }
  return translated;
}

function normalizeAlertLevel(raw) {
  const normalized = String(raw || '').toLowerCase().trim();
  return VALID_ALERTS.has(normalized) ? normalized : 'low';
}

function normalizePlace(raw) {
  const normalized = String(raw || '').toLowerCase().trim();
  if (VALID_PLACES.has(normalized)) return normalized;
  return state.place || 'patio';
}

function updateCauseButtons(groupEl, causeId) {
  const selected = confirmations.get(causeId) || '';
  const buttons = groupEl.querySelectorAll('.story-confirm-btn');
  buttons.forEach((btn) => {
    const choice = btn.dataset.storyConfirm;
    const isPressed = choice === selected;
    btn.setAttribute('aria-pressed', String(isPressed));
    btn.classList.toggle('is-yes', isPressed && choice === 'yes');
    btn.classList.toggle('is-no', isPressed && choice === 'no');
    btn.classList.toggle('is-unsure', isPressed && choice === 'unsure');
  });
}

function renderMeta(analysis) {
  const metaEl = $('daily-story-meta');
  if (!metaEl) return;
  metaEl.replaceChildren();

  const emotionRaw = analysis.emotion || '';
  if (emotionRaw) {
    const emotionLabel = translateFeeling(emotionRaw) || emotionRaw;
    metaEl.append(node('span', formatLabelValue('story_meta_emotion', emotionLabel), 'status-pill'));
  }

  const placeRaw = analysis.place || '';
  if (placeRaw) {
    const placeLabel = translatePlace(placeRaw) || placeRaw;
    metaEl.append(node('span', formatLabelValue('story_meta_place', placeLabel), 'status-pill'));
  }

  const alertLevel = normalizeAlertLevel(analysis.alertLevel);
  const alertLabel = t(`story_alert_${alertLevel}`);
  metaEl.append(
    node(
      'span',
      formatLabelValue('story_meta_alert', alertLabel),
      `story-alert-badge story-alert-badge--${alertLevel}`
    )
  );
}

function renderCauses(analysis) {
  const listEl = $('daily-story-causes');
  if (!listEl) return;
  listEl.replaceChildren();

  const causes = Array.isArray(analysis.causes) ? analysis.causes : [];

  causes.forEach((cause, index) => {
    const causeId = String(cause?.id || cause?.category || `cause-${index}`);
    const titleText = String(cause?.title || '').trim();
    const descText = String(cause?.easyReadText || '').trim();
    const iconText = String(cause?.icon || '💬').trim();

    const listItem = node('li', '', 'story-cause-item');
    const card = node('article', '', 'story-cause-card');

    const header = node('div', '', 'story-cause-header');
    const iconEl = node('span', iconText, 'story-cause-icon');
    iconEl.setAttribute('aria-hidden', 'true');
    const heading = node('h3', titleText);
    header.append(iconEl, heading);

    const desc = node('p', descText, 'story-cause-desc');

    const group = node('div', '', 'story-confirm-group');
    group.setAttribute('role', 'group');
    if (titleText) group.setAttribute('aria-label', titleText);

    CONFIRM_OPTIONS.forEach(({ key, i18nKey }) => {
      const btn = node('button', t(i18nKey), 'story-confirm-btn');
      btn.type = 'button';
      btn.dataset.storyConfirm = key;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        const current = confirmations.get(causeId);
        if (current === key) {
          confirmations.delete(causeId);
        } else {
          confirmations.set(causeId, key);
        }
        updateCauseButtons(group, causeId);
      });
      group.append(btn);
    });

    updateCauseButtons(group, causeId);
    card.append(header, desc, group);
    listItem.append(card);
    listEl.append(listItem);
  });
}

function renderAnalysis() {
  if (!currentAnalysis) return;
  put('daily-story-support', String(currentAnalysis.supportMessage || '').trim());
  renderMeta(currentAnalysis);
  renderCauses(currentAnalysis);
}

async function handleAnalyze() {
  if (isAnalyzing) return;

  const storyText = value('daily-story-input');
  if (!storyText) {
    message(t('story_empty_error'));
    $('daily-story-input')?.focus();
    return;
  }

  isAnalyzing = true;
  const analyzeBtn = $('btn-analyze-daily-story');
  if (analyzeBtn) analyzeBtn.disabled = true;

  show('daily-story-loading', true);
  show('daily-story-results', false);
  show('daily-story-sent-confirm', false);

  try {
    const result = await analyzeDailyStory(storyText, getLang());
    currentAnalysis = result || {
      causes: [],
      emotion: '',
      place: state.place || 'patio',
      moment: '',
      alertLevel: 'low',
      supportMessage: '',
      source: 'local',
    };
    currentStoryText = storyText;
    confirmations = new Map();

    renderAnalysis();
    show('daily-story-results', true);

    const resultsHeading = $('daily-story-results-title');
    if (resultsHeading) {
      resultsHeading.tabIndex = -1;
      resultsHeading.focus({ preventScroll: true });
    }

    if (
      $('gear-voice-guide')?.checked &&
      !$('gear-deaf-mode')?.checked &&
      currentAnalysis.supportMessage
    ) {
      say(currentAnalysis.supportMessage);
    }
  } finally {
    isAnalyzing = false;
    if (analyzeBtn) analyzeBtn.disabled = false;
    show('daily-story-loading', false);
  }
}

function handleReadResults() {
  if (!currentAnalysis) return;
  const parts = [];
  if (currentAnalysis.supportMessage) {
    parts.push(String(currentAnalysis.supportMessage).trim());
  }
  const causes = Array.isArray(currentAnalysis.causes) ? currentAnalysis.causes : [];
  causes.forEach((cause) => {
    const line = [cause?.title, cause?.easyReadText].filter(Boolean).join('. ');
    if (line) parts.push(line);
  });
  const spoken = parts.join('. ');
  if (spoken) say(spoken);
}

function handleSendToTeacher() {
  const storyText = currentStoryText || value('daily-story-input');
  const causes = Array.isArray(currentAnalysis?.causes) ? currentAnalysis.causes : [];

  const confirmedTitles = [];
  const unsureTitles = [];

  causes.forEach((cause, index) => {
    const causeId = String(cause?.id || cause?.category || `cause-${index}`);
    const choice = confirmations.get(causeId);
    const label = String(cause?.title || cause?.category || '').trim();
    if (!label) return;
    if (choice === 'yes') confirmedTitles.push(label);
    if (choice === 'unsure') unsureTitles.push(label);
  });

  const reportParts = [];
  if (storyText) {
    reportParts.push(formatLabelValue('story_report_prefix', storyText));
  }

  if (confirmedTitles.length) {
    reportParts.push(formatLabelValue('story_report_confirmed', confirmedTitles.join(', ')));
  }
  if (unsureTitles.length) {
    reportParts.push(formatLabelValue('story_report_unsure', unsureTitles.join(', ')));
  }
  if (!confirmedTitles.length && !unsureTitles.length) {
    reportParts.push(t('story_report_no_cause'));
  }

  if (currentAnalysis?.emotion) {
    const emotionLabel = translateFeeling(currentAnalysis.emotion) || currentAnalysis.emotion;
    reportParts.push(formatLabelValue('story_meta_emotion', emotionLabel));
  }

  const alertLevel = normalizeAlertLevel(currentAnalysis?.alertLevel);
  reportParts.push(formatLabelValue('story_meta_alert', t(`story_alert_${alertLevel}`)));

  const reportText = reportParts.filter(Boolean).join(' · ');
  const place = normalizePlace(currentAnalysis?.place);
  state.place = place;
  uiState.lastReport = reportText;

  const school = value('daily-story-school');
  const roleStr = t(state.branch === 'testigo' ? 'role_witness' : 'role_victim');
  const sender = school
    ? t('ad3_sender_named', { school, role: roleStr })
    : t('ad3_sender_anon', { role: roleStr });

  const code = addNotice(reportText, place, 'teacher_tutor', sender, {
    alertLevel,
    source: 'daily-story',
  });

  put('daily-story-safe-code', code);
  show('daily-story-sent-confirm', true);
  say(t('story_sent_spoken'));
}

export function initDailyStory() {
  on('btn-story-read-intro', () => say(`${t('story_title')}. ${t('story_desc')}`));
  on('btn-analyze-daily-story', handleAnalyze);
  on('btn-story-read-results', handleReadResults);
  on('btn-story-send-teacher', handleSendToTeacher);
  on('btn-story-speak-sent', () => say(uiState.lastReport || t('ad3_speak_fallback')));

  onLanguageChange(() => {
    if (currentAnalysis) {
      renderAnalysis();
    }
  });
}
