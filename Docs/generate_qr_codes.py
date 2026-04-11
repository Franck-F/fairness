"""
Génère les QR codes exigés par le syllabus Epitech (page 15) :
« Incluez des QR codes dans les annexes pour donner accès à des ressources
numériques telles que des vidéos de votre MVP, des démonstrations de
prototypage, et des captures d'écran de votre outil de gestion de projet
+ lien vers votre outil. »

Sortie : Docs/qr_codes/*.png
"""
from __future__ import annotations

from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_M

OUTPUT_DIR = Path(__file__).parent / "qr_codes"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

QR_SOURCES = {
    "qr_github_repo.png": (
        "Dépôt GitHub du projet AuditIQ",
        "https://github.com/Franck-F/fairness",
    ),
    "qr_demo_mvp.png": (
        "Démo en ligne du MVP AuditIQ",
        "https://fairness-eight.vercel.app/",
    ),
    "qr_sondage_forms.png": (
        "Questionnaire du sondage Microsoft Forms",
        "https://forms.office.com/Pages/AnalysisPage.aspx?AnalyzerToken=mpb4sGEh833qosb7vYT0mgSBsEhFAogo&id=yrQckGK4KUCTBuXND22fhguwfrtiJ9lCpVsQtTv76iVUOTRLUEFNTzJSUkdJWkdHMldUTlAyRlRNMi4u",
    ),
    "qr_gestion_projet.png": (
        "Suivi de projet (GitHub Projects et Issues)",
        "https://github.com/Franck-F/fairness/projects",
    ),
}


def generate(name: str, label: str, url: str) -> Path:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    path = OUTPUT_DIR / name
    img.save(path)
    print(f"  -> {name} : {label} ({url[:60]}...)")
    return path


def main() -> None:
    for filename, (label, url) in QR_SOURCES.items():
        generate(filename, label, url)
    print(f"\n{len(QR_SOURCES)} QR codes generes dans : {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
