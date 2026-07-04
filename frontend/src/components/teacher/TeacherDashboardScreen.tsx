import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { fetchTeacherApplications } from '../../store/slices/teacherSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { TeacherStackParamList, ApplicationStatus, RootStackParamList } from '../../types';
import styles from './styles/TeacherDashboardScreen.styles';

type Nav = NativeStackNavigationProp<TeacherStackParamList>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  SUBMITTED: '#3498DB',
  UNDER_REVIEW: '#F39C12',
  SHORTLISTED: '#8E44AD',
  INTERVIEW_REQUESTED: '#1ABC9C',
  REJECTED: '#E74C3C',
  HIRED: '#27AE60',
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_REQUESTED: 'Interview Requested',
  REJECTED: 'Rejected',
  HIRED: 'Hired',
};

export default function TeacherDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation<RootNav>();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((s) => s.teacher);
  const { applications } = useAppSelector((s) => s.teacher);

  useEffect(() => {
    dispatch(fetchTeacherProfile());
    dispatch(fetchTeacherApplications());
  }, [dispatch]);

  const handleLogout = () => dispatch(logoutUser());

  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    hired: applications.filter((a) => a.status === 'HIRED').length,
    interviews: applications.filter((a) => a.status === 'INTERVIEW_REQUESTED').length,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{profile?.fullName ?? 'Teacher'} 👋</Text>
        </View>
        <Button
          mode="text"
          textColor="#FFFFFF"
          onPress={handleLogout}
          icon="logout"
        >
          Logout
        </Button>
      </View>

      {/* Verification Badge */}
      {profile && (
        <Card style={styles.verificationCard}>
          <Card.Content style={styles.verificationContent}>
            <Ionicons
              name={profile.verificationStatus === 'VERIFIED' ? 'shield-checkmark' : 'shield-outline'}
              size={28}
              color={profile.verificationStatus === 'VERIFIED' ? '#27AE60' : '#F39C12'}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.verificationTitle}>Profile Status</Text>
              <Text style={[
                styles.verificationStatus,
                { color: profile.verificationStatus === 'VERIFIED' ? '#27AE60' : '#F39C12' }
              ]}>
                {profile.verificationStatus.replace('_', ' ')}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, icon: 'documents-outline', color: '#3498DB' },
          { label: 'Shortlisted', value: stats.shortlisted, icon: 'star-outline', color: '#8E44AD' },
          { label: 'Interviews', value: stats.interviews, icon: 'calendar-outline', color: '#1ABC9C' },
          { label: 'Hired', value: stats.hired, icon: 'checkmark-circle-outline', color: '#27AE60' },
        ].map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {[
          { label: 'Browse Jobs', icon: 'search-outline', screen: 'Jobs' },
          { label: 'Register Account', icon: 'person-add-outline', screen: 'TeacherProfile' },
          { label: 'Applications', icon: 'list-outline', screen: 'Applications' },
        ].map((action) => (
          <Card
            key={action.label}
            style={styles.actionCard}
            onPress={() => {
              if (action.screen === 'TeacherProfile') {
                rootNavigation.navigate('TeacherProfile');
              } else {
                (navigation.navigate as any)(action.screen);
              }
            }}
          >
            <Card.Content style={styles.actionContent}>
              <Ionicons name={action.icon as any} size={28} color="#1B4F72" />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          {applications.slice(0, 3).map((app) => (
            <Card key={app.id} style={styles.appCard}>
              <Card.Content>
                <Text style={styles.appJobTitle}>{app.jobTitle}</Text>
                <Text style={styles.appSchool}>{app.schoolName}</Text>
                <Chip
                  style={[styles.statusChip, { backgroundColor: STATUS_COLORS[app.status] + '20' }]}
                  textStyle={{ color: STATUS_COLORS[app.status], fontWeight: '600' }}
                >
                  {STATUS_LABELS[app.status]}
                </Chip>
              </Card.Content>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

