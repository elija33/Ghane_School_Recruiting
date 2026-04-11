import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import SchoolDashboardScreen from '../screens/school/SchoolDashboardScreen';
import SchoolProfileScreen from '../screens/school/SchoolProfileScreen';
import SubscriptionScreen from '../screens/school/SubscriptionScreen';
import PostJobScreen from '../screens/school/PostJobScreen';
import ManageJobsScreen from '../screens/school/ManageJobsScreen';
import BrowseTeachersScreen from '../screens/school/BrowseTeachersScreen';
import TeacherProfileViewScreen from '../screens/school/TeacherProfileViewScreen';
import ApplicationsScreen from '../screens/school/ApplicationsScreen';
import ApplicationDetailScreen from '../screens/school/ApplicationDetailScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SchoolTabs() {
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
            Teachers: focused ? 'people' : 'people-outline',
            Jobs: focused ? 'briefcase' : 'briefcase-outline',
            Profile: focused ? 'business' : 'business-outline',
            Notifications: focused ? 'notifications' : 'notifications-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={SchoolDashboardScreen} />
      <Tab.Screen name="Teachers" component={BrowseTeachersScreen} />
      <Tab.Screen name="Jobs" component={ManageJobsScreen} />
      <Tab.Screen name="Profile" component={SchoolProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

export default function SchoolNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SchoolTabs" component={SchoolTabs} />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ headerShown: true, title: 'Subscription Plans' }}
      />
      <Stack.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{ headerShown: true, title: 'Post a Job' }}
      />
      <Stack.Screen
        name="ManageJobs"
        component={ManageJobsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseTeachers"
        component={BrowseTeachersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeacherProfileView"
        component={TeacherProfileViewScreen}
        options={{ headerShown: true, title: 'Teacher Profile' }}
      />
      <Stack.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{ headerShown: true, title: 'Applications' }}
      />
      <Stack.Screen
        name="ApplicationDetail"
        component={ApplicationDetailScreen}
        options={{ headerShown: true, title: 'Application Detail' }}
      />
    </Stack.Navigator>
  );
}
