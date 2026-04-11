# Script des tâches benchmark

Ce document contient le **texte exact** à lire au testeur et les critères d'observation pour Franck. Ne pas improviser ni reformuler : la standardisation est essentielle à la comparabilité inter-sessions.

## Préambule à lire au testeur (2 minutes)

> « Bonjour et merci d'accepter de participer à ce test. Je vous rappelle que l'objectif n'est pas de vous évaluer, mais d'évaluer l'outil. Si vous rencontrez une difficulté, c'est une information précieuse pour nous. Vous pouvez interrompre à tout moment sans justification.
>
> Je vais vous demander de réaliser trois petites tâches. Pendant que vous les effectuez, j'aimerais que vous pensiez à voix haute : dites-moi ce que vous regardez, ce que vous comprenez, ce qui vous surprend, ce qui vous gêne. Si vous bloquez, restez quelques instants avant de demander de l'aide. Je prendrai des notes sans vous interrompre.
>
> La session est enregistrée (écran et voix) conformément au consentement que vous avez signé. Avez-vous des questions avant de commencer ? »

---

## Tâche 1 — Audit d'un dataset de recrutement avec AuditIQ

**Objectif** : mesurer la capacité d'un non-tech à réaliser un audit complet avec AuditIQ.

**Durée maximum** : 15 minutes. Borne stricte à 15 min, au-delà = échec enregistré.

**Données fournies** :
- Fichier `recrutement_test.csv` (~5000 lignes, préparé depuis Adult Census Income, voir fichier 09).
- Chemin local : `C:/Users/Franck/Downloads/Fairness/Docs/evaluation_kit/datasets/recrutement_test.csv`
- URL de l'instance AuditIQ : fournie en direct au testeur.

**Énoncé exact à lire** :

> « Imaginez que vous êtes responsable RH dans une PME. Votre DSI vient d'intégrer un outil de tri automatique de CV. Votre direction vous demande de vérifier que cet outil ne défavorise pas un groupe en particulier, notamment en fonction du genre. Je vous fournis un fichier CSV qui contient les décisions de cet outil sur 5000 candidats. En utilisant AuditIQ, ouvrez une session d'audit, chargez ce fichier, lancez une analyse de fairness sur la variable de genre, et dites-moi s'il existe un biais et lequel. Vous avez 15 minutes maximum. Prenez votre temps et pensez à voix haute. »

**Critères de succès (tous obligatoires)** :
1. Le testeur a chargé le CSV dans AuditIQ sans assistance externe au code.
2. Le testeur a lancé un audit sur la variable sensible `sex`.
3. Le testeur a identifié verbalement **au moins un indicateur de biais** (disparité d'impact, différence de taux de sélection, etc.) à partir du rapport généré.
4. Le testeur a formulé une conclusion : « il y a un biais » ou « il n'y en a pas », en cohérence avec les résultats affichés.

**Critères d'échec** :
- Le testeur demande à Franck d'effectuer une étape clé à sa place.
- Le testeur abandonne explicitement.
- Temps dépassé (> 15 min).
- Le testeur ne parvient pas à charger le fichier.

**Liste d'observation pour Franck** :

| Moment | À observer |
|--------|------------|
| Arrivée sur l'écran d'accueil | Le testeur comprend-il où démarrer ? Hésitation à l'entrée ? |
| Import du CSV | Trouve-t-il le bouton « Upload » en moins de 30 s ? |
| Sélection de la variable sensible | Comprend-il le terme « variable sensible » ? Recours au glossaire ? |
| Lancement de l'audit | Passe-t-il par des réglages ou laisse-t-il les valeurs par défaut ? |
| Lecture du rapport | Regarde-t-il d'abord le résumé ou les graphiques ? Quels mots-clés le perdent ? |
| Conclusion | La conclusion est-elle spontanée ou faut-il le relancer ? |

**Points de friction à coder** : termes techniques incompris (noter lesquels), retours arrière, clics erronés, temps d'arrêt > 10 secondes.

---

## Tâche 2 — Même audit avec Fairlearn en ligne de commande

**Objectif** : mesurer la friction d'une solution technique existante comme baseline de comparaison.

**Durée maximum** : 15 minutes.

**Données fournies** :
- Même CSV `recrutement_test.csv`.
- Script Python `fairlearn_baseline.py` (pré-écrit, fonctionnel, testé par Franck).
- Terminal pré-ouvert dans le bon dossier, environnement Python activé.

**Énoncé exact à lire** :

> « On vous demande maintenant de faire la même chose, mais en utilisant l'outil open-source Fairlearn, qui est la référence technique du domaine. Je vous ai préparé le terminal et un script Python. Vous devez exécuter le script, lire ce qu'il affiche, et me dire si vous voyez un biais. Vous avez 15 minutes. Je vous rappelle : si vous bloquez, restez quelques instants avant de demander de l'aide. »

**Instructions techniques affichées en grand sur l'écran** :

```
1. Cliquez dans la fenêtre noire (terminal).
2. Tapez : python fairlearn_baseline.py
3. Appuyez sur Entrée.
4. Lisez la sortie.
```

**Critères de succès** :
1. Le testeur lance le script correctement.
2. Le testeur identifie au moins un indicateur de biais dans la sortie texte.
3. Le testeur formule une conclusion.

**Critères d'échec** :
- Le testeur ne parvient pas à lancer le script.
- Le testeur ne sait pas interpréter la sortie (même partiellement).
- Temps dépassé.

**Liste d'observation** :

| Moment | À observer |
|--------|------------|
| Découverte du terminal | Peur du terminal ? Commentaires spontanés ? |
| Frappe de la commande | Fautes de frappe, erreurs de casse ? |
| Lecture de la sortie | Arrive-t-il à la parcourir ? Quels termes le perdent ? |
| Interprétation | Peut-il dire où est le biais ? |

**Contre-balance** : la moitié des testeurs commence par T2, puis fait T1, pour neutraliser l'effet d'apprentissage.

---

## Tâche 3 — Audit d'un chatbot fictif via le module LLM-audit

**Objectif** : évaluer la compréhension du module d'audit LLM, élément différenciant du MVP.

**Durée maximum** : 15 minutes.

**Données fournies** :
- Chatbot fictif pré-configuré dans AuditIQ sous le nom `chatbot_RH_demo`.
- Prompts d'évaluation déjà intégrés au module.

**Énoncé exact à lire** :

> « Dernière tâche. Votre entreprise a déployé un chatbot qui répond aux questions des candidats pendant le processus de recrutement. Votre direction veut s'assurer qu'il ne tient pas de propos biaisés selon le genre ou l'origine supposée. Dans AuditIQ, ouvrez le module Audit LLM, sélectionnez le chatbot nommé `chatbot_RH_demo`, lancez l'audit, lisez le rapport et dites-moi : y a-t-il un problème, et si oui, lequel ? Vous avez 15 minutes. »

**Critères de succès** :
1. Accès au module LLM-audit sans aide.
2. Audit lancé sur le bon chatbot.
3. Lecture du rapport.
4. Formulation verbale d'au moins un biais identifié ou de sa conclusion d'absence de biais.
5. Proposition spontanée ou sollicitée d'une piste de remédiation.

**Critères d'échec** :
- Le testeur n'a pas trouvé le module LLM-audit.
- Le rapport est jugé incompréhensible par le testeur.
- Temps dépassé.

**Liste d'observation** :

| Moment | À observer |
|--------|------------|
| Navigation vers le module | Trouve-t-il le module en moins de 30 s ? |
| Compréhension du concept « audit LLM » | Commentaires, questions ? |
| Lecture des exemples de prompts | S'y attarde-t-il ? |
| Rapport final | Quelle(s) métrique(s) retient-il ? |
| Remédiation | Spontanée ou non ? Quelle qualité ? |

---

## Clôture de la session (2 minutes)

> « Voilà, c'est terminé. Je vais maintenant vous demander de remplir deux courts questionnaires : le premier sur l'utilisabilité de l'outil (10 questions), le second sur votre ressenti global. Prenez votre temps, répondez spontanément, il n'y a pas de bonne ou de mauvaise réponse. Je vais m'éloigner pour ne pas vous influencer. »

Franck quitte la pièce ou coupe la caméra pendant le remplissage.
