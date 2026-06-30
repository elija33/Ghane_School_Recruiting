import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TeacherProfileScreen.styles';
import { FormData } from './types';

interface Props {
  form: Pick<FormData, 'idNumber'>;
  idPhotoUri: string | null;
  cvFileName: string | null;
  videoFileName: string | null;
  onChange: (key: keyof FormData) => (val: string) => void;
  onPickIdCard: () => void;
  onPickPhoto: () => void;
  onPickCV: () => void;
  onPickVideo: () => void;
}

export default function DocumentsSection({
  form, idPhotoUri, cvFileName, videoFileName,
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

      <TouchableOpacity style={styles.idCardCapture} onPress={onPickIdCard} activeOpacity={0.8}>
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
            <Ionicons name="camera-outline" size={32} color="#1B4F72" />
            <Text style={styles.idCardCaptureTitle}>Take Photo of Ghana Card</Text>
            <Text style={styles.idCardCaptureHint}>Place your card flat, well-lit, and fully in frame</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadCard} onPress={onPickPhoto}>
          <Ionicons name="camera-outline" size={28} color="#2E86C1" />
          <Text style={[styles.uploadLabel, { color: '#2E86C1' }]}>Profile Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCard} onPress={onPickCV}>
          <Ionicons name="document-attach-outline" size={28} color="#8E44AD" />
          <Text style={[styles.uploadLabel, { color: '#8E44AD' }]}>{cvFileName ?? 'Upload CV'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCard} onPress={onPickVideo}>
          <Ionicons name="videocam-outline" size={28} color="#E67E22" />
          <Text style={[styles.uploadLabel, { color: '#E67E22' }]}>{videoFileName ?? 'Video About You'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
