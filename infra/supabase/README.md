# Supabase

Ce dossier contient les migrations SQL et la configuration associée au projet Supabase.

## Prérequis
- Supabase CLI (`npm install -g supabase`)
- Accès à un projet Supabase configuré avec les clés `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE`

## Initialiser et exécuter les migrations
1. Copier le fichier `.env.example` à la racine et renseigner les variables :
   ```sh
   cp .env.example .env
   ```
2. Lancer le studio local Supabase (optionnel) :
   ```sh
   supabase start
   ```
3. Appliquer les migrations :
   ```sh
   supabase db push
   ```

Les politiques RLS sont définies dans `migrations/0001_init.sql`. Toute modification du schéma doit passer par une nouvelle migration numérotée chronologiquement.
