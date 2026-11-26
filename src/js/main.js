/**
 * Punto de entrada principal de la aplicación Contigo.
 * Inicializa servicios y módulos funcionales en orden determinista.
 */

import { go } from './core/router.js';
import { initI18n } from './services/i18n.js';
import { initSpeechRecognition } from './services/speech.js';
import { initAccessibility } from './modules/accessibility.js';
import { initCaa } from './modules/caa.js';
import { initCalm } from './modules/calm.js';
import { initChat } from './modules/chat.js';
import { initDiary } from './modules/diary.js';
import { initFeedback } from './modules/feedback.js';
import { initFlow } from './modules/flow.js';
import { initParents } from './modules/parents.js';
import { initQuestionnaire } from './modules/questionnaire.js';
import { initTeacherPanel } from './modules/teacher-panel.js';

function bootstrap() {
  initI18n();
  initCaa();
  initDiary();
  initTeacherPanel();
  initChat();
  initQuestionnaire();
  initParents();
  initCalm();
  initFeedback();
  initFlow();
  initAccessibility();
  initSpeechRecognition();

  go('home', false);
}

bootstrap();
