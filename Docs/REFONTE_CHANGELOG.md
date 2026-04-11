# Journal de la refonte d'alignement — AuditIQ

Document de traçabilité de la refonte du MVP AuditIQ et du mémoire associé,
réalisée pour aligner le projet sur sa problématique : *« Comment permettre
aux PME françaises de détecter facilement les biais de leurs algorithmes IA
pour se conformer à l'AI Act européen ? »*.

Cette refonte fait suite à une analyse critique qui a identifié sept
problèmes structurels d'alignement entre le MVP livré et la problématique
défendue. Branche dédiée : `refonte-alignement-memoire`.

---

## Diagnostic préalable

**Problèmes identifiés** (résumé des sept points d'attaque possibles en
soutenance) :

1. **Scope creep** : le MVP contenait chat IA généraliste, what-if, training
   ML, monitoring autonome, connexions multi-sources. Tous hors-scope par
   rapport à la problématique de détection des biais. Contradiction directe
   avec le critère « facilement ».
2. **Données impossibles à fournir** : l'unique mode d'audit exigeait
   prédictions + vérité terrain + attribut sensible labellisé. Une PME réelle
   n'a presque jamais ces trois éléments simultanément, et l'article 10(5)
   de l'AI Act crée un paradoxe RGPD sur la collecte d'attributs sensibles.
3. **Cas d'usage chatbot ignoré** : le sondage initial montre que 17 % des
   PME utilisent des chatbots — premier cas d'usage IA ex aequo avec le
   recrutement —, mais le MVP n'auditait que des modèles tabulaires.
4. **Confusion conformité / détection** : la problématique parle de
   « se conformer à l'AI Act », mais la fairness ne représente qu'environ
   15 % des obligations effectives. Cette confusion fragilisait le mémoire.
5. **« Françaises » non justifié** : aucun ancrage juridique national
   dans le code (CNIL, Code du travail, ACPR, Défenseur des droits absents).
6. **« Facilement » non mesuré** : critère central de la problématique mais
   évalué uniquement par verbatims, sans protocole rigoureux ni métrique.
7. **Échantillon empirique fragile** : n=34 avec 44 % de grandes entreprises,
   à assumer plus frontalement.

---

## Sprints exécutés

### Sprint 0 — Préparation (10 min)

- Création de la branche `refonte-alignement-memoire` à partir de `main`.
- Cartographie des modules MVP existants (5 routers backend, 14 pages
  dashboard).
- Identification des modules à conserver, amputer, ajouter.

### Sprint 1 — Amputation chirurgicale (45 min)

**Objectif** : retirer du périmètre actif les modules contredisant la
problématique, sans supprimer le code (réversibilité).

**Modifications** :

- `components/dashboard/sidebar.js` : navigation simplifiée de 14 à 10
  entrées. Suppression de `chat`, `data-science`, `whatif`, `connections`,
  `monitoring`, `profile` (déplacé hors nav principale). Ajout de
  `unsupervised` et `llm-audit`.
- `backend/main.py` : désactivation des routers `ml_router` et `ds_router`.
  Code conservé sur disque pour traçabilité et réactivation potentielle.
- `tests/test_api.py`, `tests/test_backend.py` : tests des endpoints
  désactivés marqués `@pytest.mark.skip` avec raison documentée.

**Justification documentée dans le code** : les modules amputés
contredisaient le critère « facilement » de la problématique en ajoutant une
charge cognitive importante à un utilisateur non-spécialiste. Pour un MVP
solo dans le cadre académique, la concentration sur les cas d'usage cœur
prime sur l'exhaustivité fonctionnelle.

### Sprint 2 — Détection non supervisée (60 min)

**Objectif** : combler le trou n°2 en ajoutant un mode d'audit qui ne
nécessite ni vérité terrain ni labels démographiques.

**Modifications** :

- Création de `backend/routers/unsupervised.py` (~250 lignes).
- Pipeline : standardisation des features → KMeans → calcul du taux de
  prédiction positive par cluster → test du Khi-deux pour la significativité
  statistique → caractérisation des clusters par features dominantes →
  attribution d'un niveau de risque (vert / orange / rouge) selon écart au
  taux global.
- Endpoint `POST /api/unsupervised/detect` avec schéma Pydantic complet.
- Renvoi structuré : niveau de risque global, résumé en langage naturel,
  pertinence AI Act explicitée, liste des findings cluster avec
  interprétation.
- Inspiration revendiquée : approche d'Algorithm Audit (Pays-Bas), reconnue
  par l'OCDE dans son Catalogue of Tools for Trustworthy AI.

### Sprint 3 — Audit LLM / chatbot (60 min)

**Objectif** : combler le trou n°3 en ajoutant un module d'audit pour
systèmes conversationnels.

**Modifications** :

- Création de `backend/routers/llm_audit.py` (~290 lignes).
- Banque de 10 prompts paired bilingues FR/EN, couvrant six attributs :
  genre, origine ethnique, âge, religion, handicap, orientation sexuelle.
  Cas d'usage sectoriels : recrutement, service client, crédit, stéréotypes
  de métier.
- Adapter générique : l'utilisateur configure URL d'endpoint LLM, headers,
  payload template avec marqueur `{{PROMPT}}`, chemin JSON de la réponse.
  Compatible OpenAI, Anthropic, Mistral, ou tout LLM exposant un endpoint
  HTTP.
- Métriques de comparaison : ratio de différence de longueur, écart de
  sentiment lexical, asymétrie de refus.
- Score agrégé par catégorie + risque global feu tricolore.
- Inspiration revendiquée : LangBiTe (Universitat Oberta de Catalunya /
  Université du Luxembourg).

### Sprint 1b — Frontend des nouveaux modules (parallèle, 1 agent)

**Objectif** : exposer les nouveaux modules via une UI cohérente avec le
reste du dashboard.

**Modifications** :

- Création de `app/dashboard/unsupervised/page.js` : sélection de dataset,
  paramétrage du clustering (sliders), affichage des résultats par carte
  cluster, feu tricolore, encart AI Act, stats Khi-deux.
- Création de `app/dashboard/llm-audit/page.js` : configuration de
  l'endpoint LLM, validation du payload template, lancement de l'audit,
  affichage des scores par catégorie, accordion détaillant chaque paire.
- Création de proxy routes Next : `app/api/unsupervised/route.js` et
  `app/api/llm-audit/route.js`, suivant la convention déjà en place pour
  d'autres routes proxy (Supabase auth + relais vers FastAPI).
- Ajout de cartes de raccourci dans `app/dashboard/page.js` (section
  « Nouveaux modules AI Act »).

### Sprint 4 — Ancrage juridique France (parallèle, 1 agent)

**Objectif** : combler le trou n°5 en justifiant la spécificité française
de la problématique.

**Modifications** :

- Création de `backend/legal_fr.py` : dictionnaire `FRENCH_LEGAL_REFERENCES`
  couvrant discrimination générale (Code pénal art. 225-1, 225-2 ; Loi
  2008-496), emploi (Code du travail L.1132-1, L.1133-1, L.1142-1, L.1221-6),
  crédit (LIL art. 22, RGPD art. 22, Code de la consommation L.312-16), et
  identification des régulateurs compétents (CNIL, Défenseur des droits,
  ACPR, AMF, DGCCRF).
- Fonctions utilitaires : `get_french_law_for_use_case`, `get_cnil_guidance`,
  `map_ai_act_article_to_french_law` pour les articles AI Act 5, 9, 10, 11,
  14, 15, 50.
- Création de `backend/sector_templates_fr.py` : 4 templates de cas d'usage
  PME français — recrutement par ATS, scoring crédit néo-banque, tarification
  assurance, chatbot service client. Chaque template inclut métriques
  recommandées, attributs sensibles à examiner, cadre juridique AI Act +
  français, risques spécifiques PME, recommandations de mitigation.
- Modification non destructive de `backend/routers/reports.py` : ajout du
  endpoint `GET /api/reports/legal-context/{use_case}` et injection
  automatique d'une section « Cadre juridique français applicable » dans les
  rapports PDF/TXT générés lorsqu'un cas d'usage est précisé.
- Tous les éléments juridiques nécessitant validation par un juriste avant
  soutenance sont marqués `verification_recommended: True`.

### Sprint 5 — Réécriture du mémoire (parallèle, 1 agent)

**Objectif** : aligner les sections clés du mémoire sur la nouvelle
architecture du MVP et combler les trous d'argumentation.

**Livrable** : `Docs/memoire_refonte_sections.md` contenant les nouvelles
versions de l'introduction, d'une section 2.3.5 dédiée au concept de triple
interface, de la totalité de la section 4.2 (architecture en trois modules),
de la section 4.3 (évaluation), de la section 5.1 (synthèse rééquilibrée),
et d'une nouvelle section 5.3.3 sur les recherches futures.

### Sprint 6 — Protocole d'évaluation utilisateur (parallèle, 1 agent)

**Objectif** : combler le trou n°6 en remplaçant les verbatims génériques
par un protocole rigoureux et exécutable.

**Livrable** : dossier `Docs/evaluation_kit/` contenant le protocole
détaillé, les questionnaires pré-test et post-test, le SUS standard
français, le script de tâches benchmark, la grille d'observation, le
formulaire de consentement RGPD, le template d'analyse, et la description
du dataset de test à utiliser.

### Sprint bonus — Kit de défense soutenance (en parallèle)

**Livrable** : `Docs/soutenance_defense_kit.md` contenant le pitch de
60 secondes, douze questions probables du jury avec réponses pré-éprouvées,
les pièges à éviter, le scénario de démo, la structure des slides, et un
mantra de préparation.

---

## Métriques de la refonte

- Branche : `refonte-alignement-memoire` (à fusionner ou rebaser sur `main`
  après revue).
- Nouveaux fichiers backend : 4 (`unsupervised.py`, `llm_audit.py`,
  `legal_fr.py`, `sector_templates_fr.py`).
- Nouveaux fichiers frontend : 4 (2 pages dashboard + 2 proxy routes).
- Nouveaux fichiers tests : 1 (`tests/test_unsupervised.py`).
- Nouveaux fichiers documentation : 4 (REFONTE_CHANGELOG.md,
  soutenance_defense_kit.md, memoire_refonte_sections.md, evaluation_kit/).
- Modules désactivés (code conservé) : 2 routers backend, 5 pages dashboard
  retirées de la nav principale.
- Lignes de code Python ajoutées : ~800.
- Lignes de code JavaScript ajoutées : ~600 estimé.
- Temps total cumulé d'exécution agents parallèles : ~15 minutes wallclock
  pour ~50 minutes de travail séquentiel équivalent.

---

## Étapes restantes pour Franck

1. Relire et intégrer manuellement les sections de
   `Docs/memoire_refonte_sections.md` dans `Docs/memoire.md`. Garder les
   sections actuelles qui restent valables — la revue de littérature 2.1 à
   2.3, la méthodologie 3.1 à 3.4, la section 4.1 d'analyse des données.
2. Exécuter les sessions du protocole d'évaluation
   (`Docs/evaluation_kit/01_protocole.md`), idéalement 6 à 8 testeurs sur
   2 semaines. Saisir les résultats dans le template d'analyse fourni.
3. Valider auprès d'un juriste les références marquées
   `verification_recommended: True` dans `backend/legal_fr.py` et
   `backend/sector_templates_fr.py`.
4. Tester le pipeline complet manuellement : upload d'un dataset →
   audit supervisé → audit non supervisé → audit LLM → génération de rapport
   PDF avec section juridique française.
5. Préparer les slides de soutenance en suivant la trame du
   `soutenance_defense_kit.md`.
6. Décider du sort des modules désactivés : suppression définitive,
   conservation pour réactivation post-mémoire, ou justification dans une
   annexe « roadmap post-MVP ».
7. Fusionner la branche `refonte-alignement-memoire` dans `main` après
   validation, ou conserver la séparation pour montrer au jury la
   traçabilité de l'itération.

---

## Décisions explicites prises pendant la refonte

- **Réversibilité plutôt que destruction** : aucun fichier n'a été supprimé.
  Les modules amputés sont seulement retirés de la nav et désactivés en
  importation. Cela permet de revenir en arrière si un module se révèle
  nécessaire en cours de soutenance, et de défendre la traçabilité.
- **Pragmatisme sur Gemini** : choix de conserver Gemini comme générateur
  de recommandations pour le MVP, en explicitant en conclusion l'évolution
  vers Mistral / Claude / modèle européen pour une version production.
- **Contributions inspirées et créditées** : les modules non supervisé et
  LLM s'inspirent explicitement d'Algorithm Audit et de LangBiTe. Les
  citations sont présentes à la fois dans le code (commentaires d'en-tête)
  et dans le mémoire (revue de littérature et section MVP).
- **Honnêteté méthodologique sur l'évaluation** : l'évaluation utilisateur
  rigoureuse n'étant pas réalisable instantanément, le protocole est livré
  comme un kit d'exécution prêt à l'emploi, à mener par Franck avant la
  soutenance. Le mémoire annonce explicitement cette démarche plutôt que
  de prétendre des résultats non collectés.
