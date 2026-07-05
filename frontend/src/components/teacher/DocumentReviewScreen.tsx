import React, { useRef, useState } from 'react';
import { Animated, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ReferenceItem, RootStackParamList, TeacherProfileRequest } from '../../types';
import api from '../../services/api';

import styles from './styles/TeacherProfileScreen.styles';
import SaveProfileButton from '../SaveProfileButton';
import ProfileProgress from './profile/ProfileProgress';
import { profileStore } from './profileStore';

type Route = RouteProp<RootStackParamList, 'TeacherDocuments'>;

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F0F3F8' }}>
      <Text style={{ flex: 1, fontSize: 13, color: '#7F8C8D' }}>{label}</Text>
      <Text style={{ flex: 2, fontSize: 13, color: '#2C3E50', fontWeight: '500' }}>{value}</Text>
    </View>
  );
}

export default function DocumentReviewScreen() {
  const route = useRoute<Route>();
  const routePersonal = route.params?.personalData;
  const personalData = (routePersonal && Object.keys(routePersonal).length > 0)
    ? routePersonal
    : profileStore.getPersonalData();

  const routeRefs = route.params?.references;
  const references = (routeRefs && routeRefs.length > 0)
    ? routeRefs
    : profileStore.getRefs();

  const [saved, setSaved] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const fullName: string = personalData.fullName ?? '';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const slideAnim = useRef(new Animated.Value(-900)).current;

  const openDrawer = (uri: string) => {
    setPdfUri(uri);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, { toValue: -900, duration: 280, useNativeDriver: true }).start(() => setPdfUri(null));
  };

  // Convert DD/MM/YYYY (stored in profileStore) → YYYY-MM-DD (ISO, required by backend LocalDate)
  const toIsoDate = (s?: string) => {
    if (!s) return undefined;
    const parts = s.split('/');
    if (parts.length !== 3) return undefined;
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const subjects = Array.isArray(personalData.subjects) && personalData.subjects.length > 0
        ? personalData.subjects.join(', ')
        : (personalData.otherSubject ?? undefined);

      const locationParts = [personalData.region, personalData.city].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(', ') : undefined;

      const refs: ReferenceItem[] = references
        .filter(r => r.name || r.email)
        .map(r => ({ name: r.name ?? '', position: r.position ?? '', phone: r.phone ?? '', email: r.email ?? '' }));

      const request: TeacherProfileRequest = {
        fullName:             personalData.fullName    || undefined,
        phoneNumber:          personalData.phone       || undefined,
        location,
        subjectSpecialization: subjects,
        yearsOfExperience:    personalData.experience  ? parseInt(personalData.experience, 10) : undefined,
        bio:                  personalData.bio         || undefined,
        dateOfBirth:          toIsoDate(personalData.dateOfBirth),
        idNumber:             personalData.idNumber    || undefined,
        references:           refs.length > 0 ? refs : undefined,
      };

      try {
        await api.post('/teachers/profile', request);
      } catch {
        // Profile may already exist — fall back to update
        await api.put('/teachers/profile', request);
      }

      setThankYouVisible(true);
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Thank You Modal */}
      <Modal visible={thankYouVisible} transparent animationType="fade" onRequestClose={() => setThankYouVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 420, alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#EAF7EE', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Ionicons name="checkmark-circle" size={48} color="#27AE60" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', marginBottom: 10 }}>
              Thank you {firstName}{lastName ? ` ${lastName}` : ''}!
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1B4F72', textAlign: 'center', marginBottom: 12 }}>
              Account Registered Successfully
            </Text>
            <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
              Check your email for confirmation. Our team will review your documents and get back to you shortly.
            </Text>
            <Button
              mode="contained"
              onPress={() => setThankYouVisible(false)}
              buttonColor="#27AE60"
              style={{ borderRadius: 10, width: '100%' }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Done
            </Button>
          </View>
        </View>
      </Modal>

      {pdfUri && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, flexDirection: 'row' }}>
          {/* Dark overlay on the right — tap to close */}
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} activeOpacity={1} onPress={closeDrawer} />

          {/* Sliding drawer from the left */}
          <Animated.View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '75%', backgroundColor: '#fff', transform: [{ translateX: slideAnim }], shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 4, height: 0 }, elevation: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#1B4F72' }}>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>CV / Resume</Text>
              <TouchableOpacity onPress={closeDrawer} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web'
                ? React.createElement('iframe', {
                    src: pdfUri,
                    style: { width: '100%', height: '100%', border: 'none' },
                    title: 'CV Preview',
                  })
                : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <Ionicons name="document-attach-outline" size={48} color="#1B4F72" />
                    <Text style={{ color: '#2C3E50', marginTop: 12, textAlign: 'center' }}>
                      PDF preview is not available on this device.
                    </Text>
                  </View>
                )}
            </View>
          </Animated.View>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="document-text-outline" size={40} color="#fff" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Document Review</Text>
          <Text style={styles.headerSubtitle}>Review your information and upload your documents</Text>
        </View>

        <ProfileProgress currentStep={2} />

        {/* Personal Information Review */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <InfoRow label="Full Name" value={personalData.fullName} />
          <InfoRow label="Date of Birth" value={personalData.dateOfBirth} />
          <InfoRow label="Phone Number" value={personalData.phone} />
          <InfoRow label="Email Address" value={personalData.email} />
          <InfoRow label="Region" value={personalData.region} />
          <InfoRow label="City / Town" value={personalData.city} />
        </View>

        {/* Professional Information Review */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Professional Information</Text>
          </View>
          <InfoRow
            label="Subjects"
            value={Array.isArray(personalData.subjects) && personalData.subjects.length > 0
              ? personalData.subjects.join(', ')
              : undefined}
          />
          <InfoRow label="Other Subject" value={personalData.otherSubject} />
          <InfoRow label="Years of Experience" value={personalData.experience} />
          <InfoRow label="About Yourself" value={personalData.bio} />
        </View>

        {/* References Review */}
        {references.length > 0 && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={20} color="#1B4F72" />
              <Text style={styles.sectionTitle}>Professional References</Text>
            </View>
            {references.map((ref, i) => (
              <View key={i} style={{ marginBottom: i < references.length - 1 ? 16 : 0 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 4 }]}>Reference {i + 1}</Text>
                <InfoRow label="Name" value={ref.name} />
                <InfoRow label="Position" value={ref.position} />
                <InfoRow label="Phone" value={ref.phone} />
                <InfoRow label="Email" value={ref.email} />
              </View>
            ))}
          </View>
        )}

        {/* Documents Review */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Documents & Verification</Text>
          </View>

          <InfoRow label="Ghana Card Number" value={personalData.idNumber} />

          {personalData.idPhotoUri ? (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Ghana Card Photo</Text>
              <Image
                source={{ uri: personalData.idPhotoUri }}
                style={styles.idCardImage}
                resizeMode="contain"
              />
            </View>
          ) : null}

          {personalData.photoUri ? (
            <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image
                source={{ uri: personalData.photoUri }}
                style={{ width: 52, height: 52, borderRadius: 26 }}
              />
              <Text style={{ fontSize: 13, color: '#2C3E50', fontWeight: '500' }}>Profile Photo uploaded</Text>
            </View>
          ) : null}

          {personalData.cvFileName ? (
            <TouchableOpacity
              onPress={() => personalData.cvUri && openDrawer(personalData.cvUri)}
              style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F0F3F8', alignItems: 'center' }}
            >
              <Text style={{ flex: 1, fontSize: 13, color: '#7F8C8D' }}>CV / Resume</Text>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="document-attach-outline" size={16} color="#1B4F72" />
                <Text style={{ fontSize: 13, color: '#1B4F72', fontWeight: '600', textDecorationLine: 'underline', flexShrink: 1 }}>
                  {personalData.cvFileName}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <InfoRow label="Intro Video" value={personalData.videoFileName} />
        </View>

        {submitError ? (
          <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: '#FDEDEC', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="alert-circle-outline" size={16} color="#E74C3C" />
            <Text style={{ color: '#C0392B', fontSize: 13, flex: 1 }}>{submitError}</Text>
          </View>
        ) : null}

        <View style={styles.btnRow}>
          <SaveProfileButton
            onPress={handleSubmit}
            style={styles.btnFlex}
            label={submitting ? 'Submitting…' : 'Submit Documents'}
            disabled={submitting}
          />
        </View>

        <Text style={styles.hint}>* Your documents will be reviewed by our verification team.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}
