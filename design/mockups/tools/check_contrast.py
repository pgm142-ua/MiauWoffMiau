"""Verificación automática de ratios de contraste WCAG 2.1 para las 3 direcciones."""


def rel_lum(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4))
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in (r, g, b)]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(c1: str, c2: str) -> float:
    l1, l2 = sorted((rel_lum(c1), rel_lum(c2)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


CHECKS = [
    # Dirección A — Cuaderno
    ("A Cuaderno", "Texto principal sobre papel", "#1F2A37", "#F6F1E7", 7.0),
    ("A Cuaderno", "Texto secundario sobre papel", "#47505C", "#F6F1E7", 4.5),
    ("A Cuaderno", "CTA blanco sobre terracota", "#FFFFFF", "#B54020", 4.5),
    ("A Cuaderno", "Eyebrow terracota sobre papel", "#B54020", "#F6F1E7", 4.5),
    ("A Cuaderno", "Eyebrow calma sobre papel", "#2E5D40", "#F6F1E7", 4.5),
    ("A Cuaderno", "Salir rápido papel sobre tinta", "#F6F1E7", "#1F2A37", 7.0),
    # Dirección B — Señalética
    ("B Señalética", "Texto principal sobre fondo", "#13204A", "#F2F4F8", 7.0),
    ("B Señalética", "Texto secundario sobre fondo", "#49536E", "#F2F4F8", 4.5),
    ("B Señalética", "Blanco sobre azul acción", "#FFFFFF", "#1D56E0", 4.5),
    ("B Señalética", "Azul acción sobre tinte azul", "#1D56E0", "#E6EEFF", 4.5),
    ("B Señalética", "Verde sobre tinte verde", "#0C6E4E", "#E2F4EC", 4.5),
    ("B Señalética", "Naranja sobre tinte naranja", "#9A480B", "#FDEBDD", 4.5),
    ("B Señalética", "Marino sobre amarillo CTA", "#13204A", "#FFC72C", 7.0),
    ("B Señalética", "Subtítulo claro sobre marino", "#B5C2EA", "#13204A", 7.0),
    ("B Señalética", "SOS blanco sobre rojo", "#FFFFFF", "#B82525", 4.5),
    # Dirección C — Calma
    ("C Calma", "Texto principal sobre fondo", "#25332D", "#EEF2EF", 7.0),
    ("C Calma", "Texto secundario sobre fondo", "#475650", "#EEF2EF", 4.5),
    ("C Calma", "Blanco sobre verde primario", "#FFFFFF", "#2F5C49", 7.0),
    ("C Calma", "Verde primario sobre blanco", "#2F5C49", "#FFFFFF", 7.0),
    # Alto contraste AAA (las 3)
    ("Alto Contraste", "Blanco sobre negro", "#FFFFFF", "#000000", 15.0),
    ("Alto Contraste", "Amarillo foco sobre negro", "#FFD400", "#000000", 12.0),
    ("Alto Contraste", "Negro sobre amarillo CTA", "#000000", "#FFD400", 12.0),
]

failed = 0
for group, name, fg, bg, minimum in CHECKS:
    ratio = contrast(fg, bg)
    grade = "AAA" if ratio >= 7.0 else ("AA" if ratio >= 4.5 else "FAIL")
    ok = ratio >= minimum
    if not ok:
        failed += 1
    mark = "OK" if ok else "FAIL"
    print(f"[{mark:4}] {group:14} | {name:32} | {fg}/{bg} = {ratio:5.2f}:1 ({grade})")

raise SystemExit(1 if failed else 0)
