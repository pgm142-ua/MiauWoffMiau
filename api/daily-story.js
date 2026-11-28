function json(res, status, payload) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.setHeader?.('Cache-Control', 'no-store');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(payload);
  }
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (String(req?.method || 'GET').toUpperCase() !== 'POST') {
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 1200) : '';
  if (!text) return json(res, 400, { error: 'INVALID_TEXT' });

  const apiKey = typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : '';
  if (!apiKey) return json(res, 503, { error: 'AI_UNAVAILABLE', fallback: true });

  const model =
    typeof process.env.GEMINI_MODEL === 'string' && process.env.GEMINI_MODEL.trim()
      ? process.env.GEMINI_MODEL.trim()
      : 'gemini-2.5-flash';
  const lang = typeof body.lang === 'string' ? body.lang : 'es';
  const prompt =
    'Analiza este relato escolar de acoso. Devuelve SOLO JSON válido con causas (' +
    'social, exclusion, physical, digital, noise, internal, other), emotion (calm/sad/scared/angry), ' +
    'place (patio/hallways/class/entrance/digital), moment (recreo/clase/pasillo/entrada/comedor/otro), ' +
    'alertLevel (low/medium/high) y supportText. Idioma: ' +
    lang +
    '. Texto: ' +
    text;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'Eres un asistente de protección infantil. No interrogues ni culpes. Devuelve JSON seguro.' }],
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
      }
    );
    if (!response.ok) return json(res, 503, { error: 'AI_UNAVAILABLE', fallback: true });
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    let analysis = null;
    try {
      analysis = JSON.parse(raw);
    } catch {
      const start = raw?.indexOf('{');
      const end = raw?.lastIndexOf('}');
      if (start >= 0 && end > start) analysis = JSON.parse(raw.slice(start, end + 1));
    }
    return analysis
      ? json(res, 200, { ok: true, analysis })
      : json(res, 503, { error: 'AI_INVALID_RESPONSE', fallback: true });
  } catch {
    return json(res, 503, { error: 'AI_UNAVAILABLE', fallback: true });
  }
}
