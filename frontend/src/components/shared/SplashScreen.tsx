import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useAppSelector } from '../../store';
import styles from './style/SplashScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useAppSelector(s => s.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace('Onboarding');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>GH</Text>
        </View>
        <Text style={styles.appName}>Teacher Recruiting</Text>
        <Text style={styles.tagline}>Connect • Verify • Hire</Text>
      </View>
    </View>
  );
}

