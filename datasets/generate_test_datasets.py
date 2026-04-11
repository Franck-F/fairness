"""
Génère 5 datasets de test réalistes pour AuditIQ.

Chaque dataset injecte un biais contrôlé pour permettre la validation
des modules supervisé et non supervisé. Les données sont synthétiques
mais contextualisées sur des cas d'usage PME français.

Usage : python datasets/generate_test_datasets.py
Sortie : datasets/test/*.csv
"""
from __future__ import annotations

import csv
import os
import random
from pathlib import Path

random.seed(42)
OUTPUT_DIR = Path(__file__).parent / "test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _write_csv(filename: str, header: list[str], rows: list[list]) -> None:
    path = OUTPUT_DIR / filename
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
    print(f"  -> {path} ({len(rows)} lignes)")


# ─────────────────────────────────────────────────────────────────────────────
# 1. RECRUTEMENT — Tri de CV par un ATS biaisé (genre + origine du prénom)
# ─────────────────────────────────────────────────────────────────────────────
def generate_recrutement(n: int = 1000) -> None:
    print("Recrutement (ATS) :")
    prenoms_fr_h = ["Pierre", "Jean", "Lucas", "Hugo", "Antoine", "Théo", "Nicolas", "Maxime"]
    prenoms_fr_f = ["Marie", "Camille", "Léa", "Sophie", "Julie", "Manon", "Chloé", "Sarah"]
    prenoms_mg_h = ["Mohammed", "Karim", "Amine", "Youssef", "Mehdi", "Sofiane", "Nassim", "Yassine"]
    prenoms_mg_f = ["Fatima", "Aïcha", "Yasmine", "Leila", "Nadia", "Sarah", "Amira", "Samira"]
    diplomes = ["CAP", "Bac", "BTS", "Licence", "Master", "Ingénieur", "Doctorat"]
    diplome_score = {"CAP": 1, "Bac": 2, "BTS": 3, "Licence": 4, "Master": 5, "Ingénieur": 5, "Doctorat": 6}

    rows = []
    for i in range(n):
        groupe_genre = random.choice(["H", "F"])
        groupe_origine = random.choices(["fr", "mg"], weights=[0.7, 0.3])[0]
        if groupe_genre == "H":
            prenom = random.choice(prenoms_fr_h if groupe_origine == "fr" else prenoms_mg_h)
        else:
            prenom = random.choice(prenoms_fr_f if groupe_origine == "fr" else prenoms_mg_f)

        age = random.randint(22, 58)
        diplome = random.choices(diplomes, weights=[5, 10, 15, 25, 25, 15, 5])[0]
        annees_xp = max(0, age - 22 - random.randint(0, 5))
        nb_langues = random.choices([1, 2, 3, 4], weights=[20, 50, 25, 5])[0]
        certifications = random.randint(0, 6)
        ecole_top = 1 if random.random() < 0.18 else 0

        # Score "objectif" basé sur les vraies compétences
        score_objectif = (
            diplome_score[diplome] * 3
            + annees_xp * 0.4
            + nb_langues * 1.5
            + certifications * 0.8
            + ecole_top * 4
        )
        # Vérité terrain : embauche réelle (basée uniquement sur le score objectif)
        seuil = 18
        embauche_reelle = 1 if score_objectif > seuil else 0

        # Prédiction du modèle ATS BIAISÉ : pénalise femmes et prénoms maghrébins
        bias_factor = 1.0
        if groupe_genre == "F":
            bias_factor -= 0.15
        if groupe_origine == "mg":
            bias_factor -= 0.20
        score_modele = score_objectif * bias_factor + random.gauss(0, 1.5)
        prediction_ats = 1 if score_modele > seuil else 0

        rows.append([
            f"CAND{i+1:04d}", prenom, age, groupe_genre, diplome, annees_xp,
            nb_langues, certifications, ecole_top, embauche_reelle, prediction_ats,
        ])

    _write_csv(
        "01_recrutement_ats.csv",
        ["candidat_id", "prenom", "age", "genre", "diplome", "annees_experience",
         "nb_langues", "certifications", "ecole_top", "embauche_reelle", "prediction_ats"],
        rows,
    )


# ─────────────────────────────────────────────────────────────────────────────
# 2. CRÉDIT — Scoring néo-banque biaisé (code postal proxy, âge)
# ─────────────────────────────────────────────────────────────────────────────
def generate_credit(n: int = 1200) -> None:
    print("Crédit (scoring) :")
    # Codes postaux : zones "favorisées" vs "défavorisées"
    cp_favorables = ["75008", "75016", "92200", "92100", "78000", "69006", "13008"]
    cp_defavorables = ["93200", "93300", "95100", "59000", "13015", "13003", "69003"]

    rows = []
    for i in range(n):
        age = random.randint(21, 70)
        revenu_mensuel = max(800, int(random.gauss(2400, 900)))
        anciennete_emploi = max(0, random.randint(0, min(35, age - 20)))
        nb_enfants = random.choices([0, 1, 2, 3, 4], weights=[30, 25, 25, 15, 5])[0]
        proprietaire = 1 if random.random() < 0.4 and revenu_mensuel > 2000 else 0
        cp_groupe = random.choices(["favorable", "defavorable"], weights=[0.55, 0.45])[0]
        cp = random.choice(cp_favorables if cp_groupe == "favorable" else cp_defavorables)
        montant_demande = random.randint(500, 30000)

        # Score "objectif" basé sur la solvabilité réelle
        ratio_endettement = montant_demande / (revenu_mensuel * 12 + 1)
        score_obj = (
            (revenu_mensuel / 1000) * 2
            + anciennete_emploi * 0.3
            + proprietaire * 3
            - ratio_endettement * 10
            - nb_enfants * 0.5
        )
        # Vérité terrain : remboursé sans incident
        rembourse = 1 if score_obj + random.gauss(0, 1) > 4 else 0

        # Modèle BIAISÉ : pénalise CP défavorables et seniors (>55)
        bias = 0
        if cp_groupe == "defavorable":
            bias -= 2.5
        if age > 55:
            bias -= 1.5
        score_modele = score_obj + bias + random.gauss(0, 1)
        accord_credit = 1 if score_modele > 4 else 0

        rows.append([
            f"DOSS{i+1:04d}", age, revenu_mensuel, anciennete_emploi, nb_enfants,
            proprietaire, cp, montant_demande, rembourse, accord_credit,
        ])

    _write_csv(
        "02_credit_scoring.csv",
        ["dossier_id", "age", "revenu_mensuel", "anciennete_emploi", "nb_enfants",
         "proprietaire", "code_postal", "montant_demande", "rembourse", "accord_credit"],
        rows,
    )


# ─────────────────────────────────────────────────────────────────────────────
# 3. ASSURANCE — Tarification IARD biaisée
# ─────────────────────────────────────────────────────────────────────────────
def generate_assurance(n: int = 900) -> None:
    print("Assurance (tarification) :")
    departements = ["75", "92", "93", "94", "13", "69", "59", "06", "33", "44", "31", "67"]
    types_vehicule = ["citadine", "berline", "SUV", "utilitaire", "sportive"]

    rows = []
    for i in range(n):
        age = random.randint(18, 80)
        genre = random.choice(["H", "F"])
        annees_permis = max(0, min(age - 17, random.randint(0, 50)))
        bonus = max(0.5, min(2.5, 1.0 - random.random() * 0.5 + (random.random() - 0.5)))
        nb_sinistres_5ans = random.choices([0, 1, 2, 3, 4], weights=[55, 25, 12, 6, 2])[0]
        type_vehicule = random.choice(types_vehicule)
        departement = random.choice(departements)
        zone_urbaine = 1 if departement in ["75", "92", "93", "94", "13", "69"] else 0
        km_annuels = random.randint(3000, 35000)

        # Tarif "objectif" basé sur le risque réel
        tarif_obj = (
            500
            + nb_sinistres_5ans * 200
            + (max(0, 25 - age) * 30)  # jeunes conducteurs
            + (max(0, age - 70) * 20)  # seniors
            + zone_urbaine * 100
            + (km_annuels / 1000) * 15
            + (1.0 / (bonus + 0.1)) * 100
        )
        sinistre_a_venir = 1 if random.random() < (0.05 + nb_sinistres_5ans * 0.04) else 0

        # Modèle biaisé : surcharge les conductrices (illégal en assurance auto depuis CJUE 2011)
        # et les zones défavorisées (93, 95, 13, 59)
        bias = 0
        if genre == "F":
            bias += 80
        if departement in ["93", "59"]:
            bias += 120
        tarif_propose = tarif_obj + bias + random.gauss(0, 50)
        # Catégorie tarifaire : 0 = standard, 1 = surprime
        surprime = 1 if tarif_propose > tarif_obj + 50 else 0

        rows.append([
            f"POL{i+1:04d}", age, genre, annees_permis, round(bonus, 2),
            nb_sinistres_5ans, type_vehicule, departement, km_annuels,
            sinistre_a_venir, surprime, round(tarif_propose, 2),
        ])

    _write_csv(
        "03_assurance_tarification.csv",
        ["police_id", "age", "genre", "annees_permis", "bonus", "nb_sinistres_5ans",
         "type_vehicule", "departement", "km_annuels", "sinistre_a_venir",
         "surprime", "tarif_propose"],
        rows,
    )


# ─────────────────────────────────────────────────────────────────────────────
# 4. MARKETING — Scoring client biaisé
# ─────────────────────────────────────────────────────────────────────────────
def generate_marketing(n: int = 800) -> None:
    print("Marketing (scoring client) :")
    csp = ["ouvrier", "employe", "technicien", "cadre", "cadre_sup", "retraite", "etudiant"]
    csp_revenu = {"ouvrier": 1700, "employe": 1900, "technicien": 2400, "cadre": 3500,
                  "cadre_sup": 5500, "retraite": 1800, "etudiant": 800}

    rows = []
    for i in range(n):
        age = random.randint(18, 75)
        genre = random.choice(["H", "F"])
        csp_choisie = random.choice(csp)
        revenu_estime = csp_revenu[csp_choisie] + random.gauss(0, 400)
        anciennete_client = random.randint(0, 15)
        nb_achats_12m = random.randint(0, 24)
        panier_moyen = max(10, random.gauss(60, 30))
        ouverture_emails = round(random.random(), 2)
        urbain = random.choice([0, 1])

        # Vraie valeur client (LTV) : basée uniquement sur comportement
        ltv_obj = nb_achats_12m * panier_moyen * (1 + anciennete_client * 0.1) * (1 + ouverture_emails)
        cible_premium_reel = 1 if ltv_obj > 1500 else 0

        # Modèle BIAISÉ : surfavorise les CSP+ et hommes urbains
        score = nb_achats_12m * 5 + ouverture_emails * 20 + anciennete_client * 3
        if csp_choisie in ("cadre", "cadre_sup"):
            score += 25
        if genre == "H" and urbain:
            score += 10
        if csp_choisie in ("ouvrier", "employe", "etudiant"):
            score -= 15
        score += random.gauss(0, 5)
        cible_premium_modele = 1 if score > 60 else 0

        rows.append([
            f"CLI{i+1:04d}", age, genre, csp_choisie, round(revenu_estime, 0),
            anciennete_client, nb_achats_12m, round(panier_moyen, 2),
            ouverture_emails, urbain, cible_premium_reel, cible_premium_modele,
        ])

    _write_csv(
        "04_marketing_scoring.csv",
        ["client_id", "age", "genre", "csp", "revenu_estime", "anciennete_client",
         "nb_achats_12m", "panier_moyen", "ouverture_emails", "urbain",
         "cible_premium_reel", "cible_premium_modele"],
        rows,
    )


# ─────────────────────────────────────────────────────────────────────────────
# 5. CONTRÔLE — Dataset propre, sans biais (pour valider absence de faux positifs)
# ─────────────────────────────────────────────────────────────────────────────
def generate_controle(n: int = 600) -> None:
    print("Contrôle (sans biais) :")
    rows = []
    for i in range(n):
        age = random.randint(20, 65)
        genre = random.choice(["H", "F"])
        groupe_a = random.choice(["A", "B", "C", "D"])
        feature1 = random.gauss(50, 15)
        feature2 = random.gauss(100, 30)
        feature3 = random.randint(0, 10)
        feature4 = random.choice(["X", "Y", "Z"])

        # Score basé UNIQUEMENT sur les features non protégées + bruit
        score = feature1 * 0.3 + feature2 * 0.05 + feature3 * 2 + random.gauss(0, 3)
        verite = 1 if score > 25 else 0
        # Modèle non biaisé : reproduit la vérité avec un peu de bruit
        prediction = 1 if score + random.gauss(0, 2) > 25 else 0

        rows.append([
            f"OBS{i+1:04d}", age, genre, groupe_a, round(feature1, 2),
            round(feature2, 2), feature3, feature4, verite, prediction,
        ])

    _write_csv(
        "05_controle_sans_biais.csv",
        ["obs_id", "age", "genre", "groupe", "feature1", "feature2",
         "feature3", "feature4", "verite", "prediction"],
        rows,
    )


if __name__ == "__main__":
    generate_recrutement()
    generate_credit()
    generate_assurance()
    generate_marketing()
    generate_controle()
    print("\nDatasets generes dans :", OUTPUT_DIR)
