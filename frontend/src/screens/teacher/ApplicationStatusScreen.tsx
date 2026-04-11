import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTeacherApplications } from '../../store/slices/teacherSlice';
import { Application, ApplicationStatus } from '../../types';

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; icon: string; label: string }> = {
  SUBMITTED:           { color: '#3498DB', icon: 'paper-plane-outline',        label: 'Submitted' },
  UNDER_REVIEW:        { color: '#F39C12', icon: 'eye-outline',                 label: 'Under Review' },
  SHORTLISTED:         { color: '#8E44AD', icon: 'star-outline',                label: 'Shortlisted' },
  INTERVIEW_REQUESTED: { color: '#1ABC9C', icon: 'calendar-outline',            label: 'Interview Requested' },
  REJECTED:            { color: '#E74C3C', icon: 'close-circle-outline',        label: 'Rejected' },
  HIRED:               { color: '#27AE60', icon: 'checkmark-circle-outline',    label: 'Hired 🎉' },
};

export default function ApplicationStatusScreen() {
  const dispatch = useAppDispatch();
  const { applications, loading } = useAppSelector((s) => s.teacher);

  useEffect(() => {
    dispatch(fetchTeacherApplications());
  }, [dispatch]);

  const renderItem = ({ item }: { item: Application }) => {
    const config = STATUS_CONFIG[item.status];
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle}>{item.jobTitle}</Text>
              <Text style={styles.schoolName}>{item.schoolName}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: config.color + '18' }]}>
              <Ionicons name={config.icon as any} size={16} color={config.color} />
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={13} color="#BDC3C7" />
            <Text style={styles.dateText}>
              Applied {format(new Date(item.appliedAt), 'MMM d, yyyy')}
            </Text>
            {item.updatedAt !== item.appliedAt && (
              <Text style={styles.dateText}>
                · Updated {format(new Date(item.updatedAt), 'MMM d')}
              </Text>
            )}
          </View>
          {item.screeningAnswers.length > 0 && (
            <Text style={styles.answersNote}>
              {item.screeningAnswers.length} screening answer{item.screeningAnswers.length > 1 ? 's' : ''} submitted
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const activeCount = applications.filter((a) => !['REJECTED', 'HIRED'].includes(a.status)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSub}>
          {applications.length} total · {activeCount} active
        </Text>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={() => dispatch(fetchTeacherApplications())}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="documents-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyTitle}>No Applications Yet</Text>
              <Text style={styles.emptySub}>
                Browse jobs and apply to get started!
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 },
  list: { padding: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50', marginBottom: 2 },
  schoolName: { fontSize: 13, color: '#1B4F72', fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  statusText: { fontSize: 12, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, color: '#BDC3C7' },
  answersNote: { fontSize: 12, color: '#7F8C8D', marginTop: 6, fontStyle: 'italic' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#BDC3C7' },
  emptySub: { fontSize: 14, color: '#D5D8DC', textAlign: 'center' },
});
