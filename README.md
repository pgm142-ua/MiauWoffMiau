# Contigo · Espacio Seguro y Accesible

> **Reto Educación — Hackathon de Tecnologías Accesibles e Inclusivas (NaviLens)**

**Contigo** es una aplicación web diseñada para la **prevención, detección temprana y comunicación accesible de situaciones de acoso escolar**, con foco especial en alumnado con **TEA (Trastorno del Espectro Autista)** y diversas necesidades de accesibilidad (visual, auditiva, habla/CAA, cognitiva, motora y sensorial).

La aplicación funciona **100 % en el navegador sin dependencias externas de ejecución**, priorizando la privacidad (almacenamiento efímero por sesión en `sessionStorage`), la accesibilidad multimodal y la respuesta rápida ante situaciones de vulnerabilidad (incluyendo **Salida Rápida** con la tecla `Esc`).

---

## Tabla de contenidos

- [Características principales](#características-principales)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura técnica](#arquitectura-técnica)
- [Cómo ejecutar en local](#cómo-ejecutar-en-local)
- [Accesibilidad e inclusión](#accesibilidad-e-inclusión)
- [Integración opcional con IA (Google Gemini)](#integración-opcional-con-ia-google-gemini)
- [Documentación adicional](#documentación-adicional)
- [Licencia](#licencia)

---

## Características principales

- **Configuración inicial de accesibilidad (Pasos 0 y 0B):** Activación guiada de voz en alto (TTS) y perfiles de apoyo (visión/letra grande, modo persona sorda con alertas visuales, sin habla/CAA, lectura fácil, TEA/sin animaciones y botones grandes para accesibilidad motora).
- **Flujo adaptado por rol:**
  - **Alumnado (Modo Adaptado):** Comunicación en 3 pasos visuales (sentimientos → causa → lugar y envío al docente con código de seguimiento `SAFE-XXX`).
  - **Alumnado (Modo No Adaptado):** Chatbot empático con dictado por voz (Web Speech API con fallback inteligente) y buzón de envío **100 % anónimo**.
  - **Cuestionario estructurado:** Evaluación paso a paso con detección automática de peligro inmediato (aviso de emergencia `112` y teléfono contra el acoso escolar `900 018 018`).
  - **Espacio Familias (Padres/Tutores):** Registro de señales de alerta observadas desde casa.
  - **Panel Docente y Orientación:** Bandeja de alertas tempranas con estados (`Pendiente`, `En seguimiento`, `Resuelto`), **Mapa de Puntos Calientes** en momentos no estructurados y pauta rápida de intervención TEA.
- **Herramientas transversales:**
  - **Tablero CAA («Voz Prestada»):** Construcción de frases mediante pictogramas con lectura en voz alta y envío directo al profesorado o al chat.
  - **Diario de Evidencias:** Registro cronológico con analizador de repetición/escalada.
  - **Rincón de Calma:** Pausa sensorial con respiración guiada visual y por voz.
  - **Feedback Emocional y Plan de Apoyo:** Cierre con 4 emociones, plan de actuación discreto del centro y exportación (copiar / imprimir PDF).
  - **Soporte multilingüe (7 idiomas):** Español (`es`), Catalán/Valenciano (`ca`), Inglés (`en`), Francés (`fr`), Alemán (`de`), Portugués (`pt`) y Árabe (`ar` con dirección `RTL`).
  - **Salida rápida (`Esc`):** Oculta la aplicación al instante bajo una pantalla neutra de apuntes de matemáticas, deteniendo voz, micrófono y peticiones activas.

---

## Estructura del proyecto

```text
Hackcesibles/
├── index.html                          # Documento HTML semántico y accesible (punto de entrada)
├── README.md                           # Documentación principal del repositorio
├── LICENSE                             # Licencia MIT
├── .gitignore                          # Exclusiones de control de versiones
├── .editorconfig                       # Reglas de formato consistentes entre editores
├── assets/
│   └── images/
│       └── hero-illustration.webp      # Ilustración principal de portada (extraída y cacheable)
├── docs/
│   ├── ARCHITECTURE.md                 # Arquitectura modular, flujo de pantallas y gestión de estado
│   └── ACCESSIBILITY.md                # Matriz de accesibilidad (WCAG, TEA, CAA, teclado y voz)
└── src/
    ├── styles/
    │   ├── main.css                    # Punto de entrada CSS (importación ordenada en cascada)
    │   ├── base.css                    # Reset, tipografía base, focus-visible y utilidades SR/skip-link
    │   ├── layout.css                  # Cabecera, barra de herramientas, progreso, hero y pie de página
    │   ├── components.css              # Tarjetas, botones, formularios, chat, calma, modales y toast
    │   └── accessibility.css           # Alto contraste, lectura fácil, modo motor, sin animaciones y vista Figma
    └── js/
        ├── main.js                     # Bootstrap de la aplicación e inicialización de módulos
        ├── core/
        │   ├── dom.js                  # Utilidades DOM (selectores, visibilidad, creación segura de nodos)
        │   ├── state.js                # Estado compartido de sesión, datos iniciales y gestión de avisos
        │   ├── storage.js              # Capa de persistencia efímera en sessionStorage
        │   └── router.js               # Enrutador de pantallas, historial, foco accesible y modales inert
        ├── services/
        │   ├── speech.js               # Síntesis de voz (TTS), dictado (STT) y alertas visuales
        │   ├── gemini.js               # Cliente opcional Google Gemini API + motor empático local offline
        │   └── i18n.js                 # Traducción multilingüe (7 idiomas, soporte RTL)
        └── modules/
            ├── accessibility.js        # Ajustes (⚙️), barra rápida, paso 0B, atajos, Esc y vista Figma
            ├── flow.js                 # Flujo guiado principal (Pasos 0–3, Modo Adaptado y delegación)
            ├── chat.js                 # Modo No Adaptado: chatbot, buzón anónimo y modal API Gemini
            ├── caa.js                  # Tablero CAA («Voz Prestada») con pictogramas
            ├── diary.js                # Diario de evidencias y detector de escalada
            ├── questionnaire.js        # Cuestionario paso a paso y alerta de urgencia
            ├── parents.js              # Espacio Familias (detección temprana desde casa)
            ├── teacher-panel.js        # Panel docente, filtros y mapa de puntos calientes
            ├── calm.js                 # Rincón de Calma (respiración guiada)
            └── feedback.js             # Feedback emocional (4 caras), plan de apoyo y exportación
```

---

## Arquitectura técnica

El proyecto sigue una arquitectura **modular nativa en ES Modules (`type="module"`)** sin frameworks ni pasos de compilación obligatorios:

1. **Separación por responsabilidades:**
   - `src/styles/` desacopla estilos base, estructura de página, componentes de interfaz y capas de accesibilidad.
   - `src/js/core/` centraliza utilidades DOM, estado compartido, persistencia de sesión y enrutamiento accesible.
   - `src/js/services/` encapsula integraciones del navegador y servicios externos (Web Speech API, Google Gemini API e i18n).
   - `src/js/modules/` aísla cada vista y funcionalidad de dominio en un módulo independiente inicializado desde `src/js/main.js`.
2. **Privacidad por diseño:** Los avisos, el diario y la configuración opcional de IA se guardan únicamente en `sessionStorage` bajo el prefijo `contigo.`, sin servidores intermedios ni rastreo.
3. **Despliegue directo:** Al ser 100 % estático (HTML5 + CSS3 + ES Modules), es compatible de forma inmediata con GitHub Pages, Vercel, Netlify o cualquier servidor HTTP estático.

Para el detalle completo de dependencias entre módulos y flujos de navegación, consulta [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## Cómo ejecutar en local

Debido al uso de **ES Modules nativos** (`<script type="module">`), los navegadores requieren servir el proyecto mediante un servidor HTTP local (no abriendo el archivo directamente con `file://`).

Elige cualquiera de estas opciones desde la raíz del proyecto:

```bash
# Opción 1: Python 3
python -m http.server 8080

# Opción 2: Node.js (npx)
npx serve . -l 8080

# Opción 3: Extensión "Live Server" en VS Code sobre index.html
```

A continuación, abre `http://localhost:8080` en tu navegador.

---

## Accesibilidad e inclusión

Contigo ha sido diseñado aplicando criterios de accesibilidad cognitiva, sensorial y técnica:

- Navegación completa por teclado, foco visible de alto contraste (`outline: 4px solid #f59e0b`), enlace *Saltar al contenido principal* y atributos `inert` en el fondo al abrir modales.
- Atajos numéricos (`1`–`6`) en cada pantalla para reducir la carga motora y facilitar el uso con lectores de pantalla.
- Modo **Alto Contraste** completo (negro puro, blanco y amarillo de alta legibilidad), **Lectura Fácil**, **Botones Grandes** y **Sin Animaciones (TEA)**.
- Regiones `aria-live="polite"`, `role="status"`, `role="alert"` y barra visual de alertas para personas sordas.

Consulta la matriz completa en [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md).

---

## Integración opcional con IA (Google Gemini)

El chatbot del **Modo No Adaptado** funciona completamente **sin clave API** gracias a un motor empático local (`src/js/services/gemini.js`).

De forma opcional, desde **Ajustes (⚙️) → API Gemini** o desde el botón **✨ IA Gemini** del chat, se puede introducir una clave de Google AI Studio (por defecto `gemini-2.5-flash`) para habilitar respuestas generativas breves y empáticas. La clave nunca se almacena de forma permanente y solo se mantiene en memoria (o en `sessionStorage` de la pestaña si se marca explícitamente).

---

## Documentación adicional

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Diagramas de arquitectura, capas y ciclo de vida de módulos.
- [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md) — Especificación de apoyos, estándares WCAG y atajos de teclado.

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más información.
