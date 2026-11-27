import {
  VALID_LANGS,
  detectCrisis,
  detectSuggestedPlace,
  getCrisisReply,
  requestGeminiServerReply,
  sanitizeHistory
} from './_lib/chat-engine.js';

const MAX_MESSAGE_LENGTH = 1200;
const DEFAULT_MODEL = 'gemini-2.5-flash';

function setResponseHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function sendJson(res, statusCode, payload) {
  setResponseHeaders(res);
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

function parseBody(rawBody) {
  if (rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)) {
    return rawBody;
  }
  if (typeof rawBody === 'string') {
    const trimmed = rawBody.trim();
    if (!trimmed) return {};
    try {
      const parsed = JSON.parse(trimmed);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req, res) {
  setResponseHeaders(res);

  const method = typeof req?.method === 'string' ? req.method.toUpperCase() : '';
  const apiKey = typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : '';

  if (method === 'GET') {
    const available = Boolean(apiKey);
    return sendJson(res, 200, {
      ok: true,
      available,
      mode: available ? 'server' : 'local'
    });
  }

  if (method !== 'POST') {
    return sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }

  const body = parseBody(req.body);
  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (!rawMessage || rawMessage.length > MAX_MESSAGE_LENGTH) {
    return sendJson(res, 400, { error: 'INVALID_MESSAGE' });
  }

  const lang = VALID_LANGS.includes(body.lang) ? body.lang : 'es';
  const branch = body.branch === 'testigo' ? 'testigo' : 'victima';
  const suggestedPlace = detectSuggestedPlace(rawMessage);

  if (detectCrisis(rawMessage)) {
    return sendJson(res, 200, {
      reply: getCrisisReply(lang),
      suggestedPlace,
      source: 'safety',
      crisis: true
    });
  }

  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'AI_UNAVAILABLE',
      fallback: true,
      suggestedPlace
    });
  }

  const model =
    typeof process.env.GEMINI_MODEL === 'string' && process.env.GEMINI_MODEL.trim()
      ? process.env.GEMINI_MODEL.trim()
      : DEFAULT_MODEL;

  try {
    const reply = await requestGeminiServerReply({
      message: rawMessage,
      history: sanitizeHistory(body.history),
      lang,
      branch,
      apiKey,
      model
    });

    return sendJson(res, 200, {
      reply,
      suggestedPlace,
      source: 'server',
      crisis: false
    });
  } catch {
    return sendJson(res, 503, {
      error: 'AI_UNAVAILABLE',
      fallback: true,
      suggestedPlace
    });
  }
}
