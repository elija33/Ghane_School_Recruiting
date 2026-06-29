import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style/ForgotPasswordScreen.styles';

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

