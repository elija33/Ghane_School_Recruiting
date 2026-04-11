import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchApplicationsForJob } from '../../store/slices/schoolSlice';
import { Application, ApplicationStatus, SchoolStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<SchoolStackParamList>;
type Route = RouteProp<SchoolStackParamList, 'Applications'>;

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; label: string }> = {
  SUBMITTED:           { color: '#3498DB', label: 'Submitted' },
  UNDER_REVIEW:        { color: '#F39C12', label: 'Under Review' },
  SHORTLISTED:         { color: '#8E44AD', label: 'Shortlisted' },
  INTERVIEW_REQUESTED: { color: '#1ABC9C', label: 'Interview' },
  REJECTED:            { color: '#E74C3C', label: 'Rejected' },
  HIRED:               { color: '#27AE60', label: 'Hired' },
};

export default function ApplicationsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { jobId, jobTitle } = route.params;
  const dispatch = useAppDispatch();
  const { applications, loading } = useAppSelector((s) => s.school);

  useEffect(() => {
    dispatch(fetchApplicationsForJob(jobId));
  }, [dispatch, jobId]);

  const renderItem = ({ item }: { item: Application }) => {
    const config = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ApplicationDetail', {
            applicationId: item.id,
            jobTitle,
          })
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardRow}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={22} color="#1B4F72" />
              </View>
              <View style={styles.info}>
                <Text style={styles.teacherName}>
                  {item.teacherName ?? item.teacherEmail}
                </Text>
                <Text style={styles.teacherEmail}>{item.teacherEmail}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={12} color="#BDC3C7" />
                  <Text style={styles.metaText}>
                    Applied {format(new Date(item.appliedAt), 'MMM d, yyyy')}
                  </Text>
                </View>
                {item.screeningAnswers.length > 0 && (
                  <Text style={styles.answersNote}>
                    {item.screeningAnswers.length} answer{item.screeningAnswers.length > 1 ? 's' : ''} submitted
                  </Text>
                )}
              </View>
              <Chip
                compact
                style={{ backgroundColor: config.color + '18' }}
                textStyle={{ color: config.color, fontSize: 11, fontWeight: '600' }}
              >
                {config.label}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const counts = Object.entries(STATUS_CONFIG).map(([status, cfg]) => ({
    status,
    label: cfg.label,
    color: cfg.color,
    count: applications.filter((a) => a.status === status).length,
  })).filter((c) => c.count > 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={2}>{jobTitle}</Text>
        <Text style={styles.headerSub}>{applications.length} total applications</Text>
        {counts.length > 0 && (
          <View style={styles.countsRow}>
            {counts.map((c) => (
              <View key={c.status} style={[styles.countBadge, { backgroundColor: c.color + '22' }]}>
                <Text style={[styles.countNum, { color: c.color }]}>{c.count}</Text>
                <Text style={[styles.countLabel, { color: c.color }]}>{c.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={() => dispatch(fetchApplicationsForJob(jobId))}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyTitle}>No Applications Yet</Text>
              <Text style={styles.emptySub}>
                Applications from teachers will appear here.
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
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4, marginBottom: 12 },
  countsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', gap: 4, alignItems: 'center' },
  countNum: { fontSize: 14, fontWeight: 'bold' },
  countLabel: { fontSize: 11, fontWeight: '600' },
  list: { padding: 16 },
  card: { marginBottom: 10, borderRadius: 14, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  teacherName: { fontSize: 15, fontWeight: '700', color: '#2C3E50' },
  teacherEmail: { fontSize: 12, color: '#7F8C8D', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#BDC3C7' },
  answersNote: { fontSize: 12, color: '#7F8C8D', fontStyle: 'italic', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#BDC3C7' },
  emptySub: { fontSize: 14, color: '#D5D8DC', textAlign: 'center' },
});
