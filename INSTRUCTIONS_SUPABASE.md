# 📋 Instructions de Configuration Supabase pour AuditIQ

## Étape 1 : Créer les Tables dans Supabase

1. **Allez sur votre projet Supabase** :
   - URL : https://supabase.com/dashboard/project/qpgwotsodziznwigpjey

2. **Ouvrez le SQL Editor** :
   - Cliquez sur "SQL Editor" dans la barre latérale gauche
   - Cliquez sur "+ New query"

3. **Copiez-collez le contenu du fichier `supabase_schema.sql`** :
   - Le fichier se trouve à la racine du projet : `/app/supabase_schema.sql`
   - Copiez tout le contenu et collez-le dans l'éditeur SQL
   - Cliquez sur "Run" (en bas à droite)

4. **Vérifiez la création des tables** :
   - Allez dans "Table Editor"
   - Vous devriez voir les tables suivantes :
     * `users`
     * `datasets`
     * `audits`
     * `reports`
     * `team_members`

## Étape 2 : Créer les Buckets de Stockage

1. **Allez dans "Storage"** :
   - Cliquez sur "Storage" dans la barre latérale gauche

2. **Créez le bucket "datasets"** :
   - Cliquez sur "+ New bucket"
   - Nom : `datasets`
   - Public : Décoché (privé)
   - Cliquez sur "Create bucket"

3. **Créez le bucket "reports"** :
   - Cliquez sur "+ New bucket"
   - Nom : `reports`
   - Public : Décoché (privé)
   - Cliquez sur "Create bucket"

## Étape 3 : Vérifier les Variables d'Environnement

Les credentials sont déjà configurés dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://qpgwotsodziznwigpjey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Étape 4 : Tester l'Application

1. **Redémarrez le serveur** (si ce n'est pas déjà fait) :
   ```bash
   sudo supervisorctl restart nextjs
   ```

2. **Testez la création de compte** :
   - Allez sur : http://localhost:3000/signup
   - Créez un compte avec votre email
   - Vérifiez que le compte est créé dans Supabase (Table Editor → users)

3. **Testez la connexion** :
   - Allez sur : http://localhost:3000/login
   - Connectez-vous avec vos identifiants
   - Vous devriez être redirigé vers le dashboard

## 🎯 Points Importants

### Row Level Security (RLS)
Le schéma SQL active automatiquement RLS sur toutes les tables, ce qui signifie :
- ✅ Chaque utilisateur ne peut voir que SES propres données
- ✅ Sécurité renforcée (isolation par utilisateur)
- ✅ Pas de risque de fuite de données entre utilisateurs

### Trigger Automatique
Le trigger `handle_new_user()` crée automatiquement un profil utilisateur dans la table `users` quand quelqu'un s'inscrit via Supabase Auth.

### Storage Policies
Les buckets de storage ont des policies qui garantissent que :
- Chaque utilisateur peut uploader dans son propre dossier
- Chaque utilisateur ne peut voir que ses propres fichiers

## 🔍 Vérification Rapide

Pour vérifier que tout fonctionne :

```sql
-- Dans SQL Editor de Supabase, exécutez :

-- Vérifier les tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Vérifier les buckets
SELECT * FROM storage.buckets;

-- Vérifier les policies RLS
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

## ❓ Problèmes Courants

### Erreur "relation does not exist"
→ Le schéma SQL n'a pas été exécuté. Retournez à l'Étape 1.

### Erreur "bucket does not exist"
→ Les buckets n'ont pas été créés. Retournez à l'Étape 2.

### Erreur "permission denied"
→ RLS est activé mais les policies ne sont pas créées. Ré-exécutez le schéma SQL complet.

---

✅ Une fois ces étapes complétées, votre base de données Supabase sera prête pour AuditIQ !
