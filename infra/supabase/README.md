# Supabase

Ce dossier contient les migrations SQL et la configuration associée au projet Supabase.

## Prérequis
- Supabase CLI (`npm install -g supabase`)
- Accès à un projet Supabase configuré avec les clés `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

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

## Fonctions Edge

La fonction `verify-invite` valide les codes d’invitation depuis l’application mobile.

Pour la déployer :

```sh
supabase functions deploy verify-invite --project-ref <project-ref>
```

Pour la tester en local :

```sh
supabase functions serve verify-invite
```
