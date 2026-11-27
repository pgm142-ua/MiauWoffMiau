// Archivo generado automáticamente por scripts/sync-stories-board.mjs
// Fuente: docs/USER_STORIES.md — No editar manualmente.
window.CONTIGO_STORIES_DATA = {
  "generatedAt": "2026-11-27T12:59:19.917Z",
  "sourceFile": "docs/USER_STORIES.md",
  "epics": [
    {
      "id": "EP-09",
      "actor": "Estudiantes con discapacidad + Docentes",
      "range": "US-ED-10 a US-ED-14, US-PR-09",
      "objective": "Descubrimiento guiado sin «¿Por qué?»: comunicar malestar sin causa identificada mediante sensaciones, rutina, tarjetas Sí/No/No lo sé, relato diario asistido por IA (Google Gemini), patrones e intervención sin interrogatorio.",
      "release": "R1 / R2"
    },
    {
      "id": "EP-01",
      "actor": "Estudiantes con discapacidad",
      "range": "US-ED-01 a US-ED-05",
      "objective": "Garantizar onboarding accesible, regulación sensorial y comunicación multimodal (Adaptado, CAA, Calma).",
      "release": "R1 (mejoras) / R2"
    },
    {
      "id": "EP-02",
      "actor": "Estudiantes con discapacidad",
      "range": "US-ED-06 a US-ED-09",
      "objective": "Asegurar accesibilidad técnica total (teclado, voz prestada, acceso NaviLens/QR) y seguimiento en lectura fácil.",
      "release": "R2 / R3"
    },
    {
      "id": "EP-03",
      "actor": "Estudiantes sin discapacidad",
      "range": "US-ES-01 a US-ES-04",
      "objective": "Ofrecer canales ágiles y anónimos (Chat seguro, Buzón anónimo, Cuestionario con prioridad urgente).",
      "release": "R1"
    },
    {
      "id": "EP-04",
      "actor": "Estudiantes sin discapacidad",
      "range": "US-ES-05 a US-ES-08",
      "objective": "Fortalecer evidencias privadas (Diario), protección al testigo, cierre emocional y seguimiento bidireccional SAFE-XXX.",
      "release": "R1 / R2"
    },
    {
      "id": "EP-05",
      "actor": "Profesores y Orientación",
      "range": "US-PR-01 a US-PR-05",
      "objective": "Proteger y profesionalizar el Panel Docente con login por rol, bandeja sincronizada, alertas urgentes y respuesta segura.",
      "release": "R1 / R2"
    },
    {
      "id": "EP-06",
      "actor": "Profesores y Orientación",
      "range": "US-PR-06 a US-PR-08",
      "objective": "Convertir los avisos en prevención (Mapa de Puntos Calientes), pautas TEA y documentación oficial de convivencia.",
      "release": "R2 / R3"
    },
    {
      "id": "EP-07",
      "actor": "Padres, madres y tutores",
      "range": "US-FA-01 a US-FA-06",
      "objective": "Detección temprana desde casa, modo acompañamiento, acuse SAFE-XXX y coordinación discreta con el centro.",
      "release": "R1 / R2"
    },
    {
      "id": "EP-08",
      "actor": "Transversales y Plataforma",
      "range": "US-TR-01 a US-TR-06",
      "objective": "Privacidad RGPD/LOPIVI, backend offline-first, proxy IA moderado, Salida Rápida, i18n/RTL y suite automatizada a11y/E2E.",
      "release": "R1 / R2 / R3"
    }
  ],
  "stories": [
    {
      "id": "US-ED-10",
      "title": "Pedir ayuda inmediata sin tener que explicar el motivo («Estoy mal y no sé por qué»)",
      "epicId": "EP-09",
      "epicTitle": "Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "actualmente #screen-3-situation-type obliga a elegir Víctima, Testigo o Cuestionario y #screen-adapted-2 pregunta «¿Por qué pasa?»",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con discapacidad que siente malestar o bloqueo sin saber explicar el motivo, quiero disponer de un camino directo llamado «Estoy mal y no sé por qué» o «Solo quiero que venga un adulto», para pedir ayuda en 1 o 2 toques sin sentirme examinado ni forzado a etiquetarme como víctima.",
      "acceptanceCriteria": [
        "1. Dado que estoy en #screen-home o paso por #screen-3-situation-type, cuando veo las opciones principales, entonces dispongo de la tarjeta accesible «Estoy mal y no sé por qué» sin exigir seleccionar victima ni testigo.",
        "2. Dado que entro en esa ruta en pleno bloqueo, cuando pulso la acción rápida «Solo quiero que venga un adulto / Ayuda ya», entonces se genera inmediatamente un aviso prioritario con mi contexto actual (hora, idioma, apoyos activos) y código SAFE-XXX sin obligarme a responder preguntas previas.",
        "3. Dado que envié ese aviso rápido, cuando termina el envío, entonces la pantalla me ofrece pasar con un toque al Rincón de Calma (#screen-calm) o usar Leer en voz alta (#btn-speak-for-me) si tengo a un profesor delante."
      ]
    },
    {
      "id": "US-ED-11",
      "title": "Comunicar malestar mediante señales corporales y sensoriales concretas (Mapa de Sensaciones)",
      "epicId": "EP-09",
      "epicTitle": "Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "evolución de #screen-adapted-1, que hoy solo muestra 4 emociones abstractas: calm, sad, scared, angry",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con TEA, alexitimia o discapacidad intelectual que no identifica emociones abstractas, quiero señalar qué nota mi cuerpo o qué me molesta del entorno mediante pictogramas concretos (tripa, cabeza, ruido, querer esconderme, corazón rápido, no lo sé), para expresar cómo me encuentro aunque no sepa ponerle nombre sentimental.",
      "acceptanceCriteria": [
        "1. Dado que accedo al paso de sensaciones (#screen-adapted-1 ampliado o ruta «No sé por qué»), cuando exploro las opciones, entonces encuentro tarjetas visuales y con audio TTS de señales corporales y sensoriales (me duele la tripa o la cabeza, demasiado ruido o luz, me quiero esconder o irme, me late fuerte el corazón, no me salen las palabras, no lo sé) junto a las 4 caras básicas.",
        "2. Dado que noto varias cosas a la vez o no estoy seguro, cuando selecciono una o más señales (o «No lo sé»), entonces puedo avanzar al siguiente paso sin mensajes de error ni obligatoriedad de elegir una emoción abstracta.",
        "3. Dado que tengo activada Lectura Fácil o TEA / Sin animaciones, cuando toco cualquier tarjeta, entonces cada opción muestra texto ultra corto, alto contraste y retroalimentación sin animaciones bruscas."
      ]
    },
    {
      "id": "US-ED-12",
      "title": "Reconstrucción guiada de hechos concretos (Rutina + Tarjetas Sí / No / No lo sé) en lugar de «¿Por qué pasa?»",
      "epicId": "EP-09",
      "epicTitle": "Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "evolución de #screen-adapted-2 y src/js/modules/flow.js, donde hoy se pregunta «¿Por qué pasa?» con 6 categorías abstractas",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con discapacidad que no sabe deducir por qué está mal, quiero que la app me haga preguntas muy cortas sobre cuándo empezó en mi rutina del día y escenas concretas con botones Sí, No y No lo sé, para dar pistas reales al profesor sin bloquearme si no sé contestar.",
      "acceptanceCriteria": [
        "1. Dado que supero el paso de sensaciones y quiero seguir dando pistas, cuando entro en la exploración guiada, entonces primero elijo en una rutina visual del día cuándo empezó (antes de llegar, entrada, clase, recreo/patio, pasillo/baño, comedor, salida, no lo sé) y después recorro micro-tarjetas de una sola pregunta por pantalla con pictograma ARASAAC y TTS.",
        "2. Dado que veo escenas concretas (burlas/risas, quedarse solo/excluido, empujones o cosas rotas, demasiado ruido/gente, cambio inesperado de rutina, mensajes en el móvil), cuando respondo Sí, No o No lo sé (o salto al envío en cualquier momento), entonces todas las respuestas se adjuntan al aviso de forma estructurada.",
        "3. Dado que respondo «No lo sé» a todas las escenas concretas, cuando finalizo, entonces el aviso se envía exactamente igual al centro como caso «Sin causa definida» con código SAFE-XXX y sin bloquear ni reprender al estudiante."
      ]
    },
    {
      "id": "US-ED-13",
      "title": "Registro pictográfico ultrarrápido de malestar para detectar patrones invisibles",
      "epicId": "EP-09",
      "epicTitle": "Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Should",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "versión adaptada y simplificada de #screen-diary y src/js/modules/diary.js",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con discapacidad que pasa malos ratos repetidos sin identificar la causa, quiero registrar en 2 toques (cómo noto mi cuerpo + momento de la rutina/lugar) cada vez que me siento mal, para que el sistema y mis profesores descubran qué situación recurrente me está haciendo daño.",
      "acceptanceCriteria": [
        "1. Dado que abro el registro rápido pictográfico (solo o acompañado por familia/apoyo), cuando toco un pictograma de sensación y un momento de la rutina/lugar, entonces la entrada se guarda con fecha y hora reales en menos de 10 segundos sin exigir texto escrito.",
        "2. Dado que se acumulan 2 o más registros de malestar sin causa definida en la misma franja o lugar durante una ventana de 7 días, cuando se evalúa el patrón (con permiso de envío o desde el historial compartido), entonces se genera una alerta de patrón recurrente para el equipo docente."
      ]
    },
    {
      "id": "US-ED-14",
      "title": "Relato guiado del día con identificación de posibles causas mediante API de Google (Gemini)",
      "epicId": "EP-09",
      "epicTitle": "Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#screen-daily-story, src/js/modules/daily-story.js, src/js/services/gemini.js, src/js/services/speech.js, src/js/core/router.js, src/styles/components.css, src/styles/accessibility.css y diccionarios i18n",
      "assignee": "pgm142-ua",
      "isAvailable": false,
      "story": "Como estudiante con discapacidad cognitiva que puede contar lo que le ha pasado durante el día pero no identificar por sí solo si sufre acoso o cuál es la causa, quiero explicar mi día por voz o texto sencillo para que la aplicación, mediante la API de Google (Gemini), identifique posibles causas, emociones y lugares de riesgo y me ayude a confirmarlos y avisar a un adulto.",
      "acceptanceCriteria": [
        "1. Dado que accedo al flujo adaptado para alumnado con discapacidad cognitiva, cuando entro en la opción de contar mi día, entonces puedo relatar lo ocurrido mediante dictado por voz (Web Speech API) o texto libre sencillo con apoyo de Lectura Fácil y lectura en voz alta (TTS).",
        "2. Dado que envío mi relato diario, cuando se procesa con la API de Google Gemini (con fallback local por reglas si no hay conexión o clave configurada), entonces el sistema devuelve un análisis estructurado con posibles causas (burlas, exclusión, agresión, sobrecarga sensorial u otras), emoción probable, lugar/momento y nivel de alerta.",
        "3. Dado que el sistema identifica posibles causas a partir de mi relato, cuando se muestran en pantalla, entonces las presenta en Lectura Fácil con tarjetas visuales de confirmación (Sí, es eso / No / No lo sé) y permite enviar el aviso estructurado al Panel Docente con código SAFE-XXX sin interrogar ni bloquear al estudiante."
      ]
    },
    {
      "id": "US-PR-09",
      "title": "Lectura docente de avisos «Sin causa definida» y guía de intervención sin interrogatorio",
      "epicId": "EP-09",
      "epicTitle": "Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "evolución de #screen-teacher-panel y src/js/modules/teacher-panel.js",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como profesor, tutor u orientador que recibe un aviso donde el estudiante no supo explicar el porqué, quiero ver de forma estructurada sus pistas corporales, momento de la rutina, respuestas Sí/No/No sé e historial reciente, junto con una pauta clara de acogida sin interrogatorio, para ayudarlo a regularse y observar la situación real sin aumentar su bloqueo.",
      "acceptanceCriteria": [
        "1. Dado que entra en #screen-teacher-panel un aviso procedente de US-ED-10–US-ED-12, cuando abro su tarjeta, entonces distingo claramente la etiqueta «Malestar sin causa identificada», las señales corporales marcadas, el tramo de rutina donde empezó y las respuestas Sí/No/No lo sé.",
        "2. Dado que ese alumno o franja tiene avisos previos o señales enviadas desde casa (US-FA-01), cuando consulto el caso, entonces el panel resalta la coincidencia de día/franja/lugar como hipótesis de observación.",
        "3. Dado que debo intervenir presencialmente con el estudiante, cuando leo la pauta contextualizada del aviso, entonces muestra acciones concretas de acogida segura (no insistir con «¿por qué lloras/estás así?», ofrecer espacio tranquilo, validar con pictogramas o tarjetas Sí/No, y vigilar discretamente la franja/zona señalada)."
      ]
    },
    {
      "id": "US-ED-01",
      "title": "Configuración guiada de voz y apoyos en Pasos 0 y 0B",
      "epicId": "EP-01",
      "epicTitle": "Onboarding accesible, regulación y comunicación adaptada",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#screen-0-voice, #screen-0-disability, src/js/modules/flow.js, src/js/modules/accessibility.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante con discapacidad visual, auditiva, motora, cognitiva o TEA, quiero elegir al entrar si necesito voz y qué apoyos prefiero mediante tarjetas claras o atajos numéricos, para usar la aplicación sin barreras desde el primer segundo.",
      "acceptanceCriteria": [
        "1. Dado que accedo a #screen-0-voice, cuando elijo «Sí, con voz» (1), respondo escribiendo/dictando «sí» o pulso escuchar bienvenida (#btn-play-welcome-voice), entonces se activa la guía TTS (#gear-voice-guide) respetando el modo sordo si se activa después.",
        "2. Dado que estoy en #screen-0-disability, cuando activo una o varias tarjetas (ciega, sorda, muda, intelectual, tea, motora) mediante clic, teclas 1–6 o formulario rápido, entonces se aplican en el DOM las clases .contrast/tamaño de fuente (ciega sube al menos a nivel 1), silenciado visual (sorda), lectura fácil (easy), sin animaciones (still) y botones grandes (motor).",
        "3. Dado que activo el modo sorda, cuando el sistema emite cualquier confirmación o toast, entonces se muestra en la franja visual superior (#visual-alert-strip) sin reproducir audio."
      ]
    },
    {
      "id": "US-ED-02",
      "title": "Persistencia de perfil de accesibilidad y enrutado inteligente tras Paso 0B",
      "epicId": "EP-01",
      "epicTitle": "Onboarding accesible, regulación y comunicación adaptada",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "src/js/modules/accessibility.js no persiste ajustes y applyDisabilitySupport() siempre envía a 1-role sin orientar el modo",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con discapacidad que entra de forma recurrente, quiero que mis preferencias de accesibilidad se recuerden en mi dispositivo y que el sistema me recomiende directamente el Modo Adaptado, exploración guiada o Tablero CAA si seleccioné apoyo cognitivo, TEA o sin habla, para no repetir configuraciones ni perderme entre pasos intermedios.",
      "acceptanceCriteria": [
        "1. Dado que configuré mis apoyos en Paso 0B o en #gear-modal, cuando recargo o vuelvo a abrir la aplicación (salvo modo privado/borrado explícito), entonces se restauran automáticamente tamaño de fuente, velocidad de voz y apoyos activos.",
        "2. Dado que seleccioné muda, intelectual o tea en Paso 0B y elijo rol alumno, cuando llego a la elección de modo (#screen-2-mode), entonces la opción Adaptado / No sé por qué (o acceso directo a Tablero CAA si marqué muda) queda destacada como recomendada y accesible en un clic.",
        "3. Dado que cambio de opinión en cualquier momento, cuando abro #gear-modal, entonces puedo restablecer o ajustar cualquier parámetro sin reiniciar el flujo en curso."
      ]
    },
    {
      "id": "US-ED-03",
      "title": "Comunicación visual en 3 pasos (Modo Adaptado)",
      "epicId": "EP-01",
      "epicTitle": "Onboarding accesible, regulación y comunicación adaptada",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#screen-adapted-1 a #screen-adapted-3, src/js/modules/flow.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante con discapacidad cognitiva o TEA que sí identifica lo ocurrido, quiero contar qué me pasa eligiendo cómo me siento, la causa o escena y el lugar/envío en pantallas simples, para pedir ayuda sin enfrentarme a un cuestionario largo.",
      "acceptanceCriteria": [
        "1. Dado que entro en el flujo Adaptado como víctima o testigo, cuando selecciono una opción en #screen-adapted-1 y #screen-adapted-2, entonces #screen-adapted-3 muestra el resumen visual combinado en #adapted-summary-box.",
        "2. Dado que estoy en #screen-adapted-3, cuando selecciono el lugar (patio, hallways, class, entrance), uso una frase rápida opcional o dicto/escribo una nota y pulso Enviar al profesor (#btn-send-to-teacher), entonces se registra el aviso y se muestra confirmación con código SAFE-XXX.",
        "3. Dado que necesito parar o cambiar algo, cuando pulso Volver o el atajo de teclado asignado, entonces regreso al paso anterior conservando mis selecciones previas."
      ]
    },
    {
      "id": "US-ED-04",
      "title": "Tablero CAA («Voz Prestada») con pictogramas ARASAAC y selector de lugar",
      "epicId": "EP-01",
      "epicTitle": "Onboarding accesible, regulación y comunicación adaptada",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#screen-caa y src/js/modules/caa.js funcionan con pictogramas y voz, pero #btn-caa-send-teacher envía siempre place = 'patio'",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante sin habla oral o con bloqueo comunicativo, quiero construir frases tocando pictogramas por categorías, escucharlas en voz alta y elegir exactamente dónde ocurrió antes de enviarlas al profesorado, para comunicarme con autonomía y precisión.",
      "acceptanceCriteria": [
        "1. Dado que estoy en #screen-caa, cuando filtro por categorías (quien, que, sentir, donde, pedir) y toco pictogramas ARASAAC, entonces cada pictograma se añade como chip eliminable en #caa-sentence-chips y se pronuncia por voz salvo modo sordo.",
        "2. Dado que ya formé una frase y pulso Enviar al Profesor (#btn-caa-send-teacher), cuando no incluí un pictograma de lugar o quiero precisarlo, entonces el sistema toma el lugar seleccionado (o el pictograma en clase / en los pasillos / en el patio de la frase) en lugar de forzar 'patio'.",
        "3. Dado que prefiero ampliar el mensaje por escrito, cuando pulso Llevar al Chat (#btn-caa-use-chat), entonces la frase construida se copia en #chat-input y navega a #screen-no-adapted."
      ]
    },
    {
      "id": "US-ED-05",
      "title": "Pausa sensorial guiada en el Rincón de Calma",
      "epicId": "EP-01",
      "epicTitle": "Onboarding accesible, regulación y comunicación adaptada",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#screen-calm, src/js/modules/calm.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante con TEA o sobrecarga sensorial, quiero acceder en un toque a un espacio de respiración visual pausado y predecible con guía opcional por voz, para regularme antes o después de contar lo que me ocurre.",
      "acceptanceCriteria": [
        "1. Dado que accedo a #screen-calm desde navegación, portada o tras enviar un aviso (#btn-adapted-to-calm), cuando se abre la pantalla, entonces el círculo #breathing-circle alterna fases lentas («Coge aire despacio…» / «Suelta el aire…») cada 4 segundos junto al indicador de progreso .calm-prog.",
        "2. Dado que activo el modo TEA / Sin animaciones (.still), cuando estoy en #screen-calm, entonces no hay movimientos bruscos ni parpadeos que provoquen sobrecarga, pudiendo pausar/reanudar con #btn-calm-pause y activar voz con #btn-calm-sound.",
        "3. Dado que ya me siento regulado/a, cuando pulso Ya estoy mejor, entonces vuelvo exactamente a la pantalla desde la que entré sin perder mi progreso."
      ]
    },
    {
      "id": "US-ED-06",
      "title": "Navegación completa por teclado, foco visible y compatibilidad con lector de pantalla",
      "epicId": "EP-02",
      "epicTitle": "Accesibilidad técnica avanzada, acceso sin fricción y seguimiento simple",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "src/styles/base.css, src/js/core/router.js, src/js/modules/accessibility.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante ciego o con discapacidad motora, quiero recorrer todas las opciones con teclado (Tab, atajos 1–6), contar con foco de alto contraste y escuchar cada cambio de pantalla o modal correctamente encapsulado, para operar la app de forma independiente con lector de pantalla o pulsadores.",
      "acceptanceCriteria": [
        "1. Dado que cambio de pantalla mediante go(), cuando se renderiza la nueva vista, entonces el foco se mueve automáticamente al <h1> principal y, si la guía de voz está activa, se lee título y subtítulo.",
        "2. Dado que uso atajos numéricos 1–6, cuando no estoy escribiendo dentro de un INPUT, SELECT o TEXTAREA, entonces se activa el botón visible correspondiente al data-key.",
        "3. Dado que abro #gear-modal, #api-modal o #safe-exit-screen, cuando el modal está activo, entonces <header>, <main>, <footer> y .mobile-bottom-nav quedan inert = true y al cerrar regresa el foco al elemento disparador.",
        "4. Dado cualquier componente nuevo o refactorizado, cuando se implementa en HTML, entonces utiliza elementos semánticos nativos (<button>, <a href>, <nav>, <main>, <fieldset>/<legend>, <label for>, <details>) aplicando WAI-ARIA únicamente como refuerzo de estado o relación."
      ]
    },
    {
      "id": "US-ED-07",
      "title": "Lectura en voz alta presencial al profesor («Leer en voz alta por mí»)",
      "epicId": "EP-02",
      "epicTitle": "Accesibilidad técnica avanzada, acceso sin fricción y seguimiento simple",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Should",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#btn-speak-for-me en #screen-adapted-3, src/js/modules/flow.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante que está físicamente delante de un docente pero sufre bloqueo del habla o mutismo situacional, quiero pulsar un botón tras preparar mi mensaje para que el dispositivo lo lea en voz alta al profesor, para pedir ayuda cara a cara sin tener que hablar.",
      "acceptanceCriteria": [
        "1. Dado que envié mi aviso en #screen-adapted-3, cuando pulso #btn-speak-for-me, entonces el navegador sintetiza en voz alta uiState.lastReport con el idioma y velocidad configurados.",
        "2. Dado que cambié de idioma antes de pulsar el botón o uso una nota en CAA, cuando se reproduce la lectura, entonces la síntesis utiliza el idioma activo en i18n.js y permite detenerse con el botón global #btn-read-page."
      ]
    },
    {
      "id": "US-ED-08",
      "title": "Acceso inmediato mediante código NaviLens o QR accesible del centro",
      "epicId": "EP-02",
      "epicTitle": "Accesibilidad técnica avanzada, acceso sin fricción y seguimiento simple",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Should",
      "release": "R3",
      "status": "PARA INICIAR",
      "statusDetail": "el proyecto responde al reto NaviLens, pero actualmente no procesa parámetros de URL/ubicación al arrancar",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con baja visión o discapacidad cognitiva en el patio o los pasillos, quiero escanear una etiqueta NaviLens o QR del centro para abrir Contigo con mi aula/centro y zona preconfigurados, para pedir ayuda en segundos sin buscar enlaces ni teclear direcciones.",
      "acceptanceCriteria": [
        "1. Dado que accedo mediante una URL parametrizada desde NaviLens/QR (p. ej. centro y zona place=patio), cuando carga la aplicación, entonces se preselecciona el contexto del centro y el lugar sugerido en los formularios de aviso.",
        "2. Dado que el enlace indica un perfil sugerido (p. ej. acceso de baja visión con voz), cuando inicia la app, entonces ofrece confirmación en un solo toque de la configuración sugerida manteniendo Salida Rápida disponible."
      ]
    },
    {
      "id": "US-ED-09",
      "title": "Seguimiento del código SAFE-XXX en Lectura Fácil y sin acceso a panel docente",
      "epicId": "EP-02",
      "epicTitle": "Accesibilidad técnica avanzada, acceso sin fricción y seguimiento simple",
      "actorGroup": "Estudiantes con discapacidad",
      "actorPrefix": "US-ED",
      "priority": "Must",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "#screen-adapted-3 expone #btn-adapted-to-teacher-panel y no existe pantalla de consulta de estado del código",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante con discapacidad que envió un aviso, quiero consultar en Lectura Fácil y con apoyo visual el estado de mi código SAFE-XXX sin ver datos de otros alumnos, para saber si el profesor ya lo leyó y qué ayuda va a darme.",
      "acceptanceCriteria": [
        "1. Dado que estoy en flujo de estudiante (#screen-adapted-3 o #screen-feedback), cuando termino de enviar un aviso, entonces no se muestra ningún botón que abra el Panel Docente (#screen-teacher-panel) de todo el centro.",
        "2. Dado que introduzco o conservo mi código SAFE-XXX en la vista de seguimiento accesible, cuando consulto su estado, entonces veo un estado simple con icono y frase en Lectura Fácil («El profe lo ha recibido» / «Ya estamos ayudándote» / «Solucionado») y puedo escucharlo con TTS."
      ]
    },
    {
      "id": "US-ES-01",
      "title": "Entrada rápida para víctima o testigo sin barreras previas",
      "epicId": "EP-03",
      "epicTitle": "Canales ágiles, anonimato real y detección de urgencias",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#screen-home botón Contar ahora, #screen-2-mode, #screen-3-situation-type, src/js/modules/flow.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante víctima o testigo, quiero acceder directamente desde la portada a elegir cómo contar lo que pasa e indicar si me ocurre a mí o lo he visto, para actuar rápido sin recorrer ajustes que no necesito.",
      "acceptanceCriteria": [
        "1. Dado que pulso Contar ahora en #screen-home, cuando navego a #screen-2-mode y luego a #screen-3-situation-type, entonces puedo entrar al Chat (no-adapted) o al Cuestionario (questionnaire) en 2 clics.",
        "2. Dado que selecciono victima o testigo, cuando entro al chat o al cuestionario, entonces el mensaje de bienvenida (chat_welcome_victim / chat_welcome_witness) y el campo #q-branch se adaptan automáticamente a mi rol."
      ]
    },
    {
      "id": "US-ES-02",
      "title": "Chatbot empático con texto, dictado por voz e IA segura gestionada en servidor",
      "epicId": "EP-03",
      "epicTitle": "Canales ágiles, anonimato real y detección de urgencias",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#screen-no-adapted, src/js/modules/chat.js, src/js/services/gemini.js funcionan con fallback offline y clave API introducida por el usuario en cliente",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante que necesita desahogarse y orientarse, quiero conversar por texto o dictado de voz con un asistente empático disponible 24/7 sin tener que configurar claves técnicas ni exponer mis datos, para aclarar qué me pasa y qué pasos seguir.",
      "acceptanceCriteria": [
        "1. Dado que abro #screen-no-adapted, cuando escribo, uso uno de los 4 prompts rápidos o dicto con #btn-chat-mic, entonces recibo una respuesta breve, empática y con soporte de voz opcional (#btn-toggle-auto-tts).",
        "2. Dado que se habilita la IA generativa en entorno productivo, cuando envío un mensaje, entonces la llamada se cursa a través de un endpoint seguro del backend del proyecto (sin pedir API key en #api-modal al alumnado) y con fallback local automático si no hay conexión.",
        "3. Dado que el mensaje describe un lugar concreto (ej. patio o pasillos), cuando el motor local o servidor lo detecta, entonces preselecciona automáticamente el lugar sugerido en el panel de envío anónimo (#anon-place)."
      ]
    },
    {
      "id": "US-ES-03",
      "title": "Buzón de envío 100 % anónimo persistido hacia el centro educativo",
      "epicId": "EP-03",
      "epicTitle": "Canales ágiles, anonimato real y detección de urgencias",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#anon-panel en #screen-no-adapted persiste solo en sessionStorage local",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante que teme represalias, quiero enviar lo hablado en el chat o un resumen personalizado de forma 100 % anónima al destinatario que elija (Orientación, Tutor o Dirección), para alertar al centro sin revelar mi identidad.",
      "acceptanceCriteria": [
        "1. Dado que abro #anon-panel, cuando selecciono destinatario (guidance, tutor, director), lugar (#anon-place) y pulso #btn-submit-anon, entonces el aviso se envía al servidor del centro sin adjuntar nombre, IP ni metadatos identificativos de sesión.",
        "2. Dado que no rellené #anon-extra pero sí escribí mensajes en el chat, cuando envío el aviso anónimo, entonces se incluyen automáticamente mis líneas del chat y se muestra el código de seguimiento SAFE-XXX en #anon-confirm-msg."
      ]
    },
    {
      "id": "US-ES-04",
      "title": "Cuestionario estructurado con detección de peligro inmediato y prioridad crítica",
      "epicId": "EP-03",
      "epicTitle": "Canales ágiles, anonimato real y detección de urgencias",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#screen-questionnaire, src/js/modules/questionnaire.js muestra #urgent-help-alert, pero descarta el código SAFE-XXX y no marca prioridad en inbox",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante en situación de riesgo o duda, quiero completar un cuestionario guiado que detecte al instante si estoy en peligro inmediato, me muestre teléfonos de ayuda reales y genere un aviso prioritario con código de seguimiento, para recibir protección rápida acorde a la gravedad.",
      "acceptanceCriteria": [
        "1. Dado que marco Peligro inmediato (qq_safety === 'danger') en la pregunta 6, cuando cambia la selección, entonces aparece inmediatamente #urgent-help-alert con acceso visible a 112 y 900 018 018.",
        "2. Dado que envío #form-questionnaire eligiendo envío anónimo o identificado (qq_delivery), cuando el sistema registra el aviso, entonces guarda la prioridad (critical si es danger, high si es fear, normal si es safe) para que el panel docente la destaque arriba.",
        "3. Dado que se completa el envío del cuestionario, cuando transiciono a confirmación/feedback, entonces se me muestra claramente el código SAFE-XXX generado y puedo copiarlo o descargarlo."
      ]
    },
    {
      "id": "US-ES-05",
      "title": "Diario de evidencias privado con detector de escalada y envío voluntario",
      "epicId": "EP-04",
      "epicTitle": "Evidencias, apoyo al testigo y cierre de ciclo",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Should",
      "release": "R2",
      "status": "Parcial",
      "statusDetail": "#screen-diary, src/js/modules/diary.js guarda en sessionStorage y analiza evolución local, pero no permite exportar ni adjuntar entradas a un aviso",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante que sufre episodios repetidos, quiero anotar fecha, lugar, gravedad y descripción en mi diario privado, ver si la situación está escalando y decidir voluntariamente qué entradas compartir en un aviso o PDF, para contar con pruebas objetivas sin empezar de cero.",
      "acceptanceCriteria": [
        "1. Dado que registro entradas en #screen-diary con fecha, lugar, nivel (1–3) y texto/dictado, cuando pulso Analizar evolución (#btn-analyze-diary), entonces veo un resumen del total de episodios, el último lugar y si la gravedad ha escalado o bajado respecto al anterior.",
        "2. Dado que decido dar el paso de pedir ayuda, cuando selecciono una o varias entradas de mi diario, entonces puedo adjuntarlas a un envío en #screen-no-adapted / #screen-questionnaire o exportarlas en PDF limpio sin revelar nada automáticamente sin mi permiso."
      ]
    },
    {
      "id": "US-ES-06",
      "title": "Cierre emocional y plan de apoyo exportable sin enlaces docentes",
      "epicId": "EP-04",
      "epicTitle": "Evidencias, apoyo al testigo y cierre de ciclo",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Should",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#screen-feedback, src/js/modules/feedback.js genera plan y copia/PDF, pero expone el botón Ver aviso en Panel Profe",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante que acaba de enviar un aviso, quiero expresar cómo me siento tras contarlo, obtener un plan discreto de actuación y copiar o imprimir mi resumen, para irme con sensación de control y respaldo.",
      "acceptanceCriteria": [
        "1. Dado que llego a #screen-feedback tras enviar un aviso, cuando selecciono una de las 4 caras (feliz, triste, enfadada, sorprendida), entonces se despliega #full-explanation-panel con mi resumen, el plan discreto del centro y teléfonos/recursos de ayuda.",
        "2. Dado que quiero conservar el resumen, cuando pulso Copiar resumen (#btn-copy-report) o Guardar PDF (#btn-print-report), entonces obtengo el texto completo (incluyendo mi código SAFE-XXX) sin que aparezca el acceso al panel interno del profesorado."
      ]
    },
    {
      "id": "US-ES-07",
      "title": "Consulta anónima de estado y respuesta mediante código SAFE-XXX",
      "epicId": "EP-04",
      "epicTitle": "Evidencias, apoyo al testigo y cierre de ciclo",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Must",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "no existe vista ni endpoint de consulta de estado por código",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como estudiante que envió un aviso anónimo, quiero consultar el estado de mi código SAFE-XXX y leer mensajes o preguntas de seguimiento del orientador, para colaborar con la solución sin perder mi anonimato.",
      "acceptanceCriteria": [
        "1. Dado que tengo un código SAFE-XXX, cuando lo introduzco en la pantalla de consulta de seguimiento (sin usuario ni contraseña), entonces veo el estado actual (Pendiente, En seguimiento, Resuelto) y los mensajes enviados por el equipo docente para ese código.",
        "2. Dado que Orientación me formula una pregunta aclaratoria en ese hilo, cuando respondo desde la vista del código, entonces mi respuesta llega al caso correspondiente manteniendo el mismo nivel de anonimato que el envío original."
      ]
    },
    {
      "id": "US-ES-08",
      "title": "Flujo específico de protección y tranquilidad para testigos (bystanders)",
      "epicId": "EP-04",
      "epicTitle": "Evidencias, apoyo al testigo y cierre de ciclo",
      "actorGroup": "Estudiantes sin discapacidad",
      "actorPrefix": "US-ES",
      "priority": "Should",
      "release": "R2",
      "status": "Parcial",
      "statusDetail": "state.branch === 'testigo' adapta bienvenida en chat y etiqueta en resumen, pero las preguntas de #screen-questionnaire siguen redactadas en segunda persona de víctima, p. ej. «¿te dejan solo/a o se ríen de ti?»",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como testigo de acoso hacia otro compañero, quiero que las preguntas del cuestionario, la confirmación y el plan de apoyo estén adaptados a mi rol de observador y me aseguren confidencialidad, para atreverme a avisar sin sentir que me señalan.",
      "acceptanceCriteria": [
        "1. Dado que selecciono testigo en #screen-3-situation-type o #q-branch, cuando abro #screen-questionnaire, entonces los enunciados de las preguntas cambian de «¿te pasa a ti?» a «¿qué has visto que le ocurre a tu compañero/a?».",
        "2. Dado que envío un aviso como testigo, cuando llego a #screen-feedback, entonces el plan de apoyo destaca pautas seguras de acompañante («no te enfrentes solo/a, mantente a salvo, tu aviso es confidencial»)."
      ]
    },
    {
      "id": "US-PR-01",
      "title": "Autenticación institucional y control de acceso por rol (RBAC)",
      "epicId": "EP-05",
      "epicTitle": "Acceso seguro por roles, bandeja multi-dispositivo y triaje urgente",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "#screen-teacher-panel es público en la navegación actual",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como docente, orientador/a o miembro de dirección, quiero iniciar sesión con mi cuenta institucional del centro para acceder únicamente a los avisos que corresponden a mi grupo o competencia, para garantizar la confidencialidad absoluta de los menores.",
      "acceptanceCriteria": [
        "1. Dado que cualquier persona intenta navegar a #screen-teacher-panel, cuando no tiene sesión docente autenticada válida, entonces el sistema exige inicio de sesión institucional y nunca renderiza avisos de alumnado ni de familias.",
        "2. Dado que inicio sesión con rol tutor, guidance (Orientación) o director (Dirección/Convivencia), cuando cargo la bandeja, entonces solo visualizo los avisos asignados a mi ámbito/grupo según la política del centro (y nunca los datos de otros centros)."
      ]
    },
    {
      "id": "US-PR-02",
      "title": "Bandeja multi-dispositivo sincronizada con filtros, estados y búsqueda",
      "epicId": "EP-05",
      "epicTitle": "Acceso seguro por roles, bandeja multi-dispositivo y triaje urgente",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#screen-teacher-panel, src/js/modules/teacher-panel.js implementa filtros de estado y select de estado, pero solo sobre sessionStorage local y con 3 casos semilla",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como profesor u orientador, quiero ver en tiempo real todos los avisos enviados desde cualquier dispositivo (alumnado Adaptado, Exploración sin causa, CAA, Chat, Cuestionario y Familias), filtrarlos por estado, urgencia o origen y actualizar su estado de gestión, para no perder ninguna alerta temprana.",
      "acceptanceCriteria": [
        "1. Dado que un estudiante o una familia envía un aviso desde otro dispositivo, cuando abro #screen-teacher-panel, entonces el aviso aparece en la bandeja con código SAFE-XXX, fecha/hora real, lugar/franja, perfil de origen (víctima/testigo/familia/CAA/sin causa) y estado inicial Pendiente.",
        "2. Dado que gestiono la bandeja, cuando filtro por estado (todos, pendiente, seguimiento, resuelto), destinatario, lugar o nivel de urgencia, entonces el listado y el contador se actualizan de forma inmediata y persistente en servidor."
      ]
    },
    {
      "id": "US-PR-03",
      "title": "Alertas urgentes en tiempo real ante peligro inmediato o escalada",
      "epicId": "EP-05",
      "epicTitle": "Acceso seguro por roles, bandeja multi-dispositivo y triaje urgente",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "no hay campo de prioridad ni notificación activa al docente",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como orientador/a o coordinador/a de convivencia, quiero recibir una alerta destacada e inmediata cuando un aviso marque «Peligro inmediato», «Ayuda ya sin causa» o muestre repetición grave, para intervenir el mismo día antes de que ocurra una agresión física.",
      "acceptanceCriteria": [
        "1. Dado que un cuestionario se envía con qq_safety === 'danger' o se pulsa el aviso rápido de bloqueo (US-ED-10), cuando entra en bandeja, entonces aparece fijado en la parte superior con etiqueta visual de Prioridad Crítica accesible (icono + texto + alto contraste) y notificación al equipo de Orientación/Dirección del centro.",
        "2. Dado que se marca como crítico, cuando un docente abre el detalle, entonces ve el recordatorio del protocolo de emergencia y puede registrar la hora de primera actuación."
      ]
    },
    {
      "id": "US-PR-04",
      "title": "Notas internas privadas, asignación de responsable y bitácora de actuaciones",
      "epicId": "EP-05",
      "epicTitle": "Acceso seguro por roles, bandeja multi-dispositivo y triaje urgente",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Should",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "actualmente cada tarjeta solo tiene un <select> de estado",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como tutor/a que colabora con Orientación, quiero reasignar un aviso al equipo adecuado, añadir notas internas con medidas aplicadas y consultar el historial de cambios, para evitar duplicidades y garantizar seguimiento continuo.",
      "acceptanceCriteria": [
        "1. Dado que abro un aviso en #screen-teacher-panel, cuando cambio el responsable asignado o escribo una nota de seguimiento interna, entonces la nota queda guardada con autor, fecha y hora en la bitácora del caso sin ser visible nunca para el alumnado.",
        "2. Dado que el caso cambia de Pendiente a En seguimiento o Resuelto, cuando consulto el historial, entonces queda registro auditable de cada transición de estado y usuario que la realizó."
      ]
    },
    {
      "id": "US-PR-05",
      "title": "Respuesta segura al emisor mediante código SAFE-XXX",
      "epicId": "EP-05",
      "epicTitle": "Acceso seguro por roles, bandeja multi-dispositivo y triaje urgente",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Should",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como orientador/a, quiero enviar un mensaje breve de acuse o pauta segura al código SAFE-XXX (con sugerencia automática de texto adaptado a Lectura Fácil si el origen fue Modo Adaptado/CAA/Sin causa), para tranquilizar al estudiante o familia y recabar el detalle mínimo necesario.",
      "acceptanceCriteria": [
        "1. Dado que un aviso proviene de un estudiante anónimo o de una familia con código SAFE-XXX, cuando redacto una respuesta desde el Panel Docente, entonces el sistema ofrece plantillas empáticas y en Lectura Fácil que el receptor podrá leer usando únicamente su código.",
        "2. Dado que envío la respuesta, cuando el emisor consulta su código, entonces no se expone ninguna nota interna privada de la bitácora docente, solo la comunicación externa aprobada."
      ]
    },
    {
      "id": "US-PR-06",
      "title": "Mapa de Puntos Calientes con filtros temporales y análisis de tendencias",
      "epicId": "EP-06",
      "epicTitle": "Prevención en momentos no estructurados, pautas TEA y cumplimiento normativo",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Should",
      "release": "R2",
      "status": "Parcial",
      "statusDetail": "#teacher-hotspot-bars calcula un conteo plano en texto sobre todo el array inbox",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como coordinador/a de convivencia, quiero visualizar en el Mapa de Puntos Calientes la distribución de incidencias por espacio (patio, pasillos, clase, entrada, comedor, digital) y momento de rutina filtrada por semana, mes o curso, para redistribuir guardias y vigilancia preventiva en momentos no estructurados.",
      "acceptanceCriteria": [
        "1. Dado que entro en la sección de Mapa de Puntos Calientes de #screen-teacher-panel, cuando selecciono un rango temporal (ej. última semana, último mes, trimestre), entonces veo barras proporcionales accesibles (texto, tabla y gráfico con contraste WCAG) con el número y porcentaje real por zona y franja.",
        "2. Dado que una zona supera un umbral configurable de alertas recientes, cuando se renderiza el mapa, entonces se destaca como foco prioritario de vigilancia para el claustro."
      ]
    },
    {
      "id": "US-PR-07",
      "title": "Pautas de intervención contextualizadas (TEA e inclusión)",
      "epicId": "EP-06",
      "epicTitle": "Prevención en momentos no estructurados, pautas TEA y cumplimiento normativo",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Could",
      "release": "R2",
      "status": "Parcial",
      "statusDetail": "#screen-teacher-panel muestra una caja fija de 3 puntos de pauta TEA para todos los casos",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como profesor sin formación específica en TEA o accesibilidad, quiero ver pautas prácticas contextualizadas al perfil de apoyo del aviso (TEA, sordera, CAA, lectura fácil, ciberacoso), para intervenir con sensibilidad y sin exponer ni sobrecargar al alumno.",
      "acceptanceCriteria": [
        "1. Dado que un aviso indica origen en Modo Adaptado, Tablero CAA o necesidad TEA marcada por familia/alumno, cuando consulto el detalle del caso, entonces se muestran pautas concretas de primera acogida adaptadas a ese perfil (ej. uso de pictogramas, ambiente silencioso, intérprete/texto visual).",
        "2. Dado que necesito apoyo rápido en el aula, cuando despliego la guía rápida, entonces puedo consultarla en menos de 30 segundos con pasos accionables («Qué hacer» y «Qué evitar»)."
      ]
    },
    {
      "id": "US-PR-08",
      "title": "Exportación de informe para protocolo oficial de convivencia",
      "epicId": "EP-06",
      "epicTitle": "Prevención en momentos no estructurados, pautas TEA y cumplimiento normativo",
      "actorGroup": "Profesores y Orientación",
      "actorPrefix": "US-PR",
      "priority": "Should",
      "release": "R3",
      "status": "PARA INICIAR",
      "statusDetail": "",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como miembro de Dirección u Orientación, quiero exportar el expediente de un caso o un resumen estadístico del centro en formato imprimible/estructurado cumpliendo minimización de datos, para incorporarlo al protocolo oficial de convivencia e inspección educativa.",
      "acceptanceCriteria": [
        "1. Dado que selecciono un caso con estado En seguimiento o Resuelto, cuando pulso exportar informe oficial, entonces se genera un documento con fecha de entrada, lugar, tipología, cronología de actuaciones y medidas tomadas, omitiendo datos innecesarios y preservando el anonimato de testigos si corresponde.",
        "2. Dado que se realiza una exportación, cuando se descarga el informe, entonces queda registrada la acción en el log de auditoría del centro."
      ]
    },
    {
      "id": "US-FA-01",
      "title": "Registro estructurado de señales desde casa con lugar, franja y destinatario reales",
      "epicId": "EP-07",
      "epicTitle": "Detección temprana desde casa y coordinación casa-escuela",
      "actorGroup": "Padres, madres y tutores legales",
      "actorPrefix": "US-FA",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "#screen-parents, src/js/modules/parents.js recoge 4 señales + nombre/nota, pero envía siempre place = 'patio' y destinatario fijo 'tutor_guidance'",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como padre, madre o tutor legal, quiero marcar las señales de alerta que observo en casa —incluido cuando vuelve mal sin saber explicar por qué—, indicar días/franja o lugar sospechado y elegir a quién enviarlo, para ayudar al colegio a triangular la causa y activar la observación temprana sin dramatizar.",
      "acceptanceCriteria": [
        "1. Dado que estoy en #screen-parents, cuando selecciono una o varias señales (.parent-signal-btn, incorporando «Vuelve mal sin saber explicar por qué» junto a las 4 señales actuales), entonces los botones actualizan aria-pressed=\"true\" y se añaden al aviso.",
        "2. Dado que completo el formulario #form-parents, cuando indico el lugar sospechado (incluyendo opción «No lo sé / Desde casa»), días/franja aproximada y el destinatario (Tutor/a, Orientación, Dirección), entonces el aviso enviado refleja esos valores reales en lugar de forzar 'patio'.",
        "3. Dado que el menor no sabe explicar qué ocurrió pero vuelve alterado ciertos días o tras una actividad concreta, cuando la familia anota esa franja en el aviso, entonces el Panel Docente vincula esa pista temporal para contrastarla con los avisos del alumno (US-PR-09)."
      ]
    },
    {
      "id": "US-FA-02",
      "title": "Modo acompañamiento familiar («Usar asistente con mi hijo/a»)",
      "epicId": "EP-07",
      "epicTitle": "Detección temprana desde casa y coordinación casa-escuela",
      "actorGroup": "Padres, madres y tutores legales",
      "actorPrefix": "US-FA",
      "priority": "Should",
      "release": "R2",
      "status": "Parcial",
      "statusDetail": "existe el botón data-go=\"2-mode\" en #screen-parents, pero salta sin configurar voz/apoyos ni ofrecer guía para la familia",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como madre o padre de un menor con dificultades de comunicación, quiero iniciar el asistente junto a mi hijo/a pasando por la configuración de apoyos y con una breve recomendación de acompañamiento respetuoso, para ayudarle a expresarse sin hablar por él ni presionarlo con preguntas de «¿por qué?».",
      "acceptanceCriteria": [
        "1. Dado que pulso Usar asistente con mi hijo/a en #screen-parents, cuando se inicia el flujo guiado, entonces me permite ajustar rápidamente voz/apoyos (o recuperar los guardados) con un aviso breve («Deja que tu hijo/a elija sensaciones, escenas o dibujos a su ritmo sin exigirle explicar por qué»).",
        "2. Dado que finalizamos juntos el flujo Adaptado, Exploración sin causa o CAA, cuando se envía el mensaje, entonces el panel docente identifica que fue un envío acompañado con contexto claro."
      ]
    },
    {
      "id": "US-FA-03",
      "title": "Confirmación familiar específica con código SAFE-XXX y seguimiento del caso",
      "epicId": "EP-07",
      "epicTitle": "Detección temprana desde casa y coordinación casa-escuela",
      "actorGroup": "Padres, madres y tutores legales",
      "actorPrefix": "US-FA",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "parents.js ignora el código devuelto por addNotice() y redirige a #screen-feedback, redactado para alumnado",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como padre o madre que acaba de enviar un aviso desde casa, quiero ver una confirmación adaptada a familias con el código de seguimiento SAFE-XXX y poder consultar su estado después, para tener tranquilidad de que el colegio lo recibió y está actuando.",
      "acceptanceCriteria": [
        "1. Dado que envío #form-parents, cuando el aviso se guarda correctamente, entonces veo el código SAFE-XXX, el resumen del aviso enviado y la opción de copiarlo o guardarlo en PDF (sin mostrar la interfaz infantil de «4 caras» ni enlaces al Panel Profe).",
        "2. Dado que regreso días después con mi código SAFE-XXX, cuando consulto el estado, entonces visualizo si está Pendiente, En seguimiento o Resuelto y cualquier mensaje público enviado por Tutor/Orientación."
      ]
    },
    {
      "id": "US-FA-04",
      "title": "Declaración de necesidades de apoyo o perfil TEA del menor en el aviso familiar",
      "epicId": "EP-07",
      "epicTitle": "Detección temprana desde casa y coordinación casa-escuela",
      "actorGroup": "Padres, madres y tutores legales",
      "actorPrefix": "US-FA",
      "priority": "Should",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como familia de un estudiante con TEA u otra necesidad específica de apoyo, quiero señalar en el formulario familiar si mi hijo/a necesita enfoque sensorial, comunicación con pictogramas o trato discreto, para que el docente aplique las pautas adecuadas desde el primer contacto.",
      "acceptanceCriteria": [
        "1. Dado que redacto un aviso en #screen-parents, cuando marco de forma opcional apoyos del menor (ej. «TEA / sensibilidad sensorial», «Usa CAA», «No exponer en grupo», «Dificultad para explicar por qué está mal»), entonces el aviso llega al Panel Docente etiquetado con esas etiquetas y activa las pautas correspondientes (US-PR-07, US-PR-09)."
      ]
    },
    {
      "id": "US-FA-05",
      "title": "Solicitud de tutoría discreta o contacto preferente con Orientación",
      "epicId": "EP-07",
      "epicTitle": "Detección temprana desde casa y coordinación casa-escuela",
      "actorGroup": "Padres, madres y tutores legales",
      "actorPrefix": "US-FA",
      "priority": "Could",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como padre o madre preocupado/a, quiero indicar si deseo que el tutor u orientación me llame o cite de forma discreta (y en qué franja horaria), para coordinar medidas en sintonía con el centro sin exponer al menor delante de otros alumnos.",
      "acceptanceCriteria": [
        "1. Dado que envío un aviso desde #screen-parents, cuando marco «Solicitar contacto discreto» e indico preferencia (llamada, mensajería escolar o reunión presencial), entonces la preferencia queda destacada en el aviso recibido por Tutor/Orientación."
      ]
    },
    {
      "id": "US-FA-06",
      "title": "Acceso directo a recursos y teléfonos de ayuda desde el Espacio Familias",
      "epicId": "EP-07",
      "epicTitle": "Detección temprana desde casa y coordinación casa-escuela",
      "actorGroup": "Padres, madres y tutores legales",
      "actorPrefix": "US-FA",
      "priority": "Should",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "el teléfono 900 018 018 y 112 solo aparecen en #urgent-help-alert del cuestionario y en el texto de #screen-feedback, no directamente en #screen-parents",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como familia que consulta la aplicación en un momento de preocupación, quiero ver directamente en #screen-parents y en la confirmación los teléfonos gratuitos de ayuda contra el acoso (900 018 018) y emergencias (112), para saber a quién acudir fuera del horario escolar si la situación es grave.",
      "acceptanceCriteria": [
        "1. Dado que accedo a #screen-parents, cuando consulto la pantalla o su confirmación de envío, entonces dispongo de una tarjeta visible y accesible con el teléfono contra el acoso escolar (900 018 018) y emergencias (112) y enlace rápido si el menor está en peligro inmediato."
      ]
    },
    {
      "id": "US-TR-01",
      "title": "Salida Rápida inmediata (Esc y botón de cabecera)",
      "epicId": "EP-08",
      "epicTitle": "Transversales y Plataforma",
      "actorGroup": "Transversales y Plataforma",
      "actorPrefix": "US-TR",
      "priority": "Must",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "#btn-safe-exit, #safe-exit-screen, src/js/modules/accessibility.js",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como cualquier estudiante o familia en situación vulnerable, quiero ocultar al instante toda la aplicación pulsando Esc o el botón visible Salida rápida, para proteger mi privacidad si alguien se acerca a mirar mi pantalla.",
      "acceptanceCriteria": [
        "1. Dado que estoy en cualquier pantalla o modal de Contigo, cuando pulso Escape o #btn-safe-exit, entonces se detienen de inmediato la síntesis de voz, el reconocimiento de voz y cualquier petición de IA en curso (abortGemini(), abortSpeechRecognition(), stopSpeaking()).",
        "2. Dado que se activa la Salida Rápida, cuando se muestra #safe-exit-screen, entonces el documento subyacente pasa a inert = true, el título de la pestaña cambia a una pantalla neutra de apuntes de matemáticas y el foco queda en el botón de retorno #return-from-safe-exit."
      ]
    },
    {
      "id": "US-TR-02",
      "title": "Backend seguro multi-centro con sincronización offline-first",
      "epicId": "EP-08",
      "epicTitle": "Transversales y Plataforma",
      "actorGroup": "Transversales y Plataforma",
      "actorPrefix": "US-TR",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "actualmente todo reside en sessionStorage sin API ni base de datos",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como equipo del centro educativo, quiero que los avisos enviados desde alumnado y familias se almacenen en un servidor seguro por centro educativo con cola local temporal si falla la red, para garantizar que ninguna alerta se pierda por falta de cobertura en el patio.",
      "acceptanceCriteria": [
        "1. Dado que un usuario envía un aviso con conexión activa, cuando confirma el envío, entonces el servidor valida el payload, asigna código único SAFE-XXX sin colisiones y lo persiste cifrado en la base de datos del centro antes de confirmar.",
        "2. Dado que el dispositivo pierde conexión temporalmente, cuando el usuario envía el aviso, entonces queda en cola local cifrada con código provisional o acuse claro y se sincroniza automáticamente en cuanto vuelve la red, limpiándose de la cola local al confirmarse."
      ]
    },
    {
      "id": "US-TR-03",
      "title": "Privacidad por diseño, minimización de datos y cumplimiento RGPD / LOPIVI",
      "epicId": "EP-08",
      "epicTitle": "Transversales y Plataforma",
      "actorGroup": "Transversales y Plataforma",
      "actorPrefix": "US-TR",
      "priority": "Must",
      "release": "R1",
      "status": "Parcial",
      "statusDetail": "prototipo privado por ser local en sessionStorage, pero sin política de retención, cifrado en tránsito/reposo ni control de acceso en producción",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como delegado/a de protección de datos o dirección del centro, quiero que la plataforma minimice la recogida de datos personales de menores, separe identidad cuando se elige anonimato y aplique políticas de retención y borrado, para cumplir estrictamente el RGPD y la LOPIVI.",
      "acceptanceCriteria": [
        "1. Dado que un aviso se envía en modo anónimo, cuando se registra en servidor, entonces no se almacenan identificadores personales del dispositivo, cookies de rastreo ni analítica de terceros.",
        "2. Dado que un caso pasa a Resuelto y vence el plazo legal/protocolario definido por el centro, cuando se ejecuta la política de retención, entonces los datos identificativos se anonimizan conservando únicamente estadísticas agregadas para el Mapa de Puntos Calientes."
      ]
    },
    {
      "id": "US-TR-04",
      "title": "Soporte multilingüe completo (7 idiomas) y direccionalidad RTL",
      "epicId": "EP-08",
      "epicTitle": "Transversales y Plataforma",
      "actorGroup": "Transversales y Plataforma",
      "actorPrefix": "US-TR",
      "priority": "Should",
      "release": "R1",
      "status": "Implementado",
      "statusDetail": "src/js/services/i18n.js, src/js/services/locales/*.js para es, ca, en, fr, de, pt, ar",
      "assignee": "Prototipo base",
      "isAvailable": false,
      "story": "Como estudiante o familiar recién llegado o de habla no hispana, quiero utilizar toda la interfaz, pictogramas, mensajes del asistente, voz y respuestas en mi idioma (incluyendo árabe RTL), para expresarme con total naturalidad.",
      "acceptanceCriteria": [
        "1. Dado que cambio el selector #lang-select entre es, ca, en, fr, de, pt y ar, cuando se aplica el idioma, entonces todas las pantallas, etiquetas aria-label, placeholders, mensajes dinámicos (inbox, diary, caa, feedback) y el idioma de TTS/STT se actualizan sin recargar.",
        "2. Dado que selecciono árabe (ar), cuando se renderiza la aplicación, entonces document.documentElement.dir cambia a rtl y los layouts mantienen alineación y lectura correctas.",
        "3. Dado que se añaden nuevas pantallas en R1/R2 (exploración sin causa, login docente, consulta SAFE-XXX), cuando se entreguen, entonces deben incorporar sus claves en los 7 archivos de src/js/services/locales/."
      ]
    },
    {
      "id": "US-TR-05",
      "title": "Proxy seguro de IA conversacional y moderación ante crisis",
      "epicId": "EP-08",
      "epicTitle": "Transversales y Plataforma",
      "actorGroup": "Transversales y Plataforma",
      "actorPrefix": "US-TR",
      "priority": "Must",
      "release": "R1",
      "status": "PARA INICIAR",
      "statusDetail": "src/js/services/gemini.js realiza llamadas directas desde el cliente con clave manual",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como responsable técnico del proyecto, quiero centralizar la integración opcional con Gemini en un proxy backend con filtros de seguridad infantil y detección de crisis, para evitar exposición de secretos y respuestas inapropiadas ante menores.",
      "acceptanceCriteria": [
        "1. Dado que el chatbot usa IA generativa en producción, cuando el cliente envía una consulta, entonces el navegador llama al backend propio sin poseer ni almacenar ninguna API key de Google AI Studio.",
        "2. Dado que el modelo o los filtros previos detectan riesgo autolítico o violencia grave inminente, cuando se procesa el mensaje, entonces se prioriza un mensaje seguro de contención con acceso directo al 112 / 900 018 018 y sugerencia de aviso inmediato al adulto/centro."
      ]
    },
    {
      "id": "US-TR-06",
      "title": "Suite automatizada de pruebas de accesibilidad (WCAG), i18n y flujos E2E por actor",
      "epicId": "EP-08",
      "epicTitle": "Transversales y Plataforma",
      "actorGroup": "Transversales y Plataforma",
      "actorPrefix": "US-TR",
      "priority": "Should",
      "release": "R2",
      "status": "PARA INICIAR",
      "statusDetail": "el repositorio cuenta con design/mockups/tools/check_contrast.py para mockups, pero no dispone de tests automatizados sobre la app en src/",
      "assignee": "Sin asignar",
      "isAvailable": true,
      "story": "Como equipo de ingeniería, quiero contar con pruebas automáticas E2E por cada uno de los 4 actores y chequeos continuos de contraste, foco, atributos ARIA y claves de idioma, para desplegar cambios sin introducir regresiones de accesibilidad.",
      "acceptanceCriteria": [
        "1. Dado cualquier cambio en index.html, src/styles/ o src/js/, cuando se ejecuta el pipeline de verificación, entonces se validan sin errores: contraste WCAG AA/AAA en modo normal y alto contraste, uso estricto de HTML semántico nativo y WAI-ARIA (sin <div>/<span> clicables), navegación por teclado completa, ausencia de claves i18n faltantes entre los 7 idiomas y los flujos críticos de los 4 actores (incluida la ruta completa respondiendo «No lo sé»)."
      ]
    }
  ]
};
