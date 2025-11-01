import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';

import { supabase } from '@/lib/supabase';

export default function SignInScreen(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    const redirectTo = AuthSession.makeRedirectUri({
      scheme: 'batiplan',
      useProxy: true,
    });

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: false,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Connexion',
          headerBackVisible: false,
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 16,
          backgroundColor: 'white',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>
          Bienvenue sur BatiPlan
        </Text>
        <Text style={{ textAlign: 'center', color: '#475467' }}>
          Connectez-vous avec votre compte Google pour accéder à vos chantiers.
        </Text>
        {error ? (
          <Text style={{ color: '#B42318', textAlign: 'center' }}>{error}</Text>
        ) : null}
        <Pressable
          disabled={loading}
          onPress={handleSignIn}
          style={{
            minWidth: 240,
            borderRadius: 8,
            backgroundColor: loading ? '#98A2B3' : '#0C63E7',
            paddingVertical: 14,
            paddingHorizontal: 20,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={{
                color: '#FFFFFF',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Se connecter avec Google
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
}
