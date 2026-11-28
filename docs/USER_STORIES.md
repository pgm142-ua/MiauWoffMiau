# Backlog de Historias de Usuario — Contigo

Este documento transforma el modelado del [Customer Journey](./CUSTOMER_JOURNEY.md) en un **backlog profesional estructurado por actores, épicas, historias de usuario y criterios de aceptación verificables**, alineado con el código actual del repositorio (`index.html`, `src/js/`).

---

## 1. Convenciones del backlog

> **Foco prioritario de producto:** La prioridad funcional nº 1 de **Contigo** es conseguir que los **estudiantes con discapacidad** puedan expresar su malestar y pedir ayuda incluso cuando **no saben identificar la emoción ni explicar por qué están mal**. La épica `EP-09` articula este flujo desde el alumno hasta el equipo docente y las familias.

> **Instrucciones de trabajo para agentes IA y equipo de desarrollo:**
> 1. **Priorizar las historias `Must`:** Al seleccionar qué implementar, **prioriza siempre las historias marcadas con `Prioridad: Must`** (especialmente las de `R1 · MVP Piloto` y la épica `EP-09`) antes de abordar historias `Should` o `Could`.
> 2. **Regla de disponibilidad (`Sin asignar`):** Una historia **solo está ocupada si `**Asignado a:**` tiene un responsable distinto de `Sin asignar`**. Si una historia está en `PARA INICIAR`, `Parcial` (implementada a mitad) o incluso `EN CURSO` pero figura como **`Asignado a: Sin asignar`**, **está libre y debe cogerla alguien**.
> 3. **Marcar como `EN CURSO` y asignársela al tomarla:** En cuanto cojas una historia libre para trabajar en ella, actualiza inmediatamente su `**Estado actual:**` a **`EN CURSO`** y rellena `**Asignado a:**` con tu nombre o identificador (persona o agente IA) para coordinar al equipo y evitar duplicar trabajo.
> 4. **Marcar como `FINALIZADO` al terminarla:** Cuando la implementación cumpla todos sus criterios de aceptación y la *Definition of Done* (Sección 5), actualiza su `**Estado actual:**` a **`FINALIZADO`**.

- **Identificadores por actor:**
  - `US-ED-xx` — Estudiantes con discapacidad
  - `US-ES-xx` — Estudiantes sin discapacidad (víctimas y testigos)
  - `US-PR-xx` — Profesores, tutores y equipo de orientación
  - `US-FA-xx` — Padres, madres y tutores legales
  - `US-TR-xx` — Transversales de seguridad, accesibilidad, plataforma y calidad
- **Prioridad (MoSCoW):** `Must` (imprescindible para piloto real — **prioridad obligatoria**), `Should` (alto valor operativo), `Could` (mejora incremental).
- **Releases objetivo:**
  - `R1 · MVP Piloto`: Seguridad, persistencia real, descubrimiento guiado sin *«¿por qué?»*, acceso por roles y flujos críticos completos sin datos hardcodeados.
  - `R2 · Seguimiento y Operación`: Canal bidireccional `SAFE-XXX`, diario pictográfico longitudinal, trazabilidad docente, alertas urgentes y coordinación casa-escuela.
  - `R3 · Escala y Prevención`: Analítica avanzada de puntos calientes, NaviLens/QR, exportación oficial y calidad continua.
- **Estado actual frente al código del repositorio:**
  - `Implementado`: Funcionalidad disponible en el prototipo base con cobertura acorde a su flujo.
  - `Parcial`: Existe en UI/módulo, pero tiene limitaciones estructurales (`sessionStorage`, campos fijos, falta de confirmación o de seguridad backend).
  - `PARA INICIAR`: No existe en el repositorio, está sin asignar y lista para empezar su diseño/desarrollo.
  - `EN CURSO`: Historia tomada actualmente por una persona o agente IA para su implementación.
  - `FINALIZADO`: Historia completada y verificada frente a sus criterios de aceptación y la *Definition of Done*.

---

## 2. Mapa de Épicas

| ID Épica | Actor / Ámbito | Rango de Historias | Objetivo de la Épica | Release principal |
| --- | --- | --- | --- | --- |
| **EP-09** | Estudiantes con discapacidad + Docentes | `US-ED-10` a `US-ED-14`, `US-PR-09` | **Descubrimiento guiado sin «¿Por qué?»**: comunicar malestar sin causa identificada mediante sensaciones, rutina, tarjetas `Sí/No/No lo sé`, relato diario asistido por IA (Google Gemini), patrones e intervención sin interrogatorio. | `R1` / `R2` |
| **EP-01** | Estudiantes con discapacidad | `US-ED-01` a `US-ED-05` | Garantizar onboarding accesible, regulación sensorial y comunicación multimodal (Adaptado, CAA, Calma). | `R1` (mejoras) / `R2` |
| **EP-02** | Estudiantes con discapacidad | `US-ED-06` a `US-ED-09` | Asegurar accesibilidad técnica total (teclado, voz prestada, acceso NaviLens/QR) y seguimiento en lectura fácil. | `R2` / `R3` |
| **EP-03** | Estudiantes sin discapacidad | `US-ES-01` a `US-ES-04` | Ofrecer canales ágiles y anónimos (Chat seguro, Buzón anónimo, Cuestionario con prioridad urgente). | `R1` |
| **EP-04** | Estudiantes sin discapacidad | `US-ES-05` a `US-ES-08` | Fortalecer evidencias privadas (Diario), protección al testigo, cierre emocional y seguimiento bidireccional `SAFE-XXX`. | `R1` / `R2` |
| **EP-05** | Profesores y Orientación | `US-PR-01` a `US-PR-05` | Proteger y profesionalizar el Panel Docente con login por rol, bandeja sincronizada, alertas urgentes y respuesta segura. | `R1` / `R2` |
| **EP-06** | Profesores y Orientación | `US-PR-06` a `US-PR-08` | Convertir los avisos en prevención (Mapa de Puntos Calientes), pautas TEA y documentación oficial de convivencia. | `R2` / `R3` |
| **EP-07** | Padres, madres y tutores | `US-FA-01` a `US-FA-06` | Detección temprana desde casa, modo acompañamiento, acuse `SAFE-XXX` y coordinación discreta con el centro. | `R1` / `R2` |
| **EP-08** | Transversales y Plataforma | `US-TR-01` a `US-TR-06` | Privacidad RGPD/LOPIVI, backend offline-first, proxy IA moderado, Salida Rápida, i18n/RTL y suite automatizada a11y/E2E. | `R1` / `R2` / `R3` |

---

## 3. Historias de Usuario por Actor y Épica

### 3.1 Estudiantes con discapacidad (`EP-09`, `EP-01` y `EP-02`)

#### EP-09 · Descubrimiento guiado sin «¿Por qué?» (Malestar sin causa identificada)

##### `US-ED-10` · Pedir ayuda inmediata sin tener que explicar el motivo («Estoy mal y no sé por qué»)
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (actualmente `#screen-3-situation-type` obliga a elegir `Víctima`, `Testigo` o `Cuestionario` y `#screen-adapted-2` pregunta «¿Por qué pasa?») | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante con discapacidad que siente malestar o bloqueo sin saber explicar el motivo**, quiero disponer de un camino directo llamado «Estoy mal y no sé por qué» o «Solo quiero que venga un adulto», para pedir ayuda en 1 o 2 toques sin sentirme examinado ni forzado a etiquetarme como víctima.
- **Criterios de aceptación:**
  1. **Dado** que estoy en `#screen-home` o paso por `#screen-3-situation-type`, **cuando** veo las opciones principales, **entonces** dispongo de la tarjeta accesible **«Estoy mal y no sé por qué»** sin exigir seleccionar `victima` ni `testigo`.
  2. **Dado** que entro en esa ruta en pleno bloqueo, **cuando** pulso la acción rápida **«Solo quiero que venga un adulto / Ayuda ya»**, **entonces** se genera inmediatamente un aviso prioritario con mi contexto actual (hora, idioma, apoyos activos) y código `SAFE-XXX` sin obligarme a responder preguntas previas.
  3. **Dado** que envié ese aviso rápido, **cuando** termina el envío, **entonces** la pantalla me ofrece pasar con un toque al **Rincón de Calma** (`#screen-calm`) o usar **Leer en voz alta** (`#btn-speak-for-me`) si tengo a un profesor delante.

##### `US-ED-11` · Comunicar malestar mediante señales corporales y sensoriales concretas (Mapa de Sensaciones)
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (evolución de `#screen-adapted-1`, que hoy solo muestra 4 emociones abstractas: `calm`, `sad`, `scared`, `angry`) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante con TEA, alexitimia o discapacidad intelectual que no identifica emociones abstractas**, quiero señalar qué nota mi cuerpo o qué me molesta del entorno mediante pictogramas concretos (tripa, cabeza, ruido, querer esconderme, corazón rápido, no lo sé), para expresar cómo me encuentro aunque no sepa ponerle nombre sentimental.
- **Criterios de aceptación:**
  1. **Dado** que accedo al paso de sensaciones (`#screen-adapted-1` ampliado o ruta «No sé por qué»), **cuando** exploro las opciones, **entonces** encuentro tarjetas visuales y con audio TTS de **señales corporales y sensoriales** (*me duele la tripa o la cabeza*, *demasiado ruido o luz*, *me quiero esconder o irme*, *me late fuerte el corazón*, *no me salen las palabras*, *no lo sé*) junto a las 4 caras básicas.
  2. **Dado** que noto varias cosas a la vez o no estoy seguro, **cuando** selecciono una o más señales (o «No lo sé»), **entonces** puedo avanzar al siguiente paso sin mensajes de error ni obligatoriedad de elegir una emoción abstracta.
  3. **Dado** que tengo activada **Lectura Fácil** o **TEA / Sin animaciones**, **cuando** toco cualquier tarjeta, **entonces** cada opción muestra texto ultra corto, alto contraste y retroalimentación sin animaciones bruscas.

##### `US-ED-12` · Reconstrucción guiada de hechos concretos (Rutina + Tarjetas `Sí / No / No lo sé`) en lugar de «¿Por qué pasa?»
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (evolución de `#screen-adapted-2` y `src/js/modules/flow.js`, donde hoy se pregunta «¿Por qué pasa?» con 6 categorías abstractas) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante con discapacidad que no sabe deducir por qué está mal**, quiero que la app me haga preguntas muy cortas sobre cuándo empezó en mi rutina del día y escenas concretas con botones `Sí`, `No` y `No lo sé`, para dar pistas reales al profesor sin bloquearme si no sé contestar.
- **Criterios de aceptación:**
  1. **Dado** que supero el paso de sensaciones y quiero seguir dando pistas, **cuando** entro en la exploración guiada, **entonces** primero elijo en una **rutina visual del día** cuándo empezó (*antes de llegar*, *entrada*, *clase*, *recreo/patio*, *pasillo/baño*, *comedor*, *salida*, *no lo sé*) y después recorro micro-tarjetas de una sola pregunta por pantalla con pictograma ARASAAC y TTS.
  2. **Dado** que veo escenas concretas (burlas/risas, quedarse solo/excluido, empujones o cosas rotas, demasiado ruido/gente, cambio inesperado de rutina, mensajes en el móvil), **cuando** respondo `Sí`, `No` o `No lo sé` (o salto al envío en cualquier momento), **entonces** todas las respuestas se adjuntan al aviso de forma estructurada.
  3. **Dado** que respondo **«No lo sé»** a todas las escenas concretas, **cuando** finalizo, **entonces** el aviso se envía exactamente igual al centro como caso **«Sin causa definida»** con código `SAFE-XXX` y sin bloquear ni reprender al estudiante.

##### `US-ED-13` · Registro pictográfico ultrarrápido de malestar para detectar patrones invisibles
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` (versión adaptada y simplificada de `#screen-diary` y `src/js/modules/diary.js`) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante con discapacidad que pasa malos ratos repetidos sin identificar la causa**, quiero registrar en 2 toques (*cómo noto mi cuerpo + momento de la rutina/lugar*) cada vez que me siento mal, para que el sistema y mis profesores descubran qué situación recurrente me está haciendo daño.
- **Criterios de aceptación:**
  1. **Dado** que abro el registro rápido pictográfico (solo o acompañado por familia/apoyo), **cuando** toco un pictograma de sensación y un momento de la rutina/lugar, **entonces** la entrada se guarda con fecha y hora reales en menos de 10 segundos sin exigir texto escrito.
  2. **Dado** que se acumulan 2 o más registros de malestar sin causa definida en la misma franja o lugar durante una ventana de 7 días, **cuando** se evalúa el patrón (con permiso de envío o desde el historial compartido), **entonces** se genera una alerta de **patrón recurrente** para el equipo docente.

##### `US-ED-14` · Relato guiado del día con identificación de posibles causas mediante API de Google (Gemini)
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`#screen-daily-story`, `src/js/modules/daily-story.js`, `src/js/services/gemini.js`, `src/js/services/speech.js`, `src/js/core/router.js`, `src/styles/components.css`, `src/styles/accessibility.css` y diccionarios `i18n`) | **Asignado a:** pgm142-ua
- **Historia:** Como **estudiante con discapacidad cognitiva que puede contar lo que le ha pasado durante el día pero no identificar por sí solo si sufre acoso o cuál es la causa**, quiero explicar mi día por voz o texto sencillo para que la aplicación, mediante la API de Google (Gemini), identifique posibles causas, emociones y lugares de riesgo y me ayude a confirmarlos y avisar a un adulto.
- **Criterios de aceptación:**
  1. **Dado** que accedo al flujo adaptado para alumnado con discapacidad cognitiva, **cuando** entro en la opción de contar mi día, **entonces** puedo relatar lo ocurrido mediante dictado por voz (Web Speech API) o texto libre sencillo con apoyo de Lectura Fácil y lectura en voz alta (TTS).
  2. **Dado** que envío mi relato diario, **cuando** se procesa con la API de Google Gemini (con *fallback* local por reglas si no hay conexión o clave configurada), **entonces** el sistema devuelve un análisis estructurado con posibles causas (burlas, exclusión, agresión, sobrecarga sensorial u otras), emoción probable, lugar/momento y nivel de alerta.
  3. **Dado** que el sistema identifica posibles causas a partir de mi relato, **cuando** se muestran en pantalla, **entonces** las presenta en **Lectura Fácil** con tarjetas visuales de confirmación (`Sí, es eso` / `No` / `No lo sé`) y permite enviar el aviso estructurado al Panel Docente con código `SAFE-XXX` sin interrogar ni bloquear al estudiante.

##### `US-PR-09` · Lectura docente de avisos «Sin causa definida» y guía de intervención sin interrogatorio
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (evolución de `#screen-teacher-panel` y `src/js/modules/teacher-panel.js`) | **Asignado a:** Sin asignar
- **Historia:** Como **profesor, tutor u orientador que recibe un aviso donde el estudiante no supo explicar el porqué**, quiero ver de forma estructurada sus pistas corporales, momento de la rutina, respuestas `Sí/No/No sé` e historial reciente, junto con una pauta clara de acogida sin interrogatorio, para ayudarlo a regularse y observar la situación real sin aumentar su bloqueo.
- **Criterios de aceptación:**
  1. **Dado** que entra en `#screen-teacher-panel` un aviso procedente de `US-ED-10`–`US-ED-12`, **cuando** abro su tarjeta, **entonces** distingo claramente la etiqueta **«Malestar sin causa identificada»**, las señales corporales marcadas, el tramo de rutina donde empezó y las respuestas `Sí`/`No`/`No lo sé`.
  2. **Dado** que ese alumno o franja tiene avisos previos o señales enviadas desde casa (`US-FA-01`), **cuando** consulto el caso, **entonces** el panel resalta la coincidencia de día/franja/lugar como hipótesis de observación.
  3. **Dado** que debo intervenir presencialmente con el estudiante, **cuando** leo la pauta contextualizada del aviso, **entonces** muestra acciones concretas de acogida segura (*no insistir con «¿por qué lloras/estás así?»*, ofrecer espacio tranquilo, validar con pictogramas o tarjetas `Sí/No`, y vigilar discretamente la franja/zona señalada).

---

#### EP-01 · Onboarding accesible, regulación y comunicación adaptada

##### `US-ED-01` · Configuración guiada de voz y apoyos en Pasos 0 y 0B
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`#screen-0-voice`, `#screen-0-disability`, `src/js/modules/flow.js`, `src/js/modules/accessibility.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante con discapacidad visual, auditiva, motora, cognitiva o TEA**, quiero elegir al entrar si necesito voz y qué apoyos prefiero mediante tarjetas claras o atajos numéricos, para usar la aplicación sin barreras desde el primer segundo.
- **Criterios de aceptación:**
  1. **Dado** que accedo a `#screen-0-voice`, **cuando** elijo «Sí, con voz» (`1`), respondo escribiendo/dictando «sí» o pulso escuchar bienvenida (`#btn-play-welcome-voice`), **entonces** se activa la guía TTS (`#gear-voice-guide`) respetando el modo sordo si se activa después.
  2. **Dado** que estoy en `#screen-0-disability`, **cuando** activo una o varias tarjetas (`ciega`, `sorda`, `muda`, `intelectual`, `tea`, `motora`) mediante clic, teclas `1`–`6` o formulario rápido, **entonces** se aplican en el DOM las clases `.contrast`/tamaño de fuente (`ciega` sube al menos a nivel 1), silenciado visual (`sorda`), lectura fácil (`easy`), sin animaciones (`still`) y botones grandes (`motor`).
  3. **Dado** que activo el modo `sorda`, **cuando** el sistema emite cualquier confirmación o toast, **entonces** se muestra en la franja visual superior (`#visual-alert-strip`) sin reproducir audio.

##### `US-ED-02` · Persistencia de perfil de accesibilidad y enrutado inteligente tras Paso 0B
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `FINALIZADO` (Verificado con 21 pruebas de npm y en Edge: recarga y reapertura, rutas por rol, Adaptado, relato guiado y CAA, ajustes y restablecimiento sin perder el borrador, teclado y Esc, siete idiomas a 320 px con lectura fácil y letra de 22 px, perfil dañado y almacenamiento bloqueado) | **Asignado a:** Codex
- **Historia:** Como **estudiante con discapacidad que entra de forma recurrente**, quiero que mis preferencias de accesibilidad se recuerden en mi dispositivo y que el sistema me recomiende directamente el Modo Adaptado, exploración guiada o Tablero CAA si seleccioné apoyo cognitivo, TEA o sin habla, para no repetir configuraciones ni perderme entre pasos intermedios.
- **Criterios de aceptación:**
  1. **Dado** que configuré mis apoyos en Paso 0B o en `#gear-modal`, **cuando** recargo o vuelvo a abrir la aplicación (salvo modo privado/borrado explícito), **entonces** se restauran automáticamente tamaño de fuente, velocidad de voz y apoyos activos.
  2. **Dado** que seleccioné `muda`, `intelectual` o `tea` en Paso 0B y elijo rol `alumno`, **cuando** llego a la elección de modo (`#screen-2-mode`), **entonces** la opción **Adaptado / No sé por qué** (o acceso directo a **Tablero CAA** si marqué `muda`) queda destacada como recomendada y accesible en un clic.
  3. **Dado** que cambio de opinión en cualquier momento, **cuando** abro `#gear-modal`, **entonces** puedo restablecer o ajustar cualquier parámetro sin reiniciar el flujo en curso.

##### `US-ED-03` · Comunicación visual en 3 pasos (Modo Adaptado)
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`#screen-adapted-1` a `#screen-adapted-3`, `src/js/modules/flow.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante con discapacidad cognitiva o TEA que sí identifica lo ocurrido**, quiero contar qué me pasa eligiendo cómo me siento, la causa o escena y el lugar/envío en pantallas simples, para pedir ayuda sin enfrentarme a un cuestionario largo.
- **Criterios de aceptación:**
  1. **Dado** que entro en el flujo Adaptado como víctima o testigo, **cuando** selecciono una opción en `#screen-adapted-1` y `#screen-adapted-2`, **entonces** `#screen-adapted-3` muestra el resumen visual combinado en `#adapted-summary-box`.
  2. **Dado** que estoy en `#screen-adapted-3`, **cuando** selecciono el lugar (`patio`, `hallways`, `class`, `entrance`), uso una frase rápida opcional o dicto/escribo una nota y pulso **Enviar al profesor** (`#btn-send-to-teacher`), **entonces** se registra el aviso y se muestra confirmación con código `SAFE-XXX`.
  3. **Dado** que necesito parar o cambiar algo, **cuando** pulso **Volver** o el atajo de teclado asignado, **entonces** regreso al paso anterior conservando mis selecciones previas.

##### `US-ED-04` · Tablero CAA («Voz Prestada») con pictogramas ARASAAC y selector de lugar
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Parcial` (`#screen-caa` y `src/js/modules/caa.js` funcionan con pictogramas y voz, pero `#btn-caa-send-teacher` envía siempre `place = 'patio'`) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante sin habla oral o con bloqueo comunicativo**, quiero construir frases tocando pictogramas por categorías, escucharlas en voz alta y elegir exactamente dónde ocurrió antes de enviarlas al profesorado, para comunicarme con autonomía y precisión.
- **Criterios de aceptación:**
  1. **Dado** que estoy en `#screen-caa`, **cuando** filtro por categorías (`quien`, `que`, `sentir`, `donde`, `pedir`) y toco pictogramas ARASAAC, **entonces** cada pictograma se añade como chip eliminable en `#caa-sentence-chips` y se pronuncia por voz salvo modo sordo.
  2. **Dado** que ya formé una frase y pulso **Enviar al Profesor** (`#btn-caa-send-teacher`), **cuando** no incluí un pictograma de lugar o quiero precisarlo, **entonces** el sistema toma el lugar seleccionado (o el pictograma `en clase` / `en los pasillos` / `en el patio` de la frase) en lugar de forzar `'patio'`.
  3. **Dado** que prefiero ampliar el mensaje por escrito, **cuando** pulso **Llevar al Chat** (`#btn-caa-use-chat`), **entonces** la frase construida se copia en `#chat-input` y navega a `#screen-no-adapted`.

##### `US-ED-05` · Pausa sensorial guiada en el Rincón de Calma
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`#screen-calm`, `src/js/modules/calm.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante con TEA o sobrecarga sensorial**, quiero acceder en un toque a un espacio de respiración visual pausado y predecible con guía opcional por voz, para regularme antes o después de contar lo que me ocurre.
- **Criterios de aceptación:**
  1. **Dado** que accedo a `#screen-calm` desde navegación, portada o tras enviar un aviso (`#btn-adapted-to-calm`), **cuando** se abre la pantalla, **entonces** el círculo `#breathing-circle` alterna fases lentas («Coge aire despacio…» / «Suelta el aire…») cada 4 segundos junto al indicador de progreso `.calm-prog`.
  2. **Dado** que activo el modo **TEA / Sin animaciones** (`.still`), **cuando** estoy en `#screen-calm`, **entonces** no hay movimientos bruscos ni parpadeos que provoquen sobrecarga, pudiendo pausar/reanudar con `#btn-calm-pause` y activar voz con `#btn-calm-sound`.
  3. **Dado** que ya me siento regulado/a, **cuando** pulso **Ya estoy mejor**, **entonces** vuelvo exactamente a la pantalla desde la que entré sin perder mi progreso.

#### EP-02 · Accesibilidad técnica avanzada, acceso sin fricción y seguimiento simple

##### `US-ED-06` · Navegación completa por teclado, foco visible y compatibilidad con lector de pantalla
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`src/styles/base.css`, `src/js/core/router.js`, `src/js/modules/accessibility.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante ciego o con discapacidad motora**, quiero recorrer todas las opciones con teclado (`Tab`, atajos `1`–`6`), contar con foco de alto contraste y escuchar cada cambio de pantalla o modal correctamente encapsulado, para operar la app de forma independiente con lector de pantalla o pulsadores.
- **Criterios de aceptación:**
  1. **Dado** que cambio de pantalla mediante `go()`, **cuando** se renderiza la nueva vista, **entonces** el foco se mueve automáticamente al `<h1>` principal y, si la guía de voz está activa, se lee título y subtítulo.
  2. **Dado** que uso atajos numéricos `1`–`6`, **cuando** no estoy escribiendo dentro de un `INPUT`, `SELECT` o `TEXTAREA`, **entonces** se activa el botón visible correspondiente al `data-key`.
  3. **Dado** que abro `#gear-modal`, `#api-modal` o `#safe-exit-screen`, **cuando** el modal está activo, **entonces** `<header>`, `<main>`, `<footer>` y `.mobile-bottom-nav` quedan `inert = true` y al cerrar regresa el foco al elemento disparador.
  4. **Dado** cualquier componente nuevo o refactorizado, **cuando** se implementa en HTML, **entonces** utiliza elementos semánticos nativos (`<button>`, `<a href>`, `<nav>`, `<main>`, `<fieldset>`/`<legend>`, `<label for>`, `<details>`) aplicando WAI-ARIA únicamente como refuerzo de estado o relación.

##### `US-ED-07` · Lectura en voz alta presencial al profesor («Leer en voz alta por mí»)
- **Prioridad:** `Should` | **Release:** `R1` | **Estado actual:** `Implementado` (`#btn-speak-for-me` en `#screen-adapted-3`, `src/js/modules/flow.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante que está físicamente delante de un docente pero sufre bloqueo del habla o mutismo situacional**, quiero pulsar un botón tras preparar mi mensaje para que el dispositivo lo lea en voz alta al profesor, para pedir ayuda cara a cara sin tener que hablar.
- **Criterios de aceptación:**
  1. **Dado** que envié mi aviso en `#screen-adapted-3`, **cuando** pulso `#btn-speak-for-me`, **entonces** el navegador sintetiza en voz alta `uiState.lastReport` con el idioma y velocidad configurados.
  2. **Dado** que cambié de idioma antes de pulsar el botón o uso una nota en CAA, **cuando** se reproduce la lectura, **entonces** la síntesis utiliza el idioma activo en `i18n.js` y permite detenerse con el botón global `#btn-read-page`.

##### `US-ED-08` · Acceso inmediato mediante código NaviLens o QR accesible del centro
- **Prioridad:** `Should` | **Release:** `R3` | **Estado actual:** `PARA INICIAR` (el proyecto responde al reto NaviLens, pero actualmente no procesa parámetros de URL/ubicación al arrancar) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante con baja visión o discapacidad cognitiva en el patio o los pasillos**, quiero escanear una etiqueta NaviLens o QR del centro para abrir **Contigo** con mi aula/centro y zona preconfigurados, para pedir ayuda en segundos sin buscar enlaces ni teclear direcciones.
- **Criterios de aceptación:**
  1. **Dado** que accedo mediante una URL parametrizada desde NaviLens/QR (p. ej. centro y zona `place=patio`), **cuando** carga la aplicación, **entonces** se preselecciona el contexto del centro y el lugar sugerido en los formularios de aviso.
  2. **Dado** que el enlace indica un perfil sugerido (p. ej. acceso de baja visión con voz), **cuando** inicia la app, **entonces** ofrece confirmación en un solo toque de la configuración sugerida manteniendo Salida Rápida disponible.

##### `US-ED-09` · Seguimiento del código `SAFE-XXX` en Lectura Fácil y sin acceso a panel docente
- **Prioridad:** `Must` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` (`#screen-adapted-3` expone `#btn-adapted-to-teacher-panel` y no existe pantalla de consulta de estado del código) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante con discapacidad que envió un aviso**, quiero consultar en Lectura Fácil y con apoyo visual el estado de mi código `SAFE-XXX` sin ver datos de otros alumnos, para saber si el profesor ya lo leyó y qué ayuda va a darme.
- **Criterios de aceptación:**
  1. **Dado** que estoy en flujo de estudiante (`#screen-adapted-3` o `#screen-feedback`), **cuando** termino de enviar un aviso, **entonces** no se muestra ningún botón que abra el Panel Docente (`#screen-teacher-panel`) de todo el centro.
  2. **Dado** que introduzco o conservo mi código `SAFE-XXX` en la vista de seguimiento accesible, **cuando** consulto su estado, **entonces** veo un estado simple con icono y frase en Lectura Fácil («El profe lo ha recibido» / «Ya estamos ayudándote» / «Solucionado») y puedo escucharlo con TTS.

---

### 3.2 Estudiantes sin discapacidad (`EP-03` y `EP-04`)

#### EP-03 · Canales ágiles, anonimato real y detección de urgencias

##### `US-ES-01` · Entrada rápida para víctima o testigo sin barreras previas
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`#screen-home` botón **Contar ahora**, `#screen-2-mode`, `#screen-3-situation-type`, `src/js/modules/flow.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante víctima o testigo**, quiero acceder directamente desde la portada a elegir cómo contar lo que pasa e indicar si me ocurre a mí o lo he visto, para actuar rápido sin recorrer ajustes que no necesito.
- **Criterios de aceptación:**
  1. **Dado** que pulso **Contar ahora** en `#screen-home`, **cuando** navego a `#screen-2-mode` y luego a `#screen-3-situation-type`, **entonces** puedo entrar al Chat (`no-adapted`) o al Cuestionario (`questionnaire`) en 2 clics.
  2. **Dado** que selecciono `victima` o `testigo`, **cuando** entro al chat o al cuestionario, **entonces** el mensaje de bienvenida (`chat_welcome_victim` / `chat_welcome_witness`) y el campo `#q-branch` se adaptan automáticamente a mi rol.

##### `US-ES-02` · Chatbot empático con texto, dictado por voz e IA segura gestionada en servidor
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `FINALIZADO` (`api/chat.js`, `api/_lib/chat-engine.js`, `#screen-no-adapted`, `src/js/modules/chat.js`, `src/js/services/gemini.js`, diccionarios `i18n` en 7 idiomas y `tests/us-es-02-chat.test.mjs`) | **Asignado a:** pgm142-ua
- **Historia:** Como **estudiante que necesita desahogarse y orientarse**, quiero conversar por texto o dictado de voz con un asistente empático disponible 24/7 sin tener que configurar claves técnicas ni exponer mis datos, para aclarar qué me pasa y qué pasos seguir.
- **Criterios de aceptación:**
  1. **Dado** que abro `#screen-no-adapted`, **cuando** escribo, uso uno de los 4 prompts rápidos o dicto con `#btn-chat-mic`, **entonces** recibo una respuesta breve, empática y con soporte de voz opcional (`#btn-toggle-auto-tts`).
  2. **Dado** que se habilita la IA generativa en entorno productivo, **cuando** envío un mensaje, **entonces** la llamada se cursa a través de un endpoint seguro del backend del proyecto (sin pedir API key en `#api-modal` al alumnado) y con fallback local automático si no hay conexión.
  3. **Dado** que el mensaje describe un lugar concreto (ej. patio o pasillos), **cuando** el motor local o servidor lo detecta, **entonces** preselecciona automáticamente el lugar sugerido en el panel de envío anónimo (`#anon-place`).

##### `US-ES-03` · Buzón de envío 100 % anónimo persistido hacia el centro educativo
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Parcial` (`#anon-panel` en `#screen-no-adapted` persiste solo en `sessionStorage` local) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante que teme represalias**, quiero enviar lo hablado en el chat o un resumen personalizado de forma 100 % anónima al destinatario que elija (Orientación, Tutor o Dirección), para alertar al centro sin revelar mi identidad.
- **Criterios de aceptación:**
  1. **Dado** que abro `#anon-panel`, **cuando** selecciono destinatario (`guidance`, `tutor`, `director`), lugar (`#anon-place`) y pulso `#btn-submit-anon`, **entonces** el aviso se envía al servidor del centro sin adjuntar nombre, IP ni metadatos identificativos de sesión.
  2. **Dado** que no rellené `#anon-extra` pero sí escribí mensajes en el chat, **cuando** envío el aviso anónimo, **entonces** se incluyen automáticamente mis líneas del chat y se muestra el código de seguimiento `SAFE-XXX` en `#anon-confirm-msg`.

##### `US-ES-04` · Cuestionario estructurado con detección de peligro inmediato y prioridad crítica
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Parcial` (`#screen-questionnaire`, `src/js/modules/questionnaire.js` muestra `#urgent-help-alert`, pero descarta el código `SAFE-XXX` y no marca prioridad en `inbox`) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante en situación de riesgo o duda**, quiero completar un cuestionario guiado que detecte al instante si estoy en peligro inmediato, me muestre teléfonos de ayuda reales y genere un aviso prioritario con código de seguimiento, para recibir protección rápida acorde a la gravedad.
- **Criterios de aceptación:**
  1. **Dado** que marco `Peligro inmediato` (`qq_safety === 'danger'`) en la pregunta 6, **cuando** cambia la selección, **entonces** aparece inmediatamente `#urgent-help-alert` con acceso visible a `112` y `900 018 018`.
  2. **Dado** que envío `#form-questionnaire` eligiendo envío anónimo o identificado (`qq_delivery`), **cuando** el sistema registra el aviso, **entonces** guarda la prioridad (`critical` si es `danger`, `high` si es `fear`, `normal` si es `safe`) para que el panel docente la destaque arriba.
  3. **Dado** que se completa el envío del cuestionario, **cuando** transiciono a confirmación/feedback, **entonces** se me muestra claramente el código `SAFE-XXX` generado y puedo copiarlo o descargarlo.

#### EP-04 · Evidencias, apoyo al testigo y cierre de ciclo

##### `US-ES-05` · Diario de evidencias privado con detector de escalada y envío voluntario
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `Parcial` (`#screen-diary`, `src/js/modules/diary.js` guarda en `sessionStorage` y analiza evolución local, pero no permite exportar ni adjuntar entradas a un aviso) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante que sufre episodios repetidos**, quiero anotar fecha, lugar, gravedad y descripción en mi diario privado, ver si la situación está escalando y decidir voluntariamente qué entradas compartir en un aviso o PDF, para contar con pruebas objetivas sin empezar de cero.
- **Criterios de aceptación:**
  1. **Dado** que registro entradas en `#screen-diary` con fecha, lugar, nivel (`1`–`3`) y texto/dictado, **cuando** pulso **Analizar evolución** (`#btn-analyze-diary`), **entonces** veo un resumen del total de episodios, el último lugar y si la gravedad ha escalado o bajado respecto al anterior.
  2. **Dado** que decido dar el paso de pedir ayuda, **cuando** selecciono una o varias entradas de mi diario, **entonces** puedo adjuntarlas a un envío en `#screen-no-adapted` / `#screen-questionnaire` o exportarlas en PDF limpio sin revelar nada automáticamente sin mi permiso.

##### `US-ES-06` · Cierre emocional y plan de apoyo exportable sin enlaces docentes
- **Prioridad:** `Should` | **Release:** `R1` | **Estado actual:** `Parcial` (`#screen-feedback`, `src/js/modules/feedback.js` genera plan y copia/PDF, pero expone el botón `Ver aviso en Panel Profe`) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante que acaba de enviar un aviso**, quiero expresar cómo me siento tras contarlo, obtener un plan discreto de actuación y copiar o imprimir mi resumen, para irme con sensación de control y respaldo.
- **Criterios de aceptación:**
  1. **Dado** que llego a `#screen-feedback` tras enviar un aviso, **cuando** selecciono una de las 4 caras (`feliz`, `triste`, `enfadada`, `sorprendida`), **entonces** se despliega `#full-explanation-panel` con mi resumen, el plan discreto del centro y teléfonos/recursos de ayuda.
  2. **Dado** que quiero conservar el resumen, **cuando** pulso **Copiar resumen** (`#btn-copy-report`) o **Guardar PDF** (`#btn-print-report`), **entonces** obtengo el texto completo (incluyendo mi código `SAFE-XXX`) sin que aparezca el acceso al panel interno del profesorado.

##### `US-ES-07` · Consulta anónima de estado y respuesta mediante código `SAFE-XXX`
- **Prioridad:** `Must` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` (no existe vista ni endpoint de consulta de estado por código) | **Asignado a:** Sin asignar
- **Historia:** Como **estudiante que envió un aviso anónimo**, quiero consultar el estado de mi código `SAFE-XXX` y leer mensajes o preguntas de seguimiento del orientador, para colaborar con la solución sin perder mi anonimato.
- **Criterios de aceptación:**
  1. **Dado** que tengo un código `SAFE-XXX`, **cuando** lo introduzco en la pantalla de consulta de seguimiento (sin usuario ni contraseña), **entonces** veo el estado actual (`Pendiente`, `En seguimiento`, `Resuelto`) y los mensajes enviados por el equipo docente para ese código.
  2. **Dado** que Orientación me formula una pregunta aclaratoria en ese hilo, **cuando** respondo desde la vista del código, **entonces** mi respuesta llega al caso correspondiente manteniendo el mismo nivel de anonimato que el envío original.

##### `US-ES-08` · Flujo específico de protección y tranquilidad para testigos (*bystanders*)
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `Parcial` (`state.branch === 'testigo'` adapta bienvenida en chat y etiqueta en resumen, pero las preguntas de `#screen-questionnaire` siguen redactadas en segunda persona de víctima, p. ej. «¿te dejan solo/a o se ríen de ti?») | **Asignado a:** Sin asignar
- **Historia:** Como **testigo de acoso hacia otro compañero**, quiero que las preguntas del cuestionario, la confirmación y el plan de apoyo estén adaptados a mi rol de observador y me aseguren confidencialidad, para atreverme a avisar sin sentir que me señalan.
- **Criterios de aceptación:**
  1. **Dado** que selecciono `testigo` en `#screen-3-situation-type` o `#q-branch`, **cuando** abro `#screen-questionnaire`, **entonces** los enunciados de las preguntas cambian de «¿te pasa a ti?» a «¿qué has visto que le ocurre a tu compañero/a?».
  2. **Dado** que envío un aviso como testigo, **cuando** llego a `#screen-feedback`, **entonces** el plan de apoyo destaca pautas seguras de acompañante («no te enfrentes solo/a, mantente a salvo, tu aviso es confidencial»).

---

### 3.3 Profesores y Orientación (`EP-05` y `EP-06`)

#### EP-05 · Acceso seguro por roles, bandeja multi-dispositivo y triaje urgente

##### `US-PR-01` · Autenticación institucional y control de acceso por rol (RBAC)
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (`#screen-teacher-panel` es público en la navegación actual) | **Asignado a:** Sin asignar
- **Historia:** Como **docente, orientador/a o miembro de dirección**, quiero iniciar sesión con mi cuenta institucional del centro para acceder únicamente a los avisos que corresponden a mi grupo o competencia, para garantizar la confidencialidad absoluta de los menores.
- **Criterios de aceptación:**
  1. **Dado** que cualquier persona intenta navegar a `#screen-teacher-panel`, **cuando** no tiene sesión docente autenticada válida, **entonces** el sistema exige inicio de sesión institucional y nunca renderiza avisos de alumnado ni de familias.
  2. **Dado** que inicio sesión con rol `tutor`, `guidance` (Orientación) o `director` (Dirección/Convivencia), **cuando** cargo la bandeja, **entonces** solo visualizo los avisos asignados a mi ámbito/grupo según la política del centro (y nunca los datos de otros centros).

##### `US-PR-02` · Bandeja multi-dispositivo sincronizada con filtros, estados y búsqueda
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Parcial` (`#screen-teacher-panel`, `src/js/modules/teacher-panel.js` implementa filtros de estado y `select` de estado, pero solo sobre `sessionStorage` local y con 3 casos semilla) | **Asignado a:** Sin asignar
- **Historia:** Como **profesor u orientador**, quiero ver en tiempo real todos los avisos enviados desde cualquier dispositivo (alumnado Adaptado, Exploración sin causa, CAA, Chat, Cuestionario y Familias), filtrarlos por estado, urgencia o origen y actualizar su estado de gestión, para no perder ninguna alerta temprana.
- **Criterios de aceptación:**
  1. **Dado** que un estudiante o una familia envía un aviso desde otro dispositivo, **cuando** abro `#screen-teacher-panel`, **entonces** el aviso aparece en la bandeja con código `SAFE-XXX`, fecha/hora real, lugar/franja, perfil de origen (víctima/testigo/familia/CAA/sin causa) y estado inicial `Pendiente`.
  2. **Dado** que gestiono la bandeja, **cuando** filtro por estado (`todos`, `pendiente`, `seguimiento`, `resuelto`), destinatario, lugar o nivel de urgencia, **entonces** el listado y el contador se actualizan de forma inmediata y persistente en servidor.

##### `US-PR-03` · Alertas urgentes en tiempo real ante peligro inmediato o escalada
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (no hay campo de prioridad ni notificación activa al docente) | **Asignado a:** Sin asignar
- **Historia:** Como **orientador/a o coordinador/a de convivencia**, quiero recibir una alerta destacada e inmediata cuando un aviso marque «Peligro inmediato», «Ayuda ya sin causa» o muestre repetición grave, para intervenir el mismo día antes de que ocurra una agresión física.
- **Criterios de aceptación:**
  1. **Dado** que un cuestionario se envía con `qq_safety === 'danger'` o se pulsa el aviso rápido de bloqueo (`US-ED-10`), **cuando** entra en bandeja, **entonces** aparece fijado en la parte superior con etiqueta visual de **Prioridad Crítica** accesible (icono + texto + alto contraste) y notificación al equipo de Orientación/Dirección del centro.
  2. **Dado** que se marca como crítico, **cuando** un docente abre el detalle, **entonces** ve el recordatorio del protocolo de emergencia y puede registrar la hora de primera actuación.

##### `US-PR-04` · Notas internas privadas, asignación de responsable y bitácora de actuaciones
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` (actualmente cada tarjeta solo tiene un `<select>` de estado) | **Asignado a:** Sin asignar
- **Historia:** Como **tutor/a que colabora con Orientación**, quiero reasignar un aviso al equipo adecuado, añadir notas internas con medidas aplicadas y consultar el historial de cambios, para evitar duplicidades y garantizar seguimiento continuo.
- **Criterios de aceptación:**
  1. **Dado** que abro un aviso en `#screen-teacher-panel`, **cuando** cambio el responsable asignado o escribo una nota de seguimiento interna, **entonces** la nota queda guardada con autor, fecha y hora en la bitácora del caso sin ser visible nunca para el alumnado.
  2. **Dado** que el caso cambia de `Pendiente` a `En seguimiento` o `Resuelto`, **cuando** consulto el historial, **entonces** queda registro auditable de cada transición de estado y usuario que la realizó.

##### `US-PR-05` · Respuesta segura al emisor mediante código `SAFE-XXX`
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` | **Asignado a:** Sin asignar
- **Historia:** Como **orientador/a**, quiero enviar un mensaje breve de acuse o pauta segura al código `SAFE-XXX` (con sugerencia automática de texto adaptado a Lectura Fácil si el origen fue Modo Adaptado/CAA/Sin causa), para tranquilizar al estudiante o familia y recabar el detalle mínimo necesario.
- **Criterios de aceptación:**
  1. **Dado** que un aviso proviene de un estudiante anónimo o de una familia con código `SAFE-XXX`, **cuando** redacto una respuesta desde el Panel Docente, **entonces** el sistema ofrece plantillas empáticas y en Lectura Fácil que el receptor podrá leer usando únicamente su código.
  2. **Dado** que envío la respuesta, **cuando** el emisor consulta su código, **entonces** no se expone ninguna nota interna privada de la bitácora docente, solo la comunicación externa aprobada.

#### EP-06 · Prevención en momentos no estructurados, pautas TEA y cumplimiento normativo

##### `US-PR-06` · Mapa de Puntos Calientes con filtros temporales y análisis de tendencias
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `Parcial` (`#teacher-hotspot-bars` calcula un conteo plano en texto sobre todo el array `inbox`) | **Asignado a:** Sin asignar
- **Historia:** Como **coordinador/a de convivencia**, quiero visualizar en el Mapa de Puntos Calientes la distribución de incidencias por espacio (`patio`, `pasillos`, `clase`, `entrada`, `comedor`, `digital`) y momento de rutina filtrada por semana, mes o curso, para redistribuir guardias y vigilancia preventiva en momentos no estructurados.
- **Criterios de aceptación:**
  1. **Dado** que entro en la sección de Mapa de Puntos Calientes de `#screen-teacher-panel`, **cuando** selecciono un rango temporal (ej. última semana, último mes, trimestre), **entonces** veo barras proporcionales accesibles (texto, tabla y gráfico con contraste WCAG) con el número y porcentaje real por zona y franja.
  2. **Dado** que una zona supera un umbral configurable de alertas recientes, **cuando** se renderiza el mapa, **entonces** se destaca como foco prioritario de vigilancia para el claustro.

##### `US-PR-07` · Pautas de intervención contextualizadas (TEA e inclusión)
- **Prioridad:** `Could` | **Release:** `R2` | **Estado actual:** `Parcial` (`#screen-teacher-panel` muestra una caja fija de 3 puntos de pauta TEA para todos los casos) | **Asignado a:** Sin asignar
- **Historia:** Como **profesor sin formación específica en TEA o accesibilidad**, quiero ver pautas prácticas contextualizadas al perfil de apoyo del aviso (TEA, sordera, CAA, lectura fácil, ciberacoso), para intervenir con sensibilidad y sin exponer ni sobrecargar al alumno.
- **Criterios de aceptación:**
  1. **Dado** que un aviso indica origen en Modo Adaptado, Tablero CAA o necesidad TEA marcada por familia/alumno, **cuando** consulto el detalle del caso, **entonces** se muestran pautas concretas de primera acogida adaptadas a ese perfil (ej. uso de pictogramas, ambiente silencioso, intérprete/texto visual).
  2. **Dado** que necesito apoyo rápido en el aula, **cuando** despliego la guía rápida, **entonces** puedo consultarla en menos de 30 segundos con pasos accionables («Qué hacer» y «Qué evitar»).

##### `US-PR-08` · Exportación de informe para protocolo oficial de convivencia
- **Prioridad:** `Should` | **Release:** `R3` | **Estado actual:** `PARA INICIAR` | **Asignado a:** Sin asignar
- **Historia:** Como **miembro de Dirección u Orientación**, quiero exportar el expediente de un caso o un resumen estadístico del centro en formato imprimible/estructurado cumpliendo minimización de datos, para incorporarlo al protocolo oficial de convivencia e inspección educativa.
- **Criterios de aceptación:**
  1. **Dado** que selecciono un caso con estado `En seguimiento` o `Resuelto`, **cuando** pulso exportar informe oficial, **entonces** se genera un documento con fecha de entrada, lugar, tipología, cronología de actuaciones y medidas tomadas, omitiendo datos innecesarios y preservando el anonimato de testigos si corresponde.
  2. **Dado** que se realiza una exportación, **cuando** se descarga el informe, **entonces** queda registrada la acción en el log de auditoría del centro.

---

### 3.4 Padres, madres y tutores legales (`EP-07`)

#### EP-07 · Detección temprana desde casa y coordinación casa-escuela

##### `US-FA-01` · Registro estructurado de señales desde casa con lugar, franja y destinatario reales
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Parcial` (`#screen-parents`, `src/js/modules/parents.js` recoge 4 señales + nombre/nota, pero envía siempre `place = 'patio'` y destinatario fijo `'tutor_guidance'`) | **Asignado a:** Sin asignar
- **Historia:** Como **padre, madre o tutor legal**, quiero marcar las señales de alerta que observo en casa —incluido cuando vuelve mal sin saber explicar por qué—, indicar días/franja o lugar sospechado y elegir a quién enviarlo, para ayudar al colegio a triangular la causa y activar la observación temprana sin dramatizar.
- **Criterios de aceptación:**
  1. **Dado** que estoy en `#screen-parents`, **cuando** selecciono una o varias señales (`.parent-signal-btn`, incorporando **«Vuelve mal sin saber explicar por qué»** junto a las 4 señales actuales), **entonces** los botones actualizan `aria-pressed="true"` y se añaden al aviso.
  2. **Dado** que completo el formulario `#form-parents`, **cuando** indico el lugar sospechado (incluyendo opción «No lo sé / Desde casa»), días/franja aproximada y el destinatario (`Tutor/a`, `Orientación`, `Dirección`), **entonces** el aviso enviado refleja esos valores reales en lugar de forzar `'patio'`.
  3. **Dado** que el menor no sabe explicar qué ocurrió pero vuelve alterado ciertos días o tras una actividad concreta, **cuando** la familia anota esa franja en el aviso, **entonces** el Panel Docente vincula esa pista temporal para contrastarla con los avisos del alumno (`US-PR-09`).

##### `US-FA-02` · Modo acompañamiento familiar («Usar asistente con mi hijo/a»)
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `Parcial` (existe el botón `data-go="2-mode"` en `#screen-parents`, pero salta sin configurar voz/apoyos ni ofrecer guía para la familia) | **Asignado a:** Sin asignar
- **Historia:** Como **madre o padre de un menor con dificultades de comunicación**, quiero iniciar el asistente junto a mi hijo/a pasando por la configuración de apoyos y con una breve recomendación de acompañamiento respetuoso, para ayudarle a expresarse sin hablar por él ni presionarlo con preguntas de «¿por qué?».
- **Criterios de aceptación:**
  1. **Dado** que pulso **Usar asistente con mi hijo/a** en `#screen-parents`, **cuando** se inicia el flujo guiado, **entonces** me permite ajustar rápidamente voz/apoyos (o recuperar los guardados) con un aviso breve («Deja que tu hijo/a elija sensaciones, escenas o dibujos a su ritmo sin exigirle explicar por qué»).
  2. **Dado** que finalizamos juntos el flujo Adaptado, Exploración sin causa o CAA, **cuando** se envía el mensaje, **entonces** el panel docente identifica que fue un envío acompañado con contexto claro.

##### `US-FA-03` · Confirmación familiar específica con código `SAFE-XXX` y seguimiento del caso
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (`parents.js` ignora el código devuelto por `addNotice()` y redirige a `#screen-feedback`, redactado para alumnado) | **Asignado a:** Sin asignar
- **Historia:** Como **padre o madre que acaba de enviar un aviso desde casa**, quiero ver una confirmación adaptada a familias con el código de seguimiento `SAFE-XXX` y poder consultar su estado después, para tener tranquilidad de que el colegio lo recibió y está actuando.
- **Criterios de aceptación:**
  1. **Dado** que envío `#form-parents`, **cuando** el aviso se guarda correctamente, **entonces** veo el código `SAFE-XXX`, el resumen del aviso enviado y la opción de copiarlo o guardarlo en PDF (sin mostrar la interfaz infantil de «4 caras» ni enlaces al Panel Profe).
  2. **Dado** que regreso días después con mi código `SAFE-XXX`, **cuando** consulto el estado, **entonces** visualizo si está `Pendiente`, `En seguimiento` o `Resuelto` y cualquier mensaje público enviado por Tutor/Orientación.

##### `US-FA-04` · Declaración de necesidades de apoyo o perfil TEA del menor en el aviso familiar
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` | **Asignado a:** Sin asignar
- **Historia:** Como **familia de un estudiante con TEA u otra necesidad específica de apoyo**, quiero señalar en el formulario familiar si mi hijo/a necesita enfoque sensorial, comunicación con pictogramas o trato discreto, para que el docente aplique las pautas adecuadas desde el primer contacto.
- **Criterios de aceptación:**
  1. **Dado** que redacto un aviso en `#screen-parents`, **cuando** marco de forma opcional apoyos del menor (ej. «TEA / sensibilidad sensorial», «Usa CAA», «No exponer en grupo», «Dificultad para explicar por qué está mal»), **entonces** el aviso llega al Panel Docente etiquetado con esas etiquetas y activa las pautas correspondientes (`US-PR-07`, `US-PR-09`).

##### `US-FA-05` · Solicitud de tutoría discreta o contacto preferente con Orientación
- **Prioridad:** `Could` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` | **Asignado a:** Sin asignar
- **Historia:** Como **padre o madre preocupado/a**, quiero indicar si deseo que el tutor u orientación me llame o cite de forma discreta (y en qué franja horaria), para coordinar medidas en sintonía con el centro sin exponer al menor delante de otros alumnos.
- **Criterios de aceptación:**
  1. **Dado** que envío un aviso desde `#screen-parents`, **cuando** marco «Solicitar contacto discreto» e indico preferencia (llamada, mensajería escolar o reunión presencial), **entonces** la preferencia queda destacada en el aviso recibido por Tutor/Orientación.

##### `US-FA-06` · Acceso directo a recursos y teléfonos de ayuda desde el Espacio Familias
- **Prioridad:** `Should` | **Release:** `R1` | **Estado actual:** `Parcial` (el teléfono `900 018 018` y `112` solo aparecen en `#urgent-help-alert` del cuestionario y en el texto de `#screen-feedback`, no directamente en `#screen-parents`) | **Asignado a:** Sin asignar
- **Historia:** Como **familia que consulta la aplicación en un momento de preocupación**, quiero ver directamente en `#screen-parents` y en la confirmación los teléfonos gratuitos de ayuda contra el acoso (`900 018 018`) y emergencias (`112`), para saber a quién acudir fuera del horario escolar si la situación es grave.
- **Criterios de aceptación:**
  1. **Dado** que accedo a `#screen-parents`, **cuando** consulto la pantalla o su confirmación de envío, **entonces** dispongo de una tarjeta visible y accesible con el teléfono contra el acoso escolar (`900 018 018`) y emergencias (`112`) y enlace rápido si el menor está en peligro inmediato.

---

### 3.5 Transversales y Plataforma (`EP-08`)

##### `US-TR-01` · Salida Rápida inmediata (`Esc` y botón de cabecera)
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Implementado` (`#btn-safe-exit`, `#safe-exit-screen`, `src/js/modules/accessibility.js`) | **Asignado a:** Prototipo base
- **Historia:** Como **cualquier estudiante o familia en situación vulnerable**, quiero ocultar al instante toda la aplicación pulsando `Esc` o el botón visible **Salida rápida**, para proteger mi privacidad si alguien se acerca a mirar mi pantalla.
- **Criterios de aceptación:**
  1. **Dado** que estoy en cualquier pantalla o modal de **Contigo**, **cuando** pulso `Escape` o `#btn-safe-exit`, **entonces** se detienen de inmediato la síntesis de voz, el reconocimiento de voz y cualquier petición de IA en curso (`abortGemini()`, `abortSpeechRecognition()`, `stopSpeaking()`).
  2. **Dado** que se activa la Salida Rápida, **cuando** se muestra `#safe-exit-screen`, **entonces** el documento subyacente pasa a `inert = true`, el título de la pestaña cambia a una pantalla neutra de apuntes de matemáticas y el foco queda en el botón de retorno `#return-from-safe-exit`.

##### `US-TR-02` · Backend seguro multi-centro con sincronización *offline-first*
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (actualmente todo reside en `sessionStorage` sin API ni base de datos) | **Asignado a:** Sin asignar
- **Historia:** Como **equipo del centro educativo**, quiero que los avisos enviados desde alumnado y familias se almacenen en un servidor seguro por centro educativo con cola local temporal si falla la red, para garantizar que ninguna alerta se pierda por falta de cobertura en el patio.
- **Criterios de aceptación:**
  1. **Dado** que un usuario envía un aviso con conexión activa, **cuando** confirma el envío, **entonces** el servidor valida el payload, asigna código único `SAFE-XXX` sin colisiones y lo persiste cifrado en la base de datos del centro antes de confirmar.
  2. **Dado** que el dispositivo pierde conexión temporalmente, **cuando** el usuario envía el aviso, **entonces** queda en cola local cifrada con código provisional o acuse claro y se sincroniza automáticamente en cuanto vuelve la red, limpiándose de la cola local al confirmarse.

##### `US-TR-03` · Privacidad por diseño, minimización de datos y cumplimiento RGPD / LOPIVI
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `Parcial` (prototipo privado por ser local en `sessionStorage`, pero sin política de retención, cifrado en tránsito/reposo ni control de acceso en producción) | **Asignado a:** Sin asignar
- **Historia:** Como **delegado/a de protección de datos o dirección del centro**, quiero que la plataforma minimice la recogida de datos personales de menores, separe identidad cuando se elige anonimato y aplique políticas de retención y borrado, para cumplir estrictamente el RGPD y la LOPIVI.
- **Criterios de aceptación:**
  1. **Dado** que un aviso se envía en modo anónimo, **cuando** se registra en servidor, **entonces** no se almacenan identificadores personales del dispositivo, cookies de rastreo ni analítica de terceros.
  2. **Dado** que un caso pasa a `Resuelto` y vence el plazo legal/protocolario definido por el centro, **cuando** se ejecuta la política de retención, **entonces** los datos identificativos se anonimizan conservando únicamente estadísticas agregadas para el Mapa de Puntos Calientes.

##### `US-TR-04` · Soporte multilingüe completo (7 idiomas) y direccionalidad RTL
- **Prioridad:** `Should` | **Release:** `R1` | **Estado actual:** `Implementado` (`src/js/services/i18n.js`, `src/js/services/locales/*.js` para `es`, `ca`, `en`, `fr`, `de`, `pt`, `ar`) | **Asignado a:** Prototipo base
- **Historia:** Como **estudiante o familiar recién llegado o de habla no hispana**, quiero utilizar toda la interfaz, pictogramas, mensajes del asistente, voz y respuestas en mi idioma (incluyendo árabe RTL), para expresarme con total naturalidad.
- **Criterios de aceptación:**
  1. **Dado** que cambio el selector `#lang-select` entre `es`, `ca`, `en`, `fr`, `de`, `pt` y `ar`, **cuando** se aplica el idioma, **entonces** todas las pantallas, etiquetas `aria-label`, placeholders, mensajes dinámicos (`inbox`, `diary`, `caa`, `feedback`) y el idioma de TTS/STT se actualizan sin recargar.
  2. **Dado** que selecciono árabe (`ar`), **cuando** se renderiza la aplicación, **entonces** `document.documentElement.dir` cambia a `rtl` y los layouts mantienen alineación y lectura correctas.
  3. **Dado** que se añaden nuevas pantallas en `R1`/`R2` (exploración sin causa, login docente, consulta `SAFE-XXX`), **cuando** se entreguen, **entonces** deben incorporar sus claves en los 7 archivos de `src/js/services/locales/`.

##### `US-TR-05` · Proxy seguro de IA conversacional y moderación ante crisis
- **Prioridad:** `Must` | **Release:** `R1` | **Estado actual:** `PARA INICIAR` (`src/js/services/gemini.js` realiza llamadas directas desde el cliente con clave manual) | **Asignado a:** Sin asignar
- **Historia:** Como **responsable técnico del proyecto**, quiero centralizar la integración opcional con Gemini en un proxy backend con filtros de seguridad infantil y detección de crisis, para evitar exposición de secretos y respuestas inapropiadas ante menores.
- **Criterios de aceptación:**
  1. **Dado** que el chatbot usa IA generativa en producción, **cuando** el cliente envía una consulta, **entonces** el navegador llama al backend propio sin poseer ni almacenar ninguna API key de Google AI Studio.
  2. **Dado** que el modelo o los filtros previos detectan riesgo autolítico o violencia grave inminente, **cuando** se procesa el mensaje, **entonces** se prioriza un mensaje seguro de contención con acceso directo al `112` / `900 018 018` y sugerencia de aviso inmediato al adulto/centro.

##### `US-TR-06` · Suite automatizada de pruebas de accesibilidad (WCAG), i18n y flujos E2E por actor
- **Prioridad:** `Should` | **Release:** `R2` | **Estado actual:** `PARA INICIAR` (el repositorio cuenta con `design/mockups/tools/check_contrast.py` para mockups, pero no dispone de tests automatizados sobre la app en `src/`) | **Asignado a:** Sin asignar
- **Historia:** Como **equipo de ingeniería**, quiero contar con pruebas automáticas E2E por cada uno de los 4 actores y chequeos continuos de contraste, foco, atributos ARIA y claves de idioma, para desplegar cambios sin introducir regresiones de accesibilidad.
- **Criterios de aceptación:**
  1. **Dado** cualquier cambio en `index.html`, `src/styles/` o `src/js/`, **cuando** se ejecuta el pipeline de verificación, **entonces** se validan sin errores: contraste WCAG AA/AAA en modo normal y alto contraste, uso estricto de HTML semántico nativo y WAI-ARIA (sin `<div>`/`<span>` clicables), navegación por teclado completa, ausencia de claves `i18n` faltantes entre los 7 idiomas y los flujos críticos de los 4 actores (incluida la ruta completa respondiendo «No lo sé»).

---

## 4. Roadmap sugerido por Releases

Para comenzar a ejecutar el proyecto de manera profesional por iteraciones, se recomienda agrupar las historias pendientes y parciales en tres releases incrementales:

| Release | Foco estratégico | Historias incluidas (Prioridad `Must` / `Should` críticas) | Resultado al cierre de la release |
| --- | --- | --- | --- |
| **R1 · MVP Piloto Escolar** | Núcleo inclusivo sin *«¿por qué?»*, seguridad, persistencia multi-dispositivo y corrección de brechas críticas del prototipo. | **`US-ED-10`**, **`US-ED-11`**, **`US-ED-12`**, **`US-ED-14`**, **`US-PR-09`**, `US-TR-02`, `US-TR-03`, `US-TR-05`, `US-PR-01`, `US-PR-02`, `US-PR-03`, `US-ED-02`, `US-ED-04`, `US-ED-09`, `US-ES-02`, `US-ES-03`, `US-ES-04`, `US-ES-06`, `US-FA-01`, `US-FA-03`, `US-FA-06` | Un centro piloto real puede desplegar **Contigo**: el alumnado con discapacidad logra expresar malestar aunque no sepa por qué está mal, y los avisos llegan con pistas y pautas sin interrogatorio al panel autenticado del profesorado. |
| **R2 · Seguimiento y Operación** | Patrones longitudinales, cierre de ciclo bidireccional, coordinación familia-escuela, prevención y QA continuo. | **`US-ED-13`**, `US-ES-05`, `US-ES-07`, `US-ES-08`, `US-PR-04`, `US-PR-05`, `US-PR-06`, `US-PR-07`, `US-FA-02`, `US-FA-04`, `US-FA-05`, `US-TR-06` | Detección automática de patrones repetitivos, consulta bidireccional `SAFE-XXX`, bitácoras internas, Mapa de Puntos Calientes temporal y pautas contextualizadas. |
| **R3 · Escala y Prevención** | Despliegue físico accesible y cumplimiento documental oficial. | `US-ED-08`, `US-PR-08` | Integración con señalética física **NaviLens / QR** en centros y exportación auditable para protocolos oficiales de convivencia. |

---

## 5. Definition of Ready (DoR) y Definition of Done (DoD)

### Definition of Ready (antes de llevar una historia a Sprint)
- El actor, el valor esperado y los criterios de aceptación (*Dado / Cuando / Entonces*) están claros y sin ambigüedad.
- Si afecta a UI de alumnado o familias, se ha definido su adaptación para **Lectura Fácil**, **Alto Contraste**, **Sin animaciones (TEA)** y **Botones grandes**.
- Se han identificado los impactos en privacidad de menores (anonimato, RBAC o retención de datos).
- Las dependencias técnicas (endpoints, claves `i18n`, pictogramas ARASAAC) están identificadas.

### Definition of Done (antes de dar una historia por terminada)
- Código integrado siguiendo la arquitectura modular (`core/`, `services/`, `modules/`) y sin lógica duplicada.
- **Regla de diseño inclusivo:** Ningún flujo de alumnado con discapacidad bloquea el envío por no saber etiquetar una emoción abstracta o responder «¿por qué?».
- Verificada la **accesibilidad técnica**: **HTML nativo primero y WAI-ARIA únicamente como refuerzo cuando el elemento nativo no cubra el estado** (sin `<div>`/`<span>` clicables), navegación por teclado, foco visible, `aria-live` / `role` correctos, `inert` en modales y compatibilidad con **Salida Rápida (`Esc`)**.
- Todas las cadenas visibles están internacionalizadas en los **7 idiomas** (`es`, `ca`, `en`, `fr`, `de`, `pt`, `ar`), verificando ausencia de solapamientos en modo `RTL` y modo **Lectura Fácil** / **22px**.
- Ningún secreto, API key ni dato sensible queda expuesto en el cliente ni se registra en consola/logs públicos.
- Pruebas funcionales del flujo y regresiones de accesibilidad ejecutadas y documentadas.
