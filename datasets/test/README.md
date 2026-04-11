# Datasets de test AuditIQ

Datasets synthétiques générés pour tester les modules d'AuditIQ. Chaque
fichier injecte un biais contrôlé pour valider que les modules supervisé
et non supervisé détectent correctement les disparités, et inclut un
contrôle sans biais pour vérifier l'absence de faux positifs.

**Régénération** : `python datasets/generate_test_datasets.py` depuis la
racine du projet. Seed fixée à 42 pour reproductibilité.

---

## 01_recrutement_ats.csv (1000 lignes)

**Cas d'usage** : tri de CV par un outil ATS (cabinet de recrutement PME).

**Colonnes** : `candidat_id, prenom, age, genre, diplome, annees_experience, nb_langues, certifications, ecole_top, embauche_reelle, prediction_ats`

**Biais injecté** :
- Pénalité de 15 % sur les candidates féminines
- Pénalité de 20 % sur les prénoms à consonance maghrébine

**Configuration recommandée pour audit supervisé** :
- Colonne cible : `embauche_reelle`
- Colonne prédiction : `prediction_ats`
- Attributs sensibles : `genre` (et créer un attribut dérivé sur le `prenom` pour tester la discrimination indirecte)

**Configuration recommandée pour audit non supervisé** :
- Colonne prédiction : `prediction_ats`
- Valeur favorable : 1
- Features : toutes sauf `candidat_id`, `prenom`, `embauche_reelle`

---

## 02_credit_scoring.csv (1200 lignes)

**Cas d'usage** : scoring crédit néo-banque / fintech.

**Colonnes** : `dossier_id, age, revenu_mensuel, anciennete_emploi, nb_enfants, proprietaire, code_postal, montant_demande, rembourse, accord_credit`

**Biais injecté** :
- Pénalité forte sur les codes postaux "défavorisés" (proxy géographique du redlining : 93200, 93300, 95100, 59000, 13015, 13003, 69003)
- Pénalité sur les seniors (>55 ans)

**Configuration audit supervisé** :
- Cible : `rembourse`
- Prédiction : `accord_credit`
- Attributs sensibles : `age` (binner en tranches), `code_postal` (binner par groupe favorable/défavorable)

**Cadre réglementaire** : RGPD art. 22, Code de la consommation L.312-16, AI Act annexe III, supervision ACPR.

---

## 03_assurance_tarification.csv (900 lignes)

**Cas d'usage** : tarification IARD automobile.

**Colonnes** : `police_id, age, genre, annees_permis, bonus, nb_sinistres_5ans, type_vehicule, departement, km_annuels, sinistre_a_venir, surprime, tarif_propose`

**Biais injecté** :
- Surprime sur les conductrices (illégal en France depuis CJUE Test-Achats 2011, applicable au 21 décembre 2012)
- Surprime sur certains départements (93, 59) comme proxy géographique

**Configuration audit supervisé** :
- Cible : `sinistre_a_venir`
- Prédiction : `surprime`
- Attributs sensibles : `genre`, `departement`

**Cadre réglementaire** : Code des assurances, supervision ACPR, AI Act annexe III, jurisprudence CJUE C-236/09.

---

## 04_marketing_scoring.csv (800 lignes)

**Cas d'usage** : segmentation client pour ciblage marketing premium.

**Colonnes** : `client_id, age, genre, csp, revenu_estime, anciennete_client, nb_achats_12m, panier_moyen, ouverture_emails, urbain, cible_premium_reel, cible_premium_modele`

**Biais injecté** :
- Bonus pour les CSP+ (cadre, cadre supérieur)
- Bonus pour les hommes urbains
- Malus pour les CSP- (ouvriers, employés, étudiants)

**Configuration audit supervisé** :
- Cible : `cible_premium_reel`
- Prédiction : `cible_premium_modele`
- Attributs sensibles : `genre`, `csp`, `urbain`

**Note** : ce cas d'usage est plus subtil car la CSP n'est pas un attribut protégé directement, mais elle peut servir de proxy. Permet de tester la détection de discrimination indirecte.

---

## 05_controle_sans_biais.csv (600 lignes)

**Cas d'usage** : dataset de contrôle, sans biais injecté.

**Colonnes** : `obs_id, age, genre, groupe, feature1, feature2, feature3, feature4, verite, prediction`

**Objectif** : vérifier que l'outil ne produit PAS de faux positifs sur des données neutres. Le modèle reproduit la vérité avec un bruit gaussien indépendant de tout attribut démographique.

**Test attendu** :
- Audit supervisé : feux verts sur tous les attributs
- Audit non supervisé : Khi-deux non significatif (p > 0.05) ou disparité < seuil

Si l'un des deux modules signale du rouge sur ce dataset, c'est un bug à investiguer.

---

## Comment utiliser ces datasets dans les sessions d'évaluation

Le protocole d'évaluation utilisateur (`Docs/evaluation_kit/01_protocole.md`)
référence le dataset Adult Census Income comme dataset principal. Ces 5
datasets synthétiques sont complémentaires et peuvent être utilisés :

- Pour les tests de développement et de régression du backend
- Comme exemples concrets dans les démos de soutenance (notamment `01_recrutement_ats.csv` qui illustre parfaitement la triple interface — biais évident, contexte familier, lien direct au Code du travail L.1132-1)
- Comme données d'entrée pour les captures d'écran du mémoire (figures 12-14)
- Pour valider que l'outil détecte correctement chaque catégorie de biais

**Pour la démo de soutenance** : recommandation d'utiliser `01_recrutement_ats.csv` parce qu'il combine deux types de biais (genre + origine), parle immédiatement à un jury non technique, et le résultat est spectaculaire visuellement.
