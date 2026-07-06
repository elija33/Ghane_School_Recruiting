import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';

import { store, persistor } from './src/store';
import AppNavigator, { AppType } from './src/navigation/AppNavigator';

const appType = (process.env.EXPO_PUBLIC_APP_TYPE ?? 'all') as AppType;
const appTitle = appType === 'school' ? 'Gh_School' : 'Gh_Teacher';

const schoolTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2C3E50',
    secondary: '#E67E22',
    tertiary: '#27AE60',
    surface: '#FFFFFF',
    background: '#F5F6FA',
  },
};

const teacherTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1B4F72',
    secondary: '#2E86C1',
    tertiary: '#F39C12',
    surface: '#FFFFFF',
    background: '#F5F6FA',
  },
};

const theme = appType === 'school' ? schoolTheme : teacherTheme;

// URL → screen mapping so browser refresh restores the current page
const linking: any = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      // ── Unauthenticated ──────────────────────────────────────────
      Splash:                '',
      Onboarding:            'onboarding',
      Login:                 'login',
      Register:              'register',
      TeacherLogin:          'teacher-login',
      AdminLogin:            'admin-login',
      ForgotPassword:        'forgot-password',
      TeacherProfile:        'profile',
      TeacherProfessional:   'professional',
      TeacherDocuments:      'documents',

      // ── Admin bypass (no auth required) ─────────────────────────
      AdminDashboard:        'admin',
      ManageSchools:         'admin/schools',
      ManageTeachers:        'admin/teachers',
      VerifiedTeachers:      'admin/teachers/verified',
      PendingDocumentReview: 'admin/teachers/pending',

      // ── Authenticated: Teacher ───────────────────────────────────
      TeacherApp: {
        screens: {
          TeacherTabs: {
            screens: {
              Dashboard:        'teacher',
              Jobs:             'teacher/jobs',
              Applications:     'teacher/applications',
              'View My Profile':'teacher/my-profile',
              Notifications:    'teacher/notifications',
            },
          },
          EditProfile:   'teacher/edit-profile',
          UploadResume:  'teacher/upload-resume',
          TakePhoto:     'teacher/photo',
          RecordVideo:   'teacher/video',
          JobDetail:     'teacher/job/:jobId',
          ApplyJob:      'teacher/apply/:jobId',
        },
      },

      // ── Authenticated: School ─────────────────────────────────────
      SchoolApp: {
        screens: {
          SchoolTabs: {
            screens: {
              Dashboard:         'school',
              Teachers:          'school/teachers',
              Jobs:              'school/jobs',
              Profile:           'school/profile',
              Notifications:     'school/notifications',
            },
          },
          Subscription:      'school/subscription',
          PostJob:           'school/post-job',
          ManageJobs:        'school/manage-jobs',
          BrowseTeachers:    'school/browse-teachers',
          TeacherProfileView:'school/teacher/:teacherId',
          Applications:      'school/applications',
          ApplicationDetail: 'school/application/:applicationId',
        },
      },

      // ── Authenticated: Admin ──────────────────────────────────────
      AdminApp: {
        screens: {
          AdminTabs: {
            screens: {
              Dashboard:     'admin-app',
              Teachers:      'admin-app/teachers',
              Schools:       'admin-app/schools',
              Notifications: 'admin-app/notifications',
            },
          },
          ManageTeachers:    'admin-app/manage-teachers',
          ManageSchools:     'admin-app/manage-schools',
          TeacherVerification:'admin-app/verification/:teacherId',
        },
      },
    },
  },
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>App Error</Text>
          <Text style={{ color: '#333', fontSize: 13 }}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={theme}>
              <NavigationContainer
                linking={linking}
                documentTitle={{ formatter: () => appTitle }}
              >
                <StatusBar style="light" />
                <AppNavigator appType={appType} />
              </NavigationContainer>
            </PaperProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
