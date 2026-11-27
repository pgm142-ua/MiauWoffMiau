/**
 * Servicio de IA conversacional (Google Gemini opcional + motor empático local offline).
 */

import { $ } from '../core/dom.js';
import { read, save } from '../core/storage.js';
import { t } from './i18n.js';

let config = read('gemini') || { key: '', model: 'gemini-2.5-flash' };
let conversation = [];
let controller = null;

const PATIO_RE =
  /recreo|patio|solo|dejan|esbarjo|pati|recess|playground|alone|r[eé]cr[eé]|cour|seul|pause|hof|allein|p[aá]tio|sozinho|استراحة|ساحة|وحده|وحدي/i;
const HALLWAY_RE =
  /pasillo|baño|cambio|passad[ií]s|banys|hallway|restroom|corridor|couloir|toilette|flur|wechsel|corredor|ممر|ممرات|تبديل/i;
const CALM_RE =
  /calma|miedo|nervio|bloque|por|bloq|calm|scared|afraid|fear|peur|effray|angst|ruhig|medo|خوف|خائف|هدوء|أهدأ|تجم/i;

export function getGeminiConfig() {
  return config;
}

export function setGeminiConfig(nextConfig, remember = false) {
  config = nextConfig;
  save('gemini', remember ? config : null);
}

export function clearGeminiConfig() {
  config.key = '';
  save('gemini', null);
}

export function abortGemini() {
  controller?.abort();
}

export function offlineReply(text) {
  if (PATIO_RE.test(text)) {
    const placeEl = $('anon-place');
    if (placeEl) placeEl.value = 'patio';
    return t('chat_offline_patio');
  }
  if (HALLWAY_RE.test(text)) {
    const placeEl = $('anon-place');
    if (placeEl) placeEl.value = 'hallways';
    return t('chat_offline_hallway');
  }
  if (CALM_RE.test(text)) {
    return t('chat_offline_calm');
  }
  return t('chat_offline_default');
}

async function callGeminiApi(key, modelName, contents, signal) {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' +
      encodeURIComponent(modelName) +
      ':generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: t('gemini_system_prompt') }] },
        contents,
      }),
    }
  );
  if (!res.ok) throw Error('Error ' + res.status);
  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim() || offlineReply('')
  );
}

export async function askGemini(userMessage) {
  if (!config.key) {
    return offlineReply(userMessage);
  }
  const turn = { role: 'user', parts: [{ text: userMessage }] };
  controller = new AbortController();
  try {
    const reply = await callGeminiApi(
      config.key,
      config.model,
      [...conversation.slice(-6), turn],
      controller.signal
    );
    conversation.push(turn, { role: 'model', parts: [{ text: reply }] });
    return reply;
  } catch {
    return offlineReply(userMessage);
  }
}

export async function testGeminiConnection(key, modelName) {
  return callGeminiApi(key, modelName, [{ role: 'user', parts: [{ text: t('gemini_test_ping') }] }]);
}

/* ==========================================================================
 * Motor de análisis estructurado del relato diario (US-ED-14)
 * ========================================================================== */

const SUPPORTED_STORY_LANGS = ['es', 'ca', 'en', 'fr', 'de', 'pt', 'ar'];

const LANG_NAMES = {
  es: 'Spanish (Español)',
  ca: 'Catalan (Català)',
  en: 'English',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  pt: 'Portuguese (Português)',
  ar: 'Arabic (العربية)',
};

const VALID_CAUSE_CATEGORIES = [
  'social',
  'exclusion',
  'physical',
  'digital',
  'noise',
  'internal',
  'other',
];
const VALID_EMOTIONS = ['calm', 'sad', 'scared', 'angry'];
const VALID_PLACES = ['patio', 'hallways', 'class', 'entrance', 'digital'];
const VALID_MOMENTS = ['recreo', 'clase', 'pasillo', 'entrada', 'comedor', 'otro'];
const VALID_ALERT_LEVELS = ['low', 'medium', 'high'];

const CAUSE_ICONS = {
  social: '🗣️',
  exclusion: '🧍',
  physical: '✋',
  digital: '📱',
  noise: '🔊',
  internal: '💭',
  other: '💙',
};

const CAUSE_RULES = [
  {
    category: 'physical',
    re: /golpe|pegar|peg[oó]|pegaron|empuj|patada|puñet|\btir[oó]\b|\btiraron\b|rompi|romper|quitaron|quit[oó]|robaron|rob[oó]|robar|mochila|escondieron|amenaz|daño|lastim|agredi|empent|colp|pegat|trenc|amenaç|\bhit\b|push|kick|punch|slap|broke|break|stole|steal|took my|threat|hurt me|frapp|pouss|\bcoups?\b|cass|vol[eé]|menac|geschlag|schlag|schubs|\btret|kaputt|geklaut|bedroh|bateu|empurr|chut|quebr|roub|ameaç|ضرب|دفع|ركل|كسر|سرق|تهديد|أذى/i,
  },
  {
    category: 'social',
    re: /burla|burlar|insult|re[ií]r|rieron|r[ií]en|mote|apodo|chisme|hablan mal|\bfe[oa]s?\b|\btont[oa]s?\b|rid[ií]cul|humill|carcajad|burles|riure|riuen|burlat|teas|mock|laugh(ed|ing)? at|name.?call|rumor|gossip|moqu|ri(ent|ait) de moi|spott|beleidig|ausgelach|läster|goza[cçrm]|zombar|xing|riram de mim|سخر|استهز|إهانة|ضحكوا علي|شتم/i,
  },
  {
    category: 'exclusion',
    re: /exclu|\bsol[oa]s?\b|soledad|no me dejan|dejaron sol|ignoran|ignor[oó]|me apart|apartaron|sin nadie|nadie quiere|no puedo jugar|me echaron|solitud|no em deixen|ignoren|excl[oò]s|alone|lonely|left out|ignor|nobody plays|won'?t let me|\bseul|personne ne veut|allein|ausgeschloss|ignorier|sozinh|ningu[eé]m quer|وحدي|وحيد|استبعاد|تجاهل|لا يتركوني/i,
  },
  {
    category: 'digital',
    re: /m[oó]vil|tel[eé]fono|redes|foto|f[oó]to|v[ií]deo|video|whatsapp|tiktok|instagram|snapchat|\bchat|mensaje|grupo|pantalla|internet|online|grabaron|grabar|subieron|m[oò]bil|xarxes|missatge|phone|social media|message|group chat|record(ed|ing)|post(ed)?|t[eé]l[eé]phone|r[eé]seaux|handy|nachricht|telem[oó]vel|celular|mensagen|هاتف|موبايل|صور|فيديو|رسائل|إنترنت|مجموعة/i,
  },
  {
    category: 'noise',
    re: /ruido|grito|gritan|agobi|demasiada gente|mucha gente|cambio de rutina|rutina|luces|sonido fuerte|estr[eé]s|saturad|sobrecarg|soroll|criden|atabal|canvi de rutina|noise|loud|shout|yell|overwhelm|too many people|routine|sensory|bruit|crient|trop de monde|lärm|\blaut\b|geschrei|überforder|barulho|gritaria|sobrecarreg|ضوضاء|صراخ|إزعاج|زحام|ضغط/i,
  },
  {
    category: 'internal',
    re: /miedo|bloque|nervio|ansied|nudo|tembl|no pod[ií]a hablar|paraliza|angusti|preocup|p[aá]nico|tinc por|fa por|molta por|bloq|nervis|ansietat|scared|afraid|\bfear\b|freeze|froze|anxious|anxiety|nervous|panic|worried|\bpeur\b|bloqu|angoiss|nerveu|\bangst\b|blockier|nervös|panik|\bmedo\b|bloquei|ansiedad|nervos|خوف|خائف|قلق|توتر|تجمد|ذعر/i,
  },
];

const HIGH_ALERT_RE =
  /amenaz|pegar|peg[oó]|pegaron|golpe|puñet|patada|sangr|lastim|daño|no quiero ir|p[aá]nico|terror|matar|amenaç|colp|threat|hit me|punch|kick|bleed|hurt me|panic|terrified|menac|frapp|terreur|bedroh|geschlag|ameaç|bateu|ضرب|تهديد|ذعر|أذى/i;

const EMOTION_RULES = [
  {
    emotion: 'scared',
    re: /miedo|asustad|terror|p[aá]nico|tembl|espant|tinc por|fa por|molta por|espantat|scared|afraid|\bfear\b|terrified|frightened|\bpeur\b|effray|\bangst\b|erschrock|\bmedo\b|assustad|خوف|خائف|مرعوب|ذعر/i,
  },
  {
    emotion: 'angry',
    re: /enfadad|rabia|furios|molest|injust|hart[oa]|\bodio\b|enfadat|r[aà]bia|angry|\bmad\b|furious|annoyed|upset|unfair|f[aâ]ch[eé]|col[eè]re|w[uü]tend|sauer|zangad|raiva|غاضب|غضب|منزعج/i,
  },
  {
    emotion: 'sad',
    re: /triste|llor|pena|\bmal\b|dolor|\bsol[oa]s?\b|apenad|trist|plor|\bsad\b|\bcry(ing)?\b|cried|lonely|hurt|\bdown\b|pleur|traurig|wein|chor|حزين|أبكي|بكيت|وحيد/i,
  },
  {
    emotion: 'calm',
    re: /\bbien\b|tranquil|feliz|content|genial|alegre|calma|\bb[eé]\b|feli[cç]|\bcalm\b|\bgood\b|\bfine\b|happy|okay|great|calme|heureux|ruhig|\bgut\b|gl[uü]cklich|calmo|\bbem\b|هادئ|بخير|سعيد/i,
  },
];

const PLACE_RULES = [
  {
    place: 'digital',
    re: /m[oó]vil|tel[eé]fono|redes|internet|whatsapp|tiktok|instagram|\bchat|mensaje|foto|v[ií]deo|pantalla|online|m[oò]bil|xarxes|phone|social media|t[eé]l[eé]phone|handy|telem[oó]vel|celular|هاتف|موبايل|إنترنت|رسائل/i,
  },
  {
    place: 'hallways',
    re: /pasillo|baño|aseo|escalera|vestuario|taquilla|cambio de clase|passad[ií]s|\bbany|lavabo|hallway|corridor|bathroom|restroom|locker|couloir|toilette|\bflur\b|wechsel|corredor|banheiro|casa de banho|ممر|ممرات|حمام/i,
  },
  {
    place: 'entrance',
    re: /entrada|salida|puerta|autob[uú]s|\bbus\b|camino|calle|porter[ií]a|sortida|\bporta\b|entrance|exit|gate|way home|entr[eé]e|sortie|eingang|ausgang|sa[ií]da|port[aã]o|بوابة|دخول|خروج|حافلة/i,
  },
  {
    place: 'class',
    re: /clase|aula|pupitre|pizarra|examen|\bprof|deberes|classe|pissarra|\bclass\b|classroom|teacher|\bdesk\b|\bcours\b|klasse|unterricht|lehrer|\bsala\b|فصل|صف|درس|معلم/i,
  },
  {
    place: 'patio',
    re: /patio|recreo|comedor|cancha|pista|f[uú]tbol|parque|esbarjo|\bpati\b|menjador|playground|recess|lunch|cafeteria|\bcour\b|r[eé]cr[eé]|cantine|pause|\bhof\b|mensa|p[aá]tio|refeit[oó]rio|ساحة|استراحة|ملعب|مقصف/i,
  },
];

const MOMENT_RULES = [
  {
    moment: 'comedor',
    re: /comedor|comida|almuerzo|comer|cantina|menjador|dinar|lunch|cafeteria|canteen|cantine|d[eé]jeuner|mensa|mittagessen|refeit[oó]rio|almo[cç]o|مقصف|غداء|أكل/i,
  },
  {
    moment: 'recreo',
    re: /recreo|patio|descanso|esbarjo|\bpati\b|recess|\bbreak\b|playground|r[eé]cr[eé]|pause|\bhof\b|p[aá]tio|استراحة|فسحة|ساحة/i,
  },
  {
    moment: 'pasillo',
    re: /pasillo|cambio de clase|baño|escalera|passad[ií]s|canvi|hallway|between classes|corridor|couloir|\bflur\b|wechsel|corredor|ممر|تبديل/i,
  },
  {
    moment: 'entrada',
    re: /entrada|salida|al llegar|al salir|mañana|autob[uú]s|\bbus\b|camino|sortida|entrance|arrival|dismissal|morning|entr[eé]e|sortie|eingang|ausgang|sa[ií]da|دخول|خروج|صباح/i,
  },
  {
    moment: 'clase',
    re: /clase|aula|hora de|examen|lecci[oó]n|deberes|classe|\bclass\b|lesson|exam|\bcours\b|stunde|unterricht|حصة|درس|فصل/i,
  },
];

const LOCALIZED_COPY = {
  es: {
    causes: {
      social: {
        title: 'Burlas o palabras que hacen daño',
        easyReadText: 'Alguien dijo cosas que te hicieron sentir mal. Mereces trato bueno y respeto.',
      },
      exclusion: {
        title: 'Te dejaron fuera o solo',
        easyReadText: 'No te incluyeron en el grupo o te sentiste solo. Tienes derecho a participar y estar acompañado.',
      },
      physical: {
        title: 'Empujones, golpes o daño a tus cosas',
        easyReadText: 'Alguien tocó tu cuerpo o tus cosas sin respeto. Nadie puede hacerte daño ni romper tus cosas.',
      },
      digital: {
        title: 'Problema con el móvil o las redes',
        easyReadText: 'Pasó algo difícil con mensajes, fotos o el móvil. Puedes pedir ayuda a un adulto de confianza.',
      },
      noise: {
        title: 'Mucho ruido o agobio',
        easyReadText: 'Había demasiado ruido, prisa o cambios. Es normal necesitar calma y un espacio tranquilo.',
      },
      internal: {
        title: 'Miedo, nervios o bloqueo',
        easyReadText: 'Sentiste miedo o te costó hablar en ese momento. No pasa nada por pedir apoyo paso a paso.',
      },
      other: {
        title: 'Algo que te incomodó hoy',
        easyReadText: 'Algo de hoy te hizo pensar o sentir distinto. Puedes señalarlo o contarlo a tu ritmo.',
      },
    },
    support: {
      high: 'Gracias por contarlo. Lo que ha pasado es importante. No estás solo y un adulto de confianza puede ayudarte ahora.',
      medium: 'Gracias por compartir cómo te sientes. Lo que cuentas importa. Podemos buscar apoyo juntos con calma.',
      low: 'Gracias por contar tu día. Puedes tomar un respiro y avisar a un adulto siempre que lo necesites.',
    },
  },
  ca: {
    causes: {
      social: {
        title: 'Burles o paraules que fan mal',
        easyReadText: 'Algú ha dit coses que et fan sentir malament. Mereixes bon tracte i respecte.',
      },
      exclusion: {
        title: 'Et van deixar fora o sol',
        easyReadText: 'No et van incloure al grup o et vas sentir sol. Tens dret a participar i estar acompanyat.',
      },
      physical: {
        title: 'Empentes, cops o dany a les teves coses',
        easyReadText: 'Algú va tocar el teu cos o les teves coses sense respecte. Ningú et pot fer mal.',
      },
      digital: {
        title: 'Problema amb el mòbil o les xarxes',
        easyReadText: 'Ha passat alguna cosa difícil amb missatges o fotos. Pots demanar ajuda a un adult de confiança.',
      },
      noise: {
        title: 'Massa soroll o atabalament',
        easyReadText: 'Hi havia massa soroll, pressa o canvis. És normal necessitar calma i un lloc tranquil.',
      },
      internal: {
        title: 'Por, nervis o bloqueig',
        easyReadText: 'Vas sentir por o et va costar parlar. Pots demanar suport a poc a poc.',
      },
      other: {
        title: 'Alguna cosa que et va incomodar avui',
        easyReadText: 'Alguna cosa d’avui t’ha fet sentir diferent. Pots explicar-ho al teu ritme.',
      },
    },
    support: {
      high: 'Gràcies per explicar-ho. El que ha passat és important. No estàs sol i un adult de confiança et pot ajudar ara.',
      medium: 'Gràcies per compartir com et sents. El que expliques importa. Podem buscar suport junts amb calma.',
      low: 'Gràcies per explicar el teu dia. Pots respirar tranquil i avisar un adult sempre que ho necessitis.',
    },
  },
  en: {
    causes: {
      social: {
        title: 'Teasing or hurtful words',
        easyReadText: 'Someone said words that hurt you. You deserve kindness and respect.',
      },
      exclusion: {
        title: 'Being left out or alone',
        easyReadText: 'Others did not include you or you felt alone. You have the right to belong and feel safe.',
      },
      physical: {
        title: 'Pushing, hitting, or touching your things',
        easyReadText: 'Someone hurt you or damaged your things. No one is allowed to hurt you.',
      },
      digital: {
        title: 'Problem with phone or messages',
        easyReadText: 'Something hard happened with messages, photos, or a phone. A trusted adult can help you.',
      },
      noise: {
        title: 'Too much noise or feeling overwhelmed',
        easyReadText: 'There was too much noise, rush, or change. It is okay to need a quiet break.',
      },
      internal: {
        title: 'Fear, worry, or freezing up',
        easyReadText: 'You felt scared or found it hard to speak. You can ask for help one small step at a time.',
      },
      other: {
        title: 'Something that felt uncomfortable today',
        easyReadText: 'Something today felt difficult or unclear. You can share more at your own pace.',
      },
    },
    support: {
      high: 'Thank you for telling us. What happened is important. You are not alone and a trusted adult can help you now.',
      medium: 'Thank you for sharing how you feel. Your story matters. We can find calm support together.',
      low: 'Thank you for sharing your day. You can take a calm breath and tell a trusted adult anytime.',
    },
  },
  fr: {
    causes: {
      social: {
        title: 'Moqueries ou mots blessants',
        easyReadText: 'Quelqu’un a dit des mots qui font mal. Tu mérites du respect et de la gentillesse.',
      },
      exclusion: {
        title: 'Mis à l’écart ou seul',
        easyReadText: 'On ne t’a pas inclus dans le groupe. Tu as le droit de participer et d’être entouré.',
      },
      physical: {
        title: 'Bousculades, coups ou affaires abîmées',
        easyReadText: 'Quelqu’un t’a fait mal ou a abîmé tes affaires. Personne n’a le droit de te faire mal.',
      },
      digital: {
        title: 'Problème avec le téléphone ou les réseaux',
        easyReadText: 'Quelque chose de difficile s’est passé avec des messages ou des photos. Un adulte de confiance peut t’aider.',
      },
      noise: {
        title: 'Trop de bruit ou de stress',
        easyReadText: 'Il y avait trop de bruit ou trop de changements. Tu as le droit d’avoir un moment calme.',
      },
      internal: {
        title: 'Peur, stress ou blocage',
        easyReadText: 'Tu as eu peur ou tu n’as pas réussi à parler. Tu peux demander de l’aide étape par étape.',
      },
      other: {
        title: 'Quelque chose de gênant aujourd’hui',
        easyReadText: 'Quelque chose t’a dérangé aujourd’hui. Tu peux en parler à ton rythme.',
      },
    },
    support: {
      high: 'Merci de l’avoir dit. Ce qui s’est passé est important. Tu n’es pas seul et un adulte de confiance peut t’aider maintenant.',
      medium: 'Merci de partager ce que tu ressens. Ton message compte. On peut chercher de l’aide calmement ensemble.',
      low: 'Merci d’avoir raconté ta journée. Tu peux respirer calmement et prévenir un adulte quand tu en as besoin.',
    },
  },
  de: {
    causes: {
      social: {
        title: 'Spott oder verletzende Worte',
        easyReadText: 'Jemand hat Dinge gesagt, die wehtun. Du verdienst Respekt und Freundlichkeit.',
      },
      exclusion: {
        title: 'Ausgeschlossen oder allein',
        easyReadText: 'Du wurdest nicht mitgenommen oder hast dich allein gefühlt. Du darfst dazugehören.',
      },
      physical: {
        title: 'Schubsen, Schlagen oder kaputte Sachen',
        easyReadText: 'Jemand hat dir wehgetan oder deine Sachen beschädigt. Niemand darf dir wehtun.',
      },
      digital: {
        title: 'Problem mit Handy oder Nachrichten',
        easyReadText: 'Mit Nachrichten oder Fotos ist etwas Schwieriges passiert. Ein vertrauter Erwachsener kann dir helfen.',
      },
      noise: {
        title: 'Zu viel Lärm oder Überforderung',
        easyReadText: 'Es war zu laut oder zu viel auf einmal. Eine ruhige Pause ist völlig in Ordnung.',
      },
      internal: {
        title: 'Angst, Nervosität oder Blockade',
        easyReadText: 'Du hattest Angst oder konntest nicht sprechen. Du darfst Schritt für Schritt Hilfe holen.',
      },
      other: {
        title: 'Etwas Unangenehmes heute',
        easyReadText: 'Heute war etwas schwierig für dich. Du kannst in deinem eigenen Tempo davon erzählen.',
      },
    },
    support: {
      high: 'Danke, dass du es erzählt hast. Was passiert ist, ist wichtig. Du bist nicht allein und ein Erwachsener kann dir jetzt helfen.',
      medium: 'Danke, dass du teilst, wie es dir geht. Deine Nachricht ist wichtig. Wir finden gemeinsam in Ruhe Hilfe.',
      low: 'Danke für deinen Bericht. Du kannst ruhig durchatmen und jederzeit einen Erwachsenen ansprechen.',
    },
  },
  pt: {
    causes: {
      social: {
        title: 'Gozações ou palavras que magoam',
        easyReadText: 'Alguém disse palavras que te fizeram sentir mal. Mereces respeito e cuidado.',
      },
      exclusion: {
        title: 'Deixaram-te de fora ou sozinho',
        easyReadText: 'Não te incluíram no grupo ou sentiste-te sozinho. Tens direito a participar e estar acompanhado.',
      },
      physical: {
        title: 'Empurrões, golpes ou dano nas tuas coisas',
        easyReadText: 'Alguém magoou-te ou estragou as tuas coisas. Ninguém pode magoar-te.',
      },
      digital: {
        title: 'Problema com o telemóvel ou redes',
        easyReadText: 'Aconteceu algo difícil com mensagens ou fotos. Podes pedir ajuda a um adulto de confiança.',
      },
      noise: {
        title: 'Muito barulho ou sobrecarga',
        easyReadText: 'Havia demasiado barulho ou mudanças. É normal precisar de calma e silêncio.',
      },
      internal: {
        title: 'Medo, nervos ou bloqueio',
        easyReadText: 'Sentiste medo ou custou-te falar. Podes pedir apoio passo a passo.',
      },
      other: {
        title: 'Algo que te incomodou hoje',
        easyReadText: 'Algo hoje fez-te sentir diferente. Podes contar ao teu ritmo.',
      },
    },
    support: {
      high: 'Obrigado por contares. O que aconteceu é importante. Não estás sozinho e um adulto de confiança pode ajudar-te agora.',
      medium: 'Obrigado por partilhares como te sentes. O que contas importa. Podemos procurar apoio juntos com calma.',
      low: 'Obrigado por contares o teu dia. Podes respirar com calma e avisar um adulto sempre que precisares.',
    },
  },
  ar: {
    causes: {
      social: {
        title: 'سخرية أو كلمات مؤذية',
        easyReadText: 'قال أحدهم كلمات أزعجتك. أنت تستحق الاحترام والمعاملة الطيبة.',
      },
      exclusion: {
        title: 'شعور بالوحدة أو الاستبعاد',
        easyReadText: 'لم يشركوك في اللعب أو شعرت أنك وحدك. من حقك أن تكون مع الآخرين بأمان.',
      },
      physical: {
        title: 'دفع أو ضرب أو إتلاف أغراضك',
        easyReadText: 'قام أحدهم بإيذائك أو إتلاف أغراضك. لا يحق لأحد أن يؤذيك.',
      },
      digital: {
        title: 'مشكلة في الهاتف أو الرسائل',
        easyReadText: 'حدث أمر صعب عبر الهاتف أو الصور أو الرسائل. يمكن لشخص بالغ تثق به مساعدتك.',
      },
      noise: {
        title: 'ضوضاء كثيرة أو ضغط شديد',
        easyReadText: 'كان هناك الكثير من الصوت أو التغيير. من الطبيعي أن تحتاج إلى مكان هادئ.',
      },
      internal: {
        title: 'خوف أو توتر أو صعوبة في الكلام',
        easyReadText: 'شعرت بالخوف أو التوتر في تلك اللحظة. يمكنك طلب المساعدة خطوة بخطوة.',
      },
      other: {
        title: 'أمر أزعجك اليوم',
        easyReadText: 'حدث شيء اليوم جعلك تشعر بعدم الارتياح. يمكنك إخبارنا بهدوء وعلى مهلك.',
      },
    },
    support: {
      high: 'شكراً لأنك أخبرتنا. ما حدث مهم جداً. أنت لست وحدك ويمكن لشخص بالغ تثق به مساعدتك الآن.',
      medium: 'شكراً لمشاركة شعورك. كلامك مهم لنا. سنبحث عن المساعدة معاً بهدوء.',
      low: 'شكراً لأنك شاركت يومك. يمكنك أن ترتاح وتخبر شخصاً بالغاً تثق به في أي وقت.',
    },
  },
};

function normalizeLang(lang) {
  const code = String(lang || 'es').toLowerCase().slice(0, 2);
  return SUPPORTED_STORY_LANGS.includes(code) ? code : 'es';
}

function buildCauseEntry(category, index, copy) {
  const info = copy.causes[category] || copy.causes.other;
  return {
    id: `cause-${category}-${index}`,
    category,
    title: info.title,
    easyReadText: info.easyReadText,
    icon: CAUSE_ICONS[category] || CAUSE_ICONS.other,
  };
}

function inferEmotion(text, categories) {
  for (const rule of EMOTION_RULES) {
    if (rule.re.test(text)) return rule.emotion;
  }
  if (categories.includes('physical') || categories.includes('internal')) return 'scared';
  if (categories.includes('social') || categories.includes('exclusion')) return 'sad';
  if (categories.includes('noise') || categories.includes('digital')) return 'angry';
  return 'calm';
}

function inferPlace(text, categories) {
  for (const rule of PLACE_RULES) {
    if (rule.re.test(text)) return rule.place;
  }
  if (categories.includes('digital')) return 'digital';
  return 'patio';
}

function inferMoment(text, place) {
  for (const rule of MOMENT_RULES) {
    if (rule.re.test(text)) return rule.moment;
  }
  if (place === 'hallways') return 'pasillo';
  if (place === 'entrance') return 'entrada';
  if (place === 'class') return 'clase';
  if (place === 'patio') return 'recreo';
  return 'otro';
}

function inferAlertLevel(text, categories, emotion) {
  if (
    categories.includes('physical') ||
    HIGH_ALERT_RE.test(text) ||
    (emotion === 'scared' && categories.some((c) => c !== 'other' && c !== 'internal'))
  ) {
    return 'high';
  }
  if (
    categories.some((c) =>
      ['social', 'exclusion', 'digital', 'noise', 'internal'].includes(c)
    )
  ) {
    return 'medium';
  }
  return 'low';
}

const ACTIVITY_PROMPT_BY_LANG = {
  es: 'Actividad de tu día. Marca si esto fue exactamente lo que te hizo sentir mal.',
  ca: 'Activitat del teu dia. Marca si això va ser exactament el que et va fer sentir malament.',
  en: 'Activity from your day. Tap if this was the exact moment that made you feel bad.',
  fr: 'Activité de ta journée. Indique si c’est exactement ce qui t’a fait sentir mal.',
  de: 'Aktivität deines Tages. Tippe an, ob genau das dich schlecht fühlen ließ.',
  pt: 'Atividade do teu dia. Marca se foi exatamente isto que te fez sentir mal.',
  ar: 'نشاط من يومك. اختر إن كان هذا بالضبط ما جعلك تشعر بالضيق.',
};

function splitStoryIntoActivities(text) {
  const rawLines = String(text || '')
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[\s\-•*·\d.)]+/, '').trim())
    .filter(Boolean);

  if (rawLines.length > 1) {
    return rawLines.slice(0, 8);
  }

  if (rawLines.length === 1) {
    const sentences = rawLines[0]
      .split(/(?<=[.!?])\s+|;\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (sentences.length > 1) {
      return sentences.slice(0, 8);
    }
    return rawLines;
  }

  return [];
}

function detectCategoriesForText(text) {
  const matched = [];
  if (!text) return matched;
  for (const rule of CAUSE_RULES) {
    if (rule.re.test(text)) {
      matched.push(rule.category);
    }
  }
  return matched;
}

export function analyzeDailyStoryLocal(storyText, lang = 'es') {
  const normalizedLang = normalizeLang(lang);
  const copy = LOCALIZED_COPY[normalizedLang] || LOCALIZED_COPY.es;
  const text = String(storyText ?? '').trim();

  const activities = splitStoryIntoActivities(text);
  const allMatchedCategories = detectCategoriesForText(text);

  let causes = [];
  if (activities.length > 0) {
    causes = activities.map((activity, idx) => {
      const lineCategories = detectCategoriesForText(activity);
      const primaryCategory = lineCategories[0] || 'other';
      const categoryInfo = copy.causes[primaryCategory];
      const hasSpecificCause = lineCategories.length > 0;

      return {
        id: `activity-${primaryCategory}-${idx + 1}`,
        category: primaryCategory,
        title: activity,
        easyReadText: hasSpecificCause
          ? `${categoryInfo.title}. ${categoryInfo.easyReadText}`
          : ACTIVITY_PROMPT_BY_LANG[normalizedLang] || ACTIVITY_PROMPT_BY_LANG.es,
        icon: hasSpecificCause ? CAUSE_ICONS[primaryCategory] : '📝',
      };
    });
  } else {
    causes = [buildCauseEntry('other', 1, copy)];
  }

  const emotion = inferEmotion(text, allMatchedCategories);
  const place = inferPlace(text, allMatchedCategories);
  const moment = inferMoment(text, place);
  const alertLevel = inferAlertLevel(text, allMatchedCategories, emotion);

  return {
    causes,
    emotion,
    place,
    moment,
    alertLevel,
    supportMessage: copy.support[alertLevel] || copy.support.low,
    source: 'local',
  };
}

function buildStorySystemPrompt(lang) {
  const langName = LANG_NAMES[lang] || LANG_NAMES.es;
  return [
    'You are an empathetic school wellbeing assistant supporting a student with cognitive disability.',
    `Respond strictly in ${langName} using Easy Read (Lectura Fácil): very short sentences, simple everyday words, warm supportive tone, never judge, never blame, and never interrogate or ask questions.`,
    'Analyze the student daily story and return ONLY a valid JSON object matching this exact schema:',
    '{',
    '  "causes": [',
    '    {',
    '      "id": "cause-<category>-1",',
    '      "category": "social" | "exclusion" | "physical" | "digital" | "noise" | "internal" | "other",',
    '      "title": "short Easy Read title",',
    '      "easyReadText": "1-2 short clear sentences without questions",',
    '      "icon": "single representative emoji"',
    '    }',
    '  ],',
    '  "emotion": "calm" | "sad" | "scared" | "angry",',
    '  "place": "patio" | "hallways" | "class" | "entrance" | "digital",',
    '  "moment": "recreo" | "clase" | "pasillo" | "entrada" | "comedor" | "otro",',
    '  "alertLevel": "low" | "medium" | "high",',
    '  "supportMessage": "brief warm Easy Read message without questions"',
    '}',
    'Rules:',
    '- Always include at least 1 item in "causes" (use "other" or "internal" with a gentle hypothesis if unclear).',
    '- Set "alertLevel" to "high" for physical aggression, threats, or intense fear; "medium" for teasing, exclusion, digital issues, or sensory overload; "low" otherwise.',
    '- Output raw JSON only, with no markdown fences or extra text.',
  ].join('\n');
}

function extractJsonObject(rawText) {
  const trimmed = String(rawText || '').trim();
  if (!trimmed) throw new Error('Empty Gemini response');
  const cleaned = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid JSON root');
  }
  return parsed;
}

function normalizeGeminiAnalysis(parsed, storyText, lang) {
  const fallback = analyzeDailyStoryLocal(storyText, lang);
  const copy = LOCALIZED_COPY[lang] || LOCALIZED_COPY.es;

  if (!Array.isArray(parsed.causes) || parsed.causes.length === 0) {
    throw new Error('Missing causes array');
  }

  const causes = parsed.causes
    .filter((item) => item && typeof item === 'object')
    .slice(0, 6)
    .map((item, idx) => {
      const category = VALID_CAUSE_CATEGORIES.includes(item.category)
        ? item.category
        : 'other';
      const defaultCopy = copy.causes[category] || copy.causes.other;
      const id =
        typeof item.id === 'string' && item.id.trim()
          ? item.id.trim()
          : `cause-${category}-${idx + 1}`;
      const title =
        typeof item.title === 'string' && item.title.trim()
          ? item.title.trim()
          : defaultCopy.title;
      const easyReadText =
        typeof item.easyReadText === 'string' && item.easyReadText.trim()
          ? item.easyReadText.trim()
          : defaultCopy.easyReadText;
      const icon =
        typeof item.icon === 'string' && item.icon.trim()
          ? item.icon.trim()
          : CAUSE_ICONS[category] || CAUSE_ICONS.other;
      return { id, category, title, easyReadText, icon };
    });

  if (causes.length === 0) {
    throw new Error('No valid causes');
  }

  const emotion = VALID_EMOTIONS.includes(parsed.emotion)
    ? parsed.emotion
    : fallback.emotion;
  const place = VALID_PLACES.includes(parsed.place)
    ? parsed.place
    : fallback.place;
  const moment = VALID_MOMENTS.includes(parsed.moment)
    ? parsed.moment
    : fallback.moment;
  const alertLevel = VALID_ALERT_LEVELS.includes(parsed.alertLevel)
    ? parsed.alertLevel
    : fallback.alertLevel;
  const supportMessage =
    typeof parsed.supportMessage === 'string' && parsed.supportMessage.trim()
      ? parsed.supportMessage.trim()
      : copy.support[alertLevel] || fallback.supportMessage;

  return {
    causes,
    emotion,
    place,
    moment,
    alertLevel,
    supportMessage,
    source: 'gemini',
  };
}

export async function analyzeDailyStory(storyText, lang = 'es') {
  const normalizedLang = normalizeLang(lang);
  const text = String(storyText ?? '').trim();

  if (!config.key || !text) {
    return analyzeDailyStoryLocal(text, normalizedLang);
  }

  controller = new AbortController();
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' +
        encodeURIComponent(config.model) +
        ':generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': config.key,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildStorySystemPrompt(normalizedLang) }],
          },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      }
    );
    if (!res.ok) throw new Error('Error ' + res.status);
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim();
    const parsed = extractJsonObject(rawText);
    return normalizeGeminiAnalysis(parsed, text, normalizedLang);
  } catch {
    return analyzeDailyStoryLocal(text, normalizedLang);
  }
}
