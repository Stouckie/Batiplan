# BatiPlan

Monorepo Expo / Supabase pour l'application mobile BatiPlan.

## Prérequis
- Node.js 20+
- pnpm 8+
- Expo Go sur votre téléphone

## Installation
```sh
pnpm install
```

## Lancer dans Expo Go
```sh
cp apps/mobile/.env.example apps/mobile/.env
# Renseignez :
# EXPO_PUBLIC_SUPABASE_URL=...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...

pnpm -C apps/mobile install
pnpm -C apps/mobile start
```

Scannez le QR code dans Expo Go (même réseau). Connectez-vous avec Google pour voir votre email (sera implémenté dans les étapes suivantes).

## Scripts CI
```sh
pnpm -r typecheck
pnpm -r lint
```
