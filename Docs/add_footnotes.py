"""
Ajoute des notes de bas de page (footnotes pandoc) au mémoire fusionné
en remplaçant la première occurrence de chaque terme technique du glossaire
par un appel de note.

Usage : python Docs/add_footnotes.py
Entrée : Docs/memoire_final.md
Sortie : Docs/memoire_final_footnotes.md
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "memoire_final.md"
OUT = ROOT / "memoire_final_footnotes.md"

# Glossaire ordonné : terme exact à chercher → définition courte.
# L'ordre détermine la priorité : les termes plus longs et spécifiques d'abord.
GLOSSARY: list[tuple[str, str]] = [
    # Concepts fondamentaux
    ("Demographic Parity", "Métrique de fairness exigeant que la proportion de résultats positifs soit identique entre tous les groupes démographiques, indépendamment des qualifications individuelles."),
    ("Equal Opportunity", "Métrique de fairness exigeant que les individus qui méritent un résultat positif aient la même probabilité d'être correctement identifiés, quel que soit leur groupe d'appartenance."),
    ("Equalized Odds", "Métrique de fairness exigeant l'égalité des taux de vrais positifs ET de faux positifs entre groupes. La plus exigeante mathématiquement."),
    ("règle des quatre cinquièmes", "Critère pragmatique issu du droit du travail américain selon lequel le taux de sélection du groupe le moins favorisé ne doit pas être inférieur à 80 % de celui du groupe le plus favorisé."),
    ("préjudices d'allocation", "Préjudices subis lorsqu'un système d'IA refuse ou accorde de manière inéquitable des opportunités, ressources ou informations."),
    ("préjudices de qualité de service", "Préjudices subis lorsqu'un système d'IA fonctionne moins bien pour certains groupes que pour d'autres, même s'ils y ont théoriquement accès."),
    ("concept drift", "Phénomène par lequel les performances d'un modèle se dégradent dans le temps parce que la distribution des données réelles évolue."),
    ("biais algorithmique", "Écart systématique de traitement entre groupes produit par un algorithme, souvent sans intention explicite de discrimination."),
    ("machine learning", "Sous-domaine de l'intelligence artificielle où un système apprend des patterns à partir de données plutôt que d'être programmé explicitement."),
    ("fairness", "Champ visant à mesurer et corriger les écarts injustifiés de traitement produits par un algorithme entre différents groupes démographiques. Le terme français équivalent serait « équité algorithmique »."),

    # Outils et frameworks
    ("Fairlearn", "Bibliothèque Python open source maintenue sous l'égide de Microsoft et de la Linux Foundation, permettant d'évaluer et de corriger les biais des modèles de machine learning via une API compatible Scikit-learn."),
    ("AIF360", "Bibliothèque Python open source d'IBM Research proposant plus de 70 métriques de fairness et 10 algorithmes de mitigation des biais."),
    ("LangBiTe", "Plateforme open source développée par l'Universitat Oberta de Catalunya et l'Université du Luxembourg pour tester les biais des grands modèles de langage via des banques de prompts paired."),
    ("Algorithm Audit", "Association néerlandaise développant un outil de détection non supervisée des biais, reconnue par l'OCDE dans son Catalogue of Tools for Trustworthy AI."),
    ("MetricFrame", "Classe centrale de Fairlearn qui permet de désagréger n'importe quelle métrique de performance par groupe démographique."),
    ("Scikit-learn", "Bibliothèque Python de référence pour le machine learning classique : régression, classification, clustering, prétraitement."),
    ("KMeans", "Algorithme de clustering non supervisé qui regroupe les observations en k clusters en minimisant la variance intra-cluster."),
    ("test du Khi-deux", "Test statistique d'indépendance entre deux variables catégorielles, utilisé dans AuditIQ pour vérifier si la répartition des prédictions varie significativement entre clusters."),

    # Acronymes
    ("MVP", "Minimum Viable Product. Version initiale d'un produit avec le minimum de fonctionnalités nécessaires pour valider l'hypothèse de valeur auprès des premiers utilisateurs."),
    ("ATS", "Applicant Tracking System. Logiciel utilisé par les recruteurs pour automatiser le tri des candidatures, souvent à base de filtres et de scoring algorithmique."),
    ("LLM", "Large Language Model. Modèle de langage de grande taille capable de générer du texte en langage naturel à partir de prompts."),
    ("SaaS", "Software as a Service. Modèle de distribution logicielle où l'application est hébergée par le fournisseur et accessible via internet."),
    ("API", "Application Programming Interface. Interface permettant à deux logiciels de communiquer via un protocole standardisé."),
    ("JWT", "JSON Web Token. Standard de jeton d'authentification sécurisé utilisé pour les sessions web."),
    ("EDA", "Exploratory Data Analysis. Analyse exploratoire de données préalable à toute modélisation, visant à comprendre les distributions, corrélations et anomalies."),

    # Cadre réglementaire
    ("AI Act", "Règlement UE 2024/1689 sur l'intelligence artificielle, adopté en mars 2024, premier cadre juridique mondial dédié à la régulation de l'IA, fondé sur une approche par les risques."),
    ("RGPD", "Règlement Général sur la Protection des Données. Règlement européen 2016/679 sur la protection des données personnelles, en vigueur depuis mai 2018."),
    ("CNIL", "Commission Nationale de l'Informatique et des Libertés. Autorité française chargée de veiller au respect du RGPD et de la loi Informatique et Libertés."),
    ("ACPR", "Autorité de Contrôle Prudentiel et de Résolution. Superviseur français des secteurs bancaire et assurantiel."),
    ("Défenseur des droits", "Autorité administrative indépendante française chargée de défendre les droits et libertés, notamment contre les discriminations."),
    ("bac à sable réglementaire", "Cadre juridique expérimental permettant aux entreprises de tester de nouvelles solutions sous la supervision d'une autorité, en bénéficiant d'allègements temporaires."),
    ("discrimination directe", "Différence de traitement explicitement fondée sur un critère protégé : genre, origine, religion, etc."),
    ("discrimination indirecte", "Pratique apparemment neutre qui produit en réalité un désavantage disproportionné pour un groupe protégé."),
    ("PME", "Petite et Moyenne Entreprise. Au sens européen : moins de 250 salariés et chiffre d'affaires annuel inférieur à 50 millions d'euros."),

    # Méthodologie
    ("Design Thinking", "Approche de conception centrée utilisateur, popularisée par la d.school de Stanford et IDEO, articulée autour de cinq phases : empathie, définition, idéation, prototypage, test."),
    ("approche mixte", "Méthode de recherche combinant un volet quantitatif (mesurable, statistique) et un volet qualitatif (en profondeur, contextuel)."),
    ("entretien semi-directif", "Technique d'enquête qualitative structurée autour d'un guide de questions, mais laissant à l'interviewé la latitude d'approfondir certains points."),
    ("analyse thématique", "Méthode d'analyse qualitative consistant à coder les transcriptions et à regrouper les codes en thèmes émergents, formalisée par Braun et Clarke (2006)."),
    ("SUS", "System Usability Scale. Questionnaire standardisé de Brooke (1996) en 10 items mesurant l'utilisabilité perçue d'un système, score sur 100. Au-dessus de 70 : bon. Au-dessus de 85 : excellent."),

    # Stack technique
    ("Next.js", "Framework JavaScript React pour le développement d'applications web avec rendu hybride serveur et client."),
    ("FastAPI", "Framework Python moderne pour construire des API web performantes et auto-documentées."),
    ("PostgreSQL", "Système de gestion de base de données relationnelle open source."),
    ("Supabase", "Plateforme open source offrant base de données PostgreSQL managée, authentification, et stockage, présentée comme alternative à Firebase."),
    ("Tailwind CSS", "Framework CSS utilitaire permettant de styler des interfaces directement via des classes courtes."),
    ("Shadcn/UI", "Bibliothèque de composants React accessibles, construite sur Radix UI et stylée avec Tailwind."),
    ("Bcrypt", "Algorithme de hachage cryptographique conçu pour stocker des mots de passe de manière sécurisée."),
    ("Docker", "Technologie de conteneurisation permettant d'encapsuler une application et ses dépendances dans un environnement reproductible."),
]


def slugify(term: str, idx: int) -> str:
    """Crée un identifiant unique pour la footnote à partir du terme."""
    slug = re.sub(r"[^a-z0-9]+", "-", term.lower()).strip("-")
    return f"{slug}-{idx}"


def add_footnotes(text: str) -> tuple[str, list[tuple[str, str]]]:
    """
    Pour chaque terme du glossaire, insère un appel de note pandoc à sa
    PREMIÈRE occurrence dans le texte. Renvoie le texte modifié et la
    liste (id, définition) des notes ajoutées.
    """
    used: list[tuple[str, str]] = []
    for idx, (term, definition) in enumerate(GLOSSARY, start=1):
        # Échapper les caractères regex spéciaux dans le terme
        escaped = re.escape(term)
        # Match insensible à la casse, en veillant à ne pas match au milieu
        # d'un autre mot. \b ne fonctionne pas toujours bien avec les
        # caractères français, on utilise donc une lookaround souple.
        pattern = re.compile(rf"(?<![\wÀ-ÿ]){escaped}(?![\wÀ-ÿ])", re.IGNORECASE)

        # On exclut les zones de footnote déjà ajoutées (pas de doublon)
        # et on s'arrête à la première occurrence
        match = pattern.search(text)
        if not match:
            continue

        note_id = slugify(term, idx)
        # Ne pas ajouter la note si on est dans un titre markdown ou un bloc
        # de figure (ligne commençant par #, > ou _).
        line_start = text.rfind("\n", 0, match.start()) + 1
        line = text[line_start:text.find("\n", match.end())] if "\n" in text[line_start:] else text[line_start:]
        if line.lstrip().startswith(("#", ">", "[^", "|")):
            continue

        # Insérer l'appel de note immédiatement après le terme
        before = text[:match.end()]
        after = text[match.end():]
        text = f"{before}[^{note_id}]{after}"
        used.append((note_id, definition))

    # Ajout du bloc de définitions à la fin du document
    if used:
        text += "\n\n---\n\n## Notes\n\n"
        for note_id, definition in used:
            text += f"[^{note_id}]: {definition}\n\n"

    return text, used


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source introuvable : {SRC}")
    text = SRC.read_text(encoding="utf-8")
    enriched, used = add_footnotes(text)
    OUT.write_text(enriched, encoding="utf-8")
    print(f"OK : {OUT.name}")
    print(f"Notes de bas de page ajoutees : {len(used)}/{len(GLOSSARY)}")
    print("Termes notes :", ", ".join(t[0] for t in used[:10]), "..." if len(used) > 10 else "")


if __name__ == "__main__":
    main()
