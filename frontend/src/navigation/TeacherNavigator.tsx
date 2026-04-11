import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import TeacherProfileScreen from '../screens/teacher/TeacherProfileScreen';
import UploadResumeScreen from '../screens/teacher/UploadResumeScreen';
import TakePhotoScreen from '../screens/teacher/TakePhotoScreen';
import RecordVideoScreen from '../screens/teacher/RecordVideoScreen';
import BrowseJobsScreen from '../screens/teacher/BrowseJobsScreen';
import JobDetailScreen from '../screens/teacher/JobDetailScreen';
import ApplyJobScreen from '../screens/teacher/ApplyJobScreen';
import ApplicationStatusScreen from '../screens/teacher/ApplicationStatusScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1B4F72',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: { paddingBottom: 5 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Dashboard: focused ? 'home' : 'home-outline',
            Profile: focused ? 'person' : 'person-outline',
            Jobs: focused ? 'briefcase' : 'briefcase-outline',
            Applications: focused ? 'document-text' : 'document-text-outline',
            Notifications: focused ? 'notifications' : 'notifications-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboardScreen} />
      <Tab.Screen name="Jobs" component={BrowseJobsScreen} />
      <Tab.Screen name="Applications" component={ApplicationStatusScreen} />
      <Tab.Screen name="Profile" component={TeacherProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

export default function TeacherNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
      <Stack.Screen name="UploadResume" component={UploadResumeScreen} />
      <Stack.Screen name="TakePhoto" component={TakePhotoScreen} />
      <Stack.Screen name="RecordVideo" component={RecordVideoScreen} />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{ headerShown: true, title: 'Job Details' }}
      />
      <Stack.Screen
        name="ApplyJob"
        component={ApplyJobScreen}
        options={{ headerShown: true, title: 'Apply for Job' }}
      />
    </Stack.Navigator>
  );
}
