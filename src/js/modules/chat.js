/**
 * Módulo de Modo No Adaptado: Chatbot «Nube» con voz, envío anónimo en vivo y proxy IA seguro.
 */

import { $, all, on, put, show, submit, value } from '../core/dom.js';
import { addNotice, state, uiState } from '../core/state.js';
import { closeModal, registerPageHook } from '../core/router.js';
import {
  askGemini,
  checkServerAiAvailability,
  clearGeminiConfig,
  detectSuggestedPlace,
  getAiMode,
  setGeminiConfig,
  testGeminiConnection,
} from '../services/gemini.js';
import { onLanguageChange, t, translatePlace, translateRecipient } from '../services/i18n.js';
import { message, say } from '../services/speech.js';
import {
  detectRecipientFromMessage,
  detectWhatPictogram,
  detectWhoFromMessage,
  mergeIncidentSummary,
} from './chat-report-helpers.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARASAAC_BASE = './assets/arasaac/';

const WHO_VISUAL = {
  victima: { img: 'yo.png', key: 'chat_who_victim' },
  testigo: { img: 'companero.png', key: 'chat_who_witness' },
  varios: { img: 'grupo.png', key: 'chat_who_several' },
};

const PLACE_VISUAL = {
  patio: { img: 'patio.png' },
  hallways: { img: 'pasillo.png' },
  class: { img: 'clase.png' },
  digital: { emo: '📱' },
  entrance: { emo: '🚪' },
};

const TO_VISUAL = {
  guidance: { img: 'ayuda.png' },
  tutor: { img: 'profesor.png' },
  director: { emo: '🏫' },
};

const reportState = {
  who: 'victima',
  whoManual: false,
  where: '',
  whereManual: false,
  what: '',
  whatManual: false,
  whatPic: '',
  to: 'guidance',
  toManual: false,
  sent: false,
  openEditor: '',
  readyToastShown: false,
};

let autoTts = true;
let lastAnonCode = '';
let lastDetectedPlace = '';
let isSending = false;
let mobileToastTimer = null;
const flashTimers = new Map();

function createSvgUse(symbolId) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', symbolId);
  svg.append(use);
  return svg;
}

function createBuddyAvatar(symbolId) {
  const span = document.createElement('span');
  span.className = 'chat-mini-avatar';
  span.append(createSvgUse(symbolId));
  return span;
}

function scrollChatToBottom() {
  const scroller = $('chat-scroll');
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
  const box = $('chat-messages');
  if (box) box.scrollTop = box.scrollHeight;
}

function setSlotVisual(container, visual) {
  if (!container) return;
  container.replaceChildren();
  if (visual?.img) {
    const img = document.createElement('img');
    img.src = ARASAAC_BASE + visual.img;
    img.alt = '';
    img.width = 44;
    img.height = 44;
    container.append(img);
    return;
  }
  container.textContent = visual?.emo || '📝';
}

function flashSlot(slotKey) {
  const slotEl = document.querySelector(`.chat-slot[data-slot="${slotKey}"]`);
  if (!slotEl) return;
  slotEl.classList.remove('is-flash');
  void slotEl.offsetWidth;
  slotEl.classList.add('is-flash');
  clearTimeout(flashTimers.get(slotKey));
  flashTimers.set(
    slotKey,
    setTimeout(() => slotEl.classList.remove('is-flash'), 900)
  );
}

function showMobileReadyToast() {
  const toast = $('chat-mobile-toast');
  if (!toast) return;
  toast.classList.add('show');
  clearTimeout(mobileToastTimer);
  mobileToastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

const MOBILE_SHEET_MQ =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 760px)')
    : null;

function isMobileSheetViewport() {
  return Boolean(MOBILE_SHEET_MQ?.matches);
}

function setElementInert(el, isInert) {
  if (!el) return;
  el.inert = isInert;
  if (isInert) {
    el.setAttribute('inert', '');
  } else {
    el.removeAttribute('inert');
  }
}

function syncReportSheetAccessibility() {
  const report = $('chat-report');
  if (!report) return;
  const isOpen = report.classList.contains('is-open');
  const shouldInert = isMobileSheetViewport() && !isOpen;
  setElementInert(report.querySelector('.chat-report-inner'), shouldInert);
  setElementInert(report.querySelector('.chat-report-foot'), shouldInert);
  $('btn-report-handle')?.setAttribute('aria-expanded', String(isOpen));
}

function focusReportSheetContent() {
  const target =
    (!reportState.sent && $('chat-report-title')) ||
    $('chat-report-body') ||
    $('btn-submit-anon');
  target?.focus({ preventScroll: true });
}

function toggleReportSheet(force, { restoreFocus = false } = {}) {
  const report = $('chat-report');
  if (!report) return;
  const open = typeof force === 'boolean' ? force : !report.classList.contains('is-open');
  if (open) setMenuOpen(false);
  report.classList.toggle('is-open', open);
  syncReportSheetAccessibility();

  if (open && isMobileSheetViewport()) {
    focusReportSheetContent();
  } else if (!open && restoreFocus) {
    $('btn-report-handle')?.focus();
  }
}

function setSosBannerOpen(open, { moveFocus = false, restoreFocus = false } = {}) {
  show('chat-sos-banner', open);
  $('btn-chat-sos')?.setAttribute('aria-expanded', String(open));
  if (open && moveFocus) {
    $('chat-sos-banner')?.focus({ preventScroll: true });
  } else if (!open && restoreFocus) {
    $('btn-chat-sos')?.focus();
  }
}

function getMenuItems() {
  const menu = $('chat-more-menu');
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll('button[role="menuitem"], button[role="menuitemcheckbox"]')
  ).filter((btn) => !btn.disabled && !btn.classList.contains('hidden'));
}

function setMenuOpen(open, { restoreFocus = false, focusFirst = false } = {}) {
  const menu = $('chat-more-menu');
  if (!menu) return;
  if (open && isMobileSheetViewport() && $('chat-report')?.classList.contains('is-open')) {
    toggleReportSheet(false);
  }
  menu.classList.toggle('open', open);
  $('btn-chat-menu')?.setAttribute('aria-expanded', String(open));
  if (open && focusFirst) {
    getMenuItems()[0]?.focus();
  } else if (!open && restoreFocus) {
    $('btn-chat-menu')?.focus();
  }
}

function openSlotEditor(slotKey, toggle = true) {
  const nextKey = toggle && reportState.openEditor === slotKey ? '' : slotKey;
  reportState.openEditor = nextKey;

  for (const key of ['who', 'where', 'what', 'to']) {
    const isOpen = key === nextKey;
    show('slot-editor-' + key, isOpen);
    document
      .querySelector(`[data-edit-slot="${key}"]`)
      ?.setAttribute('aria-expanded', String(isOpen));
  }

  if (nextKey === 'what') {
    $('anon-extra')?.focus();
  }
}

function syncQuickPromptsState() {
  const box = $('chat-messages');
  const hasUserMessages = Boolean(box?.querySelector('.bubble.own'));
  $('chat-quick-prompts')?.classList.toggle('is-compact', hasUserMessages);
}

function appendChatLine(text, own = false, extraClass = '') {
  const box = $('chat-messages');
  if (!box) return null;

  const row = document.createElement('div');
  row.className = 'chat-row ' + (own ? 'chat-row-own' : 'chat-row-bot');
  if (!own) {
    row.append(createBuddyAvatar('#buddy'));
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble' + (own ? ' own' : '') + (extraClass ? ' ' + extraClass : '');

  const textSpan = document.createElement('span');
  textSpan.className = 'bubble-text';
  textSpan.textContent = text;
  bubble.append(textSpan);

  if (!own) {
    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className = 'chat-speak-btn';
    speakBtn.setAttribute('aria-label', t('chat_speak_msg'));
    speakBtn.title = t('chat_speak_msg');
    speakBtn.append(createSvgUse('#i-speaker'));
    speakBtn.addEventListener('click', () => say(text));
    bubble.append(speakBtn);
  }

  row.append(bubble);
  box.append(row);
  syncQuickPromptsState();
  scrollChatToBottom();
  return bubble;
}

function appendThinkingRow() {
  const box = $('chat-messages');
  if (!box) return null;

  const row = document.createElement('div');
  row.className = 'chat-row chat-row-bot';
  row.append(createBuddyAvatar('#buddy-calm'));

  const bubble = document.createElement('div');
  bubble.className = 'bubble thinking';

  const dots = document.createElement('span');
  dots.className = 'chat-typing';
  dots.setAttribute('aria-hidden', 'true');
  dots.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));

  const sr = document.createElement('span');
  sr.className = 'chat-thinking-sr';
  sr.textContent = t('chat_thinking');

  bubble.append(dots, sr);
  row.append(bubble);
  box.append(row);
  scrollChatToBottom();
  return row;
}

function syncWhoFromBranch() {
  if (!reportState.whoManual) {
    reportState.who = state.branch === 'testigo' ? 'testigo' : 'victima';
  }
}

export function renderReportPanel({ notifyReady = false } = {}) {
  const doneCount = 1 + (reportState.where ? 1 : 0) + (reportState.what ? 1 : 0) + 1;

  const bar = $('chat-report-bar');
  if (bar) bar.style.width = `${(doneCount / 4) * 100}%`;

  put('chat-report-count', t('chat_report_progress', { done: doneCount }));
  put('chat-report-count-m', reportState.sent ? '✓' : `${doneCount}/4`);

  const whoMeta = WHO_VISUAL[reportState.who] || WHO_VISUAL.victima;
  setSlotVisual($('slot-pic-who'), whoMeta);
  put('slot-val-who', t(whoMeta.key));
  all('[data-pick-who]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.pickWho === reportState.who));
  });

  const whereSlot = document.querySelector('.chat-slot[data-slot="where"]');
  const hasWhere = Boolean(reportState.where);
  whereSlot?.classList.toggle('is-done', hasWhere);
  setSlotVisual($('slot-pic-where'), PLACE_VISUAL[reportState.where] || PLACE_VISUAL.patio);
  put('slot-val-where', hasWhere ? translatePlace(reportState.where) : t('chat_slot_waiting'));
  all('[data-pick-where]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.pickWhere === reportState.where));
  });

  const whatSlot = document.querySelector('.chat-slot[data-slot="what"]');
  const cleanWhat = reportState.what.trim();
  const hasWhat = Boolean(cleanWhat);
  whatSlot?.classList.toggle('is-done', hasWhat);
  setSlotVisual(
    $('slot-pic-what'),
    hasWhat && reportState.whatPic ? { img: reportState.whatPic } : { emo: '📝' }
  );
  put('slot-val-what', hasWhat ? cleanWhat : t('chat_slot_waiting'));

  const toVisual = TO_VISUAL[reportState.to] || TO_VISUAL.guidance;
  setSlotVisual($('slot-pic-to'), toVisual);
  put('slot-val-to', translateRecipient(reportState.to));
  all('[data-pick-to]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.pickTo === reportState.to));
  });

  const submitBtn = $('btn-submit-anon');
  if (submitBtn) submitBtn.disabled = !hasWhat;

  put(
    'chat-report-foot-note',
    hasWhat
      ? t('chat_foot_recipient', { recipient: translateRecipient(reportState.to) })
      : t('chat_foot_hint')
  );

  const report = $('chat-report');
  const isReady = doneCount === 4 && !reportState.sent;
  if (report) {
    report.classList.toggle('is-ready', isReady);
    report.classList.toggle('is-sent', reportState.sent);
  }

  if (notifyReady && isReady && !reportState.readyToastShown) {
    reportState.readyToastShown = true;
    showMobileReadyToast();
  }
}

export function initChatWelcome() {
  const box = $('chat-messages');
  if (!box) return;
  box.replaceChildren();
  syncWhoFromBranch();
  const welcome = t(state.branch === 'testigo' ? 'chat_welcome_witness' : 'chat_welcome_victim');
  appendChatLine(welcome, false);
  renderReportPanel();
}

export function syncChat() {
  put('gemini-status-pill', t(getAiMode() === 'server' ? 'chat_status_server' : 'chat_status_local'));
}

async function probeAndSyncChat() {
  await checkServerAiAvailability();
  syncChat();
}

function syncPlaceHint() {
  if (!lastDetectedPlace) return;
  put('chat-place-hint', t('chat_place_detected', { place: translatePlace(lastDetectedPlace) }));
  show('chat-place-hint', true);
}

function syncBotVoiceButton() {
  put('btn-toggle-auto-tts', t(autoTts ? 'chat_bot_voice_on' : 'chat_bot_voice_off'));
}

function syncKeyVisibilityButton() {
  const keyInput = $('gemini-api-key');
  if (!keyInput) return;
  put('btn-toggle-key-visibility', t(keyInput.type === 'text' ? 'api_hide' : 'api_show'));
}

function setApiFeedback(text) {
  put('api-test-result', text);
  show('api-test-result', true);
}

function currentModel() {
  return value('gemini-model-select') === 'custom'
    ? value('gemini-custom-model')
    : value('gemini-model-select');
}

function applyWhereSelection(place, { manual = false, showHint = true } = {}) {
  if (!place) return;
  const changed = reportState.where !== place;
  reportState.where = place;
  if (manual) reportState.whereManual = true;
  if ($('anon-place')) $('anon-place').value = place;
  lastDetectedPlace = place;
  if (showHint) syncPlaceHint();
  if (changed) flashSlot('where');
}

function applyWhoSelection(who, { manual = false } = {}) {
  if (!WHO_VISUAL[who]) return;
  const changed = reportState.who !== who;
  reportState.who = who;
  if (manual) reportState.whoManual = true;
  if (who === 'victima' || who === 'testigo') {
    state.branch = who;
  }
  if (changed) flashSlot('who');
}

function applyRecipientSelection(recipient, { manual = false } = {}) {
  if (!TO_VISUAL[recipient]) return;
  const changed = reportState.to !== recipient;
  reportState.to = recipient;
  if (manual) reportState.toManual = true;
  if ($('anon-recipient')) $('anon-recipient').value = recipient;
  if (changed) flashSlot('to');
}

function updateLiveReportFromUserMessage(text, serverPlace = null) {
  if (reportState.sent) {
    reportState.sent = false;
    reportState.readyToastShown = false;
    show('anon-confirm-msg', false);
  }

  const detectedPlace = serverPlace || detectSuggestedPlace(text);
  const detectedRecipient = detectRecipientFromMessage(text);
  const detectedWho = detectWhoFromMessage(text);

  if (!reportState.whoManual && detectedWho) {
    applyWhoSelection(detectedWho);
  }

  if (!reportState.toManual && detectedRecipient) {
    applyRecipientSelection(detectedRecipient);
  }

  if ((!reportState.whereManual || !reportState.where) && detectedPlace) {
    applyWhereSelection(detectedPlace, { showHint: true });
  }

  if (!reportState.whatManual) {
    const merged = mergeIncidentSummary(reportState.what, text, {
      detectedPlace,
      detectedRecipient,
    });
    if (merged && merged !== reportState.what) {
      reportState.what = merged;
      reportState.whatPic = detectWhatPictogram(merged) || '';
      if ($('anon-extra')) $('anon-extra').value = merged;
      flashSlot('what');
    }
  }

  renderReportPanel({ notifyReady: true });
}

function buildAudioWaveBars() {
  const wave = $('chat-wave');
  if (!wave || wave.children.length) return;
  for (let i = 0; i < 26; i++) {
    const bar = document.createElement('i');
    bar.style.animationDelay = `${((i % 9) * 0.1).toFixed(2)}s`;
    wave.append(bar);
  }
}

function cycleFontSizeFromMenu() {
  const segs = all('.font-seg-btn');
  if (!segs.length) return;
  const activeIdx = segs.findIndex((btn) => btn.getAttribute('aria-pressed') === 'true');
  const nextBtn = segs[(activeIdx + 1) % segs.length];
  nextBtn?.click();
}

export function initChat() {
  buildAudioWaveBars();

  registerPageHook('no-adapted', () => {
    const box = $('chat-messages');
    if (!box?.children.length || !box.querySelector('.bubble.own')) {
      initChatWelcome();
    } else {
      syncWhoFromBranch();
      renderReportPanel();
    }
    probeAndSyncChat();
    syncReportSheetAccessibility();
  });

  submit('form-chat', async () => {
    if (isSending) return;
    const text = value('chat-input');
    if (!text) return;

    const inputEl = $('chat-input');
    const sendBtn = $('btn-send-chat');
    isSending = true;
    if (inputEl) {
      inputEl.value = '';
      inputEl.disabled = true;
    }
    if (sendBtn) sendBtn.disabled = true;

    updateLiveReportFromUserMessage(text);
    appendChatLine(text, true);
    const thinkingRow = appendThinkingRow();

    try {
      const result = await askGemini(text, { branch: state.branch });
      thinkingRow?.remove();
      if (!result) return;

      appendChatLine(result.reply, false, result.crisis ? 'crisis' : '');

      if (result.crisis) {
        setSosBannerOpen(true);
      }

      if (result.suggestedPlace && (!reportState.whereManual || !reportState.where)) {
        applyWhereSelection(result.suggestedPlace, { showHint: true });
        renderReportPanel({ notifyReady: true });
      }

      syncChat();

      if (autoTts && !$('gear-deaf-mode')?.checked) {
        say(result.reply);
      }
    } finally {
      thinkingRow?.remove();
      isSending = false;
      if (inputEl) inputEl.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  });

  on('btn-toggle-auto-tts', () => {
    autoTts = !autoTts;
    $('btn-toggle-auto-tts')?.setAttribute('aria-checked', String(autoTts));
    syncBotVoiceButton();
    if (!autoTts) window.speechSynthesis?.cancel();
  });

  on('btn-chat-sos', () => {
    const banner = $('chat-sos-banner');
    const willOpen = Boolean(banner?.classList.contains('hidden'));
    setSosBannerOpen(willOpen, { moveFocus: willOpen, restoreFocus: !willOpen });
  });

  on('btn-close-chat-sos', () => setSosBannerOpen(false, { restoreFocus: true }));

  $('chat-sos-banner')?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSosBannerOpen(false, { restoreFocus: true });
    }
  });

  on('btn-chat-menu', (e) => {
    e.stopPropagation();
    const isOpen = $('chat-more-menu')?.classList.contains('open');
    setMenuOpen(!isOpen, { focusFirst: !isOpen });
  });

  $('btn-chat-menu')?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      const items = getMenuItems();
      setMenuOpen(true);
      const target = e.key === 'ArrowUp' ? items[items.length - 1] : items[0];
      target?.focus();
    }
  });

  on('btn-chat-font-size', () => {
    cycleFontSizeFromMenu();
    setMenuOpen(false);
  });

  $('chat-more-menu')?.addEventListener('click', (e) => {
    const item = e.target.closest('button[role="menuitem"], button[role="menuitemcheckbox"]');
    if (item && item.id !== 'btn-toggle-auto-tts') {
      setMenuOpen(false);
    }
  });

  $('chat-more-menu')?.addEventListener('keydown', (e) => {
    const items = getMenuItems();
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setMenuOpen(false, { restoreFocus: true });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.chat-head-actions')) {
      setMenuOpen(false);
    }
    if (
      isMobileSheetViewport() &&
      $('chat-report')?.classList.contains('is-open') &&
      !e.target.closest('#chat-report') &&
      !e.target.closest('#btn-chat-toast-open')
    ) {
      toggleReportSheet(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('chat-more-menu')?.classList.contains('open')) {
      e.preventDefault();
      setMenuOpen(false, { restoreFocus: true });
      return;
    }
    if (isMobileSheetViewport() && $('chat-report')?.classList.contains('is-open')) {
      e.preventDefault();
      toggleReportSheet(false, { restoreFocus: true });
    }
  });

  MOBILE_SHEET_MQ?.addEventListener?.('change', syncReportSheetAccessibility);

  if (typeof window !== 'undefined' && window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const screen = $('screen-no-adapted');
      if (screen && !screen.classList.contains('hidden')) {
        scrollChatToBottom();
      }
    });
  }

  // Hoja inferior móvil y toast
  on('btn-report-handle', () => toggleReportSheet());
  on('btn-chat-toast-open', () => {
    toggleReportSheet(true);
    $('chat-mobile-toast')?.classList.remove('show');
  });

  // Edición inline de los 4 slots del aviso
  all('[data-edit-slot]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openSlotEditor(btn.dataset.editSlot || '');
    });
  });

  all('[data-close-editor]').forEach((btn) => {
    btn.addEventListener('click', () => openSlotEditor('', false));
  });

  all('[data-pick-who]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyWhoSelection(btn.dataset.pickWho, { manual: true });
      openSlotEditor('', false);
      renderReportPanel({ notifyReady: true });
    });
  });

  all('[data-pick-where]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyWhereSelection(btn.dataset.pickWhere, { manual: true, showHint: false });
      openSlotEditor('', false);
      renderReportPanel({ notifyReady: true });
    });
  });

  all('[data-pick-what-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const label = t(btn.dataset.pickWhatKey || '');
      reportState.what = label;
      reportState.whatManual = true;
      reportState.whatPic = btn.dataset.pickPic || detectWhatPictogram(label) || '';
      if ($('anon-extra')) $('anon-extra').value = label;
      flashSlot('what');
      openSlotEditor('', false);
      renderReportPanel({ notifyReady: true });
    });
  });

  all('[data-pick-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyRecipientSelection(btn.dataset.pickTo, { manual: true });
      openSlotEditor('', false);
      renderReportPanel({ notifyReady: true });
    });
  });

  $('anon-extra')?.addEventListener('input', () => {
    const val = $('anon-extra')?.value.trim() || '';
    reportState.what = val;
    reportState.whatManual = Boolean(val);
    reportState.whatPic = detectWhatPictogram(val) || '';
    renderReportPanel({ notifyReady: true });
  });

  $('anon-place')?.addEventListener('change', () => {
    const val = value('anon-place');
    if (val) {
      applyWhereSelection(val, { manual: true, showHint: false });
      renderReportPanel({ notifyReady: true });
    }
  });

  $('anon-recipient')?.addEventListener('change', () => {
    const val = value('anon-recipient');
    if (val) {
      applyRecipientSelection(val, { manual: true });
      renderReportPanel({ notifyReady: true });
    }
  });

  on('btn-submit-anon', () => {
    const chatLines = all('#chat-messages .bubble.own')
      .map((bubble) => bubble.querySelector('.bubble-text')?.textContent || bubble.textContent)
      .join(' | ');
    const text = value('anon-extra') || reportState.what || chatLines || t('chat_anon_default');
    const place = reportState.where || value('anon-place') || 'patio';
    const recipient = reportState.to || value('anon-recipient') || 'guidance';

    const code = addNotice(text, place, recipient, '', { contextKey: 'chat_anon_context' });
    lastAnonCode = code;
    state.place = place;
    uiState.lastReport = text;

    reportState.sent = true;
    openSlotEditor('', false);
    put('anon-confirm-msg', t('chat_anon_confirm', { code }));
    show('anon-confirm-msg', true);
    renderReportPanel();

    appendChatLine(t('chat_anon_confirm', { code }), false);
    say(t('chat_anon_spoken'));
  });

  on('btn-chat-keep-talking', () => {
    reportState.sent = false;
    reportState.what = '';
    reportState.whatManual = false;
    reportState.whatPic = '';
    reportState.readyToastShown = false;
    if ($('anon-extra')) $('anon-extra').value = '';
    show('anon-confirm-msg', false);
    renderReportPanel();
    toggleReportSheet(false);
    $('chat-input')?.focus();
  });

  // Modal API Gemini (ajustes / análisis US-ED-14)
  $('gemini-model-select')?.addEventListener('change', () => {
    show('custom-model-group', value('gemini-model-select') === 'custom');
  });

  on('btn-toggle-key-visibility', () => {
    const keyInput = $('gemini-api-key');
    if (!keyInput) return;
    keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    syncKeyVisibilityButton();
  });

  on('btn-test-api-key', async () => {
    if (!value('gemini-api-key')) return setApiFeedback(t('api_err_nokey'));
    setApiFeedback(t('api_testing'));
    try {
      await testGeminiConnection(value('gemini-api-key'), currentModel());
      setApiFeedback(t('api_ok'));
    } catch (err) {
      setApiFeedback(t('api_err_conn', { error: err.message }));
    }
  });

  on('btn-save-api-key', () => {
    setGeminiConfig(
      { key: value('gemini-api-key'), model: currentModel() },
      Boolean($('gemini-remember-key')?.checked)
    );
    syncChat();
    closeModal();
    message(t('api_saved'));
  });

  on('btn-clear-api-key', () => {
    clearGeminiConfig();
    if ($('gemini-api-key')) $('gemini-api-key').value = '';
    syncChat();
    setApiFeedback(t('api_cleared'));
  });

  onLanguageChange(() => {
    syncChat();
    syncBotVoiceButton();
    syncKeyVisibilityButton();

    const box = $('chat-messages');
    if (box?.children.length && !box.querySelector('.bubble.own')) {
      initChatWelcome();
    }

    all('#chat-messages .chat-speak-btn').forEach((btn) => {
      btn.setAttribute('aria-label', t('chat_speak_msg'));
      btn.title = t('chat_speak_msg');
    });

    if (lastDetectedPlace && $('chat-place-hint') && !$('chat-place-hint').classList.contains('hidden')) {
      syncPlaceHint();
    }

    if (lastAnonCode && $('anon-confirm-msg') && !$('anon-confirm-msg').classList.contains('hidden')) {
      put('anon-confirm-msg', t('chat_anon_confirm', { code: lastAnonCode }));
    }

    renderReportPanel();
  });

  syncChat();
  syncBotVoiceButton();
  renderReportPanel();
  syncReportSheetAccessibility();
  probeAndSyncChat();
}
