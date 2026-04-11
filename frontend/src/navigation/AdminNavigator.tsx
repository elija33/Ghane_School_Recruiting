import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageTeachersScreen from '../screens/admin/ManageTeachersScreen';
import TeacherVerificationScreen from '../screens/admin/TeacherVerificationScreen';
import ManageSchoolsScreen from '../screens/admin/ManageSchoolsScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1B4F72',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Dashboard: focused ? 'stats-chart' : 'stats-chart-outline',
            Teachers: focused ? 'people' : 'people-outline',
            Schools: focused ? 'business' : 'business-outline',
            Notifications: focused ? 'notifications' : 'notifications-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Teachers" component={ManageTeachersScreen} />
      <Tab.Screen name="Schools" component={ManageSchoolsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen
        name="ManageTeachers"
        component={ManageTeachersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageSchools"
        component={ManageSchoolsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeacherVerification"
        component={TeacherVerificationScreen}
        options={{ headerShown: true, title: 'Teacher Verification' }}
      />
    </Stack.Navigator>
  );
}
