import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    // In a production app, this would call the forgot-password API endpoint.
    // The server sends a reset link to the user's email.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="mail-outline" size={80} color="#1B4F72" />
        <Text style={styles.successTitle}>Check Your Email</Text>
        <Text style={styles.successMessage}>
          If an account exists for {email}, you will receive a password reset link shortly.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
          buttonColor="#1B4F72"
        >
          Back to Login
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1B4F72" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Ionicons name="lock-open-outline" size={64} color="#1B4F72" style={styles.icon} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a reset link.
          </Text>

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!error}
          />
          <HelperText type="error" visible={!!error}>{error}</HelperText>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
            buttonColor="#1B4F72"
          >
            Send Reset Link
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  backButton: { padding: 16, paddingTop: 56 },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  icon: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  input: { width: '100%', marginBottom: 4 },
  button: { width: '100%', borderRadius: 12, marginTop: 8 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 24, marginBottom: 16 },
  successMessage: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
});
