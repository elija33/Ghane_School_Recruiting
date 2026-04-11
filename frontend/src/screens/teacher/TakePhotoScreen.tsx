import React, { useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store';
import { teacherService } from '../../services/teacherService';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { extractErrorMessage } from '../../services/api';

export default function TakePhotoScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) setCapturedUri(photo.uri);
  };

  const uploadPhoto = async () => {
    if (!capturedUri) return;
    setUploading(true);
    setError('');
    try {
      const fileName = `photo_${Date.now()}.jpg`;
      await teacherService.uploadPhoto(capturedUri, 'image/jpeg', fileName);
      dispatch(fetchTeacherProfile());
      navigation.goBack();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#1B4F72" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSub}>We need camera access to take your profile photo.</Text>
        <Button mode="contained" onPress={requestPermission} buttonColor="#1B4F72" style={styles.permBtn}>
          Grant Permission
        </Button>
      </View>
    );
  }

  if (capturedUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedUri }} style={styles.preview} resizeMode="cover" />
        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : null}
        <View style={styles.previewActions}>
          <Button
            mode="outlined"
            onPress={() => setCapturedUri(null)}
            disabled={uploading}
            style={styles.previewBtn}
          >
            Retake
          </Button>
          <Button
            mode="contained"
            onPress={uploadPhoto}
            loading={uploading}
            disabled={uploading}
            buttonColor="#1B4F72"
            style={styles.previewBtn}
          >
            Use This Photo
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.overlay}>
          <View style={styles.faceGuide} />
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} style={styles.flipBtn}>
            <Ionicons name="camera-reverse-outline" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureBtn}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.flipBtn}>
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Centre your face in the circle</Text>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  faceGuide: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  flipBtn: { padding: 12 },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  hint: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: 13, paddingBottom: 16 },
  preview: { flex: 1 },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  previewBtn: { flex: 1, borderRadius: 10 },
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  permissionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 12 },
  permissionSub: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  permBtn: { width: '100%', borderRadius: 10 },
  errorBox: { position: 'absolute', top: 56, left: 16, right: 16, backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12 },
  errorText: { color: '#C0392B', fontSize: 14 },
});
