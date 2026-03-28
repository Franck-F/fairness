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
- **Sécurité** : Changement de mot de passe, authentification 2FA (prévu)
- **Connexions externes** : Intégration avec sources de données tierces (prévu)

---

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, FastAPI (Python) |
| **Base de données** | Supabase (PostgreSQL) |
| **Stockage** | Supabase Storage |
| **Authentification** | Supabase Auth |
| **IA/ML** | Google Gemini, scikit-learn, pandas |
| **Visualisations** | Plotly.js, Recharts |
| **Déploiement** | Netlify |

---

## Installation Locale

```bash
# Cloner le repository
git clone https://github.com/your-org/auditiq.git
cd auditiq

# Installer les dépendances
yarn install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
yarn dev
```

### Démarrage one-shot (frontend + backend)

Sous Windows (PowerShell), vous pouvez démarrer le projet en une seule commande :

```bash
npm run dev:all
```

Ce script :
- lance le backend FastAPI dans une nouvelle fenêtre PowerShell (port `8000`)
- lance le frontend Next.js dans le terminal courant (port `3000`)

Frontend uniquement :

```bash
npm run dev:frontend
```

---

## Déploiement sur Netlify

### Étape 1 : Connecter le Repository

1. Allez sur [Netlify](https://app.netlify.com)
2. Cliquez sur **"Add new site"** > **"Import an existing project"**
3. Connectez votre repository GitHub/GitLab

### Étape 2 : Paramètres de Build

| Paramètre | Valeur |
|-----------|--------|
| Build command | `yarn build` |
| Publish directory | `.next` |
| Node version | `20` |

### Étape 3 : Variables d'Environnement

Dans **Netlify Dashboard** > **Site settings** > **Environment variables** :

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_STORAGE_BUCKET=datasets
DATABASE_URL=postgresql://...
```

#### Google OAuth
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### Google Gemini
```
GEMINI_API_KEY=your-gemini-api-key
```

#### Email (Gmail SMTP)
```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@yourdomain.com
```

#### Application
```
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
FRONTEND_URL=https://your-site.netlify.app
SECRET_KEY=your-secret-key-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

---

## Configuration Google OAuth

Après le déploiement, configurez Google OAuth :

### 1. Google Cloud Console

[Google Cloud Console](https://console.cloud.google.com/apis/credentials) :

1. Cliquez sur votre **OAuth 2.0 Client ID**
2. **Origines JavaScript autorisées** :
   ```
   https://your-site.netlify.app
   ```
3. **URI de redirection autorisés** :
   ```
   https://your-site.netlify.app
   https://your-project.supabase.co/auth/v1/callback
   ```

### 2. Supabase Dashboard

[Supabase Dashboard](https://supabase.com/dashboard) > **Authentication** > **URL Configuration** :

1. **Site URL** : `https://your-site.netlify.app`
2. **Redirect URLs** : `https://your-site.netlify.app/**`

### 3. Supabase Google Provider

**Authentication** > **Providers** > **Google** :
- Activez le provider Google
- Ajoutez votre Client ID et Client Secret

---

## Backend FastAPI (Optionnel)

Pour l'analyse ML réelle (au lieu de résultats simulés) :

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Déployez sur [Railway](https://railway.app) ou [Render](https://render.com), puis ajoutez :
```
FASTAPI_URL=https://your-fastapi-backend.railway.app
```

---

## Structure du Projet

```
/app
├── app/                    # Next.js App Router
│   ├── api/               # Routes API
│   │   ├── audits/        # CRUD Audits
│   │   ├── datasets/      # Gestion datasets
│   │   ├── eda/           # Analyse exploratoire
│   │   ├── fairness/      # Calcul métriques fairness
│   │   ├── chat/          # Assistant IA
│   │   └── reports/       # Génération rapports
│   ├── dashboard/         # Pages dashboard
│   │   ├── audits/        # Liste & détail audits
│   │   ├── eda/           # Analyse EDA
│   │   ├── chat/          # Chat IA
│   │   ├── profile/       # Profil utilisateur
│   │   └── settings/      # Paramètres
│   └── (auth)/            # Pages authentification
├── backend/               # Backend FastAPI (optionnel)
│   └── main.py            # API ML/Fairness
├── components/            # Composants React
│   ├── dashboard/         # Composants dashboard
│   │   ├── ai-dashboard.js    # Dashboard IA
│   │   ├── sidebar.js         # Navigation
│   │   └── file-upload.js     # Upload fichiers
│   └── ui/                # Composants shadcn/ui
├── lib/                   # Utilitaires
│   ├── supabase.js        # Client Supabase
│   ├── auth-context.js    # Contexte auth
│   └── gemini.js          # Client Gemini
├── netlify.toml           # Configuration Netlify
└── package.json
```

---

## Identifiants de Test

| Email | Mot de passe |
|-------|--------------|
| `demo@auditiq.ai` | `Demo123!` |

---

## Roadmap

- [ ] Authentification 2FA
- [ ] Intégrations sources de données (BigQuery, Snowflake, S3)
- [ ] Analyse What-If interactive
- [ ] Gestion d'équipe multi-utilisateurs
- [ ] Webhooks & API publique
- [ ] Templates d'audits par industrie
- [ ] Conformité RGPD automatisée

---

## Licence

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

