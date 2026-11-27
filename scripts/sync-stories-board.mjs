#!/usr/bin/env node
/**
 * Sincronizador de backlog Markdown -> datos estáticos para el tablón Kanban.
 *
 * Lee `docs/USER_STORIES.md` (Sección 2: Épicas y Sección 3: Historias de usuario)
 * y genera `docs/stories-data.js` asignando `window.CONTIGO_STORIES_DATA` para que
 * `docs/stories-board.html` funcione tanto con servidor HTTP como abierto
 * directamente con doble clic (`file://`).
 *
 * Uso:
 *   node scripts/sync-stories-board.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SOURCE_REL_PATH = 'docs/USER_STORIES.md';
const OUTPUT_REL_PATH = 'docs/stories-data.js';
const SOURCE_PATH = path.join(ROOT_DIR, SOURCE_REL_PATH);
const OUTPUT_PATH = path.join(ROOT_DIR, OUTPUT_REL_PATH);

const ACTOR_GROUPS_BY_PREFIX = {
  'US-ED': 'Estudiantes con discapacidad',
  'US-ES': 'Estudiantes sin discapacidad',
  'US-PR': 'Profesores y Orientación',
  'US-FA': 'Padres, madres y tutores legales',
  'US-TR': 'Transversales y Plataforma',
};

/**
 * Elimina sintaxis Markdown inline manteniendo el texto legible.
 */
function stripInlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[\s(«])\*([^*]+)\*(?=[\s.,;:!?»)»]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parsea la tabla de la Sección 2 ("Mapa de Épicas").
 */
function parseEpics(lines) {
  const epics = [];
  let inSection2 = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^##\s+2\.\s+Mapa de Épicas/i.test(line)) {
      inSection2 = true;
      continue;
    }
    if (inSection2 && /^##\s+3\./.test(line)) {
      break;
    }
    if (!inSection2 || !line.startsWith('|')) {
      continue;
    }

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 5) continue;

    // Saltar cabecera y separador de tabla
    if (/^ID\s+Épica/i.test(cells[0]) || /^-+$/.test(cells[0].replace(/\s/g, ''))) {
      continue;
    }

    const id = stripInlineMarkdown(cells[0]);
    if (!/^EP-\d{2}$/.test(id)) continue;

    epics.push({
      id,
      actor: stripInlineMarkdown(cells[1]),
      range: stripInlineMarkdown(cells[2]),
      objective: stripInlineMarkdown(cells[3]),
      release: stripInlineMarkdown(cells[4]),
    });
  }

  return epics;
}

/**
 * Parsea las historias de usuario de la Sección 3.
 */
function parseStories(lines, epicsById) {
  const stories = [];
  let inSection3 = false;
  let currentSectionActor = '';
  let currentEpicId = '';
  let currentEpicTitle = '';
  let currentStory = null;
  let inAcceptanceCriteria = false;

  const flushStory = () => {
    if (currentStory) {
      stories.push(currentStory);
      currentStory = null;
    }
    inAcceptanceCriteria = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (/^##\s+3\.\s+Historias de Usuario/i.test(trimmed)) {
      inSection3 = true;
      continue;
    }
    if (inSection3 && /^##\s+4\./.test(trimmed)) {
      flushStory();
      break;
    }
    if (!inSection3) continue;

    // Cabecera de actor: ### 3.1 Estudiantes con discapacidad (`EP-09`, `EP-01` y `EP-02`)
    const actorHeaderMatch = trimmed.match(/^###\s+3\.\d+\s+(.+?)\s*\(([^)]+)\)\s*$/);
    if (actorHeaderMatch) {
      flushStory();
      currentSectionActor = stripInlineMarkdown(actorHeaderMatch[1]);
      const epicRefs = actorHeaderMatch[2].match(/EP-\d{2}/g) || [];
      if (epicRefs.length === 1) {
        currentEpicId = epicRefs[0];
        currentEpicTitle = currentSectionActor;
      }
      continue;
    }

    // Cabecera de épica: #### EP-09 · Descubrimiento guiado sin «¿Por qué?» (...)
    const epicHeaderMatch = trimmed.match(/^####\s+(EP-\d{2})\s*·\s*(.+)$/);
    if (epicHeaderMatch) {
      flushStory();
      currentEpicId = epicHeaderMatch[1];
      currentEpicTitle = stripInlineMarkdown(epicHeaderMatch[2]);
      continue;
    }

    // Cabecera de historia: ##### `US-ED-10` · Título...
    const storyHeaderMatch = trimmed.match(/^#####\s+`([A-Z]{2}-[A-Z]{2}-\d+)`\s*·\s*(.+)$/);
    if (storyHeaderMatch) {
      flushStory();
      const id = storyHeaderMatch[1];
      const title = stripInlineMarkdown(storyHeaderMatch[2]);
      const actorPrefix = id.split('-').slice(0, 2).join('-');
      const actorGroup = ACTOR_GROUPS_BY_PREFIX[actorPrefix] || currentSectionActor;

      if (!currentEpicId || !epicsById.has(currentEpicId)) {
        throw new Error(`Historia ${id} encontrada sin épica válida (actual: "${currentEpicId}")`);
      }

      currentStory = {
        id,
        title,
        epicId: currentEpicId,
        epicTitle: currentEpicTitle || epicsById.get(currentEpicId).objective,
        actorGroup,
        actorPrefix,
        priority: '',
        release: '',
        status: '',
        statusDetail: '',
        assignee: '',
        isAvailable: false,
        story: '',
        acceptanceCriteria: [],
      };
      continue;
    }

    if (!currentStory) continue;

    // Línea de metadatos: - **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (...) | **Asignado a:** Sin asignar
    if (trimmed.startsWith('- **Prioridad:**')) {
      const metaMatch = trimmed.match(
        /^\-\s+\*\*Prioridad:\*\*\s*`?([^|`]+?)`?\s*\|\s*\*\*Release:\*\*\s*`?([^|`]+?)`?\s*\|\s*\*\*Estado actual:\*\*\s*`([^`]+)`(?:\s*\(([\s\S]*?)\))?\s*\|\s*\*\*Asignado a:\*\*\s*(.+)$/
      );
      if (!metaMatch) {
        throw new Error(`No se pudo parsear la línea de metadatos de ${currentStory.id}: ${trimmed}`);
      }
      currentStory.priority = stripInlineMarkdown(metaMatch[1]);
      currentStory.release = stripInlineMarkdown(metaMatch[2]);
      currentStory.status = stripInlineMarkdown(metaMatch[3]);
      currentStory.statusDetail = metaMatch[4] ? stripInlineMarkdown(metaMatch[4]) : '';
      currentStory.assignee = stripInlineMarkdown(metaMatch[5]);
      currentStory.isAvailable = currentStory.assignee.toLowerCase() === 'sin asignar';
      continue;
    }

    // Historia de usuario: - **Historia:** Como ...
    if (trimmed.startsWith('- **Historia:**')) {
      currentStory.story = stripInlineMarkdown(trimmed.replace(/^- \*\*Historia:\*\*\s*/, ''));
      continue;
    }

    // Inicio de criterios de aceptación
    if (/^- \*\*Criterios de aceptación:\*\*/.test(trimmed)) {
      inAcceptanceCriteria = true;
      continue;
    }

    // Ítems numerados de criterios de aceptación
    if (inAcceptanceCriteria) {
      const acMatch = trimmed.match(/^(\d+\.\s+.+)$/);
      if (acMatch) {
        currentStory.acceptanceCriteria.push(stripInlineMarkdown(acMatch[1]));
      }
    }
  }

  flushStory();
  return stories;
}

/**
 * Valida integridad de épicas e historias parseadas.
 */
function validateData(epics, stories) {
  const expectedEpics = ['EP-01', 'EP-02', 'EP-03', 'EP-04', 'EP-05', 'EP-06', 'EP-07', 'EP-08', 'EP-09'];
  const parsedEpicIds = new Set(epics.map((e) => e.id));

  for (const epicId of expectedEpics) {
    if (!parsedEpicIds.has(epicId)) {
      throw new Error(`Falta la épica esperada ${epicId} en Sección 2.`);
    }
  }

  for (const epic of epics) {
    for (const field of ['id', 'actor', 'range', 'objective', 'release']) {
      if (!epic[field] || typeof epic[field] !== 'string') {
        throw new Error(`Épica ${epic.id || '(sin id)'} tiene campo vacío o inválido: ${field}`);
      }
    }
  }

  if (stories.length === 0) {
    throw new Error('No se parseó ninguna historia de usuario.');
  }

  const seenStoryIds = new Set();
  const requiredStringFields = [
    'id',
    'title',
    'epicId',
    'epicTitle',
    'actorGroup',
    'actorPrefix',
    'priority',
    'release',
    'status',
    'assignee',
    'story',
  ];

  for (const story of stories) {
    if (seenStoryIds.has(story.id)) {
      throw new Error(`ID de historia duplicado: ${story.id}`);
    }
    seenStoryIds.add(story.id);

    for (const field of requiredStringFields) {
      if (!story[field] || typeof story[field] !== 'string') {
        throw new Error(`Historia ${story.id} tiene campo vacío o inválido: ${field}`);
      }
    }

    if (typeof story.statusDetail !== 'string') {
      throw new Error(`Historia ${story.id} tiene statusDetail inválido.`);
    }

    if (typeof story.isAvailable !== 'boolean') {
      throw new Error(`Historia ${story.id} tiene isAvailable inválido.`);
    }

    if (!Array.isArray(story.acceptanceCriteria) || story.acceptanceCriteria.length === 0) {
      throw new Error(`Historia ${story.id} no tiene criterios de aceptación.`);
    }
  }
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function main() {
  if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error(`No se encontró el archivo fuente: ${SOURCE_PATH}`);
  }

  const markdown = fs.readFileSync(SOURCE_PATH, 'utf8');
  const lines = markdown.split(/\r?\n/);

  const epics = parseEpics(lines);
  const epicsById = new Map(epics.map((e) => [e.id, e]));
  const stories = parseStories(lines, epicsById);

  validateData(epics, stories);

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceFile: SOURCE_REL_PATH,
    epics,
    stories,
  };

  const banner = [
    '// Archivo generado automáticamente por scripts/sync-stories-board.mjs',
    `// Fuente: ${SOURCE_REL_PATH} — No editar manualmente.`,
    `window.CONTIGO_STORIES_DATA = ${JSON.stringify(payload, null, 2)};`,
    '',
  ].join('\n');

  fs.writeFileSync(OUTPUT_PATH, banner, 'utf8');

  const statusCounts = countBy(stories, 'status');
  const priorityCounts = countBy(stories, 'priority');
  const availableCount = stories.filter((s) => s.isAvailable).length;

  console.log(`Sincronizacion completada: ${OUTPUT_REL_PATH}`);
  console.log(`- Epicas parseadas (${epics.length}): ${epics.map((e) => e.id).join(', ')}`);
  console.log(`- Historias parseadas: ${stories.length} (disponibles: ${availableCount}, asignadas: ${stories.length - availableCount})`);
  console.log('- Conteo por estado:');
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`  * ${status}: ${count}`);
  }
  console.log('- Conteo por prioridad:');
  for (const [priority, count] of Object.entries(priorityCounts)) {
    console.log(`  * ${priority}: ${count}`);
  }
}

main();
