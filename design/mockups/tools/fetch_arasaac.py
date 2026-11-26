"""Descarga pictogramas ARASAAC (CC BY-NC-SA, Gobierno de Aragón) para los mockups."""
import json
import pathlib
import urllib.parse
import urllib.request

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "arasaac"
OUT.mkdir(parents=True, exist_ok=True)

TERMS = {
    "yo": "yo",
    "companero": "compañero",
    "grupo": "grupo",
    "profesor": "profesor",
    "reirse": "reírse de",
    "solo": "solo",
    "empujar": "empujar",
    "miedo": "miedo",
    "triste": "triste",
    "bloqueado": "nervioso",
    "patio": "patio",
    "pasillo": "pasillo",
    "clase": "clase",
    "ayuda": "ayuda",
    "privado": "secreto",
    "calma": "tranquilo",
    "contento": "contento",
    "enfadado": "enfadado",
}

result = {}
for key, term in TERMS.items():
    url = "https://api.arasaac.org/v1/pictograms/es/search/" + urllib.parse.quote(term)
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.load(r)
        pid = data[0]["_id"]
        img = f"https://static.arasaac.org/pictograms/{pid}/{pid}_300.png"
        urllib.request.urlretrieve(img, OUT / f"{key}.png")
        result[key] = pid
        print(key, term, pid)
    except Exception as e:  # noqa: BLE001
        print("FAIL", key, term, e)

(OUT / "ids.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
