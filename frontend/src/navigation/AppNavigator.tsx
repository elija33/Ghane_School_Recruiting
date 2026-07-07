import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { RootStackParamList } from '../types';

import SplashScreen from '../components/shared/SplashScreen';
import OnboardingScreen from '../components/shared/OnboardingScreen';
import LoginScreen from '../components/shared/LoginScreen';
import RegisterScreen from '../components/shared/RegisterScreen';
import ForgotPasswordScreen from '../components/shared/ForgotPasswordScreen';
import TeacherProfileScreen from '../components/teacher/TeacherProfileScreen';
import ProfessionalScreen from '../components/teacher/ProfessionalScreen';
import DocumentReviewScreen from '../components/teacher/DocumentReviewScreen';
import TeacherNavigator from './TeacherNavigator';
import SchoolNavigator from './SchoolNavigator';
import AdminNavigator from './AdminNavigator';
import AdminLoginScreen from '../components/admin/AdminLoginScreen';
import AdminDashboardScreen from '../components/admin/dashboard/AdminDashboardScreen';
import ManageTeachersScreen from '../components/admin/ManageTeachersScreen';
import ManageSchoolsScreen from '../components/admin/ManageSchoolsScreen';
import SchoolReviewScreen from '../components/admin/SchoolReviewScreen';
import VerifiedTeachersScreen from '../components/admin/VerifiedTeachersScreen';
import PendingDocumentReviewScreen from '../components/admin/PendingDocumentReviewScreen';
import TeacherLoginScreen from '../components/teacher/TeacherLoginScreen';

export type AppType = 'teacher' | 'school' | 'all';

interface AppNavigatorProps {
  appType?: AppType;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({ appType = 'all' }: AppNavigatorProps) {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  const showTeacher = isAuthenticated && role === 'TEACHER' && (appType === 'all' || appType === 'teacher');
  const showSchool  = isAuthenticated && role === 'SCHOOL'  && (appType === 'all' || appType === 'school');
  const showAdmin   = isAuthenticated && role === 'ADMIN'   && appType === 'all';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="ManageSchools" component={ManageSchoolsScreen} />
          <Stack.Screen name="SchoolReview" component={SchoolReviewScreen} />
          <Stack.Screen name="ManageTeachers" component={ManageTeachersScreen} />
          <Stack.Screen name="VerifiedTeachers" component={VerifiedTeachersScreen} />
          <Stack.Screen name="PendingDocumentReview" component={PendingDocumentReviewScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} />
          <Stack.Screen name="TeacherProfessional" component={ProfessionalScreen} />
          <Stack.Screen name="TeacherDocuments" component={DocumentReviewScreen} />
        </>
      ) : (
        <>
          {showTeacher && <Stack.Screen name="TeacherApp" component={TeacherNavigator} />}
          {showSchool  && <Stack.Screen name="SchoolApp"  component={SchoolNavigator}  />}
          {showAdmin   && <Stack.Screen name="AdminApp"   component={AdminNavigator}   />}
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} />
          <Stack.Screen name="TeacherProfessional" component={ProfessionalScreen} />
          <Stack.Screen name="TeacherDocuments" component={DocumentReviewScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
