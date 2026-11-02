import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { TopBar } from '../components/TopBar';
import { toImageUri } from '../lib/imageUri';
import { useSpecimenPhoto } from '../state/capture';
import { colors } from '../theme';

export default function PreviewScreen() {
  const photo = useSpecimenPhoto();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <TopBar
        title="Review"
        tone="camera"
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
            return;
          }
          router.dismissTo('/');
        }}
      />
      {photo ? (
        <Image
          accessibilityLabel="Captured specimen"
          source={{ uri: toImageUri(photo.uri) }}
          style={styles.photo}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No photo yet</Text>
          <Text style={styles.emptyBody}>Capture a specimen to review it here.</Text>
        </View>
      )}
      <View style={[styles.panel, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.panelTitle}>Check the frame</Text>
        <Text style={styles.panelBody}>
          Keep the shot if the specimen fills the guide and the surface is in focus.
        </Text>
        <View style={styles.actions}>
          <View style={styles.action}>
            <ActionButton
              label="Retake"
              variant="secondary"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                  return;
                }
                router.dismissTo('/');
              }}
            />
          </View>
          <View style={styles.action}>
            <ActionButton
              label="Identify"
              disabled={!photo}
              onPress={() => router.push('/identifying')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.camera,
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: colors.paper,
    fontSize: 24,
    fontWeight: '700',
  },
  emptyBody: {
    marginTop: 8,
    color: '#D9D0C4',
    fontSize: 16,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 8,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  panelBody: {
    color: colors.inkSoft,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  action: {
    flex: 1,
  },
});
