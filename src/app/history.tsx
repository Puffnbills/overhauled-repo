import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { TopBar } from '../components/TopBar';
import { toImageUri } from '../lib/imageUri';
import { useReadings } from '../state/capture';
import { colors } from '../theme';

export default function HistoryScreen() {
  const readings = useReadings();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <TopBar title="Recent" onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.dismissTo('/');
      }} />
      {readings.length === 0 ? (
        <View style={[styles.empty, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.emptyTitle}>No readings yet</Text>
          <Text style={styles.emptyBody}>Photographs you identify in this session show up here.</Text>
          <ActionButton label="Open camera" onPress={() => router.dismissTo('/')} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}>
          {readings.map((reading) => (
            <Pressable
              key={reading.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${reading.identification.commonName}`}
              onPress={() => router.push({ pathname: '/results', params: { id: reading.id } })}
              style={styles.row}
            >
              <Image
                source={{ uri: toImageUri(reading.photo.uri) }}
                style={styles.thumb}
                resizeMode="cover"
              />
              <View style={styles.copy}>
                <Text style={styles.kind}>{reading.identification.kind}</Text>
                <Text style={styles.name}>{reading.identification.commonName}</Text>
                <Text style={styles.time}>
                  {new Date(reading.createdAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.inkSoft,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: colors.paperRaised,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.ink,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  kind: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  time: {
    color: colors.muted,
    fontSize: 14,
  },
});
