"""
Mise en conformité du mémoire avec les exigences du syllabus Epitech (page 15) :

1. Insertion des QR codes réels dans l'Annexe C (remplace le placeholder).
2. Tri alphabétique par auteur au sein de chaque sous-section bibliographique
   (le syllabus exige une bibliographie alphabétique ; le tri par catégorie
   thématique est conservé pour la lisibilité, avec note explicative).

Usage : python Docs/conformite_syllabus.py
Entrée : Docs/memoire_final_humanise.md (modifié EN PLACE après backup)
Sortie : Docs/memoire_final_humanise.md
Backup : Docs/memoire_final_humanise.md.bak
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "memoire_final_humanise.md"
BACKUP = ROOT / "memoire_final_humanise.md.bak"

# ─────────────────────────────────────────────────────────────────────────────
# 1. Insertion des QR codes en Annexe C
# ─────────────────────────────────────────────────────────────────────────────
QR_BLOCK = """**Annexe C : AuditIQ — Accès au MVP**

* **Dépôt GitHub :** [github.com/Franck-F/fairness](https://github.com/Franck-F/fairness)
* **Démo en ligne :** [fairness-eight.vercel.app](https://fairness-eight.vercel.app/)
* **Suivi de projet :** [github.com/Franck-F/fairness/projects](https://github.com/Franck-F/fairness/projects) (GitHub Projects et Issues)
* **Questionnaire du sondage :** [Microsoft Forms](https://forms.office.com/Pages/AnalysisPage.aspx?AnalyzerToken=mpb4sGEh833qosb7vYT0mgSBsEhFAogo&id=yrQckGK4KUCTBuXND22fhguwfrtiJ9lCpVsQtTv76iVUOTRLUEFNTzJSUkdJWkdHMldUTlAyRlRNMi4u)

**QR codes** *(scannez avec un smartphone pour accéder directement aux ressources)* :

| Dépôt GitHub | Démo MVP en ligne |
|:---:|:---:|
| ![QR Dépôt GitHub](qr_codes/qr_github_repo.png){ width=180px } | ![QR Démo MVP](qr_codes/qr_demo_mvp.png){ width=180px } |
| github.com/Franck-F/fairness | fairness-eight.vercel.app |

| Suivi de projet | Questionnaire sondage |
|:---:|:---:|
| ![QR Suivi projet](qr_codes/qr_gestion_projet.png){ width=180px } | ![QR Sondage](qr_codes/qr_sondage_forms.png){ width=180px } |
| GitHub Projects | Microsoft Forms |
"""

# Le placeholder à remplacer dans le markdown actuel
ANNEXE_C_PATTERN = re.compile(
    r"\*\*Annexe C : AuditIQ.*?(?=## \*\*Annexe D|\n## )",
    re.DOTALL,
)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Tri alphabétique de la bibliographie par sous-section
# ─────────────────────────────────────────────────────────────────────────────
def sort_bibliography(text: str) -> str:
    """
    Localise la section BIBLIOGRAPHIE et trie alphabétiquement chaque
    sous-section interne (## Textes réglementaires, ## Articles scientifiques,
    etc.) par auteur, en preservant la structure markdown.
    """
    bib_start = text.find("BIBLIOGRAPHIE", text.find("BIBLIOGRAPHIE") + 1)
    if bib_start == -1:
        return text
    annexes_start = text.find("# **ANNEXES**", bib_start)
    if annexes_start == -1:
        return text

    bib_section = text[bib_start:annexes_start]
    # Trouve les sous-sections h2
    sub_pattern = re.compile(r"(## \*\*[^\n]+\*\*\n)((?:(?!## \*\*).)+)", re.DOTALL)

    def sort_subsection(match: re.Match[str]) -> str:
        header = match.group(1)
        body = match.group(2)
        # Découpage par item (lignes commençant par * )
        items = re.findall(r"(\*\s[^\n]+(?:\n[^\n*#][^\n]*)*)", body)
        if not items:
            return match.group(0)

        def sort_key(item: str) -> str:
            cleaned = re.sub(r"^\*\s+", "", item).strip()
            cleaned = re.sub(r"^\*\*", "", cleaned)
            return cleaned.lower()

        items_sorted = sorted(items, key=sort_key)
        return header + "\n" + "\n".join(items_sorted) + "\n\n"

    new_bib = sub_pattern.sub(sort_subsection, bib_section)

    # Ajout d'une note explicative en début de bibliographie
    note = (
        "\n*Cette bibliographie est organisée par catégorie thématique pour "
        "faciliter la consultation, puis par ordre alphabétique d'auteur au "
        "sein de chaque sous-section, conformément à l'usage académique français.*\n\n"
    )
    if "Cette bibliographie est organisée" not in new_bib:
        new_bib = re.sub(
            r"(BIBLIOGRAPHIE\*\*\n)",
            r"\1" + note,
            new_bib,
            count=1,
        )

    return text[:bib_start] + new_bib + text[annexes_start:]


# ─────────────────────────────────────────────────────────────────────────────
# Pipeline
# ─────────────────────────────────────────────────────────────────────────────
def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source manquante : {SRC}")
    shutil.copy(SRC, BACKUP)
    print(f"Backup : {BACKUP.name}")

    text = SRC.read_text(encoding="utf-8")

    # Étape 1 : QR codes
    new_text, n = ANNEXE_C_PATTERN.subn(QR_BLOCK + "\n\n", text)
    if n == 0:
        print("AVERTISSEMENT : Annexe C non trouvee, QR codes non inseres")
    else:
        print(f"OK : Annexe C remplacee avec {n} bloc QR codes")

    # Étape 2 : Tri biblio
    new_text = sort_bibliography(new_text)
    print("OK : Bibliographie triee alphabetiquement par sous-section")

    SRC.write_text(new_text, encoding="utf-8")
    print(f"\nFichier mis a jour : {SRC.name}")
    print("Pour regenerer le DOCX : python Docs/finalize_memoire.py")


if __name__ == "__main__":
    main()
