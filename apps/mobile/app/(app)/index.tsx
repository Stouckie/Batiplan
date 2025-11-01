import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-context';

export default function HomeScreen(): JSX.Element {
  const { session } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; tone: 'success' | 'error' } | null>(
    null,
  );

  const trimmedCode = useMemo(() => inviteCode.trim(), [inviteCode]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Erreur lors de la déconnexion', signOutError);
    } finally {
      setSigningOut(false);
    }
  };

  const handleVerifyInvite = async () => {
    if (!trimmedCode) {
      setFeedback({ message: 'Entrez un code pour continuer.', tone: 'error' });
      return;
    }

    setVerifying(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.functions.invoke<{
        valid: boolean;
        message: string;
      }>('verify-invite', {
        body: { code: trimmedCode },
      });

      if (error) {
        console.error('Erreur Supabase Functions', error);
        setFeedback({
          message: "Une erreur est survenue lors de la vérification du code.",
          tone: 'error',
        });
        return;
      }

      if (data?.valid) {
        setFeedback({ message: data.message || 'Code valide', tone: 'success' });
      } else {
        setFeedback({
          message: data?.message || 'Code invalide ou expiré.',
          tone: 'error',
        });
      }
    } catch (verificationError) {
      console.error('Erreur réseau lors de la vérification', verificationError);
      setFeedback({
        message: "Impossible de contacter le service de vérification.",
        tone: 'error',
      });
    } finally {
      setVerifying(false);
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
          gap: 24,
          backgroundColor: 'white',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>
          Connecté avec Google
        </Text>
        <Text style={{ fontSize: 16, color: '#475467', textAlign: 'center' }}>
          {session?.user.email}
        </Text>
        <View
          style={{
            width: '100%',
            gap: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#EAECF0',
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Rejoindre un chantier
          </Text>
          <Text style={{ color: '#475467' }}>
            Saisissez le code d’invitation fourni par votre responsable pour valider
            l’accès.
          </Text>
          <TextInput
            placeholder="Code chantier"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
            autoCorrect={false}
            style={{
              borderWidth: 1,
              borderColor: '#D0D5DD',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#FFFFFF',
              fontSize: 16,
            }}
          />
          <Pressable
            onPress={handleVerifyInvite}
            disabled={verifying}
            style={{
              borderRadius: 8,
              backgroundColor: verifying ? '#98A2B3' : '#0C63E7',
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              {verifying ? 'Vérification…' : 'Rejoindre'}
            </Text>
          </Pressable>
          {feedback ? (
            <Text
              style={{
                color: feedback.tone === 'success' ? '#027A48' : '#B42318',
                fontWeight: '500',
              }}
            >
              {feedback.message}
            </Text>
          ) : null}
        </View>
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
