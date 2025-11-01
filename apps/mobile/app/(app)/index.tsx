import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-context';

export default function HomeScreen(): JSX.Element {
  const { session } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'BatiPlan' }} />
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
          Connecté avec Google
        </Text>
        <Text style={{ fontSize: 16, color: '#475467', textAlign: 'center' }}>
          {session?.user.email}
        </Text>
        <Pressable
          onPress={handleSignOut}
          disabled={signingOut}
          style={{
            minWidth: 180,
            borderRadius: 8,
            backgroundColor: signingOut ? '#98A2B3' : '#1F2937',
            paddingVertical: 12,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            {signingOut ? 'Déconnexion…' : 'Se déconnecter'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
