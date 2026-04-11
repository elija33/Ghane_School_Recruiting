import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, Searchbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../../services/adminService';
import { TeacherProfile, VerificationStatus, AdminStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

const STATUS_CONFIG: Record<VerificationStatus, { color: string; label: string }> = {
  PENDING:   { color: '#F39C12', label: 'Pending' },
  IN_REVIEW: { color: '#3498DB', label: 'In Review' },
  VERIFIED:  { color: '#27AE60', label: 'Verified' },
  FAILED:    { color: '#E74C3C', label: 'Failed' },
};

const STATUS_FILTERS: { label: string; value: VerificationStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Review', value: 'IN_REVIEW' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Failed', value: 'FAILED' },
];

export default function ManageTeachersScreen() {
  const navigation = useNavigation<Nav>();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');

  const loadTeachers = async (reset = false) => {
    setLoading(true);
    setError('');
    try {
      const currentPage = reset ? 0 : page;
      const data = await adminService.getAllTeachers({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page: currentPage,
        size: 20,
      });
      if (reset) {
        setTeachers(data.content);
        setPage(0);
      } else {
        setTeachers((prev) => (currentPage === 0 ? data.content : [...prev, ...data.content]));
      }
      setHasMore(!data.last);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers(true);
  }, [statusFilter]);

  const filtered = search
    ? teachers.filter((t) =>
        (t.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
      )
    : teachers;

  const handleApprove = async (teacherId: string) => {
    try {
      await adminService.approveTeacher(teacherId);
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacherId ? { ...t, verificationStatus: 'VERIFIED' as VerificationStatus, isVisibleToSchools: true } : t))
      );
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const handleReject = async (teacherId: string) => {
    try {
      await adminService.rejectTeacher(teacherId, 'Did not meet verification requirements');
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacherId ? { ...t, verificationStatus: 'FAILED' as VerificationStatus, isVisibleToSchools: false } : t))
      );
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const renderTeacher = ({ item }: { item: TeacherProfile }) => {
    const config = STATUS_CONFIG[item.verificationStatus];
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color="#1B4F72" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.fullName ?? item.email}</Text>
              <Text style={styles.email}>{item.email}</Text>
              {item.subjectSpecialization && (
                <Text style={styles.subject}>{item.subjectSpecialization}</Text>
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

          <View style={styles.docsRow}>
            {item.resumeUrl && <View style={styles.docBadge}><Text style={styles.docText}>📄 Resume</Text></View>}
            {item.photoUrl && <View style={styles.docBadge}><Text style={styles.docText}>📷 Photo</Text></View>}
            {item.videoUrl && <View style={styles.docBadge}><Text style={styles.docText}>🎬 Video</Text></View>}
          </View>

          <View style={styles.actions}>
            <Button
              mode="outlined"
              compact
              onPress={() => navigation.navigate('TeacherVerification', { teacherId: item.id })}
              icon="shield-search"
              textColor="#1B4F72"
              style={styles.actionBtn}
            >
              Verify
            </Button>
            {item.verificationStatus !== 'VERIFIED' && (
              <Button
                mode="contained"
                compact
                onPress={() => handleApprove(item.id)}
                icon="checkmark"
                buttonColor="#27AE60"
                style={styles.actionBtn}
              >
                Approve
              </Button>
            )}
            {item.verificationStatus !== 'FAILED' && (
              <Button
                mode="outlined"
                compact
                onPress={() => handleReject(item.id)}
                icon="close"
                textColor="#E74C3C"
                style={[styles.actionBtn, { borderColor: '#E74C3C' }]}
              >
                Reject
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Teachers</Text>
        <Searchbar
          placeholder="Search by name or email..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
          inputStyle={{ fontSize: 13 }}
        />
        <View style={styles.filtersRow}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterChip, statusFilter === f.value && styles.filterChipActive]}
              onPress={() => setStatusFilter(f.value)}
            >
              <Text style={[styles.filterText, statusFilter === f.value && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderTeacher}
        contentContainerStyle={styles.list}
        onRefresh={() => loadTeachers(true)}
        refreshing={loading && page === 0}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyText}>No teachers found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          hasMore ? (
            <Button
              mode="outlined"
              onPress={() => { setPage((p) => p + 1); loadTeachers(); }}
              loading={loading}
              style={styles.loadMore}
            >
              Load More
            </Button>
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
    paddingBottom: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  searchBar: { borderRadius: 10, height: 44 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterChipActive: { backgroundColor: '#FFFFFF' },
  filterText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500' },
  filterTextActive: { color: '#1B4F72', fontWeight: '700' },
  errorBox: { backgroundColor: '#FDEDEC', padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 8 },
  errorText: { color: '#C0392B', fontSize: 13 },
  list: { padding: 16, paddingBottom: 40 },
  card: { marginBottom: 12, borderRadius: 14, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#2C3E50' },
  email: { fontSize: 12, color: '#7F8C8D', marginTop: 1 },
  subject: { fontSize: 12, color: '#1B4F72', marginTop: 2, fontWeight: '500' },
  docsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  docBadge: { backgroundColor: '#F8F9FA', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  docText: { fontSize: 11, color: '#7F8C8D' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: 8 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 16, color: '#BDC3C7', fontWeight: '500' },
  loadMore: { margin: 16 },
});
