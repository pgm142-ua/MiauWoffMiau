# Arquitectura de Contigo

Este documento describe la organización interna, las capas de software y el flujo de datos de **Contigo**.

## Principios de diseño

1. **Cero dependencias de ejecución:** HTML5 semántico, CSS3 modular y JavaScript nativo con ES Modules (`type="module"`).
2. **Bajo acoplamiento:** Los módulos de dominio (`src/js/modules/`) no dependen entre sí de forma circular; el enrutador (`core/router.js`) expone `registerPageHook()` para que cada vista registre su propio renderizado al activarse.
3. **Privacidad efímera:** Todos los datos de sesión se almacenan en `sessionStorage` con prefijo `contigo.` (`core/storage.js`).
4. **Resiliencia offline:** Tanto el reconocimiento de voz (`services/speech.js`) como el chatbot (`services/gemini.js`) cuentan con degradación elegante si el dispositivo carece de micrófono o clave API.

---

## Diagrama de capas

```mermaid
flowchart TD
    HTML["index.html"] --> CSS["src/styles/main.css"]
    HTML --> MAIN["src/js/main.js"]

    CSS --> C1["base.css"]
    CSS --> C2["layout.css"]
    CSS --> C3["components.css"]
    CSS --> C4["accessibility.css"]

    MAIN --> MODS["src/js/modules/*"]
    MAIN --> SRV["src/js/services/*"]
    MAIN --> CORE["src/js/core/router.js"]

    MODS --> CORE
    MODS --> SRV
    CORE --> STATE["core/state.js + core/storage.js + core/dom.js"]
```

---

## Flujo de pantallas principales

```mermaid
flowchart LR
    HOME["Portada (home)"] --> S0["Paso 0: Voz (0-voice)"]
    S0 --> S0B["Paso 0B: Apoyos (0-disability)"]
    S0B --> S1["Paso 1: Rol (1-role)"]

    S1 -->|Profesor| TP["Panel Docente (teacher-panel)"]
    S1 -->|Padres| PAR["Espacio Familias (parents)"]
    S1 -->|Alumno| S2["Paso 2: Modo (2-mode)"]

    S2 --> S3["Paso 3: Situación (3-situation-type)"]
    S3 -->|Cuestionario| Q["Cuestionario (questionnaire)"]
    S3 -->|Modo Adaptado| AD1["Adaptado 1: Sentimiento"]
    AD1 --> AD2["Adaptado 2: Causa"]
    AD2 --> AD3["Adaptado 3: Enviar al Profesor"]
    S3 -->|No Adaptado| CHAT["Chatbot + Buzón Anónimo (no-adapted)"]

    AD3 --> FB["Feedback Emocional (feedback)"]
    CHAT --> FB
    Q --> FB
    PAR --> FB
```

---

## Responsabilidad de cada capa

| Capa | Directorio | Responsabilidad |
| --- | --- | --- |
| **Entrada** | `index.html`, `src/js/main.js` | Estructura semántica de pantallas/modales y secuencia de arranque (`bootstrap()`). |
| **Estilos** | `src/styles/` | Diseño visual, layout responsive, componentes reutilizables y modos de accesibilidad. |
| **Núcleo** | `src/js/core/` | Utilidades DOM, estado global, persistencia en sesión y navegación con gestión de foco. |
| **Servicios** | `src/js/services/` | TTS/STT del navegador, cliente Gemini + fallback local e internacionalización. |
| **Módulos** | `src/js/modules/` | Lógica de negocio e interacción de cada pantalla o herramienta transversal. |
| **Recursos** | `assets/images/` | Imágenes optimizadas fuera del HTML para mejorar rendimiento y mantenibilidad. |
