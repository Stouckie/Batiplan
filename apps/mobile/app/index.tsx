import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'BatiPlan' }} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }}>
          Bienvenue sur BatiPlan
        </Text>
        <Text style={{ marginTop: 12, textAlign: 'center' }}>
          Authentification Google et écrans supplémentaires arrivent dans les prochaines étapes.
        </Text>
      </View>
    </>
  );
}
