import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser } from '../../store/slices/authSlice';
import { RootStackParamList, UserRole } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const appType = process.env.EXPO_PUBLIC_APP_TYPE ?? 'teacher';
const isSchoolApp = appType === 'school';
const primaryColor = isSchoolApp ? '#2C3E50' : '#1B4F72';

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(isSchoolApp ? 'SCHOOL' : 'TEACHER');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    await dispatch(registerUser({ email: email.trim().toLowerCase(), password, role }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.header, { backgroundColor: primaryColor }]}>
          <Text style={styles.title}>
            {isSchoolApp ? 'School Portal' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {isSchoolApp
              ? 'Post jobs and find qualified teachers'
              : 'Join the Ghana Teacher Recruiting Platform'}
          </Text>
        </View>

        <View style={styles.form}>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}


          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!fieldErrors.email}
          />
          <HelperText type="error" visible={!!fieldErrors.email}>{fieldErrors.email}</HelperText>

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
            style={styles.input}
            error={!!fieldErrors.password}
          />
          <HelperText type="error" visible={!!fieldErrors.password}>{fieldErrors.password}</HelperText>

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            error={!!fieldErrors.confirmPassword}
          />
          <HelperText type="error" visible={!!fieldErrors.confirmPassword}>{fieldErrors.confirmPassword}</HelperText>

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
            buttonColor={primaryColor}
          >
            {isSchoolApp ? 'Create School Account' : 'Create Account'}
          </Button>

          <View style={styles.loginRow}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: primaryColor }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F6FA' },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  form: { padding: 24 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  roleLabel: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 12 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleChip: { flex: 1, borderWidth: 2, borderColor: '#D5D8DC' },
  roleChipSelected: { borderColor: primaryColor, backgroundColor: '#EBF5FB' },
  roleChipTextSelected: { color: primaryColor, fontWeight: '600' },
  input: { marginBottom: 4 },
  button: { borderRadius: 12, marginTop: 8, marginBottom: 24 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  linkText: { fontWeight: '600' },
});
