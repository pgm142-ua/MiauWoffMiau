import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('index.html enforces First Rule of WAI-ARIA (native HTML elements first)', async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, 'index.html'), 'utf8');

  // Native <dialog> for all modals (no <div role="dialog">)
  assert.doesNotMatch(html, /<div\b[^>]*\brole="dialog"/i, 'Use native <dialog> instead of <div role="dialog">');
  assert.match(html, /<dialog\b[^>]*\bid="safe-exit-screen"/i);
  assert.match(html, /<dialog\b[^>]*\bid="gear-modal"/i);
  assert.match(html, /<dialog\b[^>]*\bid="api-modal"/i);

  // Native <progress> (no <div role="progressbar">)
  assert.doesNotMatch(html, /<div\b[^>]*\brole="progressbar"/i, 'Use native <progress> instead of <div role="progressbar">');
  assert.match(html, /<progress\b[^>]*\bid="progress-bar"[^>]*\baria-labelledby="progress-label"/i);

  // Native <nav> (no <div role="navigation">)
  assert.doesNotMatch(html, /<div\b[^>]*\brole="navigation"/i, 'Use native <nav> instead of <div role="navigation">');
  assert.match(html, /<nav\b[^>]*\bclass="home-chips"/i);

  // Native <section> (no <div role="region">)
  assert.doesNotMatch(html, /<div\b[^>]*\brole="region"/i, 'Use native <section> instead of <div role="region">');

  // Native <ul>/<li> (no <div role="list">)
  assert.doesNotMatch(html, /<div\b[^>]*\brole="list"/i, 'Use native <ul>/<ol> instead of <div role="list">');
  assert.match(html, /<ul\b[^>]*\bid="daily-story-causes"/i);

  // Native <fieldset> + <input type="radio"> (no custom role="radiogroup" / role="radio")
  assert.doesNotMatch(html, /\brole="radiogroup"/i, 'Use native <fieldset> + <input type="radio">');
  assert.doesNotMatch(html, /\brole="radio"/i, 'Use native <input type="radio">');
  const feedbackRadios = html.match(/<input\b[^>]*\btype="radio"[^>]*\bname="feedback-emotion"/gi) || [];
  assert.equal(feedbackRadios.length, 4, 'Expected 4 native radio inputs for feedback emotions');

  // No clickable non-native controls (<div role="button"> / <span role="button">)
  assert.doesNotMatch(html, /<(?:div|span)\b[^>]*\brole="button"/i, 'Use native <button> instead of div/span role="button"');

  // No redundant landmark roles on native <header> / <footer>
  assert.doesNotMatch(html, /<header\b[^>]*\brole="banner"/i, 'Avoid redundant role="banner" on <header>');
  assert.doesNotMatch(html, /<footer\b[^>]*\brole="contentinfo"/i, 'Avoid redundant role="contentinfo" on <footer>');
});

test('index.html enforces valid WAI-ARIA attributes and WCAG 2.1 AA/AAA requirements', async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, 'index.html'), 'utf8');

  // Valid tablist/tab/tabpanel pattern (no aria-pressed on role="tab")
  const tabTags = html.match(/<button\b[^>]*\brole="tab"[^>]*>/gi) || [];
  assert.equal(tabTags.length, 6, 'Expected 6 CAA tab buttons');
  for (const tag of tabTags) {
    assert.doesNotMatch(tag, /\baria-pressed=/i, `Invalid aria-pressed on role="tab": ${tag}`);
    assert.match(tag, /\baria-selected="(?:true|false)"/i, `Missing aria-selected on role="tab": ${tag}`);
    assert.match(tag, /\baria-controls="caa-panel"/i, `Missing aria-controls on role="tab": ${tag}`);
  }
  assert.match(html, /<div\b[^>]*\bid="caa-panel"[^>]*\brole="tabpanel"[^>]*\baria-labelledby="caa-tab-todos"/i);

  // Valid menuitemcheckbox for toggleable chat menu item (no aria-pressed on role="menuitem")
  assert.doesNotMatch(html, /\brole="menuitem"[^>]*\baria-pressed=/i, 'Use role="menuitemcheckbox" + aria-checked instead of role="menuitem" + aria-pressed');
  assert.match(html, /<button\b[^>]*\bid="btn-toggle-auto-tts"[^>]*\brole="menuitemcheckbox"[^>]*\baria-checked="true"/i);

  // Every role="group" has an accessible name (aria-label or aria-labelledby)
  const groupTags = html.match(/<[a-z0-9]+\b[^>]*\brole="group"[^>]*>/gi) || [];
  assert.ok(groupTags.length > 0);
  for (const tag of groupTags) {
    assert.match(
      tag,
      /\b(?:aria-label|aria-labelledby)=/i,
      `role="group" must have an accessible name: ${tag}`
    );
  }

  // Place pills expose pressed state
  const placeButtons = html.match(/<button\b[^>]*\bdata-adapted-place="[^"]+"[^>]*>/gi) || [];
  assert.equal(placeButtons.length, 4);
  for (const btn of placeButtons) {
    assert.match(btn, /\baria-pressed="(?:true|false)"/i, `Missing aria-pressed on place button: ${btn}`);
  }

  // Every <img> has an alt attribute
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  assert.ok(imgTags.length > 0);
  for (const img of imgTags) {
    assert.match(img, /\balt="/i, `Missing alt attribute on <img>: ${img}`);
  }

  // Skip link and main landmark
  assert.match(html, /<a\b[^>]*href="#main-content"[^>]*class="skip-link"/i);
  assert.match(html, /<main\b[^>]*\bid="main-content"/i);
});

test('JS modules keep native dialog/progress/ARIA contracts consistent', async () => {
  const [routerJs, a11yJs, caaJs, chatJs, teacherJs, dailyStoryJs] = await Promise.all([
    fs.readFile(path.join(ROOT_DIR, 'src/js/core/router.js'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/accessibility.js'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/caa.js'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/chat.js'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/teacher-panel.js'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/daily-story.js'), 'utf8'),
  ]);

  assert.match(routerJs, /\.showModal\b/);
  assert.match(routerJs, /progressBar\.max\s*=/);
  assert.match(routerJs, /progressBar\.value\s*=/);

  assert.match(a11yJs, /safeExit\?\.showModal/);
  assert.match(a11yJs, /addEventListener\('cancel'/);

  assert.doesNotMatch(caaJs, /aria-pressed/);
  assert.match(caaJs, /ArrowRight/);
  assert.match(caaJs, /ArrowLeft/);

  assert.match(chatJs, /menuitemcheckbox/);
  assert.match(chatJs, /setAttribute\('aria-checked'/);

  assert.match(teacherJs, /select\.setAttribute\('aria-label'/);
  assert.doesNotMatch(dailyStoryJs, /role',\s*'listitem'/);
});

test('guided help route includes sensations, routine, and Yes/No/Unknown scenes', async () => {
  const [html, flowJs, teacherJs] = await Promise.all([
    fs.readFile(path.join(ROOT_DIR, 'index.html'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/flow.js'), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, 'src/js/modules/teacher-panel.js'), 'utf8'),
  ]);

  assert.match(html, /<section\b[^>]*\bid="screen-guided-help"/i);
  assert.match(html, /data-guided-sensation="me-duele-tripa-cabeza"/i);
  assert.match(html, /data-guided-routine="recreo"/i);
  assert.equal((html.match(/data-guided-answer="no-lo-se"/gi) || []).length >= 5, true);
  assert.match(flowJs, /go\('guided-help'\)/);
  assert.match(flowJs, /btn-send-guided-help/);
  assert.match(teacherJs, /Malestar sin causa definida/);
});
