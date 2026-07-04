import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, HelperText, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1B4F72';
const GREEN = '#4CAF50';

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Username is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    await dispatch(loginUser({ email: email.trim().toLowerCase(), password }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F5F8FA' }} keyboardShouldPersistTaps="handled">

        {/* Hero section */}
        <View style={{ backgroundColor: PRIMARY, alignItems: 'center', paddingTop: 64, paddingBottom: 40, paddingHorizontal: 32 }}>
          <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <Ionicons name="school-outline" size={72} color="rgba(255,255,255,0.9)" />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 }}>
            Find Teaching Jobs in Ghana
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)', textAlign: 'center', lineHeight: 23 }}>
            Browse hundreds of verified teaching positions across Ghana. Apply directly from your phone with a single tap.
          </Text>
        </View>

        {/* Login form */}
        <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 8 }}>
        <View style={{ width: '100%', maxWidth: 480, paddingHorizontal: 24 }}>
          {error && (
            <View style={{ backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#E74C3C', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="alert-circle-outline" size={18} color="#E74C3C" />
              <Text style={{ color: '#C0392B', fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          )}

          <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 }}>Username</Text>
          <TextInput
            placeholder="Enter Username"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ backgroundColor: '#fff', marginBottom: 2 }}
            error={!!fieldErrors.email}
            activeOutlineColor={PRIMARY}
          />
          <HelperText type="error" visible={!!fieldErrors.email}>{fieldErrors.email}</HelperText>

          <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 6, marginTop: 8 }}>Password</Text>
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={{ backgroundColor: '#fff', marginBottom: 2 }}
            error={!!fieldErrors.password}
            right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword((v) => !v)} />}
            activeOutlineColor={PRIMARY}
          />
          <HelperText type="error" visible={!!fieldErrors.password}>{fieldErrors.password}</HelperText>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{ borderRadius: 6, marginTop: 16, marginBottom: 12 }}
            contentStyle={{ paddingVertical: 6 }}
            buttonColor={GREEN}
          >
            Login
          </Button>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe((v) => !v)}
                color={GREEN}
              />
              <Text style={{ fontSize: 14, color: '#333' }}>Remember me</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={{ fontSize: 13, color: PRIMARY, fontWeight: '600', textDecorationLine: 'underline' }}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ fontSize: 14, color: '#555' }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ fontSize: 14, color: PRIMARY, fontWeight: '700' }}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Admin access */}
          <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')} style={{ alignItems: 'center', paddingBottom: 16 }}>
            <Text style={{ fontSize: 12, color: '#aaa' }}>Admin Access</Text>
          </TouchableOpacity>
        </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
