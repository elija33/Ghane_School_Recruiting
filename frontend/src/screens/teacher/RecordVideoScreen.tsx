import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ProgressBar, Text } from 'react-native-paper';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store';
import { teacherService } from '../../services/teacherService';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { extractErrorMessage } from '../../services/api';

const MAX_DURATION_SECS = 120; // 2 minutes

export default function RecordVideoScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setElapsed(0);
    setError('');
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= MAX_DURATION_SECS - 1) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: MAX_DURATION_SECS });
      if (video?.uri) setRecordedUri(video.uri);
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
    setIsRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const uploadVideo = async () => {
    if (!recordedUri) return;
    setUploading(true);
    setUploadProgress(0.1);
    setError('');

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 0.08, 0.9));
      }, 800);

      const fileName = `video_${Date.now()}.mp4`;
      await teacherService.uploadVideo(recordedUri, 'video/mp4', fileName);

      clearInterval(progressInterval);
      setUploadProgress(1);
      dispatch(fetchTeacherProfile());
      setTimeout(() => navigation.goBack(), 1200);
    } catch (e) {
      setError(extractErrorMessage(e));
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (secs: number) =>
    `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  if (!cameraPermission?.granted || !micPermission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="videocam-outline" size={64} color="#1B4F72" />
        <Text style={styles.permTitle}>Camera & Mic Required</Text>
        <Text style={styles.permSub}>We need camera and microphone access to record your screening video.</Text>
        <Button
          mode="contained"
          onPress={async () => { await requestCameraPermission(); await requestMicPermission(); }}
          buttonColor="#1B4F72"
          style={styles.permBtn}
        >
          Grant Permissions
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} mode="video" facing="front">
        {/* Timer */}
        <View style={styles.timerRow}>
          {isRecording && <View style={styles.recDot} />}
          <Text style={styles.timer}>{formatTime(elapsed)}</Text>
          <Text style={styles.maxLabel}>/ {formatTime(MAX_DURATION_SECS)}</Text>
        </View>

        {isRecording && (
          <ProgressBar
            progress={elapsed / MAX_DURATION_SECS}
            color="#E74C3C"
            style={styles.progressBar}
          />
        )}

        {/* Tips */}
        {!isRecording && !recordedUri && (
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>Screening Video Tips</Text>
            {[
              'Introduce yourself and your teaching experience',
              'Explain your teaching philosophy',
              'Mention subjects and grade levels you teach',
              'Keep it under 2 minutes',
            ].map((tip, i) => (
              <Text key={i} style={styles.tip}>• {tip}</Text>
            ))}
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.recordBtn, isRecording && styles.stopBtn]}
          >
            {isRecording
              ? <View style={styles.stopIcon} />
              : <View style={styles.recordIcon} />}
          </TouchableOpacity>

          <View style={styles.sideBtn} />
        </View>
      </CameraView>

      {/* Post-record actions */}
      {recordedUri && !isRecording && (
        <View style={styles.postRecord}>
          <Text style={styles.recordedLabel}>Video recorded: {formatTime(elapsed)}</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {uploading && (
            <>
              <Text style={styles.uploadingLabel}>Uploading... {Math.round(uploadProgress * 100)}%</Text>
              <ProgressBar progress={uploadProgress} color="#1B4F72" style={styles.uploadBar} />
            </>
          )}
          <View style={styles.postActions}>
            <Button mode="outlined" onPress={() => { setRecordedUri(null); setElapsed(0); }} disabled={uploading}>
              Re-record
            </Button>
            <Button
              mode="contained"
              onPress={uploadVideo}
              loading={uploading}
              disabled={uploading}
              buttonColor="#1B4F72"
            >
              Upload Video
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 56,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E74C3C' },
  timer: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  maxLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  progressBar: { height: 4, margin: 16, borderRadius: 2 },
  tipsBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: { color: '#F39C12', fontWeight: '700', fontSize: 14, marginBottom: 8 },
  tip: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 22 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  sideBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  recordBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: { borderColor: '#E74C3C' },
  recordIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E74C3C' },
  stopIcon: { width: 28, height: 28, borderRadius: 4, backgroundColor: '#E74C3C' },
  postRecord: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
  },
  recordedLabel: { fontSize: 16, fontWeight: '600', color: '#2C3E50', textAlign: 'center' },
  errorText: { color: '#E74C3C', textAlign: 'center' },
  uploadingLabel: { fontSize: 14, color: '#7F8C8D', textAlign: 'center' },
  uploadBar: { height: 6, borderRadius: 3 },
  postActions: { flexDirection: 'row', gap: 12 },
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  permTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 12 },
  permSub: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  permBtn: { width: '100%', borderRadius: 10 },
});
