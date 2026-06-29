import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { adminService, AdminAnalytics } from '../../services/adminService';
import { AdminStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';
import styles from './style/AdminDashboardScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

export default function AdminDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch {
        // non-fatal — show empty stats
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = analytics
    ? [
        { label: 'Total Teachers', value: analytics.totalTeachers, color: '#1B4F72', icon: 'person-outline' },
        { label: 'Total Schools', value: analytics.totalSchools, color: '#8E44AD', icon: 'business-outline' },
        { label: 'Verified Teachers', value: analytics.verifiedTeachers, color: '#27AE60', icon: 'shield-checkmark-outline' },
        { label: 'Active Subscriptions', value: analytics.activeSubscriptions, color: '#E67E22', icon: 'card-outline' },
        { label: 'Pending Verifications', value: analytics.pendingVerificationTeachers, color: '#E74C3C', icon: 'time-outline' },
        { label: 'Total Applications', value: analytics.totalApplications, color: '#3498DB', icon: 'documents-outline' },
      ]
    : [];

  const quickActions = [
    {
      icon: 'people-outline',
      label: 'Manage Teachers',
      color: '#1B4F72',
      onPress: () => navigation.navigate('ManageTeachers'),
    },
    {
      icon: 'business-outline',
      label: 'Manage Schools',
      color: '#8E44AD',
      onPress: () => navigation.navigate('ManageSchools'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.title}>Ghana Teacher Recruiting</Text>
        </View>
        <TouchableOpacity onPress={() => dispatch(logoutUser())} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Pending Verification Alert */}
      {analytics && analytics.pendingVerificationTeachers > 0 && (
        <TouchableOpacity onPress={() => navigation.navigate('ManageTeachers')}>
          <View style={styles.alertBanner}>
            <Ionicons name="alert-circle" size={20} color="#E74C3C" />
            <Text style={styles.alertText}>
              {analytics.pendingVerificationTeachers} teacher{analytics.pendingVerificationTeachers > 1 ? 's' : ''} awaiting verification
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#E74C3C" />
          </View>
        </TouchableOpacity>
      )}

      {/* Analytics Grid */}
      <Text style={styles.sectionTitle}>Platform Overview</Text>
      {loading ? (
        <View style={styles.loadingPlaceholder}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      ) : (
        <View style={styles.statsGrid}>
          {statCards.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {quickActions.map((a) => (
          <TouchableOpacity key={a.label} style={styles.actionCard} onPress={a.onPress}>
            <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
              <Ionicons name={a.icon as any} size={32} color={a.color} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

