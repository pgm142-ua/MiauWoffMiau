"""Compila los mockups (inyecta el sprite SVG) y genera capturas PNG con Chrome headless.

Uso:  python design/mockups/tools/build.py
"""
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PNG = ROOT / "png"
PNG.mkdir(exist_ok=True)

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]
chrome = next((c for c in CHROME_CANDIDATES if pathlib.Path(c).exists()), None)

sprite = (SRC / "sprite.svg").read_text(encoding="utf-8")
SCREENS = ["home", "sup", "feel", "feel-hc", "caa", "calm"]
only = sys.argv[1:]

for page in sorted(SRC.glob("*.html")):
    if only and not any(o in page.stem for o in only):
        continue
    out = ROOT / page.name
    out.write_text(page.read_text(encoding="utf-8").replace("<!--SPRITE-->", sprite), encoding="utf-8")
    print("built", out.name)
    if not chrome:
        continue
    for s in SCREENS:
        target = PNG / f"{page.stem}-{s}.png"
        subprocess.run([
            chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1", "--window-size=1280,800",
            "--virtual-time-budget=6000", f"--screenshot={target}",
            out.as_uri() + f"?s={s}",
        ], check=True, capture_output=True)
        print("  ", target.name)
