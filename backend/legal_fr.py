"""
Ancrage juridique francais pour AuditIQ.

Ce module centralise les references de droit francais et europeen applicables
aux audits de fairness d'algorithmes IA, afin d'outiller les rapports et
recommandations produits pour des PME francaises dans le cadre de l'AI Act.

AVERTISSEMENT : les references juridiques ci-dessous sont fournies a titre
informatif. Les champs marques `verification_recommended: True` doivent etre
valides par un juriste avant diffusion officielle.
"""

from typing import Any


# ---------------------------------------------------------------------------
# Dictionnaire central des references juridiques francaises
# ---------------------------------------------------------------------------

FRENCH_LEGAL_REFERENCES: dict[str, dict[str, Any]] = {
    "discrimination_generale": {
        "description": (
            "Cadre general d'interdiction des discriminations en droit francais."
        ),
        "articles": [
            {
                "code": "Code penal",
                "reference": "Art. 225-1",
                "objet": (
                    "Definition de la discrimination (liste des 25 criteres proteges "
                    "dont origine, sexe, age, situation de famille, apparence physique, "
                    "etat de sante, handicap, opinions, etc.)."
                ),
                "verification_recommended": False,
            },
            {
                "code": "Code penal",
                "reference": "Art. 225-2",
                "objet": (
                    "Sanctions penales de la discrimination (refus de service, "
                    "entrave a une activite economique, refus d'embauche, etc.)."
                ),
                "verification_recommended": False,
            },
            {
                "code": "Loi n°2008-496 du 27 mai 2008",
                "reference": "Art. 1 a 4",
                "objet": (
                    "Transposition des directives europeennes anti-discrimination : "
                    "definit discrimination directe, indirecte, harcelement, et "
                    "introduit la notion d'amenagement de la charge de la preuve."
                ),
                "verification_recommended": False,
            },
        ],
    },
    "recrutement_emploi": {
        "description": (
            "Cadre applicable aux outils algorithmiques de recrutement, tri de CV "
            "et gestion RH."
        ),
        "articles": [
            {
                "code": "Code du travail",
                "reference": "L.1132-1",
                "objet": (
                    "Interdiction generale de discrimination dans l'acces a l'emploi, "
                    "la formation, la remuneration, la promotion."
                ),
                "verification_recommended": False,
            },
            {
                "code": "Code du travail",
                "reference": "L.1133-1",
                "objet": (
                    "Differences de traitement admises si objectives, necessaires et "
                    "proportionnees (exigence professionnelle essentielle)."
                ),
                "verification_recommended": False,
            },
            {
                "code": "Code du travail",
                "reference": "L.1142-1",
                "objet": (
                    "Egalite professionnelle entre femmes et hommes ; interdiction "
                    "de mentionner le sexe ou la situation de famille dans une offre."
                ),
                "verification_recommended": False,
            },
            {
                "code": "Code du travail",
                "reference": "L.1221-6",
                "objet": (
                    "Les informations demandees a un candidat doivent avoir un lien "
                    "direct et necessaire avec l'emploi propose ou l'evaluation "
                    "des aptitudes professionnelles."
                ),
                "verification_recommended": False,
            },
        ],
    },
    "credit_services_financiers": {
        "description": (
            "Cadre applicable au scoring credit, a l'octroi de prets et aux "
            "decisions automatisees sur les services financiers."
        ),
        "articles": [
            {
                "code": "Loi n°78-17 (Informatique et Libertes)",
                "reference": "Art. 22",
                "objet": (
                    "Droit de la personne a ne pas faire l'objet d'une decision "
                    "entierement automatisee produisant des effets juridiques ou "
                    "l'affectant de maniere significative."
                ),
                "verification_recommended": False,
            },
            {
                "code": "RGPD",
                "reference": "Art. 22",
                "objet": (
                    "Encadrement europeen des decisions individuelles automatisees "
                    "incluant le profilage ; obligation d'information, droit "
                    "d'obtenir une intervention humaine et de contester la decision."
                ),
                "verification_recommended": False,
            },
            {
                "code": "Code de la consommation",
                "reference": "L.312-16",
                "objet": (
                    "Obligation pour le preteur d'evaluer la solvabilite de "
                    "l'emprunteur avant l'octroi d'un credit a la consommation."
                ),
                "verification_recommended": True,
            },
        ],
    },
    "regulateurs_competents": {
        "description": "Autorites francaises competentes selon le domaine d'usage.",
        "autorites": [
            {
                "nom": "CNIL",
                "perimetre": (
                    "Donnees personnelles, profilage, decisions automatisees, "
                    "conformite RGPD et Loi Informatique et Libertes."
                ),
                "url": "https://www.cnil.fr",
            },
            {
                "nom": "Defenseur des droits",
                "perimetre": (
                    "Discrimination et acces aux droits ; publie des decisions "
                    "et recommandations sur les biais algorithmiques."
                ),
                "url": "https://www.defenseurdesdroits.fr",
            },
            {
                "nom": "ACPR",
                "perimetre": (
                    "Supervision du secteur bancaire et assurantiel ; controle "
                    "des modeles de scoring credit et de tarification."
                ),
                "url": "https://acpr.banque-france.fr",
            },
            {
                "nom": "AMF",
                "perimetre": (
                    "Services d'investissement, conseils financiers automatises "
                    "(robo-advisors)."
                ),
                "url": "https://www.amf-france.org",
            },
            {
                "nom": "DGCCRF",
                "perimetre": (
                    "Protection du consommateur, pratiques commerciales trompeuses, "
                    "personnalisation algorithmique des prix."
                ),
                "url": "https://www.economie.gouv.fr/dgccrf",
            },
        ],
    },
}


# ---------------------------------------------------------------------------
# Cas d'usage PME -> articles applicables
# ---------------------------------------------------------------------------

_USE_CASE_TO_REFERENCES: dict[str, dict[str, Any]] = {
    "recrutement": {
        "use_case": "recrutement",
        "libelle": "Recrutement et tri de candidatures",
        "categories": ["discrimination_generale", "recrutement_emploi"],
        "ai_act_articles": [5, 10, 14, 15],
        "regulateurs": ["CNIL", "Defenseur des droits"],
    },
    "credit": {
        "use_case": "credit",
        "libelle": "Scoring de credit et decisions automatisees",
        "categories": ["discrimination_generale", "credit_services_financiers"],
        "ai_act_articles": [5, 9, 10, 14],
        "regulateurs": ["CNIL", "ACPR"],
    },
    "assurance": {
        "use_case": "assurance",
        "libelle": "Tarification et souscription en assurance",
        "categories": ["discrimination_generale", "credit_services_financiers"],
        "ai_act_articles": [9, 10, 14],
        "regulateurs": ["ACPR", "CNIL"],
    },
    "marketing": {
        "use_case": "marketing",
        "libelle": "Personnalisation marketing et ciblage publicitaire",
        "categories": ["discrimination_generale"],
        "ai_act_articles": [5, 50],
        "regulateurs": ["CNIL", "DGCCRF"],
    },
    "service_client": {
        "use_case": "service_client",
        "libelle": "Chatbots et assistants de service client",
        "categories": ["discrimination_generale"],
        "ai_act_articles": [50, 14],
        "regulateurs": ["CNIL", "DGCCRF"],
    },
}


def get_french_law_for_use_case(use_case: str) -> dict[str, Any]:
    """Retourne les articles de droit francais applicables a un cas d'usage.

    Args:
        use_case: identifiant parmi `recrutement`, `credit`, `assurance`,
            `marketing`, `service_client`.

    Returns:
        Dictionnaire contenant les categories juridiques, les articles
        detailles et les regulateurs competents.
    """
    key = use_case.strip().lower()
    if key not in _USE_CASE_TO_REFERENCES:
        return {
            "use_case": use_case,
            "error": "Cas d'usage inconnu",
            "cas_disponibles": sorted(_USE_CASE_TO_REFERENCES.keys()),
        }

    meta = _USE_CASE_TO_REFERENCES[key]
    articles: list[dict[str, Any]] = []
    for cat in meta["categories"]:
        cat_data = FRENCH_LEGAL_REFERENCES.get(cat, {})
        for art in cat_data.get("articles", []):
            articles.append({**art, "categorie": cat})

    autorites = [
        a
        for a in FRENCH_LEGAL_REFERENCES["regulateurs_competents"]["autorites"]
        if a["nom"] in meta["regulateurs"]
    ]

    return {
        "use_case": meta["use_case"],
        "libelle": meta["libelle"],
        "articles_francais": articles,
        "ai_act_articles_associes": meta["ai_act_articles"],
        "regulateurs_competents": autorites,
        "verification_recommended": any(
            a.get("verification_recommended") for a in articles
        ),
    }


# ---------------------------------------------------------------------------
# Guides CNIL et positions publiques
# ---------------------------------------------------------------------------


def get_cnil_guidance() -> list[dict[str, Any]]:
    """Retourne la liste des guides et prises de position publiques pertinents.

    Les dates et intitules doivent etre verifies avant publication officielle
    (`verification_recommended: True`).
    """
    return [
        {
            "titre": "Guide IA de la CNIL",
            "annee": 2024,
            "url": "https://www.cnil.fr/fr/intelligence-artificielle",
            "objet": (
                "Recommandations pratiques pour concevoir des systemes d'IA "
                "conformes au RGPD (base legale, minimisation, information)."
            ),
            "verification_recommended": False,
        },
        {
            "titre": (
                "Recommandation CNIL sur les algorithmes et systemes d'aide a "
                "la decision"
            ),
            "annee": 2023,
            "url": "https://www.cnil.fr/fr/intelligence-artificielle",
            "objet": (
                "Principes d'explicabilite, d'intervention humaine et de "
                "documentation applicables aux decisions algorithmiques."
            ),
            "verification_recommended": True,
        },
        {
            "titre": (
                "Defenseur des droits - Algorithmes : prevenir l'automatisation "
                "des discriminations"
            ),
            "annee": 2020,
            "url": (
                "https://www.defenseurdesdroits.fr/rapport-algorithmes-prevenir-"
                "lautomatisation-des-discriminations"
            ),
            "objet": (
                "Position officielle sur les biais algorithmiques et les "
                "obligations des acteurs publics et prives."
            ),
            "verification_recommended": True,
        },
    ]


# ---------------------------------------------------------------------------
# Mapping AI Act -> droit francais
# ---------------------------------------------------------------------------

_AI_ACT_MAPPING: dict[int, dict[str, Any]] = {
    5: {
        "ai_act_objet": "Pratiques d'IA interdites (manipulation, notation sociale).",
        "articles_francais": [
            ("Code penal", "225-1 / 225-2"),
            ("Loi n°2008-496", "Art. 1 a 4"),
        ],
        "commentaire": (
            "Les pratiques interdites par l'AI Act recoupent les interdictions "
            "penales francaises de discrimination."
        ),
    },
    9: {
        "ai_act_objet": "Systeme de gestion des risques.",
        "articles_francais": [
            ("Code monetaire et financier", "Obligations ACPR - gestion des risques modeles"),
        ],
        "commentaire": (
            "Pour le secteur bancaire/assurantiel, la supervision ACPR s'ajoute "
            "aux exigences de l'AI Act."
        ),
        "verification_recommended": True,
    },
    10: {
        "ai_act_objet": "Qualite et gouvernance des donnees d'entrainement.",
        "articles_francais": [
            ("RGPD", "Art. 5 (minimisation, exactitude)"),
            ("Loi n°78-17", "Art. 4"),
        ],
        "commentaire": (
            "Les exigences AI Act sur la qualite des donnees s'articulent avec "
            "les principes RGPD de minimisation et d'exactitude."
        ),
    },
    11: {
        "ai_act_objet": "Documentation technique.",
        "articles_francais": [
            ("RGPD", "Art. 30 (registre des traitements)"),
        ],
        "commentaire": (
            "La documentation AI Act peut reutiliser le registre des traitements "
            "RGPD existant."
        ),
    },
    14: {
        "ai_act_objet": "Supervision humaine.",
        "articles_francais": [
            ("RGPD", "Art. 22"),
            ("Loi n°78-17", "Art. 22"),
        ],
        "commentaire": (
            "L'exigence de supervision humaine rejoint le droit a une "
            "intervention humaine sur les decisions automatisees."
        ),
    },
    15: {
        "ai_act_objet": "Exactitude, robustesse et cybersecurite.",
        "articles_francais": [
            ("Code penal", "323-1 et s. (atteintes aux STAD)"),
            ("Loi n°78-17", "Art. 121 (securite des donnees)"),
        ],
        "commentaire": (
            "Les exigences de robustesse croisent les obligations de securite "
            "des traitements de donnees personnelles."
        ),
        "verification_recommended": True,
    },
    50: {
        "ai_act_objet": (
            "Obligations de transparence (chatbots, contenus generes, deepfakes)."
        ),
        "articles_francais": [
            ("Code de la consommation", "L.121-1 (pratiques commerciales trompeuses)"),
            ("Loi n°78-17", "Art. 48 (information des personnes)"),
        ],
        "commentaire": (
            "L'obligation de signaler qu'un utilisateur interagit avec une IA "
            "complete l'interdiction des pratiques trompeuses."
        ),
        "verification_recommended": True,
    },
}


def map_ai_act_article_to_french_law(article_number: int) -> dict[str, Any]:
    """Retourne les articles francais correspondant a un article AI Act.

    Args:
        article_number: numero de l'article AI Act (5, 9, 10, 11, 14, 15, 50).

    Returns:
        Dictionnaire decrivant l'objet de l'article AI Act et les articles
        francais correspondants.
    """
    if article_number not in _AI_ACT_MAPPING:
        return {
            "article_ai_act": article_number,
            "error": "Article AI Act non cartographie dans AuditIQ",
            "articles_disponibles": sorted(_AI_ACT_MAPPING.keys()),
        }

    data = _AI_ACT_MAPPING[article_number]
    return {
        "article_ai_act": article_number,
        "ai_act_objet": data["ai_act_objet"],
        "articles_francais": [
            {"code": code, "reference": ref} for code, ref in data["articles_francais"]
        ],
        "commentaire": data["commentaire"],
        "verification_recommended": data.get("verification_recommended", False),
    }
