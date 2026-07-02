import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

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
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(-900)).current;

  const openDrawer = (uri: string) => {
    setPdfUri(uri);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, { toValue: -900, duration: 280, useNativeDriver: true }).start(() => setPdfUri(null));
  };

  const handleSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
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

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Documents submitted successfully!</Text>
          </View>
        )}

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

        <View style={styles.btnRow}>
          <SaveProfileButton onPress={handleSubmit} style={styles.btnFlex} label="Submit Documents" />
        </View>

        <Text style={styles.hint}>* Your documents will be reviewed by our verification team.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}
