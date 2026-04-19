import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const MAX_CV_MB = 10;
const MAX_VIDEO_MB = 100;
const MB = 1024 * 1024;

const GHANA_REGIONS: { name: string; enabled: boolean }[] = [
  { name: 'Greater Accra', enabled: true },
  { name: 'Ashanti', enabled: true },
  { name: 'Western', enabled: false },
  { name: 'Central', enabled: false },
  { name: 'Eastern', enabled: false },
  { name: 'Northern', enabled: false },
  { name: 'Upper East', enabled: false },
  { name: 'Upper West', enabled: false },
  { name: 'Volta', enabled: false },
  { name: 'Brong-Ahafo', enabled: false },
  { name: 'Oti', enabled: false },
  { name: 'Ahafo', enabled: false },
  { name: 'Bono East', enabled: false },
  { name: 'North East', enabled: false },
  { name: 'Savannah', enabled: false },
  { name: 'Western North', enabled: false },
];

const SUBJECTS = [
  'Mathematics', 'English Language', 'Science', 'Social Studies',
  'ICT', 'French', 'Physical Education', 'Music', 'Art & Design',
  'Religious & Moral Education', 'History', 'Geography', 'Economics',
  'Business Studies', 'Agriculture', 'Technical Drawing',
];

interface FormData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  region: string;
  city: string;
  subject: string;
  otherSubject: string;
  experience: string;
  bio: string;
  idNumber: string;
}

const initialForm: FormData = {
  fullName: '',
  dateOfBirth: '',
  phone: '',
  region: '',
  city: '',
  subject: '',
  otherSubject: '',
  experience: '',
  bio: '',
  idNumber: '',
};

export default function TeacherProfileScreen() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [saved, setSaved] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);

  const launchCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const launchLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickPhoto = () => {
    if (Platform.OS === 'web') {
      // On web, skip the dialog — open the file picker directly
      launchLibrary();
    } else if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take a Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) launchCamera();
          if (index === 2) launchLibrary();
        },
      );
    } else {
      // Android
      Alert.alert('Profile Photo', 'Choose an option', [
        { text: 'Take a Photo', onPress: launchCamera },
        { text: 'Choose from Library', onPress: launchLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handlePickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const sizeMB = (asset.size ?? 0) / MB;

    if (sizeMB > MAX_CV_MB) {
      Alert.alert(
        'File Too Large',
        `Your file is ${sizeMB.toFixed(1)} MB. Please upload a file under ${MAX_CV_MB} MB.\n\nTip: Use "Save as PDF" with compressed settings, or remove large images from your document.`,
        [{ text: 'OK' }],
      );
      return;
    }

    setCvFileName(asset.name);
  };

  const handlePickVideo = async () => {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow access to your media library to upload a video.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // videoQuality only applies on iOS — ignored on Android/web
      videoQuality: Platform.OS === 'ios'
        ? ImagePicker.UIImagePickerControllerQualityType.Medium
        : undefined,
      allowsEditing: false,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const sizeMB = (asset.fileSize ?? 0) / MB;

    if (sizeMB > MAX_VIDEO_MB) {
      Alert.alert(
        'Video Too Large',
        `Your video is ${sizeMB.toFixed(0)} MB after compression. Please upload a shorter clip (under ${MAX_VIDEO_MB} MB).`,
        [{ text: 'OK' }],
      );
      return;
    }

    const name = asset.uri.split('/').pop() ?? 'intro_video';
    setVideoFileName(name);
  };

  const set = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.region) e.region = 'Please select your region';
    if (!form.subject) e.subject = 'Please select your subject';
    if (!form.experience) e.experience = 'Years of experience is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={20} color="#1B4F72" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto}>
            <View style={styles.avatar}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={48} color="rgba(255,255,255,0.7)" />
              )}
            </View>
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Your Profile</Text>
          <Text style={styles.headerSubtitle}>
            Help schools find the right teacher — that's you!
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          {['Personal', 'Professional', 'Documents'].map((label, i) => (
            <View key={label} style={styles.progressItem}>
              <View style={[styles.progressDot, i === 0 && styles.progressDotActive]}>
                <Text style={[styles.progressNum, i === 0 && styles.progressNumActive]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={[styles.progressLabel, i === 0 && styles.progressLabelActive]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        {/* ── Section 1: Personal Info ── */}
        <View style={styles.card}>
          <SectionHeader icon="person-outline" title="Personal Information" />

          <TextInput
            label="Full Name *"
            value={form.fullName}
            onChangeText={set('fullName')}
            mode="outlined"
            style={styles.input}
            error={!!errors.fullName}
            left={<TextInput.Icon icon="account" />}
          />
          <HelperText type="error" visible={!!errors.fullName}>{errors.fullName}</HelperText>

          <TextInput
            label="Date of Birth"
            value={form.dateOfBirth}
            onChangeText={set('dateOfBirth')}
            mode="outlined"
            placeholder="DD/MM/YYYY"
            style={styles.input}
            left={<TextInput.Icon icon="calendar" />}
          />

          <TextInput
            label="Phone Number *"
            value={form.phone}
            onChangeText={set('phone')}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            error={!!errors.phone}
            left={<TextInput.Icon icon="phone" />}
          />
          <HelperText type="error" visible={!!errors.phone}>{errors.phone}</HelperText>

          <Text style={styles.fieldLabel}>Region *</Text>
          <View style={styles.chipGrid}>
            {GHANA_REGIONS.map((r) => (
              <TouchableOpacity
                key={r.name}
                style={[styles.chip, form.region === r.name && styles.chipSelected, !r.enabled && styles.chipDisabled]}
                onPress={() => r.enabled && set('region')(r.name)}
                disabled={!r.enabled}
              >
                <Text style={[styles.chipText, form.region === r.name && styles.chipTextSelected, !r.enabled && styles.chipTextDisabled]}>
                  {r.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!errors.region && <Text style={styles.errorText}>{errors.region}</Text>}

          <TextInput
            label="City / Town"
            value={form.city}
            onChangeText={set('city')}
            mode="outlined"
            style={[styles.input, { marginTop: 12 }]}
            left={<TextInput.Icon icon="map-marker" />}
          />
        </View>

        {/* ── Section 2: Professional Info ── */}
        <View style={styles.card}>
          <SectionHeader icon="school-outline" title="Professional Information" />

          <Text style={styles.fieldLabel}>Subject Specialization *</Text>
          <View style={styles.chipGrid}>
            {SUBJECTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, form.subject === s && styles.chipSelected]}
                onPress={() => set('subject')(s)}
              >
                <Text style={[styles.chipText, form.subject === s && styles.chipTextSelected]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}

          <TextInput
            label="Other Subject (if not listed)"
            value={form.otherSubject}
            onChangeText={set('otherSubject')}
            mode="outlined"
            style={[styles.input, { marginTop: 12 }]}
          />

          <TextInput
            label="Years of Experience *"
            value={form.experience}
            onChangeText={set('experience')}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.experience}
            left={<TextInput.Icon icon="briefcase" />}
          />
          <HelperText type="error" visible={!!errors.experience}>{errors.experience}</HelperText>

          <TextInput
            label="About Yourself"
            value={form.bio}
            onChangeText={set('bio')}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Tell schools a bit about yourself, your teaching style and goals..."
          />
        </View>

        {/* ── Section 3: Documents ── */}
        <View style={styles.card}>
          <SectionHeader icon="document-text-outline" title="Documents & Verification" />

          <TextInput
            label="Ghana Card / National ID Number"
            value={form.idNumber}
            onChangeText={set('idNumber')}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="card-account-details" />}
          />

          <View style={styles.uploadRow}>
            <TouchableOpacity style={styles.uploadCard}>
              <Ionicons name="camera-outline" size={28} color="#2E86C1" />
              <Text style={[styles.uploadLabel, { color: '#2E86C1' }]}>Profile Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadCard} onPress={handlePickCV}>
              <Ionicons name="document-attach-outline" size={28} color="#8E44AD" />
              <Text style={[styles.uploadLabel, { color: '#8E44AD' }]}>
                {cvFileName ?? 'Upload CV'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadCard} onPress={handlePickVideo}>
              <Ionicons name="videocam-outline" size={28} color="#E67E22" />
              <Text style={[styles.uploadLabel, { color: '#E67E22' }]}>
                {videoFileName ?? 'Intro Video'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 10 }}
          buttonColor="#1B4F72"
          icon="check-circle"
        >
          Save Profile
        </Button>

        <Text style={styles.hint}>
          * Required fields. Your profile will be visible to schools once verified.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F3F8' },
  content: { paddingBottom: 48 },

  // Header
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 36,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarWrapper: { marginBottom: 16, position: 'relative' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F39C12',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  progressItem: { alignItems: 'center', gap: 4 },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8ECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: { backgroundColor: '#1B4F72' },
  progressNum: { fontSize: 14, fontWeight: '700', color: '#95A5A6' },
  progressNumActive: { color: '#fff' },
  progressLabel: { fontSize: 11, color: '#95A5A6' },
  progressLabelActive: { color: '#1B4F72', fontWeight: '600' },

  // Banners
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFAF1',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  successText: { color: '#27AE60', fontWeight: '600' },

  // Cards
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1B4F72' },

  // Fields
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 10 },
  input: { marginBottom: 4, backgroundColor: '#fff' },
  errorText: { color: '#E74C3C', fontSize: 12, marginTop: 4, marginBottom: 8 },

  // Chips
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D5D8DC',
    backgroundColor: '#F8F9FA',
  },
  chipSelected: { borderColor: '#1B4F72', backgroundColor: '#EBF5FB' },
  chipDisabled: { borderColor: '#E8ECF0', backgroundColor: '#F2F3F4', opacity: 0.5 },
  chipText: { fontSize: 13, color: '#626567' },
  chipTextSelected: { color: '#1B4F72', fontWeight: '600' },
  chipTextDisabled: { color: '#BDC3C7' },

  // Upload
  uploadRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  uploadCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8ECF0',
    borderStyle: 'dashed',
    backgroundColor: '#FAFBFC',
  },
  uploadLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },

  // Save
  saveBtn: { marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  hint: { textAlign: 'center', fontSize: 12, color: '#95A5A6', marginTop: 16, marginHorizontal: 24 },
});
