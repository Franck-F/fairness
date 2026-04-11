"""
Templates sectoriels pre-configures pour les cas d'usage PME francais.

Chaque template fournit :
    - les metriques de fairness recommandees,
    - les attributs sensibles a auditer en priorite,
    - le cadre juridique (AI Act + droit francais),
    - les risques specifiques aux PME,
    - des recommandations operationnelles de mitigation.

Les contenus juridiques sont indicatifs. Les champs marques
`verification_recommended: True` doivent etre valides par un juriste.
"""

from typing import Any

from legal_fr import get_french_law_for_use_case


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

_TEMPLATES: dict[str, dict[str, Any]] = {
    "recrutement_pme_fr": {
        "name": "recrutement_pme_fr",
        "description": (
            "Modele ATS / tri automatique de CV pour PME francaise (RH, agences "
            "d'interim, cabinets de recrutement)."
        ),
        "recommended_metrics": [
            "Demographic Parity",
            "Equal Opportunity",
            "Regle des 4/5 (80% rule)",
        ],
        "sensitive_attributes_to_check": [
            "sexe",
            "age",
            "origine du nom (proxy ethnique)",
            "code postal (proxy socio-economique)",
            "situation de famille",
        ],
        "legal_framework": {
            "ai_act": [
                {
                    "article": "Annexe III - 4.a",
                    "objet": (
                        "Les systemes IA de recrutement sont classes a haut risque."
                    ),
                },
                {"article": "Art. 10", "objet": "Qualite des donnees d'entrainement."},
                {"article": "Art. 14", "objet": "Supervision humaine obligatoire."},
            ],
            "droit_francais": [
                {"code": "Code du travail", "reference": "L.1132-1"},
                {"code": "Code du travail", "reference": "L.1133-1"},
                {"code": "Code du travail", "reference": "L.1142-1"},
                {"code": "Code du travail", "reference": "L.1221-6"},
                {"code": "Code penal", "reference": "225-1 / 225-2"},
            ],
            "verification_recommended": False,
        },
        "pme_specific_risks": [
            (
                "Dataset historique biaise reflechissant les recrutements passes "
                "(sous-representation des femmes dans certains metiers techniques)."
            ),
            (
                "Proxies non intentionnels : noms, code postal, photo, nom de "
                "l'ecole pouvant reintroduire une discrimination indirecte."
            ),
            (
                "Absence de registre de decision et de voie de contestation, en "
                "infraction avec le RGPD art. 22."
            ),
            (
                "Testing possible par le Defenseur des droits ou un candidat "
                "ecarte : charge de la preuve allegee (loi de 2008)."
            ),
        ],
        "mitigation_recommendations": [
            {
                "action": (
                    "Anonymiser les CV en entree (nom, photo, adresse, date "
                    "de naissance) avant scoring."
                ),
                "difficulte": "faible",
                "impact": "eleve",
                "ressources": [
                    "Guide Defenseur des droits - CV anonyme",
                    "Methodologie HALDE",
                ],
            },
            {
                "action": (
                    "Maintenir systematiquement un humain dans la boucle pour "
                    "toute decision de rejet automatique."
                ),
                "difficulte": "faible",
                "impact": "eleve",
                "ressources": ["RGPD art. 22", "AI Act art. 14"],
            },
            {
                "action": (
                    "Auditer trimestriellement le taux de selection par sexe "
                    "et tranche d'age (regle des 4/5)."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["AuditIQ / Fairlearn"],
            },
            {
                "action": (
                    "Documenter la finalite du modele et les donnees utilisees "
                    "dans un registre RGPD dedie."
                ),
                "difficulte": "moyenne",
                "impact": "moyen",
                "ressources": ["CNIL - modele de registre"],
            },
        ],
    },
    "scoring_credit_fr": {
        "name": "scoring_credit_fr",
        "description": (
            "Modele de scoring credit pour neo-banques, fintechs et etablissements "
            "de credit a la consommation francais."
        ),
        "recommended_metrics": [
            "Equalized Odds",
            "Equal Opportunity",
            "Calibration by group",
        ],
        "sensitive_attributes_to_check": [
            "sexe",
            "age",
            "code postal",
            "statut familial",
            "nationalite (proxy)",
        ],
        "legal_framework": {
            "ai_act": [
                {
                    "article": "Annexe III - 5.b",
                    "objet": (
                        "Evaluation de solvabilite classee haut risque par l'AI Act."
                    ),
                },
                {"article": "Art. 9", "objet": "Gestion des risques du systeme."},
                {"article": "Art. 10", "objet": "Qualite des donnees."},
            ],
            "droit_francais": [
                {"code": "Code de la consommation", "reference": "L.312-16"},
                {"code": "Loi n°78-17", "reference": "Art. 22"},
                {"code": "RGPD", "reference": "Art. 22"},
                {"code": "Code penal", "reference": "225-1 / 225-2"},
            ],
            "regulateur_principal": "ACPR",
            "verification_recommended": True,
        },
        "pme_specific_risks": [
            (
                "Utilisation d'un code postal comme variable explicative pouvant "
                "constituer une discrimination indirecte (redlining)."
            ),
            (
                "Decision entierement automatisee sans information claire ni "
                "voie de recours pour l'emprunteur."
            ),
            (
                "Controle ACPR : exigences documentaires renforcees sur les "
                "modeles internes."
            ),
        ],
        "mitigation_recommendations": [
            {
                "action": (
                    "Retirer le code postal ou le remplacer par une variable "
                    "socio-economique agregee et justifiee."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["ACPR - bonnes pratiques modeles IA"],
            },
            {
                "action": (
                    "Mettre en place un processus de contestation humain "
                    "documente pour chaque refus."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["RGPD art. 22"],
            },
            {
                "action": (
                    "Verifier la calibration du score par groupe protege "
                    "(Equalized Odds)."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["AuditIQ / Fairlearn"],
            },
        ],
    },
    "assurance_tarification_fr": {
        "name": "assurance_tarification_fr",
        "description": (
            "Modele de tarification assurance IARD ou sante pour mutuelles et "
            "assureurs PME."
        ),
        "recommended_metrics": [
            "Demographic Parity",
            "Calibration by group",
            "Group fairness sur les primes",
        ],
        "sensitive_attributes_to_check": [
            "sexe (interdit en assurance auto depuis CJUE Test-Achats 2011)",
            "age",
            "lieu de residence",
            "etat de sante (donnee sensible RGPD)",
        ],
        "legal_framework": {
            "ai_act": [
                {
                    "article": "Annexe III - 5.c",
                    "objet": (
                        "Tarification en assurance vie et sante consideree "
                        "haut risque."
                    ),
                },
                {"article": "Art. 10", "objet": "Qualite des donnees."},
                {"article": "Art. 14", "objet": "Supervision humaine."},
            ],
            "droit_francais": [
                {
                    "code": "Code des assurances",
                    "reference": "Art. L.111-7",
                    "objet": (
                        "Interdiction de differences de prime et de prestations "
                        "fondees sur le sexe."
                    ),
                },
                {"code": "RGPD", "reference": "Art. 9 (donnees de sante)"},
                {"code": "Code penal", "reference": "225-1 / 225-2"},
            ],
            "regulateur_principal": "ACPR",
            "jurisprudence": "CJUE Test-Achats C-236/09 (1er mars 2011)",
            "verification_recommended": True,
        },
        "pme_specific_risks": [
            (
                "Utilisation implicite du sexe via un proxy (ex. profession, "
                "type de vehicule) reintroduisant une discrimination."
            ),
            (
                "Traitement de donnees de sante sans base legale RGPD art. 9 "
                "suffisante."
            ),
            (
                "Segmentation tarifaire geographique percue comme discriminante."
            ),
        ],
        "mitigation_recommendations": [
            {
                "action": (
                    "Auditer la correlation entre variables explicatives et sexe "
                    "pour detecter les proxies."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["ACPR", "AuditIQ"],
            },
            {
                "action": (
                    "Obtenir un consentement explicite et documenter la base "
                    "legale des donnees de sante traitees."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["CNIL - guide donnees de sante"],
            },
            {
                "action": (
                    "Mettre en place un comite de validation humaine des "
                    "modeles tarifaires avant mise en production."
                ),
                "difficulte": "elevee",
                "impact": "eleve",
                "ressources": ["AI Act art. 14"],
            },
        ],
    },
    "chatbot_service_client_fr": {
        "name": "chatbot_service_client_fr",
        "description": (
            "Chatbot de service client francais : qualite de service selon "
            "varietes linguistiques (francais standard / regional), vouvoiement, "
            "accents et langues minoritaires."
        ),
        "recommended_metrics": [
            "Qualite de service par groupe linguistique",
            "Taux de resolution par variete de francais",
            "Taux de rerouting humain par groupe",
        ],
        "sensitive_attributes_to_check": [
            "variete de francais (standard, regional, DOM-TOM)",
            "registre de langue (tutoiement / vouvoiement)",
            "accents et tournures orales",
            "langue (francais / autres langues UE)",
        ],
        "legal_framework": {
            "ai_act": [
                {
                    "article": "Art. 50",
                    "objet": (
                        "Obligation d'informer l'utilisateur qu'il interagit "
                        "avec un systeme d'IA."
                    ),
                },
                {"article": "Art. 14", "objet": "Supervision humaine."},
            ],
            "droit_francais": [
                {
                    "code": "Code de la consommation",
                    "reference": "L.121-1",
                    "objet": "Pratiques commerciales trompeuses.",
                },
                {"code": "Loi n°78-17", "reference": "Art. 48 (information)"},
                {
                    "code": "Referentiel CNIL chatbot",
                    "reference": "Recommandation 2024",
                    "verification_recommended": True,
                },
            ],
            "verification_recommended": True,
        },
        "pme_specific_risks": [
            (
                "Chatbot entraine principalement sur du francais standard : "
                "mauvaise comprehension des varietes regionales et DOM-TOM."
            ),
            (
                "Absence d'indication claire que l'utilisateur parle a une IA, "
                "en infraction avec AI Act art. 50."
            ),
            (
                "Rerouting humain systematiquement declenche pour certains "
                "groupes, creant une inegalite de service."
            ),
        ],
        "mitigation_recommendations": [
            {
                "action": (
                    "Afficher explicitement 'Vous discutez avec un assistant "
                    "virtuel' des le debut de la conversation."
                ),
                "difficulte": "faible",
                "impact": "eleve",
                "ressources": ["AI Act art. 50"],
            },
            {
                "action": (
                    "Tester le chatbot avec un jeu de donnees comportant "
                    "differentes varietes regionales et accents."
                ),
                "difficulte": "moyenne",
                "impact": "eleve",
                "ressources": ["AuditIQ", "Corpus ORFEO"],
            },
            {
                "action": (
                    "Offrir a tout moment une bascule vers un operateur humain."
                ),
                "difficulte": "faible",
                "impact": "eleve",
                "ressources": ["AI Act art. 14"],
            },
        ],
    },
}


# Alias des cas d'usage "legal_fr" vers les templates.
_USE_CASE_ALIASES: dict[str, str] = {
    "recrutement": "recrutement_pme_fr",
    "credit": "scoring_credit_fr",
    "assurance": "assurance_tarification_fr",
    "service_client": "chatbot_service_client_fr",
    "chatbot": "chatbot_service_client_fr",
}


def get_template(use_case: str) -> dict[str, Any]:
    """Retourne un template sectoriel enrichi du cadre juridique francais.

    Accepte soit le nom direct du template (`recrutement_pme_fr`), soit un
    alias court (`recrutement`, `credit`, `assurance`, `service_client`).
    """
    key = use_case.strip().lower()
    template_key = _USE_CASE_ALIASES.get(key, key)

    if template_key not in _TEMPLATES:
        return {
            "error": "Template inconnu",
            "use_case": use_case,
            "templates_disponibles": list_templates_names(),
        }

    template = dict(_TEMPLATES[template_key])

    # Enrichissement dynamique avec legal_fr (si alias reconnu).
    if key in _USE_CASE_ALIASES or template_key in _USE_CASE_ALIASES.values():
        legal_key = next(
            (
                alias
                for alias, name in _USE_CASE_ALIASES.items()
                if name == template_key
            ),
            None,
        )
        if legal_key:
            template["legal_fr_details"] = get_french_law_for_use_case(legal_key)

    return template


def list_templates() -> list[dict[str, Any]]:
    """Retourne la liste des templates disponibles (resume)."""
    return [
        {
            "name": t["name"],
            "description": t["description"],
            "recommended_metrics": t["recommended_metrics"],
            "sensitive_attributes_to_check": t["sensitive_attributes_to_check"],
        }
        for t in _TEMPLATES.values()
    ]


def list_templates_names() -> list[str]:
    """Liste les identifiants de templates disponibles."""
    return list(_TEMPLATES.keys())
