import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { ResultsCard } from '../components/ResultsCard';
import { TopBar } from '../components/TopBar';
import { sampleIdentification } from '../data/sampleIdentification';
import { toImageUri } from '../lib/imageUri';
import { useSpecimenPhoto } from '../state/capture';
import { colors } from '../theme';

export default function ResultsScreen() {
  const photo = useSpecimenPhoto();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <TopBar
        title="Identification"
        onBack={router.canGoBack() ? () => router.back() : undefined}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
      >
        <View style={styles.column}>
          {photo ? (
            <Image
              accessibilityLabel="Captured specimen"
              source={{ uri: toImageUri(photo.uri) }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.missingPhoto}>
              <Text style={styles.missingTitle}>No specimen photo</Text>
              <Text style={styles.missingBody}>
                Capture a photo to attach it to this reading.
              </Text>
            </View>
          )}
          <ResultsCard identification={sampleIdentification} />
          <ActionButton label="New photo" onPress={() => router.dismissTo('/')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  column: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    gap: 16,
  },
  photo: {
    width: '100%',
    height: 280,
    borderRadius: 22,
    backgroundColor: colors.ink,
  },
  missingPhoto: {
    height: 160,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperRaised,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  missingTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  missingBody: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
});
