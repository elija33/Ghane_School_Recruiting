import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { RootStackParamList } from '../types';

import SplashScreen from '../screens/shared/SplashScreen';
import OnboardingScreen from '../screens/shared/OnboardingScreen';
import LoginScreen from '../screens/shared/LoginScreen';
import RegisterScreen from '../screens/shared/RegisterScreen';
import ForgotPasswordScreen from '../screens/shared/ForgotPasswordScreen';
import TeacherNavigator from './TeacherNavigator';
import SchoolNavigator from './SchoolNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          {role === 'TEACHER' && <Stack.Screen name="TeacherApp" component={TeacherNavigator} />}
          {role === 'SCHOOL'  && <Stack.Screen name="SchoolApp"  component={SchoolNavigator}  />}
          {role === 'ADMIN'   && <Stack.Screen name="AdminApp"   component={AdminNavigator}   />}
        </>
      )}
    </Stack.Navigator>
  );
}
