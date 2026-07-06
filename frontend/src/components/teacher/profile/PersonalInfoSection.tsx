import React, { useRef } from 'react';
import { ActivityIndicator, Platform, TouchableOpacity, View } from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TeacherProfileScreen.styles';
import { FormData, FormErrors } from './types';

// "DD/MM/YYYY" → "YYYY-MM-DD" for the HTML date input value
function toInputValue(dmy: string): string {
  const [d, m, y] = dmy.split('/');
  if (!d || !m || !y) return '';
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// "YYYY-MM-DD" → "DD/MM/YYYY" for display
function fromInputValue(ymd: string): string {
  const [y, m, d] = ymd.split('-');
  if (!d || !m || !y) return '';
  return `${d}/${m}/${y}`;
}

interface Props {
  form: Pick<FormData, 'fullName' | 'dateOfBirth' | 'phone' | 'email' | 'region' | 'city'>;
  errors: FormErrors;
  regions: string[];
  regionsLoading?: boolean;
  onChange: (key: keyof FormData) => (val: string) => void;
}

export default function PersonalInfoSection({ form, errors, regions, regionsLoading, onChange }: Props) {
  const dateInputRef = useRef<any>(null);

  const openDatePicker = () => {
    if (Platform.OS === 'web' && dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch {
        dateInputRef.current.click();
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Ionicons name="person-outline" size={20} color="#1B4F72" />
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>

      <TextInput label="Full Name *" value={form.fullName} onChangeText={onChange('fullName')}
        mode="outlined" style={styles.input} error={!!errors.fullName}
        left={<TextInput.Icon icon="account" />} />
      <HelperText type="error" visible={!!errors.fullName}>{errors.fullName}</HelperText>

      <View>
        <TextInput
          label="Date of Birth *"
          value={form.dateOfBirth}
          onChangeText={onChange('dateOfBirth')}
          mode="outlined"
          placeholder="DD/MM/YYYY"
          style={styles.input}
          error={!!errors.dateOfBirth}
          left={<TextInput.Icon icon="calendar" onPress={openDatePicker} />}
        />
        <HelperText type="error" visible={!!errors.dateOfBirth}>{errors.dateOfBirth}</HelperText>
        {Platform.OS === 'web' && React.createElement('input', {
          ref: dateInputRef,
          type: 'date',
          value: toInputValue(form.dateOfBirth),
          max: (() => {
            const d = new Date();
            d.setFullYear(d.getFullYear() - 21);
            return d.toISOString().split('T')[0];
          })(),
          style: { position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 },
          onChange: (e: any) => {
            const val = e.target.value;
            if (val) onChange('dateOfBirth')(fromInputValue(val));
          },
        })}
      </View>

      <TextInput label="Phone Number *" value={form.phone} onChangeText={onChange('phone')}
        mode="outlined" keyboardType="phone-pad" style={styles.input} error={!!errors.phone}
        left={<TextInput.Icon icon="phone" />} />
      <HelperText type="error" visible={!!errors.phone}>{errors.phone}</HelperText>

      <TextInput label="Email Address" value={form.email} onChangeText={onChange('email')}
        mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input}
        error={!!errors.email} left={<TextInput.Icon icon="email-outline" />} />
      <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>

      <Text style={styles.fieldLabel}>Region *</Text>
      {regionsLoading ? (
        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
          <ActivityIndicator color="#1B4F72" />
        </View>
      ) : (
        <View style={styles.chipGrid}>
          {regions.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, form.region === r && styles.chipSelected]}
              onPress={() => onChange('region')(r)}
            >
              <Text style={[styles.chipText, form.region === r && styles.chipTextSelected]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {!!errors.region && <Text style={styles.errorText}>{errors.region}</Text>}

      <TextInput label="City / Town" value={form.city} onChangeText={onChange('city')}
        mode="outlined" style={[styles.input, { marginTop: 12 }]}
        left={<TextInput.Icon icon="map-marker" />} />
    </View>
  );
}
