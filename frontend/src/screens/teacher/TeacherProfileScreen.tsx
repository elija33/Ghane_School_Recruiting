import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { createTeacherProfile, fetchTeacherProfile, updateTeacherProfile } from '../../store/slices/teacherSlice';
import { TeacherProfileRequest } from '../../types';

export default function TeacherProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((s) => s.teacher);

  const [editing, setEditing] = useState(!profile);
  const [form, setForm] = useState<TeacherProfileRequest>({
    fullName: profile?.fullName ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    location: profile?.location ?? '',
    subjectSpecialization: profile?.subjectSpecialization ?? '',
    yearsOfExperience: profile?.yearsOfExperience ?? 0,
    bio: profile?.bio ?? '',
    idNumber: profile?.idNumber ?? '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        location: profile.location ?? '',
        subjectSpecialization: profile.subjectSpecialization ?? '',
        yearsOfExperience: profile.yearsOfExperience ?? 0,
        bio: profile.bio ?? '',
        idNumber: profile.idNumber ?? '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const action = profile
      ? updateTeacherProfile(form)
      : createTeacherProfile(form);
    const result = await dispatch(action);
    if (!result.type.endsWith('rejected')) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const VerificationBadge = () => (
    <View style={[
      styles.badge,
      { backgroundColor: profile?.verificationStatus === 'VERIFIED' ? '#EAFAF1' : '#FEF9E7' }
    ]}>
      <Ionicons
        name={profile?.verificationStatus === 'VERIFIED' ? 'shield-checkmark' : 'time-outline'}
        size={16}
        color={profile?.verificationStatus === 'VERIFIED' ? '#27AE60' : '#F39C12'}
      />
      <Text style={[
        styles.badgeText,
        { color: profile?.verificationStatus === 'VERIFIED' ? '#27AE60' : '#F39C12' }
      ]}>
        {(profile?.verificationStatus ?? 'PENDING').replace('_', ' ')}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            {profile?.photoUrl
              ? null
              : <Ionicons name="person" size={48} color="rgba(255,255,255,0.8)" />
            }
          </View>
          <Text style={styles.headerName}>{profile?.fullName ?? 'Your Profile'}</Text>
          <Text style={styles.headerEmail}>{profile?.email ?? ''}</Text>
          {profile && <VerificationBadge />}
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Upload shortcuts */}
        <View style={styles.uploadRow}>
          {[
            { label: 'Photo', icon: 'camera-outline', screen: 'TakePhoto', done: !!profile?.photoUrl },
            { label: 'Resume', icon: 'document-attach-outline', screen: 'UploadResume', done: !!profile?.resumeUrl },
            { label: 'Video', icon: 'videocam-outline', screen: 'RecordVideo', done: !!profile?.videoUrl },
          ].map((item) => (
            <Button
              key={item.label}
              mode="outlined"
              icon={item.done ? 'check-circle' : item.icon}
              onPress={() => (navigation.navigate as any)(item.screen)}
              style={[styles.uploadBtn, item.done && styles.uploadBtnDone]}
              textColor={item.done ? '#27AE60' : '#1B4F72'}
            >
              {item.label}
            </Button>
          ))}
        </View>

        {/* Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              {!editing && (
                <Button mode="text" onPress={() => setEditing(true)} icon="pencil">
                  Edit
                </Button>
              )}
            </View>

            {[
              { label: 'Full Name', key: 'fullName', keyboard: 'default' as const },
              { label: 'Phone Number', key: 'phoneNumber', keyboard: 'phone-pad' as const },
              { label: 'Location (Region / City)', key: 'location', keyboard: 'default' as const },
              { label: 'Subject Specialization', key: 'subjectSpecialization', keyboard: 'default' as const },
              { label: 'Ghana Card / ID Number', key: 'idNumber', keyboard: 'default' as const },
            ].map((field) => (
              <TextInput
                key={field.key}
                label={field.label}
                value={String((form as any)[field.key] ?? '')}
                onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                mode="outlined"
                disabled={!editing}
                keyboardType={field.keyboard}
                style={styles.input}
              />
            ))}

            <TextInput
              label="Years of Experience"
              value={String(form.yearsOfExperience ?? 0)}
              onChangeText={(v) => setForm({ ...form, yearsOfExperience: parseInt(v) || 0 })}
              mode="outlined"
              disabled={!editing}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Bio"
              value={form.bio ?? ''}
              onChangeText={(v) => setForm({ ...form, bio: v })}
              mode="outlined"
              disabled={!editing}
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            {editing && (
              <View style={styles.actionRow}>
                <Button
                  mode="outlined"
                  onPress={() => { setEditing(false); }}
                  style={styles.cancelBtn}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={loading}
                  disabled={loading}
                  style={styles.saveBtn}
                  buttonColor="#1B4F72"
                >
                  Save Profile
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, gap: 6 },
  badgeText: { fontSize: 13, fontWeight: '600' },
  uploadRow: { flexDirection: 'row', margin: 16, gap: 8 },
  uploadBtn: { flex: 1, borderRadius: 8 },
  uploadBtnDone: { borderColor: '#27AE60' },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFAF1',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  successText: { color: '#27AE60', fontWeight: '500' },
  errorBanner: { backgroundColor: '#FDEDEC', margin: 16, padding: 12, borderRadius: 8 },
  errorText: { color: '#C0392B', fontSize: 14 },
  formCard: { margin: 16, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  input: { marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 1, borderRadius: 8 },
});
