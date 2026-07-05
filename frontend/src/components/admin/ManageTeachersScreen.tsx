import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip, Searchbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { adminService, AdminAnalytics } from '../../services/adminService';
import { TeacherProfile, VerificationStatus, RootStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1B4F72';
const GREEN   = '#27AE60';
const ORANGE  = '#F39C12';
const RED     = '#E74C3C';
const BLUE    = '#3498DB';
const PURPLE  = '#8E44AD';

const STATUS_CONFIG: Record<VerificationStatus, { color: string; label: string }> = {
  PENDING:   { color: ORANGE, label: 'Pending' },
  IN_REVIEW: { color: BLUE,   label: 'In Review' },
  VERIFIED:  { color: GREEN,  label: 'Verified' },
  FAILED:    { color: RED,    label: 'Failed' },
};

const STATUS_FILTERS: { label: string; value: VerificationStatus | 'ALL' }[] = [
  { label: 'All',       value: 'ALL' },
  { label: 'Pending',   value: 'PENDING' },
  { label: 'In Review', value: 'IN_REVIEW' },
  { label: 'Verified',  value: 'VERIFIED' },
  { label: 'Failed',    value: 'FAILED' },
];

function StatCard({
  icon, label, value, color, bg, onPress,
}: { icon: string; label: string; value: number; color: string; bg: string; onPress?: () => void }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1, minWidth: 140, backgroundColor: '#fff',
        borderRadius: 14, padding: 18, margin: 6,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
      }}
    >
      <View style={{
        width: 46, height: 46, borderRadius: 12,
        backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
      }}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 }}>{value}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 13, color: '#888', fontWeight: '500' }}>{label}</Text>
        {onPress && <Ionicons name="chevron-forward" size={13} color="#ccc" />}
      </View>
    </Wrapper>
  );
}

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <Text style={{ fontSize: 13, color: '#555', fontWeight: '500' }}>{label}</Text>
        <Text style={{ fontSize: 13, color, fontWeight: '700' }}>{value}</Text>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: '#F0F0F0', overflow: 'hidden' }}>
        <View style={{ width: `${pct}%` as any, height: 8, borderRadius: 4, backgroundColor: color }} />
      </View>
    </View>
  );
}

export default function ManageTeachersScreen() {
  const navigation = useNavigation<Nav>();

  const [teachers, setTeachers]         = useState<TeacherProfile[]>([]);
  const [analytics, setAnalytics]       = useState<AdminAnalytics | null>(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'ALL'>('ALL');
  const [page, setPage]                 = useState(0);
  const [hasMore, setHasMore]           = useState(false);
  const [search, setSearch]             = useState('');

  const loadData = useCallback(async (reset = false) => {
    setError('');
    try {
      const [teacherData, analyticsData] = await Promise.all([
        adminService.getAllTeachers({
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          page: reset ? 0 : page,
          size: 20,
        }),
        analytics === null ? adminService.getAnalytics() : Promise.resolve(null),
      ]);
      if (reset) {
        setTeachers(teacherData.content);
        setPage(0);
      } else {
        setTeachers(prev => page === 0 ? teacherData.content : [...prev, ...teacherData.content]);
      }
      setHasMore(!teacherData.last);
      if (analyticsData) setAnalytics(analyticsData);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { setLoading(true); loadData(true); }, [statusFilter]);

  const handleRefresh = () => { setRefreshing(true); loadData(true); };

  const handleApprove = async (teacherId: string) => {
    try {
      await adminService.approveTeacher(teacherId);
      setTeachers(prev => prev.map(t =>
        t.id === teacherId ? { ...t, verificationStatus: 'VERIFIED' as VerificationStatus, isVisibleToSchools: true } : t
      ));
      if (analytics) setAnalytics({ ...analytics, verifiedTeachers: analytics.verifiedTeachers + 1, pendingVerificationTeachers: Math.max(0, analytics.pendingVerificationTeachers - 1) });
    } catch (e) { setError(extractErrorMessage(e)); }
  };

  const handleReject = (teacherId: string) => {
    Alert.alert('Reject Teacher', 'Are you sure you want to reject this teacher?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive',
        onPress: async () => {
          try {
            await adminService.rejectTeacher(teacherId, 'Did not meet verification requirements');
            setTeachers(prev => prev.map(t =>
              t.id === teacherId ? { ...t, verificationStatus: 'FAILED' as VerificationStatus, isVisibleToSchools: false } : t
            ));
          } catch (e) { setError(extractErrorMessage(e)); }
        },
      },
    ]);
  };

  const filtered = search
    ? teachers.filter(t =>
        (t.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
      )
    : teachers;

  // Derive local counts from loaded teachers
  const counts = {
    verified:  teachers.filter(t => t.verificationStatus === 'VERIFIED').length,
    pending:   teachers.filter(t => t.verificationStatus === 'PENDING').length,
    inReview:  teachers.filter(t => t.verificationStatus === 'IN_REVIEW').length,
    failed:    teachers.filter(t => t.verificationStatus === 'FAILED').length,
  };
  const totalAnalytics = analytics?.totalTeachers ?? teachers.length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F5F6FA' }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {/* ── Header ── */}
      <View style={{ backgroundColor: PRIMARY, paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 22, fontWeight: '800', color: '#fff' }}>Manage Teachers</Text>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </View>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>Ghana Teacher Recruiting Platform</Text>
      </View>

      <View style={{ padding: 16, gap: 16 }}>

        {/* ── Error banner ── */}
        {error ? (
          <View style={{ backgroundColor: '#FDEDEC', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="alert-circle-outline" size={16} color={RED} />
            <Text style={{ color: '#C0392B', fontSize: 13, flex: 1 }}>{error}</Text>
          </View>
        ) : null}

        {/* ── Stat cards ── */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -6 }}>
          <StatCard icon="people"           label="Total Teachers" value={analytics?.totalTeachers ?? teachers.length}                        color={BLUE}   bg="#EBF5FB" />
          <StatCard icon="shield-checkmark" label="Verified"       value={analytics?.verifiedTeachers ?? counts.verified}               color={GREEN}  bg="#EAFAF1" onPress={() => navigation.navigate('VerifiedTeachers')} />
          <StatCard icon="time-outline"     label="Pending"        value={analytics?.pendingVerificationTeachers ?? counts.pending}      color={ORANGE} bg="#FEF9E7" onPress={() => navigation.navigate('PendingDocumentReview')} />
          <StatCard icon="close-circle"     label="Failed"         value={counts.failed}                                                color={RED}    bg="#FDEDEC" />
        </View>

        {/* ── Verification Breakdown ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 }}>Verification Status</Text>
          <BarRow label="Verified"  value={analytics?.verifiedTeachers ?? counts.verified}  total={totalAnalytics} color={GREEN}  />
          <BarRow label="Pending"   value={analytics?.pendingVerificationTeachers ?? counts.pending}   total={totalAnalytics} color={ORANGE} />
          <BarRow label="In Review" value={counts.inReview} total={totalAnalytics} color={BLUE}   />
          <BarRow label="Failed"    value={counts.failed}   total={totalAnalytics} color={RED}    />
        </View>

        {/* ── Search ── */}
        <Searchbar
          placeholder="Search by name or email..."
          value={search}
          onChangeText={setSearch}
          style={{ borderRadius: 12, elevation: 1 }}
          inputStyle={{ fontSize: 13 }}
        />

        {/* ── Filter chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {STATUS_FILTERS.map(f => (
              <TouchableOpacity
                key={f.value}
                onPress={() => setStatusFilter(f.value)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
                  backgroundColor: statusFilter === f.value ? PRIMARY : '#fff',
                  borderWidth: 1, borderColor: statusFilter === f.value ? PRIMARY : '#E0E0E0',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: statusFilter === f.value ? '#fff' : '#555' }}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── Teachers table ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>

          {/* Table header */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#FAFAFA' }}>
            <Text style={{ flex: 2, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Teacher</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Subject</Text>
            <Text style={{ width: 80, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</Text>
            <Text style={{ width: 80, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Actions</Text>
          </View>

          {loading && filtered.length === 0 ? (
            <View style={{ paddingVertical: 48, alignItems: 'center' }}>
              <ActivityIndicator color={PRIMARY} />
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 56, alignItems: 'center', gap: 8 }}>
              <Ionicons name="people-outline" size={48} color="#D5D8DC" />
              <Text style={{ fontSize: 15, color: '#BDC3C7', fontWeight: '500' }}>No teachers found</Text>
            </View>
          ) : (
            filtered.map((item, idx) => {
              const cfg = STATUS_CONFIG[item.verificationStatus];
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: 16, paddingVertical: 14,
                    borderBottomWidth: idx < filtered.length - 1 ? 1 : 0,
                    borderBottomColor: '#F5F5F5',
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA',
                  }}
                >
                  {/* Avatar + name/email */}
                  <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#EBF5FB', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: PRIMARY }}>
                        {(item.fullName?.[0] ?? item.email[0]).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1A1A1A' }} numberOfLines={1}>
                        {item.fullName ?? '—'}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#999' }} numberOfLines={1}>{item.email}</Text>
                    </View>
                  </View>

                  {/* Subject */}
                  <Text style={{ flex: 1, fontSize: 12, color: '#555' }} numberOfLines={1}>
                    {item.subjectSpecialization ?? '—'}
                  </Text>

                  {/* Status badge */}
                  <View style={{ width: 80 }}>
                    <View style={{ backgroundColor: cfg.color + '18', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: cfg.color }}>{cfg.label}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('TeacherVerification', { teacherId: item.id })}
                      style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EBF5FB', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="eye-outline" size={14} color={PRIMARY} />
                    </TouchableOpacity>
                    {item.verificationStatus !== 'VERIFIED' && (
                      <TouchableOpacity
                        onPress={() => handleApprove(item.id)}
                        style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EAFAF1', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Ionicons name="checkmark" size={14} color={GREEN} />
                      </TouchableOpacity>
                    )}
                    {item.verificationStatus !== 'FAILED' && (
                      <TouchableOpacity
                        onPress={() => handleReject(item.id)}
                        style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#FDEDEC', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Ionicons name="close" size={14} color={RED} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}

          {/* Load more */}
          {hasMore && (
            <TouchableOpacity
              onPress={() => { setPage(p => p + 1); loadData(); }}
              style={{ padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0' }}
            >
              {loading
                ? <ActivityIndicator color={PRIMARY} />
                : <Text style={{ color: PRIMARY, fontWeight: '700', fontSize: 14 }}>Load More</Text>
              }
            </TouchableOpacity>
          )}
        </View>

      </View>
    </ScrollView>
  );
}
