import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSchoolProfile, fetchSchoolJobs, fetchSubscriptionStatus } from '../../store/slices/schoolSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { SchoolStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<SchoolStackParamList>;

export default function SchoolDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { profile, jobs, subscription } = useAppSelector((s) => s.school);

  useEffect(() => {
    dispatch(fetchSchoolProfile());
    dispatch(fetchSchoolJobs());
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  const isSubscriptionActive = subscription?.status === 'ACTIVE';
  const activeJobs = jobs.filter((j) => j.isActive).length;

  const quickActions = [
    { icon: 'add-circle-outline', label: 'Post a Job', color: '#1B4F72', onPress: () => navigation.navigate('PostJob') },
    { icon: 'people-outline', label: 'Browse Teachers', color: '#8E44AD', onPress: () => navigation.navigate('BrowseTeachers') },
    { icon: 'briefcase-outline', label: 'Manage Jobs', color: '#27AE60', onPress: () => navigation.navigate('ManageJobs') },
    { icon: 'card-outline', label: 'Subscription', color: '#E67E22', onPress: () => navigation.navigate('Subscription') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.schoolName}>{profile?.schoolName ?? 'School'}</Text>
        </View>
        <TouchableOpacity onPress={() => dispatch(logoutUser())} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Subscription Banner */}
      {!isSubscriptionActive && (
        <TouchableOpacity onPress={() => navigation.navigate('Subscription')}>
          <View style={styles.subBanner}>
            <Ionicons name="warning-outline" size={20} color="#E67E22" />
            <Text style={styles.subBannerText}>
              Subscribe to post jobs and browse teachers
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#E67E22" />
          </View>
        </TouchableOpacity>
      )}

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Active Jobs', value: activeJobs, color: '#27AE60', icon: 'briefcase' },
          { label: 'Total Jobs', value: jobs.length, color: '#1B4F72', icon: 'layers' },
          { label: 'Subscription', value: isSubscriptionActive ? 'Active' : 'Inactive', color: isSubscriptionActive ? '#27AE60' : '#E74C3C', icon: 'card' },
          { label: 'Plan', value: profile?.subscriptionTier ?? '—', color: '#8E44AD', icon: 'star' },
        ].map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name={stat.icon as any} size={22} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((a) => (
          <TouchableOpacity key={a.label} style={styles.actionCard} onPress={a.onPress}>
            <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
              <Ionicons name={a.icon as any} size={28} color={a.color} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Jobs</Text>
          {jobs.slice(0, 3).map((job) => (
            <Card key={job.id} style={styles.jobCard}>
              <Card.Content style={styles.jobContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobMeta}>{job.subject} · {job.location}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: job.isActive ? '#27AE60' : '#BDC3C7' }]} />
              </Card.Content>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  schoolName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  logoutBtn: { padding: 8 },
  subBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F39C12',
    gap: 8,
  },
  subBannerText: { flex: 1, fontSize: 13, color: '#E67E22', fontWeight: '500' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: { width: '47%', borderRadius: 12, elevation: 2 },
  statContent: { alignItems: 'center', paddingVertical: 16, gap: 6 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#7F8C8D', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginHorizontal: 16, marginTop: 8, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
  actionCard: {
    width: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  actionIcon: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#2C3E50', textAlign: 'center' },
  jobCard: { marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  jobContent: { flexDirection: 'row', alignItems: 'center' },
  jobTitle: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  jobMeta: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
});
