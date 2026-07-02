import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TeacherProfileScreen.styles';
import { FormData, FormErrors } from './types';

const SUBJECTS = [
  'Mathematics', 'English Language', 'Science', 'Social Studies', 'ICT', 'French',
  'Physical Education', 'Music', 'Art & Design', 'Religious & Moral Education',
  'History', 'Geography', 'Economics', 'Business Studies', 'Agriculture', 'Technical Drawing',
];

interface Props {
  form: Pick<FormData, 'subjects' | 'otherSubject' | 'experience' | 'bio'>;
  errors: FormErrors;
  onChange: (key: keyof FormData) => (val: string) => void;
  onToggleSubject: (subject: string) => void;
}

export default function ProfessionalInfoSection({ form, errors, onChange, onToggleSubject }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Ionicons name="school-outline" size={20} color="#1B4F72" />
        <Text style={styles.sectionTitle}>Professional Information</Text>
      </View>

      <Text style={styles.fieldLabel}>Subject Specialization * (select all that apply)</Text>
      <View style={styles.chipGrid}>
        {SUBJECTS.map((s) => {
          const selected = form.subjects.includes(s);
          return (
            <TouchableOpacity key={s} style={[styles.chip, selected && styles.chipSelected]} onPress={() => onToggleSubject(s)}>
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!errors.subjects && <Text style={styles.errorText}>{errors.subjects}</Text>}

      <TextInput label="Other Subject (if not listed)" value={form.otherSubject} onChangeText={onChange('otherSubject')}
        mode="outlined" style={[styles.input, { marginTop: 12 }]} />

      <TextInput label="Years of Experience *" value={form.experience} onChangeText={onChange('experience')}
        mode="outlined" keyboardType="numeric" style={styles.input} error={!!errors.experience}
        left={<TextInput.Icon icon="briefcase" />} />
      <HelperText type="error" visible={!!errors.experience}>{errors.experience}</HelperText>

      <TextInput label="About Yourself *" value={form.bio} onChangeText={onChange('bio')}
        mode="outlined" multiline numberOfLines={4} style={styles.input}
        error={!!errors.bio}
        placeholder="Tell schools a bit about yourself, your teaching style and goals..." />
      <HelperText type="error" visible={!!errors.bio}>{errors.bio}</HelperText>
    </View>
  );
}
