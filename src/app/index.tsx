import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useIsFocused } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '../components/ActionButton';
import { setSpecimenPhoto, useReadings } from '../state/capture';
import { colors } from '../theme';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  if (!permission) {
    return <View style={styles.screen} />;
  }

  if (!permission.granted) {
    return (
      <PermissionPrompt
        canAskAgain={permission.canAskAgain}
        onRequest={() => {
          void requestPermission();
        }}
      />
    );
  }

  return isFocused ? <LiveCamera /> : <View style={styles.screen} />;
}

function LiveCamera() {
  const insets = useSafeAreaInsets();
  const readings = useReadings();
  const cameraRef = useRef<CameraView>(null);
  const capturingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function capture() {
    if (!cameraRef.current || !ready || capturingRef.current) {
      return;
    }

    capturingRef.current = true;
    setCapturing(true);
    setError(null);

    try {
      // Wait for onCameraReady. Calling this earlier fails on Android.
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (!picture?.uri) {
        setError('The photo could not be saved. Try again.');
        return;
      }

      setSpecimenPhoto({
        uri: picture.uri,
        width: picture.width,
        height: picture.height,
      });
      router.push('/preview');
    } catch {
      setError('The photo could not be saved. Try again.');
    } finally {
      capturingRef.current = false;
      setCapturing(false);
    }
  }

  const shutterDisabled = !ready || capturing;

  return (
    <View style={styles.screen}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        mode="picture"
        onCameraReady={() => setReady(true)}
        onMountError={() => {
          setReady(false);
          setError('The camera could not start.');
        }}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.topCopy, { paddingTop: insets.top + 16 }]}>
          <View style={styles.topText} pointerEvents="none">
            <Text style={styles.brand}>Rock Identifier</Text>
            <Text style={styles.hint}>Fill the frame with one specimen</Text>
          </View>
          {readings.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open recent readings"
              onPress={() => router.push('/history')}
              hitSlop={8}
              style={styles.recent}
            >
              <Text style={styles.recentLabel}>Recent</Text>
            </Pressable>
          ) : (
            <View style={styles.recent} />
          )}
        </View>

        <View style={styles.finderWrap} pointerEvents="none">
          <View style={styles.finder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 28 }]}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
            accessibilityState={{ disabled: shutterDisabled }}
            disabled={shutterDisabled}
            onPress={() => {
              void capture();
            }}
            style={[styles.shutterOuter, shutterDisabled ? styles.shutterDisabled : null]}
          >
            <View style={[styles.shutterInner, capturing ? styles.shutterBusy : null]} />
          </Pressable>
          <Text style={styles.captureLabel}>
            {capturing ? 'Saving photo' : ready ? 'Capture' : 'Starting camera'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function PermissionPrompt({
  canAskAgain,
  onRequest,
}: {
  canAskAgain: boolean;
  onRequest: () => void;
}) {
  const insets = useSafeAreaInsets();
  const openSettings = !canAskAgain && Platform.OS !== 'web';

  return (
    <View style={[styles.prompt, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 28 }]}>
      <Text style={styles.promptKicker}>Camera</Text>
      <Text style={styles.promptTitle}>Photograph a specimen</Text>
      <Text style={styles.promptBody}>
        {openSettings
          ? 'Camera access is turned off for this app. Enable it in settings to photograph a mineral or rock.'
          : 'The camera frames the mineral or rock. The photo stays in this session so you can review it before identifying.'}
      </Text>
      <ActionButton
        label={openSettings ? 'Open settings' : 'Allow camera'}
        onPress={openSettings ? () => Linking.openSettings() : onRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.camera,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topCopy: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  topText: {
    flex: 1,
  },
  recent: {
    minWidth: 64,
    paddingTop: 2,
    alignItems: 'flex-end',
  },
  recentLabel: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: '700',
  },
  brand: {
    color: colors.paper,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  hint: {
    marginTop: 6,
    color: colors.paper,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  finderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finder: {
    width: '78%',
    aspectRatio: 3 / 4,
    maxHeight: '86%',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.paper,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  controls: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  error: {
    color: colors.dangerText,
    backgroundColor: colors.scrim,
    overflow: 'hidden',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: {
    opacity: 0.45,
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.paper,
  },
  shutterBusy: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  captureLabel: {
    color: colors.paper,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  prompt: {
    flex: 1,
    backgroundColor: colors.camera,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    gap: 14,
  },
  promptKicker: {
    color: colors.sand,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  promptTitle: {
    color: colors.paper,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '700',
  },
  promptBody: {
    color: '#D9D0C4',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 8,
  },
});
