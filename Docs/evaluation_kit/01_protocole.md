# Protocole d'évaluation utilisateur — AuditIQ MVP

Version 1.0 — Avril 2026
Responsable : Franck (Consulting Project, Epitech Digital School)

## 1. Contexte

Ce protocole encadre l'évaluation utilisateur du MVP AuditIQ, plateforme d'audit de fairness destinée aux PME françaises souhaitant se conformer à l'AI Act européen. Il vise à combler la faiblesse identifiée dans la section 4.3 du mémoire (« évaluation des résultats inadéquate », cf. syllabus Consulting Project p.6) en proposant un protocole reproductible, quantifié et traçable.

## 2. Définition opérationnelle de « facilement »

Conformément à l'introduction du mémoire, une PME peut « facilement » détecter les biais de ses algorithmes si un professionnel non spécialiste, disposant de compétences numériques de base, peut :

- effectuer un audit de fairness en quelques étapes,
- sans recourir à un prestataire externe,
- sans écrire une seule ligne de code,
- en un temps compatible avec ses contraintes opérationnelles (ici fixé à 10 minutes maximum pour un audit standard).

Cette définition est le critère de réussite ultime de l'évaluation.

## 3. Objectifs mesurables

| ID | Objectif | Indicateur | Cible |
|----|----------|------------|-------|
| O1 | Un non-tech réussit un audit autonome | Taux de complétion T1 | ≥ 80 % |
| O2 | L'audit tient dans l'enveloppe temporelle « quelques étapes » | Time-on-task T1 (médiane) | ≤ 10 min |
| O3 | La plateforme est perçue comme utilisable | Score SUS moyen | > 70 / 100 |
| O4 | AuditIQ réduit la friction par rapport à l'existant | Δ time-on-task (T1 vs T2) | ≥ 50 % |
| O5 | L'outil augmente la confiance perçue du testeur | Δ confiance auto-déclarée | ≥ +1 point Likert, p < 0,05 |
| O6 | L'outil est jugé adoptable | Probabilité d'utilisation ≥ 4/5 | ≥ 60 % des testeurs |

## 4. Hypothèses de recherche

- **H1** — Un utilisateur non-tech complète la tâche d'audit AuditIQ (T1) en moins de 10 minutes.
- **H2** — Le score SUS moyen de l'échantillon est supérieur à 70.
- **H3** — La confiance perçue dans sa capacité à détecter un biais augmente significativement entre le pré-test et le post-test (test de Wilcoxon apparié, α = 0,05).
- **H4** — Le taux de complétion global (toutes tâches confondues) est supérieur ou égal à 80 %.
- **H0** (hypothèse nulle générale) — Aucune différence significative n'existe entre AuditIQ et l'outil de référence (Fairlearn CLI) sur les métriques de temps et d'erreurs.

## 5. Profil des testeurs cibles

**Taille d'échantillon** : 6 à 8 testeurs. Ce volume est cohérent avec les recommandations de Nielsen (1993) selon lesquelles 5 testeurs permettent d'identifier environ 80 % des problèmes d'utilisabilité majeurs ; 6-8 ajoutent une marge pour l'analyse quantitative (SUS, Wilcoxon apparié).

**Critères d'inclusion** :

- Profession exercée dans une PME ou TPE française (2 à 250 salariés).
- Fonction non-technique : RH, marketing, direction, finance, opérations, juridique.
- Aucune formation formelle en data science ou en machine learning.
- Utilisation quotidienne d'outils numériques de bureautique (Excel, Google Workspace, Notion, CRM).
- Français langue de travail.

**Critères d'exclusion** :

- Développeurs, data scientists, ingénieurs IA.
- Personnes ayant déjà testé AuditIQ lors d'une session antérieure.

**Recrutement** : prioriser les répondants au sondage initial ayant manifesté un intérêt. Compléter via LinkedIn et le réseau Epitech si nécessaire. Diversifier par secteur (au moins 3 secteurs distincts) et par taille d'entreprise.

## 6. Méthodologie

Évaluation mixte (quantitative + qualitative), in situ ou en visioconférence, en individuel. Chaque session dure environ **45 minutes**.

**Techniques mobilisées** :

- **Think-aloud protocol** (Ericsson & Simon, 1993) : le testeur verbalise ses pensées pendant l'exécution.
- **Observation directe non intrusive** : Franck prend des notes dans la grille d'observation (fichier 06) sans intervenir sauf demande explicite.
- **Screen recording** : enregistrement vidéo et audio de la session via **Loom** (par défaut) ou **OBS Studio** (si le testeur refuse un outil cloud, pour respect RGPD). À valider avec le testeur dans le consentement.
- **Questionnaires pré et post** : auto-administrés en ligne (Tally ou Google Forms).
- **SUS standard** : passé immédiatement après la session pour maximiser la fraîcheur du ressenti.

**Contre-mesures anti-biais** :

- Ordre des tâches T1 et T2 contrebalancé (moitié commence par AuditIQ, moitié par Fairlearn) pour neutraliser l'effet d'apprentissage.
- Franck s'interdit toute formulation suggestive (« n'est-ce pas simple ? »).
- Les questionnaires sont remplis en l'absence de l'évaluateur (ou caméra coupée).

## 7. Tâches benchmark

Trois tâches, chacune bornée à 15 minutes maximum, avec un chronomètre visible pour Franck mais discret pour le testeur.

### Tâche 1 — Audit d'un dataset de recrutement avec AuditIQ

Le testeur reçoit un CSV de recrutement (voir fichier 09 : Adult Census Income sous-échantillonné à ~5000 lignes, renommé en `recrutement_test.csv`). Objectif : charger le fichier dans AuditIQ, lancer un audit de fairness sur la variable sensible `sex`, puis identifier et commenter le principal biais détecté.

### Tâche 2 — Même audit avec Fairlearn en ligne de commande

Le testeur reçoit un script Python pré-écrit `fairlearn_baseline.py` qu'il doit exécuter dans un terminal (Anaconda Prompt ou PowerShell), puis lire la sortie et identifier le biais. L'objectif est de mesurer la friction d'une solution technique existante pour un non-tech.

### Tâche 3 — Audit d'un chatbot fictif via le module LLM-audit d'AuditIQ

Le testeur lance le module LLM-audit sur un chatbot fictif fourni (prompts pré-enregistrés), interprète le rapport de biais généré et formule une recommandation de remédiation.

Le script précis de chaque tâche est consigné dans le fichier `03_script_taches.md`.

## 8. Métriques collectées

### 8.1 Quantitatives

| Métrique | Unité | Outil |
|----------|-------|-------|
| Time-on-task | secondes | chronomètre + vidéo |
| Taux de complétion | % (succès/total) | grille d'observation |
| Nombre d'erreurs | entier | grille d'observation |
| Nombre de demandes d'aide | entier | grille d'observation |
| Score SUS | /100 | questionnaire SUS |
| Confiance pré-test | Likert 1-5 | questionnaire pré |
| Confiance post-test | Likert 1-5 | questionnaire post |
| Probabilité d'utilisation | Likert 1-5 | questionnaire post |
| NPS adapté | -100 à +100 | questionnaire post |

### 8.2 Qualitatives

- Verbatims think-aloud classés par thème (navigation, terminologie, confiance, compréhension des résultats).
- Points de friction observés (hésitations > 10 s, clics erronés, retours arrière).
- Suggestions spontanées formulées pendant ou après la session.
- Expressions faciales notables (si caméra activée).

## 9. Plan d'analyse

1. **Statistiques descriptives** : moyenne, médiane, écart-type, min, max pour toutes les métriques quantitatives.
2. **Comparaison avant/après** : test de Wilcoxon apparié sur la confiance pré/post (Wilcoxon, 1945), car l'échantillon est petit et la distribution probablement non normale.
3. **Comparaison AuditIQ vs Fairlearn** : test de Wilcoxon apparié sur les time-on-task T1 et T2.
4. **Corrélation** : corrélation de Spearman entre profil (niveau numérique auto-déclaré) et score SUS.
5. **Analyse thématique** : codage ouvert des verbatims selon la méthode de Braun & Clarke (2006), regroupement en thèmes, fréquence par thème.
6. **Triangulation** : croisement systématique quantitatif/qualitatif pour éviter les conclusions hâtives.

Tous les calculs sont effectués dans un notebook Python (pandas, scipy.stats) versionné dans le dépôt du projet pour garantir la reproductibilité.

## 10. Calendrier d'exécution (2 semaines)

| Semaine | Jour | Action |
|---------|------|--------|
| S1 | L | Recrutement, envoi des consentements |
| S1 | M-M | Tests pilotes (1 testeur blanc pour valider le protocole) |
| S1 | J-V | Sessions 1 et 2 |
| S2 | L-M | Sessions 3, 4, 5 |
| S2 | M-J | Sessions 6, 7 (+ 8 si disponible) |
| S2 | V | Consolidation, analyse, rédaction des résultats dans le mémoire |

Le test pilote est **obligatoire** : il permet de détecter les défauts du protocole (formulations ambiguës, bugs techniques) avant d'engager les sessions réelles. Ses données ne seront **pas** incluses dans l'analyse finale.

## 11. Matériel requis

- Ordinateur portable Franck avec AuditIQ en local ou en préprod stable.
- Environnement Python avec Fairlearn installé, pré-testé.
- Dataset `recrutement_test.csv` prêt.
- Chatbot fictif pré-configuré.
- Loom (compte payant ou essai) ou OBS Studio.
- Questionnaires en ligne (Tally ou Google Forms) avec liens courts.
- Grille d'observation imprimée ou ouverte dans un second écran.
- Consentements signés (numérique ou papier).

## 12. Considérations éthiques et RGPD

- **Consentement éclairé** : signature obligatoire du formulaire (fichier 07) avant toute collecte.
- **Information préalable** : objectif, durée, nature des données collectées, droit de retrait sans justification.
- **Anonymisation** : chaque testeur reçoit un identifiant `T01`, `T02`, etc. Aucun nom n'apparaît dans les livrables.
- **Stockage** : vidéos et questionnaires chiffrés sur disque local + sauvegarde chiffrée (Cryptomator). Aucun stockage cloud non européen.
- **Conservation** : 6 mois maximum après soutenance du mémoire, puis suppression documentée.
- **Droit de retrait** : le testeur peut retirer ses données à tout moment, jusqu'à 15 jours après la soutenance, par simple email.
- **Absence de traitement de données sensibles réelles** : les datasets utilisés sont publics et anonymisés (Adult Census Income).

## 13. Risques et mitigation

| Risque | Probabilité | Mitigation |
|--------|-------------|------------|
| Bug AuditIQ pendant la session | Moyenne | Test pilote, environnement de secours |
| Testeur trop technique | Faible | Filtrage strict au recrutement |
| Effet d'apprentissage T1/T2 | Moyenne | Ordre contrebalancé |
| Testeur intimidé | Moyenne | Ton bienveillant, rappel qu'on teste l'outil, pas lui |
| Échantillon trop homogène | Moyenne | Quota par secteur |

## Références

- Brooke, J. (1996). *SUS: A quick and dirty usability scale*. Usability Evaluation in Industry.
- Nielsen, J. (1993). *Usability Engineering*. Academic Press.
- Ericsson, K. A., & Simon, H. A. (1993). *Protocol Analysis: Verbal Reports as Data*. MIT Press.
- Wilcoxon, F. (1945). Individual comparisons by ranking methods. *Biometrics Bulletin*, 1(6), 80-83.
- Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology*, 3(2), 77-101.
