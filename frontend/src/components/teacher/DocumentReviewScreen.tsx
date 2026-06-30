import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import styles from './styles/TeacherProfileScreen.styles';
import SaveProfileButton from '../SaveProfileButton';
import ProfileProgress from './profile/ProfileProgress';
import WebCameraModal from './profile/WebCameraModal';
import WebVideoRecorderModal from './profile/WebVideoRecorderModal';

const MAX_CV_MB = 10;
const MAX_VIDEO_MB = 100;
const MB = 1024 * 1024;

export default function DocumentReviewScreen() {
  const [idNumber, setIdNumber] = useState('');
  const [idPhotoUri, setIdPhotoUri] = useState<string | null>(null);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<'profile' | 'idCard' | null>(null);
  const [webChoiceTarget, setWebChoiceTarget] = useState<'idCard' | null>(null);
  const [webVideoOpen, setWebVideoOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const applyCapturedPhoto = (target: 'profile' | 'idCard', uri: string) => {
    if (target === 'profile') setProfilePhotoUri(uri);
    else setIdPhotoUri(uri);
  };

  const launchCamera = async (target: 'profile' | 'idCard') => {
    if (Platform.OS === 'web') { setCameraTarget(target); return; }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission Required', 'Please allow camera access.'); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: target === 'idCard' ? [16, 10] : [1, 1],
      quality: target === 'idCard' ? 0.3 : 0.7,
    });
    if (!result.canceled && result.assets.length > 0) applyCapturedPhoto(target, result.assets[0].uri);
  };

  const launchLibrary = async (target: 'profile' | 'idCard') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission Required', 'Please allow photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: target === 'idCard' ? [16, 10] : [1, 1],
      quality: target === 'idCard' ? 0.3 : 0.7,
    });
    if (!result.canceled && result.assets.length > 0) applyCapturedPhoto(target, result.assets[0].uri);
  };

  const pickWithChoice = (target: 'profile' | 'idCard', title: string) => {
    if (Platform.OS === 'web') {
      if (target === 'idCard') { setWebChoiceTarget('idCard'); return; }
      launchCamera(target);
      return;
    }
    if (Platform.OS === 'ios') {
      const { ActionSheetIOS } = require('react-native');
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Take a Photo', 'Choose from Library'], cancelButtonIndex: 0 },
        (i: number) => { if (i === 1) launchCamera(target); if (i === 2) launchLibrary(target); },
      );
    } else {
      Alert.alert(title, 'Choose an option', [
        { text: 'Take a Photo', onPress: () => launchCamera(target) },
        { text: 'Choose from Library', onPress: () => launchLibrary(target) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleWebChoice = (action: 'camera' | 'library') => {
    const target = webChoiceTarget;
    setWebChoiceTarget(null);
    if (!target) return;
    if (action === 'camera') launchCamera(target);
    else launchLibrary(target);
  };

  const handlePickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    const sizeMB = (asset.size ?? 0) / MB;
    if (sizeMB > MAX_CV_MB) {
      Alert.alert('File Too Large', `Your file is ${sizeMB.toFixed(1)} MB. Please upload under ${MAX_CV_MB} MB.`);
      return;
    }
    setCvFileName(asset.name);
  };

  const handlePickVideo = async () => {
    if (Platform.OS === 'web') { setWebVideoOpen(true); return; }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission Required', 'Please allow media library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoQuality: Platform.OS === 'ios' ? ImagePicker.UIImagePickerControllerQualityType.Medium : undefined,
      allowsEditing: false,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    const sizeMB = (asset.fileSize ?? 0) / MB;
    if (sizeMB > MAX_VIDEO_MB) {
      Alert.alert('Video Too Large', `Your video is ${sizeMB.toFixed(0)} MB. Please upload under ${MAX_VIDEO_MB} MB.`);
      return;
    }
    setVideoFileName(asset.uri.split('/').pop() ?? 'intro_video');
  };

  const handleSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <WebCameraModal
        visible={cameraTarget !== null}
        title={cameraTarget === 'idCard' ? 'Take a Photo of Your Ghana Card' : 'Take a Profile Photo'}
        maxWidth={cameraTarget === 'idCard' ? 320 : 300}
        onClose={() => setCameraTarget(null)}
        onCapture={(dataUrl) => { if (cameraTarget) applyCapturedPhoto(cameraTarget, dataUrl); setCameraTarget(null); }}
      />
      <WebVideoRecorderModal
        visible={webVideoOpen}
        onClose={() => setWebVideoOpen(false)}
        onSave={(_blob, name) => { setVideoFileName(name); setWebVideoOpen(false); }}
      />
      {webChoiceTarget && (
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 360 }]}>
            <Text style={styles.modalTitle}>Ghana Card Photo</Text>
            <Text style={styles.modalHint}>Take a clear photo of your card or upload an existing image.</Text>
            <Button mode="contained" onPress={() => handleWebChoice('camera')} icon="camera" buttonColor="#1B4F72" style={styles.choiceBtn} contentStyle={{ paddingVertical: 4 }}>Take a Photo</Button>
            <Button mode="contained-tonal" onPress={() => handleWebChoice('library')} icon="upload" style={styles.choiceBtn} contentStyle={{ paddingVertical: 4 }}>Upload from Files</Button>
            <Button mode="outlined" onPress={() => setWebChoiceTarget(null)} style={styles.choiceBtn}>Cancel</Button>
          </View>
        </View>
      )}

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="document-text-outline" size={40} color="#fff" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Document Review</Text>
          <Text style={styles.headerSubtitle}>
            Upload and review your documents before submitting
          </Text>
        </View>

        <ProfileProgress currentStep={2} />

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Documents submitted successfully!</Text>
          </View>
        )}

        {/* Ghana Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Ghana Card / National ID</Text>
          </View>

          <TextInput
            label="Ghana Card / National ID Number"
            value={idNumber}
            onChangeText={setIdNumber}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="card-account-details" />}
          />

          <TouchableOpacity style={styles.idCardCapture} onPress={() => pickWithChoice('idCard', 'Ghana Card Photo')} activeOpacity={0.8}>
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
        </View>

        {/* Profile Photo, CV, Video */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="attach-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Supporting Documents</Text>
          </View>

          <View style={styles.uploadRow}>
            <TouchableOpacity style={[styles.uploadCard, profilePhotoUri ? styles.chipSelected : null]} onPress={() => pickWithChoice('profile', 'Profile Photo')} activeOpacity={0.8}>
              {profilePhotoUri
                ? <Image source={{ uri: profilePhotoUri }} style={{ width: 48, height: 48, borderRadius: 24 }} />
                : <Ionicons name="camera-outline" size={28} color="#2E86C1" />}
              <Text style={[styles.uploadLabel, { color: '#2E86C1' }]}>Profile Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.uploadCard, cvFileName ? styles.chipSelected : null]} onPress={handlePickCV} activeOpacity={0.8}>
              <Ionicons name="document-attach-outline" size={28} color="#8E44AD" />
              <Text style={[styles.uploadLabel, { color: '#8E44AD' }]} numberOfLines={2}>{cvFileName ?? 'Upload CV'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.uploadCard, videoFileName ? styles.chipSelected : null]} onPress={handlePickVideo} activeOpacity={0.8}>
              <Ionicons name="videocam-outline" size={28} color="#E67E22" />
              <Text style={[styles.uploadLabel, { color: '#E67E22' }]} numberOfLines={2}>{videoFileName ?? 'Video About You'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.btnRow}>
          <SaveProfileButton onPress={handleSubmit} style={styles.btnFlex} label="Submit Documents" />
        </View>

        <Text style={styles.hint}>* Your documents will be reviewed by our verification team.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
