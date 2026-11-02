import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { identifyPhoto } from '../lib/identify';
import { toImageUri } from '../lib/imageUri';
import { useSpecimenPhoto } from '../state/capture';
import { colors } from '../theme';

export default function IdentifyingScreen() {
  const photo = useSpecimenPhoto();
  const insets = useSafeAreaInsets();
  const [attempt, setAttempt] = useState(0);
  const [failedAttempt, setFailedAttempt] = useState<number | null>(null);
  const failed = failedAttempt === attempt;

  useEffect(() => {
    if (!photo) {
      return;
    }

    let cancelled = false;

    identifyPhoto(photo)
      .then((reading) => {
        if (!cancelled) {
          router.replace({ pathname: '/results', params: { id: reading.id } });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailedAttempt(attempt);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [photo, attempt]);

  if (!photo) {
    return (
      <View style={[styles.screen, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>No photo to read</Text>
        <Text style={styles.body}>Capture a specimen before identifying it.</Text>
        <ActionButton label="Open camera" onPress={() => router.dismissTo('/')} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 24 }]}>
      <Image
        accessibilityLabel="Specimen being identified"
        source={{ uri: toImageUri(photo.uri) }}
        style={styles.photo}
        resizeMode="cover"
      />
      {failed ? (
        <>
          <Text style={styles.title}>The reading did not finish</Text>
          <Text style={styles.body}>The photo is still here. Try the reading again.</Text>
          <ActionButton label="Try again" onPress={() => setAttempt((value) => value + 1)} />
        </>
      ) : (
        <>
          <ActivityIndicator color={colors.moss} size="large" />
          <Text style={styles.title}>Reading the specimen</Text>
          <Text style={styles.body}>Comparing color, luster, and crystal habit.</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 14,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    backgroundColor: colors.ink,
    marginBottom: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  body: {
    color: colors.inkSoft,
    fontSize: 16,
    lineHeight: 23,
  },
});
