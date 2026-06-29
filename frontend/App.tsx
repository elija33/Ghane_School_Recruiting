import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
              <NavigationContainer documentTitle={{ formatter: () => appTitle }}>
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
