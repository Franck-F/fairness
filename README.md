# AuditIQ - Plateforme d'Audit de Fairness et Détection de Biais IA

![AuditIQ](https://img.shields.io/badge/AuditIQ-AI%20Fairness-ec4899)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e)
![Netlify](https://img.shields.io/badge/Netlify-Ready-00c7b7)

## Présentation

**AuditIQ** est une plateforme SaaS complète pour l'audit de fairness et la détection de biais dans les modèles d'intelligence artificielle. Elle aide les organisations à garantir la conformité de leurs modèles ML avec les standards éthiques et les réglementations comme l'**EU AI Act**.

[![alt text](image.png)](https://fairness-eight.vercel.app/)
---

## Fonctionnalités

### Analyse Exploratoire des Données (EDA)

- **Statistiques descriptives** : Moyennes, médianes, écarts-types, quartiles
- **Analyse univariée** : Distribution de chaque variable avec histogrammes et box plots interactifs
- **Analyse bivariée** : Scatter plots, corrélations entre variables
- **Matrice de corrélation** : Visualisation des relations entre variables numériques
- **Qualité des données** : Détection des valeurs manquantes, outliers, doublons
- **Visualisations Plotly** : Graphiques interactifs zoomables et exportables
- **Import direct** : Upload de fichiers CSV/Excel directement dans la page EDA

### Dashboard IA 

- **KPIs automatiques** : Calcul intelligent des indicateurs clés basés sur vos données
- **Visualisations suggérées** : Graphiques générés automatiquement selon le contexte
- **Insights IA** : Résumé exécutif, alertes et recommandations générés
- **Analyse de la variable cible** : Statistiques et visualisations focalisées sur l'outcome

### Audit de Fairness

- **Métriques de fairness** :
  - Demographic Parity (Parité démographique)
  - Equal Opportunity (Égalité des chances)
  - Equalized Odds (Odds égalisés)
  - Predictive Parity (Parité prédictive)
  - Disparate Impact (Impact disparate)
- **Analyse multi-attributs** : Évaluation sur plusieurs attributs sensibles (genre, âge, ethnie, etc.)
- **Score global d'équité** : Note de 0 à 100% avec niveau de risque
- **Détection de biais** : Identification automatique des biais critiques
- **Recommandations** : Suggestions de techniques de mitigation (pre-processing, in-processing, post-processing)

### Rapports d'Audit

- **Téléchargement PDF/HTML** : Export des résultats d'audit complets
- **Visualisations incluses** : Graphiques radar, bar charts des métriques
- **Historique des audits** : Suivi de tous les audits réalisés
- **Comparaison temporelle** : Évolution des scores entre audits

### Assistant IA (Chat)

- **Questions sur vos données** : Interrogez vos datasets en langage naturel
- **Explication des métriques** : Comprenez ce que signifie chaque score
- **Conseils personnalisés** : Recommandations adaptées à votre cas d'usage
- **Historique des conversations** : Sessions de chat sauvegardées

### Authentification & Sécurité

- **Connexion Email/Mot de passe** : Inscription classique avec vérification email
- **Google OAuth** : Connexion en un clic avec Google
- **Mot de passe oublié** : Flux de réinitialisation par email
- **Sessions sécurisées** : Tokens JWT avec expiration configurable

### Gestion des Datasets

- **Upload multi-format** : CSV, Excel (.xlsx, .xls)
- **Parsing automatique** : Détection des types de colonnes (numérique, catégoriel, booléen)
- **Stockage sécurisé** : Fichiers stockés dans Supabase Storage
- **Métadonnées** : Nombre de lignes, colonnes, taille du fichier

### Paramètres & Profil

- **Profil utilisateur** : Modification des informations personnelles
- **Préférences** : Thème sombre/clair, langue, notifications
- **Sécurité** : Changement de mot de passe, authentification 2FA 
- **Connexions externes** : Intégration avec sources de données tierces 

