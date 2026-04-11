import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, ProgressBar, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store';
import { teacherService } from '../../services/teacherService';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { extractErrorMessage } from '../../services/api';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function UploadResumeScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [pickedFile, setPickedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const pickResume = async () => {
    setError('');
    setSuccess(false);

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const file = result.assets[0];
    if (file.size && file.size > MAX_SIZE_BYTES) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setPickedFile(file);
  };

  const uploadResume = async () => {
    if (!pickedFile?.uri) return;
    setUploading(true);
    setProgress(0.1);
    setError('');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 0.15, 0.85));
      }, 500);

      await teacherService.uploadResume(
        pickedFile.uri,
        pickedFile.mimeType ?? 'application/pdf',
        pickedFile.name
      );

      clearInterval(progressInterval);
      setProgress(1);
      setSuccess(true);
      dispatch(fetchTeacherProfile());

      setTimeout(() => navigation.goBack(), 1500);
    } catch (e) {
      setError(extractErrorMessage(e));
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-attach-outline" size={60} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Upload Resume</Text>
        <Text style={styles.headerSub}>PDF only · Maximum 5MB</Text>
      </View>

      <View style={styles.body}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <Card style={styles.successCard}>
            <Card.Content style={styles.centeredContent}>
              <Ionicons name="checkmark-circle" size={56} color="#27AE60" />
              <Text style={styles.successText}>Resume uploaded successfully!</Text>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.dropZone} onPress={pickResume}>
            <Card.Content style={styles.centeredContent}>
              <Ionicons
                name={pickedFile ? 'document-text' : 'cloud-upload-outline'}
                size={64}
                color={pickedFile ? '#1B4F72' : '#BDC3C7'}
              />
              {pickedFile ? (
                <>
                  <Text style={styles.fileName}>{pickedFile.name}</Text>
                  <Text style={styles.fileSize}>
                    {pickedFile.size ? `${(pickedFile.size / 1024).toFixed(0)} KB` : 'Unknown size'}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.dropText}>Tap to select a PDF file</Text>
                  <Text style={styles.dropSub}>or drag and drop here</Text>
                </>
              )}
            </Card.Content>
          </Card>
        )}

        {uploading && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Uploading... {Math.round(progress * 100)}%</Text>
            <ProgressBar progress={progress} color="#1B4F72" style={styles.progressBar} />
          </View>
        )}

        <View style={styles.buttonRow}>
          {pickedFile && !success && (
            <Button
              mode="outlined"
              onPress={pickResume}
              disabled={uploading}
              style={styles.btn}
            >
              Change File
            </Button>
          )}
          <Button
            mode="contained"
            onPress={pickedFile ? uploadResume : pickResume}
            loading={uploading}
            disabled={uploading}
            style={styles.btn}
            buttonColor="#1B4F72"
          >
            {pickedFile ? 'Upload Resume' : 'Select PDF'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  body: { flex: 1, padding: 24 },
  errorBox: { backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#E74C3C' },
  errorText: { color: '#C0392B', fontSize: 14 },
  dropZone: { borderRadius: 16, borderWidth: 2, borderColor: '#D5D8DC', borderStyle: 'dashed', marginBottom: 24 },
  centeredContent: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  dropText: { fontSize: 17, fontWeight: '600', color: '#7F8C8D' },
  dropSub: { fontSize: 13, color: '#BDC3C7' },
  fileName: { fontSize: 16, fontWeight: '600', color: '#1B4F72', textAlign: 'center' },
  fileSize: { fontSize: 13, color: '#7F8C8D' },
  progressContainer: { marginBottom: 24 },
  progressLabel: { fontSize: 14, color: '#7F8C8D', marginBottom: 8, textAlign: 'center' },
  progressBar: { height: 8, borderRadius: 4 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, borderRadius: 10 },
  successCard: { borderRadius: 16, borderWidth: 2, borderColor: '#27AE60' },
  successText: { fontSize: 16, fontWeight: '600', color: '#27AE60', textAlign: 'center' },
});
