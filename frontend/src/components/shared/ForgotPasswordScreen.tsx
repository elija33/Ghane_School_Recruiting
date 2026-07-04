import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { RootStackParamList } from '../../types';
import styles from './style/ForgotPasswordScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1B4F72';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const validate = () => {
    if (!email.trim()) { setError('Please enter your email address'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError('');
    setNotFound(false);
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSubmitted(true);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err?.response?.data?.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#EAF7EE', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Ionicons name="mail" size={44} color="#27AE60" />
        </View>
        <Text style={styles.successTitle}>Check Your Email</Text>
        <Text style={styles.successMessage}>
          A password reset link has been sent to{'\n'}
          <Text style={{ fontWeight: '700', color: PRIMARY }}>{email}</Text>
          {'\n\n'}The link expires in 1 hour.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
          buttonColor={PRIMARY}
        >
          Back to Login
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Ionicons name="lock-open-outline" size={64} color={PRIMARY} style={styles.icon} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email and we'll send you a reset link.
          </Text>

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); setNotFound(false); }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!error || notFound}
            activeOutlineColor={PRIMARY}
          />

          {/* Email not found error */}
          {notFound && (
            <View style={{ backgroundColor: '#FEF2F2', borderRadius: 8, padding: 14, marginTop: 4, borderLeftWidth: 4, borderLeftColor: '#E74C3C' }}>
              <Text style={{ fontSize: 14, color: '#C0392B', fontWeight: '600', marginBottom: 6 }}>
                The email you entered is not recognizable.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={{ fontSize: 13, color: '#555' }}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={{ fontSize: 13, color: PRIMARY, fontWeight: '700', textDecorationLine: 'underline' }}>
                    Create an account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <HelperText type="error" visible={!!error}>{error}</HelperText>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={[styles.button, { marginTop: notFound ? 16 : 0 }]}
            contentStyle={{ paddingVertical: 8 }}
            buttonColor={PRIMARY}
          >
            Send Reset Link
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
