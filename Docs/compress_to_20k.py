"""
Compresse le mémoire de ~28 800 mots à ~20 000 mots par réduction
proportionnelle des paragraphes longs.

Stratégie : pour chaque paragraphe de plus de 60 mots qui n'est PAS protégé
(figure, citation, chiffre clé, titre, bibliographie, annexe), on retire
les phrases du milieu en gardant la première et la dernière phrase.

Le ratio de coupe est ajusté dynamiquement pour atteindre ~20 000 mots.

Usage : python Docs/compress_to_20k.py
Entrée : Docs/memoire_final_humanise.md.bak (28 807 mots)
Sortie : Docs/memoire_final_humanise.md (écrasé)
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "memoire_final_humanise.md.bak"
OUT = ROOT / "memoire_final_humanise.md"
TARGET_WORDS = 20000
MIN_WORDS = 19800
MAX_WORDS = 20500

# Patterns qui protègent un paragraphe de la coupe
PROTECTED_PATTERNS = [
    r"^\s*#",           # titres markdown
    r"^\s*\|",          # tableaux markdown
    r"^\s*>",           # blockquotes (figures)
    r"^\s*\*\s+\*\*",   # items de liste en gras (biblio)
    r"^\s*-\s",         # listes à puces
    r"^\s*\*\s",        # listes à puces
    r"\[FIGURE",        # blocs figure
    r"\[\^",            # footnotes
    r"^\s*!\[",         # images
    r"^\s*```",         # code blocks
    r"---",             # séparateurs
    r"\\newpage",       # sauts de page
]

# Chiffres clés qui protègent un paragraphe
PROTECTED_CONTENT = [
    "38,2", "44,1", "35,3", "17,6", "20,6", "23,5", "26,5", "29,4",
    "82 %", "85 %", "5,9", "11,8", "14,9", "32,4",
    "n=34", "34 professionnels", "34 répondants",
    "Buolamwini", "Chouldechova", "Kleinberg", "Mehrabi", "Wachter",
    "Bertrand", "Mullainathan", "Braun", "Clarke", "Creswell", "Brooke",
    "Nielsen", "Algorithm Audit", "LangBiTe",
    "L.1132-1", "L.1133-1", "L.1142-1", "L.1221-6",
    "article 5", "article 9", "article 10", "article 11",
    "article 14", "article 15", "article 50", "article 57",
]


def is_protected(paragraph: str) -> bool:
    for pat in PROTECTED_PATTERNS:
        if re.search(pat, paragraph):
            return True
    for content in PROTECTED_CONTENT:
        if content.lower() in paragraph.lower():
            return True
    return False


def count_words(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def split_sentences(text: str) -> list[str]:
    """Découpe un texte en phrases. Heuristique simple mais efficace."""
    # Split sur . ? ! suivi d'un espace et majuscule, ou fin de texte
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-ZÀÉÈÊËÎÏÔÙÛÜÇ])", text)
    return [s.strip() for s in sentences if s.strip()]


def compress_paragraph(paragraph: str, ratio: float) -> str:
    """Retire des phrases du milieu d'un paragraphe pour le réduire."""
    sentences = split_sentences(paragraph)
    if len(sentences) <= 2:
        return paragraph  # pas assez de phrases pour couper

    n_to_keep = max(2, int(len(sentences) * (1 - ratio)))
    if n_to_keep >= len(sentences):
        return paragraph

    # Garder la première et la dernière, et quelques intermédiaires bien réparties
    if n_to_keep == 2:
        kept = [sentences[0], sentences[-1]]
    else:
        # Garder first, last, et les intermédiaires uniformément réparties
        middle_count = n_to_keep - 2
        middle_indices = []
        step = (len(sentences) - 2) / (middle_count + 1)
        for i in range(middle_count):
            idx = int(1 + step * (i + 1))
            idx = min(idx, len(sentences) - 2)
            if idx not in middle_indices:
                middle_indices.append(idx)
        kept = [sentences[0]]
        for idx in sorted(middle_indices):
            kept.append(sentences[idx])
        kept.append(sentences[-1])

    return " ".join(kept)


def find_annexes_start(text: str) -> int:
    m = re.search(r"^#\s+\*?\*?ANNEXES", text, re.MULTILINE)
    return m.start() if m else len(text)


def find_biblio_start(text: str) -> int:
    # Deuxième occurrence de BIBLIOGRAPHIE (après le sommaire)
    first = text.find("BIBLIOGRAPHIE")
    if first == -1:
        return len(text)
    second = text.find("BIBLIOGRAPHIE", first + 1)
    return second if second > 0 else first


def compress_to_target(text: str, target: int) -> str:
    """Compresse le corps du texte pour atteindre le nombre de mots cible."""
    biblio_start = find_biblio_start(text)
    annexes_start = find_annexes_start(text)
    protected_start = min(biblio_start, annexes_start)

    body = text[:protected_start]
    tail = text[protected_start:]  # biblio + annexes = intouchables

    current_words = count_words(body)
    words_to_cut = current_words - target + count_words(tail)
    # On ne coupe que le body, pas le tail
    body_target = target - count_words(tail)

    print(f"  Corps: {current_words} mots")
    print(f"  Queue (biblio+annexes): {count_words(tail)} mots")
    print(f"  Cible corps: {body_target} mots")
    print(f"  A couper: {current_words - body_target} mots")

    # Split en paragraphes
    paragraphs = body.split("\n\n")

    # Identifier les paragraphes compressibles
    compressible_indices = []
    compressible_words = 0
    for i, p in enumerate(paragraphs):
        word_count = count_words(p)
        if word_count > 50 and not is_protected(p):
            compressible_indices.append(i)
            compressible_words += word_count

    print(f"  Paragraphes compressibles: {len(compressible_indices)} ({compressible_words} mots)")

    # Calculer le ratio de coupe nécessaire
    needed_cut = current_words - body_target
    if compressible_words == 0:
        print("  AVERTISSEMENT: aucun paragraphe compressible!")
        return text

    ratio = min(0.65, needed_cut / compressible_words)
    print(f"  Ratio de coupe par paragraphe: {ratio:.1%}")

    # Appliquer la compression
    for i in compressible_indices:
        paragraphs[i] = compress_paragraph(paragraphs[i], ratio)

    new_body = "\n\n".join(paragraphs)
    result = new_body + tail

    actual = count_words(new_body)
    print(f"  Resultat corps: {actual} mots")

    return result


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source manquante: {SRC}")

    text = SRC.read_text(encoding="utf-8")
    total_before = count_words(text)
    print(f"Avant: {total_before} mots total")

    result = compress_to_target(text, TARGET_WORDS)

    # Vérification
    m = re.search(r"^#\s+\*?\*?ANNEXES", result, re.MULTILINE)
    body = result[:m.start()] if m else result
    body_words = count_words(body)
    total_after = count_words(result)

    print(f"\nApres: {total_after} mots total, {body_words} mots corps")
    print(f"Reduction: {total_before - total_after} mots ({(total_before - total_after) / total_before:.0%})")

    if MIN_WORDS <= body_words <= MAX_WORDS:
        print(f"CONFORME: {body_words} dans la cible [{MIN_WORDS}-{MAX_WORDS}]")
    elif body_words > MAX_WORDS:
        print(f"ENCORE TROP LONG: {body_words} > {MAX_WORDS}, relance avec ratio plus fort")
    else:
        print(f"TROP COURT: {body_words} < {MIN_WORDS}")

    OUT.write_text(result, encoding="utf-8")
    print(f"\nEcrit: {OUT.name}")


if __name__ == "__main__":
    main()
