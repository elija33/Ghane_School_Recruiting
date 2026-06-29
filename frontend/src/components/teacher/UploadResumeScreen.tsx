import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, ProgressBar, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store';
import { teacherService } from '../../services/teacherService';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { extractErrorMessage } from '../../services/api';
import styles from './styles/UploadResumeScreen.styles';

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

