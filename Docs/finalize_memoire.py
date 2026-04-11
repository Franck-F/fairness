"""
Pipeline de finalisation du mémoire après humanisation par l'agent.

Étapes :
1. Lit Docs/memoire_final_humanise.md
2. Auto-link toutes les URLs résiduelles non markdown au format [url](url)
3. Délègue à add_footnotes.py pour ajouter les notes de bas de page
4. Génère le .docx final via pandoc

Usage : python Docs/finalize_memoire.py
Sortie : Docs/memoire_final.docx (écrasé)
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "memoire_final_humanise.md"
INTERMEDIATE = ROOT / "memoire_final_humanise_linked.md"
WITH_FOOTNOTES = ROOT / "memoire_final_humanise_footnotes.md"
DOCX = ROOT / "memoire_final.docx"


# Regex qui matche une URL http(s):// qui n'est PAS déjà dans un lien markdown
# (pas précédée de `(` ou `]` collés, pas dans une note de bas de page)
PLAIN_URL_RE = re.compile(
    r"(?<![(\[/=\"'])"           # pas après ( [ / = " '
    r"(https?://[^\s\)\]<>\"']+)"  # l'URL elle-même
)


def auto_link_urls(text: str) -> tuple[str, int]:
    """Convertit les URLs nues en liens markdown cliquables."""
    count = 0
    # Avant remplacement : exclure les lignes qui sont des définitions
    # de footnote `[^id]: ...` ou des images.
    lines = text.split("\n")
    out_lines: list[str] = []
    for line in lines:
        # On préserve les lignes qui sont des images, des targets HTML, ou
        # qui contiennent déjà uniquement des liens markdown bien formés.
        if line.lstrip().startswith(("!", "<", "```")):
            out_lines.append(line)
            continue

        def _replace(m: re.Match[str]) -> str:
            nonlocal count
            url = m.group(1)
            # Nettoyage des ponctuations finales courantes
            trailing = ""
            while url and url[-1] in ".,;:!?":
                trailing = url[-1] + trailing
                url = url[:-1]
            count += 1
            return f"[{url}]({url}){trailing}"

        out_lines.append(PLAIN_URL_RE.sub(_replace, line))

    return "\n".join(out_lines), count


def run_add_footnotes(input_path: Path, output_path: Path) -> int:
    """Délègue à add_footnotes.py adapté pour I/O explicite."""
    # On importe le module et on appelle ses fonctions directement
    sys.path.insert(0, str(ROOT))
    from add_footnotes import add_footnotes  # type: ignore

    text = input_path.read_text(encoding="utf-8")
    enriched, used = add_footnotes(text)
    output_path.write_text(enriched, encoding="utf-8")
    return len(used)


def run_pandoc(input_path: Path, output_path: Path) -> None:
    # --resource-path permet à pandoc de retrouver les images relatives
    # (qr_codes/*.png) référencées depuis le markdown.
    cmd = [
        "pandoc",
        str(input_path),
        "-o", str(output_path),
        "--toc",
        "--toc-depth=3",
        "--number-sections",
        "--resource-path=" + str(ROOT),
        "--metadata", "author=Franck F.",
        "--metadata", "lang=fr-FR",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("PANDOC STDERR:", result.stderr, file=sys.stderr)
        raise SystemExit("pandoc a échoué")
    if result.stderr.strip():
        for line in result.stderr.splitlines():
            if "[WARNING]" in line:
                print("WARN :", line)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source manquante : {SRC}")

    print(f"1/3 Auto-link des URLs dans {SRC.name}")
    text = SRC.read_text(encoding="utf-8")
    linked, n_urls = auto_link_urls(text)
    INTERMEDIATE.write_text(linked, encoding="utf-8")
    print(f"      -> {n_urls} URLs converties au format markdown")

    print("2/3 Ajout des notes de bas de page")
    n_notes = run_add_footnotes(INTERMEDIATE, WITH_FOOTNOTES)
    print(f"      -> {n_notes} notes ajoutées")

    print("3/3 Génération DOCX via pandoc")
    run_pandoc(WITH_FOOTNOTES, DOCX)
    size_kb = DOCX.stat().st_size // 1024
    print(f"      -> {DOCX.name} ({size_kb} K)")

    print("\nOK : pipeline complet.")
    print(f"     Lis le DOCX final ici : {DOCX}")


if __name__ == "__main__":
    main()
