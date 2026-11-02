import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme';

type TopBarProps = {
  title: string;
  onBack?: () => void;
  tone?: 'paper' | 'camera';
};

export function TopBar({ title, onBack, tone = 'paper' }: TopBarProps) {
  const insets = useSafeAreaInsets();
  const onCamera = tone === 'camera';

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }, onCamera ? styles.camera : null]}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={8}
          style={styles.back}
        >
          <Text style={[styles.backLabel, onCamera ? styles.cameraText : null]}>Back</Text>
        </Pressable>
      ) : (
        <View style={styles.back} />
      )}
      <Text style={[styles.title, onCamera ? styles.cameraText : null]}>{title}</Text>
      <View style={styles.back} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
  },
  camera: {
    backgroundColor: 'transparent',
  },
  back: {
    width: 64,
  },
  backLabel: {
    color: colors.moss,
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  cameraText: {
    color: colors.paper,
  },
});
