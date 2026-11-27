/**
 * Funciones puras de inferencia en vivo para el panel «Tu aviso anónimo»
 * del chatbot (sin dependencias del DOM para facilitar pruebas unitarias).
 */

function normalizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const FIRST_PERSON_VICTIM_RE =
  /(?<![\p{L}\p{N}])(?:a mi|me pasa a mi|se burlan de mi|se rien de mi|me insultan|me insulta|me empujan|me empuja|me pegan|me pega|me dejan sol[oa]|me deja sol[oa]|me quitan|me acosan|me molestan|no me dejan|no me hablan|em pasa a mi|es riuen de mi|em deixen sol|happens? to me|happening to me|bullying me|teasing me|laugh(?:ing|ed)? at me|push(?:ing)? me|hit(?:ting)? me|leave me alone|ca m'arrive|se moquent de moi|es passiert mir|lachen uber mich|acontece comigo|riem de mim|يتنمرون علي|يسخرون مني|يحدث لي|يدفعونني|يضربونني)(?![\p{L}\p{N}])/u;

const SEVERAL_RE =
  /(?<![\p{L}\p{N}])(?:a varios|varios companeros|varias companeras|a diversos|diversos companys|several classmates|multiple classmates|a plusieurs|plusieurs camarades|mehreren mitschuler(?:innen)?|mehrere mitschuler(?:innen)?|a varios colegas|varios colegas|لعده زملاء|عده زملاء)(?![\p{L}\p{N}])/u;

const WITNESS_RE =
  /(?<![\p{L}\p{N}])(?:a un companero|a una companera|un companero|una companera|un chico|una chica|lo he visto|le insultan|le empujan|le pegan|le dejan sol[oa]|le quitan|se meten con un|se meten con una|un company|una companya|ho he vist|a classmate|saw it|i saw|push(?:ing)? him|push(?:ing)? her|un camarade|une camarade|je l'ai vu|ein mitschuler|eine mitschulerin|um colega|uma colega|زميل|زميله|لقد رايت)(?![\p{L}\p{N}])/u;

const RECIPIENT_RULES = [
  {
    recipient: 'guidance',
    re: /(?<![\p{L}\p{N}])(?:orientacion|orientador|orientadora|orientacio|psicologo|psicologa|bienestar|benestar|guidance|counselor|counsellor|wellbeing|conseiller|conseillere|orientation|schulberatung|orientacao|المرشد|التوجيه)(?![\p{L}\p{N}])/u,
  },
  {
    recipient: 'director',
    re: /(?<![\p{L}\p{N}])(?:direccion|direccio|director|directora|convivencia|principal|headteacher|headmaster|direction|schulleitung|direcao|الاداره|المدير|المديره)(?![\p{L}\p{N}])/u,
  },
  {
    recipient: 'tutor',
    re: /(?<![\p{L}\p{N}])(?:tutor|tutora|tutoria|profesor|profesora|profe|docente|maestro|maestra|teacher|homeroom|enseignant|enseignante|professeur|lehrer|lehrerin|lehrkraft|professor|professora|معلم|معلمه|استاذ)(?![\p{L}\p{N}])/u,
  },
];

const WHAT_PICTOGRAM_RULES = [
  {
    file: 'insultar.png',
    re: /burla|insult|reir|rien|rieron|mote|apodo|humill|riure|riuen|burlat|teas|mock|laugh|name.?call|moqu|spott|beleidig|ausgelach|goza|zombar|xing|سخر|استهز|شتم|اهانه/,
  },
  {
    file: 'empujar.png',
    re: /empuj|golpe|pegar|pegan|pego|patada|punet|rompen|rompio|quitan|quitaron|robar|roban|mochila|empent|colp|push|hit|kick|punch|slap|frapp|pouss|schlag|schubs|empurr|bateu|ضرب|دفع|ركل|سرق/,
  },
  {
    file: 'solo.png',
    re: /\bsol[oa]s?\b|soledad|exclus|excluy|ignor|apart|no me dejan|no le dejan|dejan fuera|solitud|no em deixen|alone|lonely|left out|seul|ecart|allein|ausgeschloss|sozinh|وحيد|وحدي|استبعاد|تجاهل/,
  },
  {
    file: 'miedo.png',
    re: /miedo|asustad|terror|panico|bloque|tinc por|fa por|scared|afraid|fear|peur|angst|medo|خوف|خائف|رعب/,
  },
  {
    file: 'triste.png',
    re: /triste|llor|pena|trist|sad|cry|pleur|traurig|حزين|ابكي|بكاء/,
  },
  {
    file: 'enfadado.png',
    re: /enfadad|rabia|furios|enfadat|angry|mad|fach|wutend|zangad|غاضب|غضب/,
  },
];

const GREETING_OR_ACK_RE =
  /^(?:hola|buenas|buenos dias|buenas tardes|gracias|muchas gracias|ok|vale|si|no|claro|listo|perfecto|hi|hello|hey|thanks|thank you|yes|okay|bon dia|hola!|gracies|salut|bonjour|merci|oui|non|hallo|danke|ja|nein|ola|obrigado|obrigada|sim|nao|مرحبا|اهلا|شكرا|نعم|لا|حسنا)+[!.?\s]*$/u;

const PURE_CALM_RE =
  /(?<![\p{L}\p{N}])(?:calma|calmarme|calm|calmer|beruhig|acalmar|respir|breathe|هدا|هدوء|تنفس)(?![\p{L}\p{N}])/u;

/**
 * Infiere quién sufre la situación a partir de un mensaje libre.
 * @param {string} text
 * @returns {'victima'|'testigo'|'varios'|null}
 */
export function detectWhoFromMessage(text) {
  const norm = normalizeText(text);
  if (!norm) return null;
  if (FIRST_PERSON_VICTIM_RE.test(norm)) return 'victima';
  if (SEVERAL_RE.test(norm)) return 'varios';
  if (WITNESS_RE.test(norm)) return 'testigo';
  return null;
}

/**
 * Infiere el destinatario del centro educativo mencionado en el texto.
 * @param {string} text
 * @returns {'guidance'|'tutor'|'director'|null}
 */
export function detectRecipientFromMessage(text) {
  const norm = normalizeText(text);
  if (!norm) return null;
  for (const rule of RECIPIENT_RULES) {
    if (rule.re.test(norm)) return rule.recipient;
  }
  return null;
}

/**
 * Selecciona el pictograma ARASAAC más adecuado para describir qué ha pasado.
 * @param {string} text
 * @returns {string|null}
 */
export function detectWhatPictogram(text) {
  const norm = normalizeText(text);
  if (!norm) return null;
  for (const rule of WHAT_PICTOGRAM_RULES) {
    if (rule.re.test(norm)) return rule.file;
  }
  return null;
}

/**
 * Determina si un mensaje es puramente auxiliar (saludo, calma sin incidente,
 * o una respuesta corta que solo aporta lugar o destinatario).
 * @param {string} text
 * @param {{detectedPlace?: string|null, detectedRecipient?: string|null}} [meta]
 * @returns {boolean}
 */
export function isPureAuxiliaryMessage(text, meta = {}) {
  const clean = String(text ?? '').trim();
  const norm = normalizeText(clean);
  if (!norm) return true;
  if (GREETING_OR_ACK_RE.test(norm)) return true;

  const hasWhatSignal = Boolean(detectWhatPictogram(clean));
  if (!hasWhatSignal && PURE_CALM_RE.test(norm)) {
    return true;
  }

  const wordCount = norm.split(' ').filter(Boolean).length;
  if (wordCount <= 4 && !hasWhatSignal && (meta.detectedPlace || meta.detectedRecipient)) {
    return true;
  }

  return false;
}

/**
 * Combina el resumen actual del incidente con un nuevo mensaje sin perder
 * el relato previo ni ensuciarlo con mensajes puramente auxiliares.
 * @param {string} currentText
 * @param {string} incomingText
 * @param {{detectedPlace?: string|null, detectedRecipient?: string|null}} [meta]
 * @returns {string}
 */
export function mergeIncidentSummary(currentText, incomingText, meta = {}) {
  const cur = String(currentText ?? '').trim();
  const inc = String(incomingText ?? '').trim();
  if (!inc) return cur;

  const aux = isPureAuxiliaryMessage(inc, meta);
  if (!cur) {
    return aux ? '' : inc.slice(0, 220);
  }
  if (aux) return cur;

  const normCur = normalizeText(cur);
  const normInc = normalizeText(inc);
  if (normCur.includes(normInc)) return cur;
  if (normInc.includes(normCur)) return inc.slice(0, 220);

  const combined = `${cur} · ${inc}`;
  return combined.length > 220 ? `${combined.slice(0, 217).trimEnd()}…` : combined;
}
