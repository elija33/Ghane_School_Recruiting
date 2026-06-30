import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles/TeacherProfileScreen.styles';
import SaveProfileButton from '../SaveProfileButton';
import ProfileProgress from './profile/ProfileProgress';

interface Reference {
  name: string;
  position: string;
  contact: string;
}

const emptyRef = (): Reference => ({ name: '', position: '', contact: '' });

interface RefErrors {
  name?: string;
  position?: string;
  contact?: string;
}

export default function ProfessionalScreen() {
  const [refs, setRefs] = useState<Reference[]>([emptyRef(), emptyRef(), emptyRef()]);
  const [refErrors, setRefErrors] = useState<RefErrors[]>([{}, {}, {}]);
  const [saved, setSaved] = useState(false);

  const onRefChange = (index: number, field: keyof Reference) => (val: string) =>
    setRefs((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: val } : r)));

  const validate = (): boolean => {
    const rErrs: RefErrors[] = refs.map((r) => {
      const re: RefErrors = {};
      if (!r.name.trim()) re.name = 'Name is required';
      if (!r.position.trim()) re.position = 'Position is required';
      if (!r.contact.trim()) re.contact = 'Phone or email is required';
      return re;
    });
    setRefErrors(rErrs);
    return rErrs.every((re) => Object.keys(re).length === 0);
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
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

        <ProfileProgress currentStep={1} />

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
            <View key={i} style={{ marginBottom: i < 2 ? 24 : 0 }}>
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
                label="Phone Number or Email *"
                value={ref.contact}
                onChangeText={onRefChange(i, 'contact')}
                mode="outlined"
                style={styles.input}
                error={!!refErrors[i]?.contact}
                left={<TextInput.Icon icon="phone-outline" />}
              />
              <HelperText type="error" visible={!!refErrors[i]?.contact}>{refErrors[i]?.contact}</HelperText>
            </View>
          ))}
        </View>

        <View style={styles.btnRow}>
          <SaveProfileButton onPress={handleSave} style={styles.btnFlex} label="Save Professional Info" />
        </View>

        <Text style={styles.hint}>* Required fields.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
