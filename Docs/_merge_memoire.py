"""Merge memoire.md + memoire_refonte_sections.md into memoire_final.md, then call pandoc."""
import re
import subprocess
from pathlib import Path

DOCS = Path(r"C:/Users/Franck/Downloads/Fairness/Docs")
src = (DOCS / "memoire.md").read_text(encoding="utf-8").splitlines(keepends=False)
refonte = (DOCS / "memoire_refonte_sections.md").read_text(encoding="utf-8").splitlines(keepends=False)


def extract_between(lines, start_marker, end_marker):
    """Return lines strictly between start_marker line and end_marker line (exclusive of both)."""
    out = []
    in_block = False
    for ln in lines:
        if not in_block:
            if ln.strip() == start_marker:
                in_block = True
            continue
        if ln.strip() == end_marker:
            break
        out.append(ln)
    # trim leading/trailing blank lines
    while out and not out[0].strip():
        out.pop(0)
    while out and not out[-1].strip():
        out.pop()
    return out


# --- Extract refonte sections ---
# Section A: from "## A — Nouvelle INTRODUCTION" until next "---"
section_A = extract_between(refonte, "## A — Nouvelle INTRODUCTION", "---")

# Section B: between "## B — Section 2.3.5 — Synthèse : la triple lacune" and "---"
section_B = extract_between(refonte, "## B — Section 2.3.5 — Synthèse : la triple lacune", "---")

# Section C: between "## C — Section 4.2 — Développement du MVP : AuditIQ (réécrite)" and "---"
section_C = extract_between(refonte, "## C — Section 4.2 — Développement du MVP : AuditIQ (réécrite)", "---")

# Section D: between "## D — Section 4.3 — Évaluation du prototype (réécrite)" and "---"
section_D = extract_between(refonte, "## D — Section 4.3 — Évaluation du prototype (réécrite)", "---")

# Section E: between "## E — Section 5.1 — Synthèse rééquilibrée" and "---"
section_E = extract_between(refonte, "## E — Section 5.1 — Synthèse rééquilibrée", "---")

# Section F: between "## F — Section 5.3.3 — Pour les recherches futures" and EOF
section_F = []
in_f = False
for ln in refonte:
    if not in_f:
        if ln.strip() == "## F — Section 5.3.3 — Pour les recherches futures":
            in_f = True
        continue
    if ln.strip() == "---":
        break
    section_F.append(ln)
while section_F and not section_F[0].strip():
    section_F.pop(0)
while section_F and not section_F[-1].strip():
    section_F.pop()

print(f"A intro lines: {len(section_A)}")
print(f"B 2.3.5 lines: {len(section_B)}")
print(f"C 4.2 lines: {len(section_C)}")
print(f"D 4.3 lines: {len(section_D)}")
print(f"E 5.1 lines: {len(section_E)}")
print(f"F 5.3.3 lines: {len(section_F)}")

# --- Now splice into memoire.md ---
# Line indices are 1-based in our earlier reads. Convert.
# Intro: replace lines 230..254 (1-based) -> python index 229..254 (exclusive 254)
# Keep header "# **INTRODUCTION**" then new body
# Section A from refonte does NOT include a header line, it starts with body text.
# Add header "# INTRODUCTION" explicitly.

new = []
# Lines 1..229 (pre-intro) -> python 0..229
new.extend(src[0:229])
# Insert new INTRODUCTION
new.append("# **INTRODUCTION**")
new.append("")
new.extend(section_A)
new.append("")
# Lines 255..495 (Partie 1, 2.1-2.3.4) -> python 255..495 (exclusive 495). We want through line 495 which is a blank line before ## 2.4
# Actually line 496 is "## **2.4 Conclusion...". So preserved range = lines 256..495 -> python indices 255..495 (exclusive 495)
new.extend(src[255:495])
# Insert section B (2.3.5) before 2.4
new.append("")
new.extend(section_B)
new.append("")
# Line 496 onwards (2.4) until 4.2 replacement. 4.2 starts at line 704. Preserve 496..703 -> python 495..703
new.extend(src[495:703])
# Insert section C (4.2)
new.extend(section_C)
new.append("")
# 4.3 starts at line 816. Preserve 704..815 was replaced; next preserved content is ## 4.4 at line 840. 4.3 range replaced = 816..839. So after 4.2 replacement, next preserved = line 840 onwards -> python 839..
# But wait: we need to also include nothing between 4.2 end (line 815) and 4.3 start (line 816). The refonte C replaces the whole 4.2 block from line 704 through line 815. Then insert D (replaces 4.3). Then resume at line 840.
new.extend(section_D)
new.append("")
# Preserve lines 840..849 (## 4.4 through # PARTIE 5) -> python 839..849
new.extend(src[839:849])
# Insert section E (5.1) which replaces lines 850..861. Resume at line 862 (## 5.2)
new.extend(section_E)
new.append("")
# Preserve 862..915 (5.2, 5.3, 5.3.1, 5.3.2) -> python 861..915
new.extend(src[861:915])
# Insert section F (5.3.3) which replaces lines 916..925. Resume at 926 (## 5.4)
new.extend(section_F)
new.append("")
# Preserve lines 926..end -> python 925..end
new.extend(src[925:])

# Write out
out_md = DOCS / "memoire_final.md"
out_md.write_text("\n".join(new) + "\n", encoding="utf-8")

# Word count
text = out_md.read_text(encoding="utf-8")
words = len(re.findall(r"\b\w+\b", text))
print(f"Total words in merged doc: {words}")
print(f"Total lines: {len(new)}")
print(f"Wrote: {out_md}")
