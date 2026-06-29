import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button, ProgressBar, Text } from 'react-native-paper';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store';
import { teacherService } from '../../services/teacherService';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { extractErrorMessage } from '../../services/api';
import styles from './styles/RecordVideoScreen.styles';

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

