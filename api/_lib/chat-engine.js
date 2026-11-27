export const VALID_LANGS = ['es', 'ca', 'en', 'fr', 'de', 'pt', 'ar'];

export const VALID_PLACES = ['patio', 'hallways', 'class', 'digital', 'entrance'];

const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_TIMEOUT_MS = 12000;
const MAX_HISTORY_ITEMS = 6;
const MAX_HISTORY_TEXT_LENGTH = 600;

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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLatinRegex(terms) {
  const alternation = terms.map(escapeRegex).join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternation})(?![\\p{L}\\p{N}])`, 'u');
}

function buildArabicRegex(terms) {
  const alternation = terms.map(escapeRegex).join('|');
  return new RegExp(`(?:${alternation})`, 'u');
}

const PLACE_PATTERNS = [
  {
    place: 'digital',
    latin: buildLatinRegex([
      'whatsapp', 'wsp', 'wasap', 'tiktok', 'instagram', 'insta', 'snapchat',
      'discord', 'telegram', 'youtube', 'twitch', 'roblox', 'fortnite',
      'internet', 'online', 'digital', 'ciberacoso', 'ciberassetjament',
      'cyberbullying', 'cyberharcelement', 'cybermobbing', 'movil', 'celular',
      'telefono', 'mobil', 'phone', 'smartphone', 'handy', 'telemovel',
      'redes', 'redes sociales', 'xarxes', 'xarxes socials', 'social media',
      'reseaux', 'reseaux sociaux', 'soziale medien', 'redes sociais',
      'mensaje', 'mensajes', 'missatge', 'missatges', 'message', 'messages',
      'nachricht', 'nachrichten', 'mensagem', 'mensagens', 'chat', 'chats',
      'grupo de whatsapp', 'grup de whatsapp', 'group chat', 'foto', 'fotos',
      'video', 'videos', 'captura', 'screenshot', 'meme', 'memes', 'perfil',
      'cuenta falsa', 'fake account', 'correo', 'email', 'pantalla', 'juego online'
    ]),
    arabic: buildArabicRegex([
      'انترنت', 'الانترنت', 'واتساب', 'تيك توك', 'انستغرام', 'انستقرام',
      'سناب', 'ديسكورد', 'تيليجرام', 'جوال', 'هاتف', 'موبايل', 'رسايل',
      'رساله', 'رسائل', 'مواقع التواصل', 'تنمر الكتروني', 'الكتروني',
      'اونلاين', 'دردشه', 'مجموعه', 'صوره', 'فيديو', 'حساب وهمي'
    ])
  },
  {
    place: 'hallways',
    latin: buildLatinRegex([
      'pasillo', 'pasillos', 'bano', 'banos', 'aseo', 'aseos', 'vestuario',
      'vestuarios', 'escalera', 'escaleras', 'taquilla', 'taquillas',
      'passadis', 'passadissos', 'bany', 'banys', 'lavabo', 'lavabos',
      'vestidor', 'vestidors', 'escala', 'escales', 'armariet',
      'hallway', 'hallways', 'corridor', 'corridors', 'bathroom', 'bathrooms',
      'restroom', 'restrooms', 'toilet', 'toilets', 'locker', 'lockers',
      'locker room', 'changing room', 'stairs', 'stairway',
      'couloir', 'couloirs', 'toilettes', 'vestiaire', 'vestiaires',
      'escalier', 'escaliers', 'casier', 'casiers',
      'flur', 'flure', 'gang', 'gange', 'toilette', 'toiletten', 'klo',
      'umkleide', 'umkleidekabine', 'treppe', 'treppenhaus', 'spind',
      'corredor', 'corredores', 'banheiro', 'banheiros', 'casa de banho',
      'vestiario', 'vestiarios', 'escada', 'escadas', 'cacifo'
    ]),
    arabic: buildArabicRegex([
      'ممر', 'ممرات', 'حمام', 'حمامات', 'دوره المياه', 'دورة المياه',
      'مرحاض', 'درج', 'سلم', 'غرفه تبديل', 'خزانه', 'خزائن'
    ])
  },
  {
    place: 'entrance',
    latin: buildLatinRegex([
      'entrada', 'salida', 'puerta', 'porton', 'autobus', 'bus', 'ruta escolar',
      'camino a casa', 'camino al cole', 'camino del cole', 'calle', 'parada',
      'sortida', 'porta', 'cami a casa', 'cami de lescola', 'carrer',
      'entrance', 'exit', 'gate', 'school gate', 'front door', 'school bus',
      'bus stop', 'way home', 'way to school', 'street', 'walk home',
      'entree', 'sortie', 'portail', 'porte', 'bus scolaire', 'chemin',
      'rue', 'arret de bus',
      'eingang', 'ausgang', 'schultor', 'tor', 'schulbus', 'bushaltestelle',
      'schulweg', 'heimweg', 'strasse', 'straße',
      'saida', 'portao', 'onibus', 'autocarro', 'caminho de casa',
      'caminho da escola', 'rua', 'paragem', 'ponto de onibus'
    ]),
    arabic: buildArabicRegex([
      'مدخل', 'مخرج', 'بوابه', 'باب المدرسه', 'حافله', 'باص',
      'طريق المدرسه', 'طريق البيت', 'شارع', 'موقف الباص', 'خارج المدرسه'
    ])
  },
  {
    place: 'class',
    latin: buildLatinRegex([
      'clase', 'clases', 'aula', 'aulas', 'pupitre', 'pizarra', 'examen',
      'classe', 'classes', 'taula', 'pissarra', 'assignatura',
      'classroom', 'class', 'desk', 'lesson', 'board', 'homeroom',
      'salle de classe', 'cours', 'tableau', 'bureau',
      'klasse', 'klassenraum', 'klassenzimmer', 'unterricht', 'tafel',
      'sala de aula', 'turma', 'carteira', 'quadro', 'licao'
    ]),
    arabic: buildArabicRegex([
      'فصل', 'صف', 'حصه', 'درس', 'قاعه', 'مقعد', 'سبوره', 'داخل الصف'
    ])
  },
  {
    place: 'patio',
    latin: buildLatinRegex([
      'patio', 'recreo', 'comedor', 'cancha', 'pista', 'gimnasio', 'descanso',
      'pati', 'esbarjo', 'menjador', 'gimnas', 'pista esportiva',
      'playground', 'recess', 'schoolyard', 'yard', 'break time', 'cafeteria',
      'canteen', 'lunchroom', 'gym', 'field',
      'cour', 'cour de recreation', 'recreation', 'recre', 'cantine',
      'gymnase', 'terrain',
      'schulhof', 'pausenhof', 'hof', 'pause', 'mensa', 'turnhalle', 'spielplatz',
      'recreio', 'intervalo', 'cantina', 'refeitorio', 'quadra', 'ginasio'
    ]),
    arabic: buildArabicRegex([
      'ساحه', 'فناء', 'استراحه', 'فسحه', 'مقصف', 'ملعب', 'صاله رياضيه'
    ])
  }
];

const CRISIS_LATIN_REGEX = buildLatinRegex([
  // Spanish
  'suicidio', 'suicidarme', 'suicidar', 'matarme', 'quitarme la vida',
  'no quiero vivir', 'no aguanto mas vivir', 'quiero morir', 'deseo morir',
  'hacerme dano', 'autolesion', 'autolesionarme', 'autolesiones',
  'cortarme', 'me corto', 'me estoy cortando', 'acabar con mi vida',
  'acabar con todo', 'desaparecer para siempre', 'tirarme por',
  'me estan pegando ahora', 'me esta pegando ahora', 'me van a pegar ahora',
  'me quieren matar', 'me quiere matar', 'me va a matar', 'amenaza de muerte',
  'amenazan de muerte', 'cuchillo', 'navaja', 'pistola', 'arma',
  'sangrando mucho', 'herida grave', 'peligro ahora', 'abuso sexual',
  'me tocan sin permiso', 'me toca sin permiso',
  // Catalan
  'suicidi', 'suicidar-me', 'matar-me', 'llevar-me la vida', 'no vull viure',
  'vull morir', 'fer-me mal', 'autolesio', 'autolesionar-me', 'tallar-me',
  'em tallo', 'mestan pegant', 'em peguen ara', 'em vol matar',
  'em volen matar', 'amenaca de mort', 'ganivet', 'perill greu',
  // English
  'suicide', 'suicidal', 'kill myself', 'killing myself', 'end my life',
  'want to die', 'wanna die', 'dont want to live', 'do not want to live',
  'hurt myself', 'hurting myself', 'self harm', 'self-harm', 'cut myself',
  'cutting myself', 'overdose', 'jump off', 'hitting me right now',
  'beating me right now', 'attacking me right now', 'going to kill me',
  'wants to kill me', 'death threat', 'knife', 'gun', 'weapon',
  'bleeding badly', 'immediate danger', 'sexual abuse', 'sexually abused',
  // French
  'suicider', 'me tuer', 'mettre fin a mes jours', 'en finir avec la vie',
  'je veux mourir', 'envie de mourir', 'plus envie de vivre',
  'me faire du mal', 'automutilation', 'me mutiler', 'me couper',
  'je me coupe', 'me frappent maintenant', 'me frappe maintenant',
  'veut me tuer', 'veulent me tuer', 'menace de mort', 'couteau', 'arme',
  'danger immediat', 'abus sexuel',
  // German
  'suizid', 'selbstmord', 'mich umbringen', 'umbringen', 'will sterben',
  'mochte sterben', 'nicht mehr leben', 'mir wehtun', 'mir selbst wehtun',
  'selbstverletzung', 'mich verletzen', 'mich ritzen', 'ritze mich',
  'schlagen mich gerade', 'schlagt mich gerade', 'will mich toten',
  'todesdrohung', 'messer', 'waffe', 'lebensgefahr', 'sexueller missbrauch',
  // Portuguese
  'me matar', 'tirar a minha vida', 'tirar minha vida', 'nao quero viver',
  'quero morrer', 'me machucar', 'me magoar', 'automutilacao', 'me cortar',
  'estou me cortando', 'estao me batendo', 'me batendo agora',
  'vai me matar', 'quer me matar', 'ameaca de morte', 'faca',
  'perigo imediato', 'abuso sexual'
]);

const CRISIS_ARABIC_REGEX = buildArabicRegex([
  'انتحار', 'انتحر', 'سانتحر', 'اريد ان اموت', 'لا اريد ان اعيش',
  'اقتل نفسي', 'ايذاء نفسي', 'اؤذي نفسي', 'اجرح نفسي', 'اقطع يدي',
  'يضربونني الان', 'يضربني الان', 'سيقتلني', 'يريد قتلي', 'يهدد بقتلي',
  'خطر شديد', 'خطر فوري', 'سكين', 'سلاح', 'تحرش جنسي', 'اعتداء جنسي'
]);

const CRISIS_REPLIES = {
  es: 'Siento mucho que estés pasando por algo tan duro ahora mismo. No estás solo ni tienes que cargar con esto en silencio: busca ahora mismo a una persona adulta de confianza (tu profe, orientación, dirección o tu familia). Si estás en peligro inmediato o necesitas ayuda urgente, llama al 112 o al 900 018 018 (gratuito, confidencial y 24 horas).',
  ca: 'Sento molt que estiguis passant per una situació tan dura ara mateix. No estàs sol ni has de portar això en silenci: busca ara mateix una persona adulta de confiança (un docent, orientació, direcció o la teva família). Si estàs en perill immediat o necessites ajuda urgent, truca al 112 o al 900 018 018 (gratuït, confidencial i 24 hores).',
  en: 'I am really sorry you are going through something this heavy right now. You are not alone and you do not have to carry this by yourself: please go to a trusted adult right now (a teacher, school counselor, principal, or family member). If you are in immediate danger or need urgent help, call 112 or 900 018 018 (free, confidential, 24/7).',
  fr: 'Je suis vraiment désolé que tu traverses quelque chose d’aussi difficile en ce moment. Tu n’es pas seul et tu n’as pas à porter cela en silence : va tout de suite parler à un adulte de confiance (un professeur, un conseiller, la direction ou ta famille). Si tu es en danger immédiat ou as besoin d’aide urgente, appelle le 112 ou le 900 018 018 (gratuit, confidentiel, 24h/24).',
  de: 'Es tut mir sehr leid, dass du gerade so etwas Schweres durchmachst. Du bist nicht allein und musst das nicht alleine tragen: Wende dich jetzt sofort an eine vertrauenswürdige erwachsene Person (Lehrkraft, Schulberatung, Schulleitung oder Familie). Wenn du in akuter Gefahr bist oder dringend Hilfe brauchst, ruf bitte 112 oder 900 018 018 an (kostenlos, vertraulich, rund um die Uhr).',
  pt: 'Sinto muito que estejas a passar por algo tão difícil agora mesmo. Não estás sozinho nem tens de carregar isto em silêncio: procura agora mesmo um adulto de confiança (um professor, orientação, direção ou a tua família). Se estiveres em perigo imediato ou precisares de ajuda urgente, liga para o 112 ou para o 900 018 018 (gratuito, confidencial e 24 horas).',
  ar: 'أنا آسف جداً لأنك تمر بشيء صعب جداً الآن. أنت لست وحدك ولا يجب أن تتحمل هذا بمفردك: توجه الآن فوراً إلى شخص بالغ تثق به (معلمك، المرشد المدرسي، الإدارة أو عائلتك). إذا كنت في خطر فوري أو تحتاج إلى مساعدة عاجلة، اتصل على 112 أو 900 018 018 (مجاني وسري ومتاح 24 ساعة).'
};

const PROMPT_TEMPLATES = {
  es: {
    intro: 'Eres Nube, un acompañante escolar cálido, empático y seguro que acompaña al estudiante a su ritmo mientras llega la ayuda.',
    victima: 'El estudiante cuenta algo que le está pasando. Valida cómo se siente, recuérdale que no tiene la culpa y ofrécele un consejo práctico y seguro adaptado a su situación (por ejemplo, acercarse a un adulto o a un grupo seguro, no responder y guardar capturas/bloquear si es digital, o respirar despacio si siente agobio).',
    testigo: 'El estudiante ha presenciado una situación de acoso y quiere ayudar. Valora su valentía y dale un consejo práctico y seguro sin ponerse en riesgo (por ejemplo, acompañar después a la persona afectada, no difundir burlas ni capturas y avisar a una persona adulta de confianza).',
    rules: 'Responde siempre en español en 2 o 3 frases cortas y sencillas, acompañando con cercanía. Nunca culpes, juzgues ni interrogues. Nunca pidas datos personales identificables (nombre completo, dirección, teléfono, colegio o fotos). Cuando encaje, recuerda con suavidad y sin repetirte que puede usar el buzón anónimo o el Rincón de Calma.'
  },
  ca: {
    intro: 'Ets Nube, un acompanyant escolar càlid, empàtic i segur que acompanya l’estudiant al seu ritme mentre arriba l’ajuda.',
    victima: 'L’estudiant explica alguna cosa que li està passant. Valida com se sent, recorda-li que no en té la culpa i ofereix-li un consell pràctic i segur adaptat a la seva situació (per exemple, apropar-se a un adult o a un grup segur, no respondre i guardar captures/bloquejar si és digital, o respirar a poc a poc si sent atabalament).',
    testigo: 'L’estudiant ha presenciat una situació d’assetjament i vol ajudar. Valora la seva valentia i dona-li un consell pràctic i segur sense posar-se en risc (per exemple, acompanyar després la persona afectada, no difondre burles ni captures i avisar una persona adulta de confiança).',
    rules: 'Respon sempre en català en 2 o 3 frases curtes i senzilles, acompanyant amb proximitat. No culpis, jutgis ni interrogis mai. No demanis mai dades personals identificables (nom complet, adreça, telèfon, escola o fotos). Quan escaigui, recorda suaument i sense repetir-te que pot fer servir la bústia anònima o el Racó de Calma.'
  },
  en: {
    intro: 'You are Nube, a warm, empathetic, and child-safe school companion who stays with the student at their pace while help is arranged.',
    victima: 'The student is sharing something happening to them. Validate their feelings, remind them it is not their fault, and offer one practical, safe tip tailored to their situation (for example, staying near a trusted adult or safe friends, saving screenshots and blocking without replying if it is online, or taking a slow breath if overwhelmed).',
    testigo: 'The student witnessed bullying and wants to help. Acknowledge their care and give one practical, safe tip without putting themselves in danger (for example, checking in kindly on the classmate afterwards, not sharing mockery or screenshots, and telling a trusted adult).',
    rules: 'Always reply in English in 2 to 3 short, simple sentences with warm companionship. Never blame, judge, or interrogate. Never ask for personally identifiable information (full name, address, phone number, school name, or photos). When relevant, gently remind them without sounding repetitive about the anonymous report box or the Calm Corner.'
  },
  fr: {
    intro: 'Tu es Nube, un compagnon scolaire chaleureux, empathique et sûr qui accompagne l’élève à son rythme pendant que l’aide arrive.',
    victima: 'L’élève raconte quelque chose qui lui arrive. Valide ce qu’il ou elle ressent, rappelle-lui que ce n’est pas de sa faute et donne un conseil pratique et sûr adapté à sa situation (par exemple, rester près d’un adulte ou d’amis de confiance, ne pas répondre et garder des captures/bloquer en ligne, ou respirer lentement en cas de stress).',
    testigo: 'L’élève a été témoin d’une situation de harcèlement et veut aider. Valorise son courage et donne un conseil pratique et sûr sans se mettre en danger (par exemple, soutenir l’élève concerné ensuite, ne pas partager de moqueries ni de captures et prévenir un adulte de confiance).',
    rules: 'Réponds toujours en français en 2 ou 3 phrases courtes et simples, avec bienveillance. Ne blâme, ne juge et n’interroge jamais. Ne demande jamais de données personnelles identifiables (nom complet, adresse, téléphone, école ou photos). Quand c’est utile, rappelle doucement et sans répétition la boîte de signalement anonyme ou le Coin Calme.'
  },
  de: {
    intro: 'Du bist Nube, eine warme, einfühlsame und kindgerechte Schulbegleitung, die in Ruhe an der Seite der Person bleibt, während Hilfe organisiert wird.',
    victima: 'Die Person erzählt etwas, das ihr selbst passiert. Bestätige ihre Gefühle, erinnere sie daran, dass sie keine Schuld trägt, und gib einen konkreten, sicheren Tipp passend zur Situation (z. B. in der Nähe einer Lehrkraft oder sicherer Freunde bleiben, online nicht antworten, Screenshots sichern und blockieren, oder bei Stress ruhig durchatmen).',
    testigo: 'Die Person hat Mobbing beobachtet und möchte helfen. Würdige ihren Mut und gib einen konkreten, sicheren Tipp ohne sich selbst in Gefahr zu bringen (z. B. danach für die betroffene Person da sein, keine Spottnachrichten oder Screenshots weiterleiten und eine vertrauenswürdige erwachsene Person informieren).',
    rules: 'Antworte immer auf Deutsch in 2 bis 3 kurzen, einfachen Sätzen mit warmer Begleitung. Gib niemals die Schuld, urteile nicht und verhöre nicht. Frage niemals nach persönlich identifizierbaren Daten (vollständiger Name, Adresse, Telefonnummer, Schule oder Fotos). Wenn es passt, erinnere sanft und ohne Wiederholung an das anonyme Meldefach oder die Ruhe-Ecke.'
  },
  pt: {
    intro: 'És a Nube, uma companhia escolar calorosa, empática e segura que acompanha o estudante ao seu ritmo enquanto a ajuda chega.',
    victima: 'O estudante está a contar algo que lhe está a acontecer. Valida o que sente, lembra-lhe que não tem culpa e dá um conselho prático e seguro adaptado à situação (por exemplo, ficar perto de um adulto ou de amigos seguros, não responder e guardar capturas/bloquear se for online, ou respirar devagar se sentir aperto).',
    testigo: 'O estudante presenciou uma situação de bullying e quer ajudar. Valoriza a sua coragem e dá um conselho prático e seguro sem se colocar em risco (por exemplo, apoiar depois o colega afetado, não partilhar gozações nem capturas e avisar um adulto de confiança).',
    rules: 'Responde sempre em português em 2 ou 3 frases curtas e simples, acompanhando com proximidade. Nunca culpes, julgues nem interrogues. Nunca peças dados pessoais identificáveis (nome completo, morada, telefone, escola ou fotos). Quando fizer sentido, lembra com suavidade e sem repetir a caixa de denúncia anónima ou o Cantinho da Calma.'
  },
  ar: {
    intro: 'أنت نوبة، رفيق مدرسي دافئ ومتعاطف وآمن يرافق الطالب على مهله بينما تصل المساعدة.',
    victima: 'الطالب يشارك شيئاً يحدث له شخصياً. قدّر مشاعره وذكّره بأن ما يحدث ليس خطأه أبداً، وقدّم له نصيحة عملية وآمنة تناسب موقفه (مثل البقاء قرب شخص بالغ موثوق أو أصدقاء آمنين، عدم الرد وحفظ لقطات الشاشة والحظر في التنمر الإلكتروني، أو التنفس ببطء عند التوتر).',
    testigo: 'الطالب شاهد موقف تنمر ويريد المساعدة. قدّر شجاعته وقدّم له نصيحة عملية وآمنة دون تعريض نفسه للخطر (مثل دعم زميله بلطف بعد ذلك، عدم نشر السخرية أو الصور، وإبلاغ شخص بالغ موثوق).',
    rules: 'أجب دائماً باللغة العربية في جملتين أو ثلاث جمل قصيرة وبسيطة وبأسلوب مرافق ودافئ. لا تلم الطالب ولا تحكم عليه ولا تستجوبه أبداً. لا تطلب أبداً أي بيانات شخصية تعريفية (الاسم الكامل، العنوان، رقم الهاتف، اسم المدرسة أو الصور). وعندما يكون مناسباً، ذكّره بلطف ودون تكرار بصندوق البلاغ المجهول أو ركن الهدوء.'
  }
};

function normalizeLang(lang) {
  return VALID_LANGS.includes(lang) ? lang : 'es';
}

function normalizeBranch(branch) {
  return branch === 'testigo' ? 'testigo' : 'victima';
}

export function detectSuggestedPlace(text) {
  const normalized = normalizeText(text);
  if (!normalized) return null;

  for (const entry of PLACE_PATTERNS) {
    if (entry.latin.test(normalized) || entry.arabic.test(normalized)) {
      return entry.place;
    }
  }
  return null;
}

export function detectCrisis(text) {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return CRISIS_LATIN_REGEX.test(normalized) || CRISIS_ARABIC_REGEX.test(normalized);
}

export function getCrisisReply(lang) {
  const safeLang = normalizeLang(lang);
  return CRISIS_REPLIES[safeLang];
}

export function buildChatSystemPrompt(lang, branch) {
  const safeLang = normalizeLang(lang);
  const safeBranch = normalizeBranch(branch);
  const template = PROMPT_TEMPLATES[safeLang];
  return `${template.intro} ${template[safeBranch]} ${template.rules}`;
}

export function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  const valid = [];
  for (const item of history) {
    if (!item || typeof item !== 'object') continue;
    if (item.role !== 'user' && item.role !== 'model') continue;
    if (typeof item.text !== 'string') continue;

    const cleanText = item.text.trim().slice(0, MAX_HISTORY_TEXT_LENGTH);
    if (!cleanText) continue;

    valid.push({ role: item.role, text: cleanText });
  }

  return valid.slice(-MAX_HISTORY_ITEMS);
}

export async function requestGeminiServerReply({
  message,
  history = [],
  lang = 'es',
  branch = 'victima',
  apiKey,
  model = DEFAULT_MODEL,
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS
} = {}) {
  const cleanKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!cleanKey) {
    throw new Error('MISSING_API_KEY');
  }

  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  if (!cleanMessage) {
    throw new Error('INVALID_MESSAGE');
  }

  if (typeof fetchImpl !== 'function') {
    throw new Error('FETCH_UNAVAILABLE');
  }

  const resolvedModel = typeof model === 'string' && model.trim() ? model.trim() : DEFAULT_MODEL;
  const resolvedTimeout =
    typeof timeoutMs === 'number' && Number.isFinite(timeoutMs) && timeoutMs > 0
      ? timeoutMs
      : DEFAULT_TIMEOUT_MS;

  const safeHistory = sanitizeHistory(history);
  const contents = [
    ...safeHistory.map((item) => ({
      role: item.role,
      parts: [{ text: item.text }]
    })),
    {
      role: 'user',
      parts: [{ text: cleanMessage }]
    }
  ];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(resolvedModel)}:generateContent`;
  const isFlash25 = /^gemini-2\.5-flash/i.test(resolvedModel);
  const generationConfig = {
    temperature: 0.5,
    maxOutputTokens: isFlash25 ? 512 : 1024
  };
  if (isFlash25) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), resolvedTimeout);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildChatSystemPrompt(lang, branch) }]
        },
        contents,
        generationConfig
      }),
      signal: controller.signal
    });

    if (!response || !response.ok) {
      throw new Error(`GEMINI_HTTP_${response ? response.status : 'ERROR'}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts)
      ? parts
          .filter((part) => !part?.thought)
          .map((part) => (typeof part?.text === 'string' ? part.text : ''))
          .join('')
          .trim()
      : '';

    if (!reply) {
      throw new Error('EMPTY_GEMINI_REPLY');
    }

    return reply;
  } finally {
    clearTimeout(timer);
  }
}
