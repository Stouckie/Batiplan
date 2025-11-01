import type { ExpoConfig } from 'expo/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY doivent être définies pour la connexion Supabase.',
  );
}

const config: ExpoConfig = {
  name: 'BatiPlan',
  slug: 'batiplan',
  scheme: 'batiplan',
  version: '0.0.1',
  orientation: 'portrait',
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl,
    supabaseAnonKey,
  },
};

export default config;
