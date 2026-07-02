import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import styles from './styles/TeacherProfileScreen.styles';
import SaveProfileButton from '../SaveProfileButton';
import SaveAndNextButton from '../SaveAndNextButton';
import ProfileProgress from './profile/ProfileProgress';
import { profileStore } from './profileStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'TeacherProfessional'>;

interface Reference {
  name: string;
  position: string;
  phone: string;
  email: string;
}

const emptyRef = (): Reference => ({ name: '', position: '', phone: '', email: '' });


interface RefErrors {
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
}

export default function ProfessionalScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const personalData = route.params?.personalData ?? {};
  const [refs, setRefs] = useState<Reference[]>(() => {
    const stored = profileStore.getRefs();
    return stored.length > 0 ? stored as Reference[] : [emptyRef(), emptyRef(), emptyRef()];
  });

  const updateRefs = (updater: (prev: Reference[]) => Reference[]) => {
    setRefs((prev) => {
      const next = updater(prev);
      profileStore.setRefs(next);
      return next;
    });
  };
  const [refErrors, setRefErrors] = useState<RefErrors[]>([{}, {}, {}]);
  const [dupMessages, setDupMessages] = useState<string[]>([]);
  const [dupModalVisible, setDupModalVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const onRefChange = (index: number, field: keyof Reference) => (val: string) =>
    updateRefs((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: val } : r)));

  const validate = (): boolean => {
    const names = refs.map((r) => r.name.trim().toLowerCase());
    const phones = refs.map((r) => r.phone.trim().toLowerCase());
    const emails = refs.map((r) => r.email.trim().toLowerCase());

    // Build per-field inline errors
    const rErrs: RefErrors[] = refs.map((r, i) => {
      const re: RefErrors = {};
      if (!r.name.trim()) re.name = 'Name is required';
      if (!r.position.trim()) re.position = 'Position is required';
      if (!r.phone.trim() && !r.email.trim()) re.phone = 'Phone number or email is required';
      return re;
    });
    setRefErrors(rErrs);

    // Build duplicate warning messages
    const msgs: string[] = [];
    for (let a = 0; a < refs.length; a++) {
      for (let b = a + 1; b < refs.length; b++) {
        const dupFields: string[] = [];
        if (names[a] && names[a] === names[b]) dupFields.push('Full Name');
        if (phones[a] && phones[a] === phones[b]) dupFields.push('Phone Number');
        if (emails[a] && emails[a] === emails[b]) dupFields.push('Email Address');
        if (dupFields.length > 0) {
          msgs.push(
            `Reference ${a + 1} and Reference ${b + 1}: ${dupFields.join(', ')} ${dupFields.length > 1 ? 'are' : 'is'} the same — each reference must be a different person.`
          );
        }
      }
    }
    setDupMessages(msgs);
    if (msgs.length > 0) setDupModalVisible(true);

    return rErrs.every((re) => Object.keys(re).length === 0) && msgs.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveAndNext = () => {
    if (!validate()) return;
    profileStore.setRefs(refs);
    navigation.navigate('TeacherDocuments', { personalData, references: refs });
  };

  return (
    <>
      <Modal visible={dupModalVisible} transparent animationType="fade" onRequestClose={() => setDupModalVisible(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setDupModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Ionicons name="alert-circle" size={26} color="#E74C3C" />
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#C0392B' }}>Duplicate References</Text>
            </View>
            {dupMessages.map((msg, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <Ionicons name="remove-circle-outline" size={16} color="#E74C3C" style={{ marginTop: 2 }} />
                <Text style={{ flex: 1, fontSize: 13, color: '#2C3E50', lineHeight: 20 }}>{msg}</Text>
              </View>
            ))}
            <Button mode="contained" buttonColor="#E74C3C" style={{ marginTop: 8, borderRadius: 10 }} onPress={() => setDupModalVisible(false)}>
              OK, I'll Fix It
            </Button>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="school-outline" size={40} color="#fff" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Professional Profile</Text>
          <Text style={styles.headerSubtitle}>
            Share your teaching experience and subject expertise
          </Text>
        </View>

        <ProfileProgress currentStep={1} onValidate={validate} />

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Professional info saved!</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Professional Information</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={20} color="#1B4F72" />
            <Text style={styles.sectionTitle}>Professional References</Text>
          </View>
          <Text style={[styles.hint, { textAlign: 'left', marginHorizontal: 0, marginTop: 0, marginBottom: 16 }]}>
            Provide 3 people who can vouch for your teaching ability.
          </Text>

          {refs.map((ref, i) => (
            <View key={i} style={{ marginBottom: i < 2 ? 28 : 0 }}>
              <Text style={styles.fieldLabel}>Reference {i + 1}</Text>

              <TextInput
                label="Full Name *"
                value={ref.name}
                onChangeText={onRefChange(i, 'name')}
                mode="outlined"
                style={styles.input}
                error={!!refErrors[i]?.name}
                left={<TextInput.Icon icon="account" />}
              />
              <HelperText type="error" visible={!!refErrors[i]?.name}>{refErrors[i]?.name}</HelperText>

              <TextInput
                label="Position / Title *"
                value={ref.position}
                onChangeText={onRefChange(i, 'position')}
                mode="outlined"
                style={styles.input}
                error={!!refErrors[i]?.position}
                left={<TextInput.Icon icon="briefcase-outline" />}
              />
              <HelperText type="error" visible={!!refErrors[i]?.position}>{refErrors[i]?.position}</HelperText>

              <TextInput
                label="Phone Number"
                value={ref.phone}
                onChangeText={onRefChange(i, 'phone')}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                error={!!refErrors[i]?.phone}
                left={<TextInput.Icon icon="phone-outline" />}
              />
              <HelperText type="error" visible={!!refErrors[i]?.phone}>{refErrors[i]?.phone}</HelperText>

              <TextInput
                label="Email Address"
                value={ref.email}
                onChangeText={onRefChange(i, 'email')}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                error={!!refErrors[i]?.email}
                left={<TextInput.Icon icon="email-outline" />}
              />
              <HelperText type="error" visible={!!refErrors[i]?.email}>{refErrors[i]?.email}</HelperText>
            </View>
          ))}
        </View>

        <View style={styles.btnRow}>
          <SaveProfileButton onPress={handleSave} style={styles.btnFlex} />
          <SaveAndNextButton onPress={handleSaveAndNext} style={styles.btnFlex} />
        </View>

        <Text style={styles.hint}>* Required fields.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}
