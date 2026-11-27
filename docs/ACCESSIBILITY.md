# Guía de Accesibilidad e Inclusión — Contigo

**Contigo** está diseñado siguiendo pautas **WCAG 2.1 AA/AAA** y criterios de **accesibilidad cognitiva y sensorial** orientados a alumnado con TEA y diversidad funcional.

## Perfiles de apoyo integrados

| Perfil / Necesidad | Activación | Adaptaciones aplicadas |
| --- | --- | --- |
| **Visión / Baja visión** | Paso 0B (`1`) o Ajustes (`⚙️`) | Guía de voz automática (TTS), botón persistente `Escuchar / Parar` en la barra superior, incremento de tamaño de fuente (`16px` / `19px` / `22px`) y modo Alto Contraste (consolidados en Ajustes). |
| **Audición / Persona sorda** | Paso 0B (`2`) o Ajustes (`⚙️`) | Silencia la síntesis de voz y desvía los avisos a la franja visual superior (`#visual-alert-strip`). |
| **Sin habla / Comunicación alternativa** | Paso 0B (`3`) o Tablero CAA | Tablero CAA («Voz Prestada») con pictogramas que construyen frases habladas y enviables al docente o chat. |
| **Accesibilidad cognitiva / Lectura fácil** | Paso 0B (`4`) o Ajustes (`⚙️`) | Frases ultra cortas, interlineado ampliado (`1.8`) y mayor espaciado entre caracteres (`0.03em`). |
| **TEA / Regulación sensorial** | Paso 0B (`5`) o pestaña `🌿 Calma` | Desactivación total de animaciones y transiciones (`.still`), acceso inmediato al Rincón de Calma y pauta docente TEA. |
| **Accesibilidad motora** | Paso 0B (`6`) o Ajustes (`⚙️`) | Botones de mayor área táctil (`min-height: 50px` / `44px` en barra superior) y atajos numéricos de teclado (`1`–`6`). |

---

## Navegación por teclado y seguridad

- **`Tab` / `Shift + Tab`:** Recorrido lógico con indicador de foco de alto contraste (`4px solid #f59e0b`).
- **Enlace de salto:** `.skip-link` visible al recibir foco para saltar directamente a `#main-content`.
- **Atajos numéricos (`1`–`6`):** Seleccionan las opciones numeradas de la pantalla activa (desactivados automáticamente al escribir en campos de texto).
- **Tecla `Esc` (Salida Rápida):** Activa la pantalla neutra de *Apuntes de Matemáticas*, detiene voz/micrófono/IA, aplica `inert` al contenido subyacente y cambia el título de la pestaña.
- **Gestión de modales:** Al abrir un modal (`gear-modal`, `api-modal`, `safe-exit-screen`), `<header>`, `<main>` y `<footer>` pasan a `inert = true` y al cerrarlo se devuelve el foco al elemento disparador.

---

## Principio WAI-ARIA: HTML nativo primero

Todo el desarrollo de interfaz en **Contigo** aplica la **Primera Regla de WAI-ARIA**: implementar siempre los controles, estructuras y regiones interactivas con **elementos nativos de HTML5** siempre que exista un elemento estándar equivalente, reservando WAI-ARIA únicamente como refuerzo para estados o relaciones que HTML no expresa por sí solo.

- **Controles e hitos en HTML nativo:** usar `<button type="button">` para acciones y toggles, `<a href>` para enlaces de navegación, `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` y encabezados jerárquicos (`<h1>`–`<h3>`) para regiones de página, `<fieldset>` + `<legend>` + `<label for>` + `<input>` / `<select>` para formularios, y `<details>` / `<summary>` para bloques desplegables.
- **Uso de WAI-ARIA solo como refuerzo semántico:** emplear atributos como `aria-pressed` (tarjetas seleccionables o pausa), `aria-expanded`, `aria-current="page"`, `aria-live="polite"`, `aria-labelledby`, `aria-describedby`, `role="status"` y `role="alert"` sobre los elementos nativos correspondientes —o en patrones compuestos sin equivalente nativo estable como pestañas (`role="tablist"` / `role="tab"` sobre `<button>`).
- **Regla en revisión de código:** queda prohibido construir controles interactivos sobre `<div>` o `<span>` con `role="button"` y `tabindex="0"` artificiales cuando pueda usarse un elemento nativo HTML (`<button>`, `<a>`, `<input>`).

---

## Soporte multilingüe y direccionalidad

El selector de idioma (`#lang-select`) soporta 7 idiomas (`es`, `ca`, `en`, `fr`, `de`, `pt`, `ar`), ajustando tanto el atributo `lang` como la direccionalidad `dir="rtl"` para árabe y el idioma de síntesis de voz (`SpeechSynthesisUtterance.lang`).
