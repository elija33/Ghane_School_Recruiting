import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TeacherProfileScreen.styles';
import { FormData, FormErrors } from './types';

interface Props {
  form: Pick<FormData, 'idNumber'>;
  idPhotoUri: string | null;
  photoUri: string | null;
  cvFileName: string | null;
  videoFileName: string | null;
  errors?: FormErrors;
  onChange: (key: keyof FormData) => (val: string) => void;
  onPickIdCard: () => void;
  onPickPhoto: () => void;
  onPickCV: () => void;
  onPickVideo: () => void;
}

export default function DocumentsSection({
  form, idPhotoUri, photoUri, cvFileName, videoFileName, errors = {},
  onChange, onPickIdCard, onPickPhoto, onPickCV, onPickVideo,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Ionicons name="document-text-outline" size={20} color="#1B4F72" />
        <Text style={styles.sectionTitle}>Documents & Verification</Text>
      </View>

      <TextInput label="Ghana Card / National ID Number" value={form.idNumber} onChangeText={onChange('idNumber')}
        mode="outlined" style={styles.input} left={<TextInput.Icon icon="card-account-details" />} />

      <TouchableOpacity
        style={[styles.idCardCapture, !!errors.idPhotoUri && { borderColor: '#E74C3C', borderWidth: 1.5 }]}
        onPress={onPickIdCard}
        activeOpacity={0.8}
      >
        {idPhotoUri ? (
          <>
            <Image source={{ uri: idPhotoUri }} style={styles.idCardImage} resizeMode="contain" />
            <View style={styles.idCardRetakeBadge}>
              <Ionicons name="refresh" size={14} color="#fff" />
              <Text style={styles.idCardRetakeText}>Retake</Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons name="camera-outline" size={32} color={errors.idPhotoUri ? '#E74C3C' : '#1B4F72'} />
            <Text style={[styles.idCardCaptureTitle, !!errors.idPhotoUri && { color: '#E74C3C' }]}>Take Photo of Ghana Card *</Text>
            <Text style={styles.idCardCaptureHint}>Place your card flat, well-lit, and fully in frame</Text>
          </>
        )}
      </TouchableOpacity>
      <HelperText type="error" visible={!!errors.idPhotoUri}>{errors.idPhotoUri}</HelperText>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={[styles.uploadCard, !!errors.photoUri && !photoUri && { borderColor: '#E74C3C', borderWidth: 1.5 }]} onPress={onPickPhoto}>
          <Ionicons name="camera-outline" size={28} color={errors.photoUri && !photoUri ? '#E74C3C' : '#2E86C1'} />
          <Text style={[styles.uploadLabel, { color: errors.photoUri && !photoUri ? '#E74C3C' : '#2E86C1' }]}>{photoUri ? 'Profile Photo ✓' : 'Profile Photo *'}</Text>
          {!!errors.photoUri && !photoUri && (
            <Text style={{ fontSize: 10, color: '#E74C3C', textAlign: 'center', marginTop: 2 }}>Required</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.uploadCard, !!errors.cvFileName && !cvFileName && { borderColor: '#E74C3C', borderWidth: 1.5 }]} onPress={onPickCV}>
          <Ionicons name="document-attach-outline" size={28} color={errors.cvFileName && !cvFileName ? '#E74C3C' : '#8E44AD'} />
          <Text style={[styles.uploadLabel, { color: errors.cvFileName && !cvFileName ? '#E74C3C' : '#8E44AD' }]}>{cvFileName ?? 'Upload CV *'}</Text>
          {!!errors.cvFileName && !cvFileName && (
            <Text style={{ fontSize: 10, color: '#E74C3C', textAlign: 'center', marginTop: 2 }}>Required</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.uploadCard, !!errors.videoFileName && !videoFileName && { borderColor: '#E74C3C', borderWidth: 1.5 }]} onPress={onPickVideo}>
          <Ionicons name="videocam-outline" size={28} color={errors.videoFileName && !videoFileName ? '#E74C3C' : '#E67E22'} />
          <Text style={[styles.uploadLabel, { color: errors.videoFileName && !videoFileName ? '#E74C3C' : '#E67E22' }]}>{videoFileName ?? 'Video About You *'}</Text>
          {!!errors.videoFileName && !videoFileName && (
            <Text style={{ fontSize: 10, color: '#E74C3C', textAlign: 'center', marginTop: 2 }}>Required</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
