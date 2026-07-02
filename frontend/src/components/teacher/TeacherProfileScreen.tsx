import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

import styles from './styles/TeacherProfileScreen.styles';
import SaveProfileButton from '../SaveProfileButton';
import SaveAndNextButton from '../SaveAndNextButton';
import WebCameraModal from './profile/WebCameraModal';
import WebVideoRecorderModal from './profile/WebVideoRecorderModal';
import ProfileHeader from './profile/ProfileHeader';
import ProfileProgress from './profile/ProfileProgress';
import PersonalInfoSection from './profile/PersonalInfoSection';
import ProfessionalInfoSection from './profile/ProfessionalInfoSection';
import DocumentsSection from './profile/DocumentsSection';
import { FormData, FormErrors, initialForm } from './profile/types';
import { profileStore } from './profileStore';

const MAX_CV_MB = 10;
const MAX_VIDEO_MB = 100;
const MB = 1024 * 1024;

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function TeacherProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [idPhotoUri, setIdPhotoUri] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvUri, setCvUri] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'idCard' | null>(null);
  const [webChoiceTarget, setWebChoiceTarget] = useState<'idCard' | null>(null);
  const [webVideoOpen, setWebVideoOpen] = useState(false);

  const applyCapturedPhoto = (target: 'avatar' | 'idCard', uri: string) => {
    if (target === 'avatar') setPhotoUri(uri);
    else setIdPhotoUri(uri);
  };

  const launchCamera = async (target: 'avatar' | 'idCard') => {
    if (Platform.OS === 'web') { setCameraTarget(target); return; }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission Required', 'Please allow camera access to take a photo.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: target === 'idCard' ? [16, 10] : [1, 1], quality: target === 'idCard' ? 0.3 : 0.7 });
    if (!result.canceled && result.assets.length > 0) applyCapturedPhoto(target, result.assets[0].uri);
  };

  const launchLibrary = async (target: 'avatar' | 'idCard') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission Required', 'Please allow access to your photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: target === 'idCard' ? [16, 10] : [1, 1], quality: target === 'idCard' ? 0.3 : 0.7 });
    if (!result.canceled && result.assets.length > 0) applyCapturedPhoto(target, result.assets[0].uri);
  };

  const pickImageWithChoice = (target: 'avatar' | 'idCard', alertTitle: string) => {
    if (Platform.OS === 'web') { launchCamera(target); return; }
    if (Platform.OS === 'ios') {
      const { ActionSheetIOS } = require('react-native');
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Take a Photo', 'Choose from Library'], cancelButtonIndex: 0 },
        (index: number) => { if (index === 1) launchCamera(target); if (index === 2) launchLibrary(target); },
      );
    } else {
      Alert.alert(alertTitle, 'Choose an option', [
        { text: 'Take a Photo', onPress: () => launchCamera(target) },
        { text: 'Choose from Library', onPress: () => launchLibrary(target) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handlePickPhoto = () => pickImageWithChoice('avatar', 'Profile Photo');

  const handlePickIdCard = () => {
    if (Platform.OS === 'web') { setWebChoiceTarget('idCard'); return; }
    pickImageWithChoice('idCard', 'Ghana Card Photo');
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
      Alert.alert('File Too Large', `Your file is ${sizeMB.toFixed(1)} MB. Please upload a file under ${MAX_CV_MB} MB.`, [{ text: 'OK' }]);
      return;
    }
    setCvFileName(asset.name);
    setCvUri(asset.uri);
  };

  const handlePickVideo = async () => {
    if (Platform.OS === 'web') { setWebVideoOpen(true); return; }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Permission Required', 'Please allow access to your media library to upload a video.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoQuality: Platform.OS === 'ios' ? ImagePicker.UIImagePickerControllerQualityType.Medium : undefined,
      allowsEditing: false,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    const sizeMB = (asset.fileSize ?? 0) / MB;
    if (sizeMB > MAX_VIDEO_MB) {
      Alert.alert('Video Too Large', `Your video is ${sizeMB.toFixed(0)} MB. Please upload a shorter clip (under ${MAX_VIDEO_MB} MB).`, [{ text: 'OK' }]);
      return;
    }
    setVideoFileName(asset.uri.split('/').pop() ?? 'intro_video');
  };

  const onChange = (key: keyof FormData) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  const onToggleSubject = (s: string) =>
    setForm((f) => ({ ...f, subjects: f.subjects.includes(s) ? f.subjects.filter((x) => x !== s) : [...f.subjects, s] }));

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';

    if (!form.dateOfBirth.trim()) {
      e.dateOfBirth = 'Date of birth is required';
    } else {
      const [d, m, y] = form.dateOfBirth.split('/').map(Number);
      const dob = new Date(y, m - 1, d);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear()
        - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      if (isNaN(dob.getTime()) || !d || !m || !y) {
        e.dateOfBirth = 'Enter a valid date (DD/MM/YYYY)';
      } else if (age < 21) {
        e.dateOfBirth = 'You must be at least 21 years old to register';
      }
    }

    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.region) e.region = 'Please select your region';
    if (form.subjects.length === 0) e.subjects = 'Please select at least one subject';
    if (!form.experience.trim()) e.experience = 'Years of experience is required';
    if (!form.bio.trim()) e.bio = 'Please write something about yourself';
    if (!photoUri) e.photoUri = 'Please add a profile photo';
    if (!idPhotoUri) e.idPhotoUri = 'Please take a photo of your Ghana Card';
    if (!cvFileName) e.cvFileName = 'Please upload your CV / Resume';
    if (!videoFileName) e.videoFileName = 'Please record or upload a video about yourself';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveAndNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const personalData = { ...form, cvFileName, cvUri, videoFileName, idPhotoUri, photoUri };
    profileStore.setPersonalData(personalData);
    navigation.navigate('TeacherProfessional', { personalData });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <WebCameraModal
        visible={cameraTarget !== null}
        title={cameraTarget === 'idCard' ? 'Take a Photo of Your Ghana Card' : 'Take a Photo'}
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
        <ProfileHeader photoUri={photoUri} onPickPhoto={handlePickPhoto} />
        <ProfileProgress onValidate={() => { const e = validate(); setErrors(e); return Object.keys(e).length === 0; }} />

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        <PersonalInfoSection form={form} errors={errors} onChange={onChange} />
        <ProfessionalInfoSection form={form} errors={errors} onChange={onChange} onToggleSubject={onToggleSubject} />
        <DocumentsSection
          form={form}
          idPhotoUri={idPhotoUri}
          photoUri={photoUri}
          cvFileName={cvFileName}
          videoFileName={videoFileName}
          errors={errors}
          onChange={onChange}
          onPickIdCard={handlePickIdCard}
          onPickPhoto={handlePickPhoto}
          onPickCV={handlePickCV}
          onPickVideo={handlePickVideo}
        />

        <View style={styles.btnRow}>
          <SaveProfileButton onPress={handleSave} style={styles.btnFlex} />
          <SaveAndNextButton onPress={handleSaveAndNext} style={styles.btnFlex} />
        </View>

        <Text style={styles.hint}>* Required fields. Your profile will be visible to schools once verified.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
