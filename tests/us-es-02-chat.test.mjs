import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  VALID_LANGS,
  VALID_PLACES,
  buildChatSystemPrompt,
  detectCrisis,
  detectSuggestedPlace,
  getCrisisReply,
  requestGeminiServerReply,
  sanitizeHistory
} from '../api/_lib/chat-engine.js';
import chatHandler from '../api/chat.js';
import {
  detectRecipientFromMessage,
  detectWhatPictogram,
  detectWhoFromMessage,
  isPureAuxiliaryMessage,
  mergeIncidentSummary
} from '../src/js/modules/chat-report-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function createMockRes() {
  const headers = new Map();
  let statusCode = 200;
  let rawBody = '';
  let jsonBody;

  return {
    setHeader(name, value) {
      headers.set(String(name).toLowerCase(), String(value));
    },
    getHeader(name) {
      return headers.get(String(name).toLowerCase());
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      jsonBody = payload;
      rawBody = JSON.stringify(payload);
      return this;
    },
    end(chunk = '') {
      rawBody = String(chunk);
      if (rawBody) {
        try {
          jsonBody = JSON.parse(rawBody);
        } catch {
          jsonBody = undefined;
        }
      }
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    set statusCode(code) {
      statusCode = code;
    },
    get body() {
      return jsonBody;
    },
    get rawBody() {
      return rawBody;
    }
  };
}

function createMinimalBrowserEnv() {
  const store = new Map();
  const elements = new Map();

  const createMockElement = (id) => ({
    id,
    value: '',
    textContent: '',
    checked: false,
    classList: {
      toggle() {},
      contains() {
        return false;
      }
    },
    setAttribute() {},
    addEventListener() {}
  });

  const documentMock = {
    documentElement: { lang: 'es', dir: 'ltr' },
    title: '',
    getElementById(id) {
      if (!elements.has(id)) {
        return null;
      }
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    },
    createElement(tag) {
      return createMockElement(tag);
    }
  };

  const sessionStorageMock = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };

  const windowMock = {
    speechSynthesis: { cancel() {} }
  };

  const navigatorMock = {
    language: 'es-ES'
  };

  return {
    document: documentMock,
    window: windowMock,
    sessionStorage: sessionStorageMock,
    navigator: navigatorMock,
    elements,
    createMockElement
  };
}

function extractScreenNoAdaptedSection(html) {
  const startMatch = html.match(/<section\b[^>]*\bid=["']screen-no-adapted["'][^>]*>/i);
  assert.ok(startMatch, 'Expected <section id="screen-no-adapted"> in index.html');
  const startIndex = startMatch.index;
  const tagRegex = /<\/?section\b[^>]*>/gi;
  tagRegex.lastIndex = startIndex;

  let depth = 0;
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(startIndex, match.index + match[0].length);
      }
    } else {
      depth += 1;
    }
  }

  assert.fail('Could not find closing </section> for #screen-no-adapted');
}

/* ==========================================================================
 * 1. Backend engine (api/_lib/chat-engine.js)
 * ========================================================================== */

test('detectSuggestedPlace detects all 5 places and null across languages', () => {
  const cases = [
    // patio
    ['Se meten conmigo en el recreo', 'patio'],
    ['Someone pushes me on the playground', 'patio'],
    ['Ça se passe dans la cour de récréation', 'patio'],
    ['يتنمرون علي في الساحة وقت الاستراحة', 'patio'],
    ['Auf dem Schulhof lachen sie über mich', 'patio'],
    ['No recreio ficam me provocando', 'patio'],
    // hallways
    ['Me esperan en los pasillos y baños', 'hallways'],
    ['They block my locker in the hallway', 'hallways'],
    ['Il y a un problème dans le couloir près des toilettes', 'hallways'],
    ['يضايقونني في الممر قرب الحمام', 'hallways'],
    ['Im Flur vor der Umkleide passiert es', 'hallways'],
    // class
    ['Se burlan de mí en clase delante de la pizarra', 'class'],
    ['Someone hides my notebook in the classroom', 'class'],
    ['Ils se moquent pendant le cours dans la salle de classe', 'class'],
    ['يسخرون مني داخل الفصل أثناء الدرس', 'class'],
    ['Im Klassenzimmer werfen sie Sachen', 'class'],
    // digital
    ['Me mandan mensajes por WhatsApp y suben fotos', 'digital'],
    ['They made a fake account on social media', 'digital'],
    ['On me harcèle par message sur Instagram', 'digital'],
    ['يرسلون لي رسائل مؤذية على واتساب', 'digital'],
    ['Über das Handy und WhatsApp bekomme ich Drohungen', 'digital'],
    // entrance
    ['Me siguen en la salida y en la parada del autobús', 'entrance'],
    ['They wait for me at the school gate on my way home', 'entrance'],
    ['À la sortie près du portail et du bus scolaire', 'entrance'],
    ['ينتظرونني عند بوابة المدرسة وموقف الباص', 'entrance'],
    ['Am Schultor und auf dem Heimweg verfolgen sie mich', 'entrance'],
    // null
    ['No sé qué hacer, me siento triste hoy', null],
    ['I feel sad and alone today', null],
    ['Je me sens triste et inquiet aujourd’hui', null],
    ['أشعر بالحزن اليوم ولا أعرف ماذا أفعل', null],
    ['', null],
    [null, null]
  ];

  for (const [text, expected] of cases) {
    assert.equal(
      detectSuggestedPlace(text),
      expected,
      `Expected ${expected} for "${text}"`
    );
  }
});

test('detectCrisis detects crisis phrases across languages and avoids false positives', () => {
  const crisisInputs = [
    'No quiero vivir más, quiero suicidarme',
    'A veces pienso en hacerme daño o cortarme',
    'Alguien trae un cuchillo y me quiere matar',
    'I want to die and hurt myself',
    'Someone has a knife and wants to kill me',
    'Je veux mourir et mettre fin à mes jours',
    'Ich will sterben und mich umbringen',
    'Não quero viver, penso em me matar',
    'أريد أن أموت أو أنتحر',
    'أحدهم يحمل سكين ويهدد بقتلي',
    'No vull viure més, em vull fer-me mal'
  ];

  for (const input of crisisInputs) {
    assert.equal(detectCrisis(input), true, `Expected crisis=true for "${input}"`);
  }

  const safeInputs = [
    'Se burlan de mí en el patio y me dejan solo',
    'Ayúdame a calmarme ahora mismo, tengo miedo',
    'Hay problemas en los pasillos cuando cambiamos de clase',
    'They tease me at recess and won’t let me play',
    'Un compañero me quitó el bocadillo en el comedor',
    'Me siento triste porque no me hablan en clase',
    'On se moque de moi dans la cour',
    'أشعر بالخوف في الاستراحة لأنهم يتجاهلونني',
    '',
    null
  ];

  for (const input of safeInputs) {
    assert.equal(detectCrisis(input), false, `Expected crisis=false for "${input}"`);
  }
});

test('getCrisisReply returns non-empty text with 112 and 900 018 018 for all 7 languages', () => {
  assert.deepEqual(VALID_LANGS, ['es', 'ca', 'en', 'fr', 'de', 'pt', 'ar']);

  for (const lang of VALID_LANGS) {
    const reply = getCrisisReply(lang);
    assert.equal(typeof reply, 'string');
    assert.ok(reply.trim().length > 20, `Crisis reply for ${lang} should be substantive`);
    assert.ok(reply.includes('112'), `Crisis reply for ${lang} must include 112`);
    assert.ok(reply.includes('900 018 018'), `Crisis reply for ${lang} must include 900 018 018`);
  }

  // Fallback for unknown language returns Spanish crisis reply
  assert.equal(getCrisisReply('xx'), getCrisisReply('es'));
});

test('sanitizeHistory trims to max 6 entries, caps text at 600 chars, and drops invalid items', () => {
  assert.deepEqual(sanitizeHistory(null), []);
  assert.deepEqual(sanitizeHistory('not-an-array'), []);

  const longText = 'a'.repeat(750);
  const raw = [
    null,
    'string-item',
    { role: 'system', text: 'ignore me' },
    { role: 'assistant', text: 'wrong role name' },
    { role: 'user', text: '   ' },
    { role: 'model', text: 123 },
    { role: 'user', text: 'turn 1' },
    { role: 'model', text: 'turn 2' },
    { role: 'user', text: 'turn 3' },
    { role: 'model', text: 'turn 4' },
    { role: 'user', text: 'turn 5' },
    { role: 'model', text: 'turn 6' },
    { role: 'user', text: `  ${longText}  ` }
  ];

  const cleaned = sanitizeHistory(raw);
  assert.equal(cleaned.length, 6);
  assert.deepEqual(
    cleaned.slice(0, 5),
    [
      { role: 'model', text: 'turn 2' },
      { role: 'user', text: 'turn 3' },
      { role: 'model', text: 'turn 4' },
      { role: 'user', text: 'turn 5' },
      { role: 'model', text: 'turn 6' }
    ]
  );
  assert.equal(cleaned[5].role, 'user');
  assert.equal(cleaned[5].text.length, 600);
  assert.equal(cleaned[5].text, 'a'.repeat(600));
});

test('requestGeminiServerReply sends key in x-goog-api-key header only, parses text, and throws on non-2xx', async () => {
  const captured = [];
  const fakeFetch = async (url, init) => {
    captured.push({ url, init });
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          candidates: [
            {
              content: {
                parts: [
                  { text: 'razonamiento interno', thought: true },
                  { text: 'Siento mucho que pases por eso. ' },
                  { text: 'No estás solo.' }
                ]
              }
            }
          ]
        };
      }
    };
  };

  const secretKey = 'AIzaSy-TEST-SECRET-KEY';
  const reply = await requestGeminiServerReply({
    message: 'Se ríen de mí en el patio',
    history: [
      { role: 'user', text: 'Hola' },
      { role: 'model', text: 'Hola, estoy aquí.' }
    ],
    lang: 'es',
    branch: 'victima',
    apiKey: secretKey,
    fetchImpl: fakeFetch
  });

  assert.equal(reply, 'Siento mucho que pases por eso. No estás solo.');
  assert.equal(captured.length, 1);

  const { url, init } = captured[0];
  assert.ok(!url.includes(secretKey), 'API key must NOT be in URL');
  assert.ok(!url.includes('key='), 'Query parameter key= must NOT be in URL');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers['x-goog-api-key'], secretKey);
  assert.equal(init.headers['Content-Type'], 'application/json');

  const payload = JSON.parse(init.body);
  assert.equal(payload.systemInstruction.parts[0].text, buildChatSystemPrompt('es', 'victima'));
  assert.equal(payload.generationConfig.maxOutputTokens, 512);
  assert.deepEqual(payload.generationConfig.thinkingConfig, { thinkingBudget: 0 });
  assert.equal(payload.contents.length, 3);
  assert.deepEqual(payload.contents[2], {
    role: 'user',
    parts: [{ text: 'Se ríen de mí en el patio' }]
  });

  // Non-2xx throws
  await assert.rejects(
    () =>
      requestGeminiServerReply({
        message: 'Hola',
        apiKey: secretKey,
        fetchImpl: async () => ({ ok: false, status: 502 })
      }),
    /GEMINI_HTTP_502/
  );

  // Empty candidates throws
  await assert.rejects(
    () =>
      requestGeminiServerReply({
        message: 'Hola',
        apiKey: secretKey,
        fetchImpl: async () => ({
          ok: true,
          status: 200,
          async json() {
            return { candidates: [] };
          }
        })
      }),
    /EMPTY_GEMINI_REPLY/
  );

  // Missing API key throws
  await assert.rejects(
    () => requestGeminiServerReply({ message: 'Hola', apiKey: '', fetchImpl: fakeFetch }),
    /MISSING_API_KEY/
  );
});

/* ==========================================================================
 * 2. Backend HTTP handler (api/chat.js)
 * ========================================================================== */

test('api/chat.js GET returns availability without leaking secret and sets security headers', async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    const resLocal = createMockRes();
    await chatHandler({ method: 'GET' }, resLocal);
    assert.equal(resLocal.statusCode, 200);
    assert.deepEqual(resLocal.body, { ok: true, available: false, mode: 'local' });
    assert.equal(resLocal.getHeader('cache-control'), 'no-store');
    assert.equal(resLocal.getHeader('x-content-type-options'), 'nosniff');

    const secret = 'AIzaSy-SUPER-SECRET-VALUE';
    process.env.GEMINI_API_KEY = secret;
    const resServer = createMockRes();
    await chatHandler({ method: 'GET' }, resServer);
    assert.equal(resServer.statusCode, 200);
    assert.deepEqual(resServer.body, { ok: true, available: true, mode: 'server' });
    assert.equal(resServer.getHeader('cache-control'), 'no-store');
    assert.equal(resServer.getHeader('x-content-type-options'), 'nosniff');
    assert.ok(!resServer.rawBody.includes(secret), 'Secret must never appear in GET body');
  } finally {
    if (prevKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = prevKey;
  }
});

test('api/chat.js rejects PUT and DELETE with 405 METHOD_NOT_ALLOWED', async () => {
  for (const method of ['PUT', 'DELETE']) {
    const res = createMockRes();
    await chatHandler({ method }, res);
    assert.equal(res.statusCode, 405);
    assert.deepEqual(res.body, { error: 'METHOD_NOT_ALLOWED' });
    assert.equal(res.getHeader('cache-control'), 'no-store');
    assert.equal(res.getHeader('x-content-type-options'), 'nosniff');
  }
});

test('api/chat.js POST rejects empty or invalid body with 400 INVALID_MESSAGE', async () => {
  const invalidBodies = [
    undefined,
    null,
    {},
    { message: '' },
    { message: '   ' },
    { message: 12345 },
    { message: 'x'.repeat(1201) },
    'not-valid-json',
    '{"message": ""}'
  ];

  for (const body of invalidBodies) {
    const res = createMockRes();
    await chatHandler({ method: 'POST', body }, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'INVALID_MESSAGE' });
  }
});

test('api/chat.js POST returns safety crisis reply without calling Gemini', async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  const prevFetch = globalThis.fetch;
  let fetchCalled = false;

  try {
    process.env.GEMINI_API_KEY = 'AIzaSy-CRISIS-TEST-KEY';
    globalThis.fetch = async () => {
      fetchCalled = true;
      throw new Error('Gemini should not be called for crisis messages');
    };

    const res = createMockRes();
    await chatHandler(
      {
        method: 'POST',
        body: {
          message: 'No quiero vivir más, me siento fatal en el patio',
          lang: 'es',
          branch: 'victima'
        }
      },
      res
    );

    assert.equal(fetchCalled, false, 'Gemini must NOT be invoked on crisis input');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.source, 'safety');
    assert.equal(res.body.crisis, true);
    assert.equal(res.body.suggestedPlace, 'patio');
    assert.ok(res.body.reply.includes('112'));
    assert.ok(res.body.reply.includes('900 018 018'));
  } finally {
    globalThis.fetch = prevFetch;
    if (prevKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = prevKey;
  }
});

test('api/chat.js POST without GEMINI_API_KEY returns 503 AI_UNAVAILABLE with fallback and suggestedPlace', async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    const res = createMockRes();
    await chatHandler(
      {
        method: 'POST',
        body: {
          message: 'Me molestan en los pasillos',
          lang: 'es'
        }
      },
      res
    );

    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.body, {
      error: 'AI_UNAVAILABLE',
      fallback: true,
      suggestedPlace: 'hallways'
    });
  } finally {
    if (prevKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = prevKey;
  }
});

test('api/chat.js POST with GEMINI_API_KEY and mocked fetch returns 200 server response', async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  const prevModel = process.env.GEMINI_MODEL;
  const prevFetch = globalThis.fetch;
  const secret = 'AIzaSy-SERVER-TEST-KEY';

  try {
    process.env.GEMINI_API_KEY = secret;
    process.env.GEMINI_MODEL = 'gemini-2.5-flash';
    let capturedHeaders = null;

    globalThis.fetch = async (url, init) => {
      capturedHeaders = init.headers;
      assert.ok(!url.includes(secret));
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            candidates: [
              {
                content: {
                  parts: [{ text: 'Gracias por contarlo. Puedes pedir ayuda a un adulto.' }]
                }
              }
            ]
          };
        }
      };
    };

    const res = createMockRes();
    await chatHandler(
      {
        method: 'POST',
        body: JSON.stringify({
          message: 'Me envían mensajes por WhatsApp',
          history: [{ role: 'user', text: 'Hola' }],
          lang: 'es',
          branch: 'victima'
        })
      },
      res
    );

    assert.equal(capturedHeaders['x-goog-api-key'], secret);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      reply: 'Gracias por contarlo. Puedes pedir ayuda a un adulto.',
      suggestedPlace: 'digital',
      source: 'server',
      crisis: false
    });
    assert.ok(!res.rawBody.includes(secret));
  } finally {
    globalThis.fetch = prevFetch;
    if (prevKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = prevKey;
    if (prevModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = prevModel;
  }
});

/* ==========================================================================
 * 3. Frontend service (src/js/services/gemini.js)
 * ========================================================================== */

test('src/js/services/gemini.js local detection, buildLocalChatReply, and askGemini behavior', async (t) => {
  const mockEnv = createMinimalBrowserEnv();
  const prevFetch = globalThis.fetch;
  const globalNames = ['document', 'window', 'sessionStorage', 'navigator'];
  const prevDescriptors = new Map(
    globalNames.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)])
  );

  for (const name of globalNames) {
    Object.defineProperty(globalThis, name, {
      value: mockEnv[name],
      configurable: true,
      writable: true,
      enumerable: true
    });
  }

  t.after(() => {
    for (const name of globalNames) {
      const desc = prevDescriptors.get(name);
      if (desc) {
        Object.defineProperty(globalThis, name, desc);
      } else {
        delete globalThis[name];
      }
    }
    globalThis.fetch = prevFetch;
  });

  const geminiMod = await import(`../src/js/services/gemini.js?test=${Date.now()}`);
  const {
    detectSuggestedPlace: feDetectPlace,
    detectCrisis: feDetectCrisis,
    buildLocalChatReply,
    askGemini
  } = geminiMod;

  // detectSuggestedPlace
  assert.equal(feDetectPlace('En el recreo me dejan solo'), 'patio');
  assert.equal(feDetectPlace('En los pasillos me empujan'), 'hallways');
  assert.equal(feDetectPlace('En clase se ríen de mí'), 'class');
  assert.equal(feDetectPlace('En WhatsApp me insultan'), 'digital');
  assert.equal(feDetectPlace('En la salida del autobús'), 'entrance');
  assert.equal(feDetectPlace('Hoy estoy un poco triste'), null);

  // detectCrisis
  assert.equal(feDetectCrisis('Quiero suicidarme'), true);
  assert.equal(feDetectCrisis('I want to die'), true);
  assert.equal(feDetectCrisis('Se burlan de mí en el recreo'), false);
  assert.equal(feDetectCrisis('Ayúdame a calmarme'), false);

  // buildLocalChatReply: all 5 places + calm + crisis + default
  const patioLocal = buildLocalChatReply('Me molestan en el patio');
  assert.equal(patioLocal.suggestedPlace, 'patio');
  assert.equal(patioLocal.source, 'local');
  assert.equal(patioLocal.crisis, false);
  assert.ok(patioLocal.reply.includes('Patio / Recreo'));

  const hallwaysLocal = buildLocalChatReply('Me esperan en el pasillo');
  assert.equal(hallwaysLocal.suggestedPlace, 'hallways');
  assert.equal(hallwaysLocal.source, 'local');
  assert.equal(hallwaysLocal.crisis, false);
  assert.ok(hallwaysLocal.reply.toLowerCase().includes('pasillos'));

  const classLocal = buildLocalChatReply('Me molestan en clase');
  assert.equal(classLocal.suggestedPlace, 'class');
  assert.equal(classLocal.source, 'local');
  assert.equal(classLocal.crisis, false);
  assert.ok(classLocal.reply.includes('En clase'));

  const digitalLocal = buildLocalChatReply('Me acosan por WhatsApp');
  assert.equal(digitalLocal.suggestedPlace, 'digital');
  assert.equal(digitalLocal.source, 'local');
  assert.equal(digitalLocal.crisis, false);
  assert.ok(digitalLocal.reply.includes('Móvil / Redes'));

  const entranceLocal = buildLocalChatReply('Me siguen en la salida del colegio');
  assert.equal(entranceLocal.suggestedPlace, 'entrance');
  assert.equal(entranceLocal.source, 'local');
  assert.equal(entranceLocal.crisis, false);
  assert.ok(entranceLocal.reply.includes('Entrada / Salida'));

  const calmLocal = buildLocalChatReply('Tengo mucho miedo y necesito calma');
  assert.equal(calmLocal.suggestedPlace, null);
  assert.equal(calmLocal.source, 'local');
  assert.equal(calmLocal.crisis, false);
  assert.ok(calmLocal.reply.includes('Calma'));

  const crisisLocal = buildLocalChatReply('No quiero vivir más');
  assert.equal(crisisLocal.source, 'safety');
  assert.equal(crisisLocal.crisis, true);
  assert.ok(crisisLocal.reply.includes('112'));
  assert.ok(crisisLocal.reply.includes('900 018 018'));

  const defaultLocal = buildLocalChatReply('Hoy ha sido un día difícil');
  assert.equal(defaultLocal.suggestedPlace, null);
  assert.equal(defaultLocal.source, 'local');
  assert.equal(defaultLocal.crisis, false);
  assert.ok(defaultLocal.reply.length > 0);
  assert.notEqual(defaultLocal.reply, calmLocal.reply);

  // askGemini: 200 server response, no API key header sent
  let lastFetchArgs = null;
  globalThis.fetch = async (url, init) => {
    lastFetchArgs = { url, init };
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          reply: 'Estoy contigo. Puedes hablar con orientación.',
          suggestedPlace: 'patio',
          source: 'server',
          crisis: false
        };
      }
    };
  };

  const serverResult = await askGemini('Se meten conmigo en el recreo', {
    lang: 'es',
    branch: 'victima'
  });
  assert.equal(lastFetchArgs.url, '/api/chat');
  const headerKeys = Object.keys(lastFetchArgs.init.headers).map((k) => k.toLowerCase());
  assert.ok(!headerKeys.includes('x-goog-api-key'), 'Client must NOT send x-goog-api-key');
  assert.ok(!headerKeys.includes('authorization'), 'Client must NOT send Authorization header');
  assert.deepEqual(serverResult, {
    reply: 'Estoy contigo. Puedes hablar con orientación.',
    suggestedPlace: 'patio',
    source: 'server',
    crisis: false
  });

  // askGemini: 503 response falls back cleanly to local reply with suggestedPlace
  globalThis.fetch = async () => ({
    ok: false,
    status: 503,
    async json() {
      return { error: 'AI_UNAVAILABLE', fallback: true, suggestedPlace: 'digital' };
    }
  });
  const fallback503 = await askGemini('Me insultan en Instagram');
  assert.equal(fallback503.source, 'local');
  assert.equal(fallback503.crisis, false);
  assert.equal(fallback503.suggestedPlace, 'digital');
  assert.ok(fallback503.reply.includes('Móvil / Redes'));

  // askGemini: network error falls back cleanly to local reply
  globalThis.fetch = async () => {
    throw new Error('Failed to fetch');
  };
  const fallbackNet = await askGemini('Me esperan en los pasillos');
  assert.equal(fallbackNet.source, 'local');
  assert.equal(fallbackNet.crisis, false);
  assert.equal(fallbackNet.suggestedPlace, 'hallways');
  assert.ok(fallbackNet.reply.length > 0);

  // askGemini: AbortError returns null
  globalThis.fetch = async () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    throw err;
  };
  const aborted = await askGemini('Hola');
  assert.equal(aborted, null);
});

/* ==========================================================================
 * 4. HTML / Accessibility & i18n checks
 * ========================================================================== */

test('index.html #screen-no-adapted has required accessible controls and no API modal button', async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const section = extractScreenNoAdaptedSection(html);

  const quickPromptMatches = section.match(/class="[^"]*\bquick-prompt-btn\b[^"]*"/g) || [];
  assert.equal(quickPromptMatches.length, 4, 'Expected exactly 4 .quick-prompt-btn buttons');

  assert.match(section, /\bid="btn-chat-mic"/);
  assert.match(section, /\bid="btn-toggle-auto-tts"/);

  const anonPlaceMatch = section.match(/<select\b[^>]*\bid="anon-place"[^>]*>([\s\S]*?)<\/select>/i);
  assert.ok(anonPlaceMatch, 'Expected <select id="anon-place"> inside #screen-no-adapted');
  const optionValues = Array.from(anonPlaceMatch[1].matchAll(/<option\b[^>]*\bvalue="([^"]+)"/gi)).map(
    (m) => m[1]
  );
  assert.deepEqual(optionValues, VALID_PLACES);

  const hintMatch = section.match(/<([a-z0-9]+)\b[^>]*\bid="chat-place-hint"[^>]*>/i);
  assert.ok(hintMatch, 'Expected #chat-place-hint element inside #screen-no-adapted');
  assert.match(hintMatch[0], /\brole="status"/);
  assert.match(hintMatch[0], /\baria-live="polite"/);

  assert.equal(
    section.includes('btn-open-api-modal'),
    false,
    '#btn-open-api-modal must NOT exist inside #screen-no-adapted'
  );
});

test('all 7 locales share identical key counts and include valid chat_* translations', async () => {
  const expectedNewKeys = [
    'chat_status_server',
    'chat_thinking',
    'chat_place_detected',
    'chat_offline_class',
    'chat_offline_digital',
    'chat_offline_entrance',
    'chat_crisis_reply'
  ];

  const dicts = {};
  for (const lang of VALID_LANGS) {
    const mod = await import(`../src/js/services/locales/${lang}.js`);
    dicts[lang] = mod.default;
  }

  const baseKeys = Object.keys(dicts.es).sort();

  for (const lang of VALID_LANGS) {
    const dict = dicts[lang];
    const keys = Object.keys(dict).sort();
    assert.equal(
      keys.length,
      baseKeys.length,
      `Locale ${lang} key count (${keys.length}) differs from es (${baseKeys.length})`
    );
    assert.deepEqual(keys, baseKeys, `Locale ${lang} keys differ from es`);

    for (const key of expectedNewKeys) {
      assert.equal(typeof dict[key], 'string', `Missing ${key} in ${lang}`);
      assert.ok(dict[key].trim().length > 0, `Empty ${key} in ${lang}`);
    }

    assert.ok(
      dict.chat_place_detected.includes('{place}'),
      `Locale ${lang} chat_place_detected must include {place}`
    );
    assert.ok(
      dict.chat_crisis_reply.includes('112'),
      `Locale ${lang} chat_crisis_reply must include 112`
    );
    assert.ok(
      dict.chat_crisis_reply.includes('900 018 018'),
      `Locale ${lang} chat_crisis_reply must include 900 018 018`
    );

    const mockupKeys = [
      'chat_nube_name',
      'chat_nube_subtitle',
      'chat_privacy_chip',
      'chat_sos_btn',
      'chat_more_options',
      'chat_speak_msg',
      'chat_sos_banner',
      'chat_report_title',
      'chat_report_sub',
      'chat_report_progress',
      'chat_report_no_name',
      'chat_slot_who',
      'chat_slot_where',
      'chat_slot_what',
      'chat_slot_to',
      'chat_slot_waiting',
      'chat_slot_change',
      'chat_slot_done',
      'chat_who_victim',
      'chat_who_witness',
      'chat_who_several',
      'chat_safe_note',
      'chat_send_anon_short',
      'chat_foot_recipient',
      'chat_foot_hint',
      'chat_sent_title',
      'chat_sent_desc',
      'chat_sent_keep_talking',
      'chat_toast_ready',
      'chat_toast_view'
    ];
    for (const key of mockupKeys) {
      assert.equal(typeof dict[key], 'string', `Missing ${key} in ${lang}`);
      assert.ok(dict[key].trim().length > 0, `Empty ${key} in ${lang}`);
    }
    assert.ok(
      dict.chat_report_progress.includes('{done}'),
      `Locale ${lang} chat_report_progress must include {done}`
    );
    assert.ok(
      dict.chat_foot_recipient.includes('{recipient}'),
      `Locale ${lang} chat_foot_recipient must include {recipient}`
    );
  }
});

/* ==========================================================================
 * 5. Mockup B UI & live report helpers
 * ========================================================================== */

test('index.html #screen-no-adapted implements Mockup B two-column structure and live slots', async () => {
  const html = await fs.readFile(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert.match(html, /<symbol\b[^>]*\bid="i-mic"/, 'Expected #i-mic symbol in SVG sprite');

  const section = extractScreenNoAdaptedSection(html);
  const slotMatches = section.match(/class="(?:[^"]*\s)?chat-slot(?:\s[^"]*)?"/g) || [];
  assert.equal(slotMatches.length, 4, 'Expected exactly 4 .chat-slot cards');

  for (const requiredId of [
    'chat-report',
    'btn-chat-sos',
    'chat-sos-banner',
    'btn-chat-menu',
    'chat-more-menu',
    'btn-report-handle',
    'chat-mobile-toast',
    'btn-submit-anon',
    'anon-confirm-msg',
    'anon-extra',
    'anon-recipient'
  ]) {
    assert.match(
      section,
      new RegExp(`\\bid="${requiredId}"`),
      `Expected #${requiredId} inside #screen-no-adapted`
    );
  }

  assert.match(
    section,
    /<button\b[^>]*\bid="btn-chat-mic"[^>]*>[\s\S]*?<span\b[^>]*\bclass="sr-only"[^>]*data-i18n="chat_mic_btn"/,
    'Expected <span class="sr-only" data-i18n="chat_mic_btn"> inside #btn-chat-mic to preserve icon during STT'
  );
});

test('chat-report-helpers infers who, recipient, pictogram, and incident summary cleanly', () => {
  assert.equal(detectWhoFromMessage('Se burlan de mí en el patio'), 'victima');
  assert.equal(detectWhoFromMessage('Están empujando a un compañero en el recreo'), 'testigo');
  assert.equal(detectWhoFromMessage('Se meten con varios compañeros en clase'), 'varios');
  assert.equal(detectWhoFromMessage('En el patio'), null);

  assert.equal(detectRecipientFromMessage('Quiero avisar a orientación'), 'guidance');
  assert.equal(detectRecipientFromMessage('Hablar con mi tutora'), 'tutor');
  assert.equal(detectRecipientFromMessage('Avisar a dirección del centro'), 'director');
  assert.equal(detectRecipientFromMessage('En el recreo'), null);

  assert.equal(detectWhatPictogram('Se ríen de mí y me insultan'), 'insultar.png');
  assert.equal(detectWhatPictogram('Me empujan en el pasillo'), 'empujar.png');
  assert.equal(detectWhatPictogram('Me dejan solo en el patio'), 'solo.png');
  assert.equal(detectWhatPictogram('Tengo miedo al entrar'), 'miedo.png');

  assert.equal(isPureAuxiliaryMessage('Hola'), true);
  assert.equal(isPureAuxiliaryMessage('Ayúdame a calmarme ahora mismo'), true);
  assert.equal(isPureAuxiliaryMessage('En el patio', { detectedPlace: 'patio' }), true);
  assert.equal(isPureAuxiliaryMessage('Me insultan en el patio', { detectedPlace: 'patio' }), false);

  assert.equal(mergeIncidentSummary('', 'Hola'), '');
  assert.equal(
    mergeIncidentSummary('', 'Ayúdame a calmarme ahora mismo'),
    ''
  );
  const first = mergeIncidentSummary('', 'Se burlan de mí en clase');
  assert.equal(first, 'Se burlan de mí en clase');
  assert.equal(
    mergeIncidentSummary(first, 'En el patio', { detectedPlace: 'patio' }),
    'Se burlan de mí en clase'
  );
  assert.equal(
    mergeIncidentSummary(first, 'También me quitan la mochila'),
    'Se burlan de mí en clase · También me quitan la mochila'
  );
});
