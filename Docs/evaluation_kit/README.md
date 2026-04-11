# Kit d'évaluation utilisateur — AuditIQ

Ce dossier contient tout le nécessaire pour exécuter, seul, une évaluation utilisateur rigoureuse du MVP AuditIQ, dans le cadre du mémoire Consulting Project (Epitech Digital School, 2025-2026).

Cible : 6 à 8 testeurs non-techniques issus de PME/TPE françaises, sur 2 semaines.

## Index des fichiers

| # | Fichier | Rôle |
|---|---------|------|
| 1 | `01_protocole.md` | Document de référence : objectifs, hypothèses, méthodologie, calendrier, éthique |
| 2 | `02_questionnaire_pre_test.md` | Questionnaire profil + niveau initial (avant session) |
| 3 | `03_script_taches.md` | Script exact des 3 tâches benchmark |
| 4 | `04_questionnaire_sus.md` | SUS standard FR + formule de calcul |
| 5 | `05_questionnaire_post_test.md` | Questionnaire post-session (confiance, intention, NPS, ouvertes) |
| 6 | `06_grille_observation.md` | Grille à remplir en direct par Franck |
| 7 | `07_modele_consentement.md` | Consentement éclairé RGPD |
| 8 | `08_analyse_template.md` | Template à remplir après collecte pour alimenter la section 4.3 du mémoire |
| 9 | `09_dataset_test.md` | Préparation du dataset `recrutement_test.csv` + script Fairlearn baseline |

## Ordre d'utilisation

### Phase 0 — Préparation (1 à 2 jours avant)

1. Lire **`01_protocole.md`** intégralement.
2. Préparer le dataset en suivant **`09_dataset_test.md`** (générer `recrutement_test.csv`, tester `fairlearn_baseline.py`).
3. Créer les versions en ligne des questionnaires 2, 4 et 5 (Tally ou Google Forms). Générer des liens courts.
4. Préparer 8 exemplaires du consentement **`07_modele_consentement.md`** (PDF signable).
5. Installer et tester l'outil d'enregistrement (Loom recommandé, OBS en secours).
6. Exécuter un **test pilote** avec un proche non-tech pour valider le protocole. **Obligatoire**.

### Phase 1 — Recrutement (J-7 à J-1)

- Identifier 6 à 8 profils (voir critères dans 01, section 5).
- Envoyer une invitation avec la description de l'étude (durée, objectif, consentement joint).
- Planifier les créneaux (45 min chacun + 15 min de battement).

### Phase 2 — Session type (~45 min par testeur)

| Étape | Durée | Fichier support |
|-------|-------|-----------------|
| Accueil, rappel du cadre, signature consentement | 5 min | 07 |
| Questionnaire pré-test | 5 min | 02 |
| Lecture du préambule, démarrage enregistrement | 2 min | 03 |
| Tâche 1 (ou T2 selon contrebalancement) | jusqu'à 15 min | 03 |
| Tâche 2 (ou T1) | jusqu'à 15 min | 03 |
| Tâche 3 — LLM-audit | jusqu'à 15 min | 03 |
| SUS (seul) | 3 min | 04 |
| Questionnaire post-test (seul) | 5 min | 05 |
| Débriefing libre | 5 min | — |

Franck remplit **`06_grille_observation.md`** en continu pendant toute la session.

Note : les tâches sont bornées à 15 min chacune mais l'ordre d'enchaînement fait que la session tient en 45 min si le testeur reste dans les médianes attendues. Prévoir un créneau de 1 h pour absorber les débordements.

### Phase 3 — Analyse (S2 vendredi)

1. Saisir les données dans **`08_analyse_template.md`**.
2. Calculer les scores SUS (formule fichier 04).
3. Lancer le notebook d'analyse Python (Wilcoxon, Spearman, descriptifs).
4. Coder les verbatims par thèmes.
5. Rédiger la section 4.3 du mémoire à partir du template.

## Check-list express pour chaque session

- [ ] Consentement signé avant tout enregistrement
- [ ] Ordre des tâches noté (contrebalance)
- [ ] Enregistrement Loom/OBS lancé et vérifié
- [ ] Chronomètre lancé au début de chaque tâche
- [ ] Grille d'observation ouverte et mise à jour en direct
- [ ] Franck ne parle pas pendant le think-aloud (sauf demande)
- [ ] Franck quitte la pièce / coupe caméra pendant SUS + post-test
- [ ] Sauvegarde immédiate des fichiers dans le dossier `sessions/T0X/`
- [ ] Synthèse à chaud remplie dans les 15 min qui suivent

## Arborescence conseillée

```
Docs/evaluation_kit/
  01_protocole.md
  02_questionnaire_pre_test.md
  03_script_taches.md
  04_questionnaire_sus.md
  05_questionnaire_post_test.md
  06_grille_observation.md
  07_modele_consentement.md
  08_analyse_template.md
  09_dataset_test.md
  README.md
  datasets/
    prepare_recrutement_test.py
    recrutement_test.csv
    fairlearn_baseline.py
  sessions/
    T01/
      consentement.pdf
      pre_test.csv
      grille.md
      sus.csv
      post_test.csv
      recording.mp4
    T02/
    ...
  analyse/
    resultats.ipynb
```

## Rappel critique

L'évaluation ne remplace **pas** un audit technique d'AuditIQ : elle mesure l'expérience utilisateur et valide (ou invalide) la promesse « facilement » de la problématique du mémoire. C'est exactement le point soulevé par le syllabus (« évaluation des résultats inadéquate »). Ne pas céder à la tentation de l'auto-évaluation : l'observation externe est la seule méthode recevable.
