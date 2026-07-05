import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { adminService } from '../../services/adminService';
import { TeacherProfile, RootStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1B4F72';
const GREEN   = '#27AE60';

export default function VerifiedTeachersScreen() {
  const navigation = useNavigation<Nav>();
  const [teachers, setTeachers]   = useState<TeacherProfile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(0);
  const [hasMore, setHasMore]     = useState(false);

  const load = useCallback(async (reset = false) => {
    setError('');
    try {
      const data = await adminService.getAllTeachers({ status: 'VERIFIED', page: reset ? 0 : page, size: 20 });
      if (reset) { setTeachers(data.content); setPage(0); }
      else        { setTeachers(prev => page === 0 ? data.content : [...prev, ...data.content]); }
      setHasMore(!data.last);
    } catch (e) { setError(extractErrorMessage(e)); }
    finally     { setLoading(false); setRefreshing(false); }
  }, [page]);

  useEffect(() => { load(true); }, []);

  const filtered = search
    ? teachers.filter(t =>
        (t.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()))
    : teachers;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F5F6FA' }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} />}
    >
      {/* Header */}
      <View style={{ backgroundColor: GREEN, paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>Verified Teachers</Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
              {teachers.length} verified account{teachers.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="shield-checkmark" size={22} color="#fff" />
          </View>
        </View>
      </View>

      <View style={{ padding: 16, gap: 14 }}>
        {error ? (
          <View style={{ backgroundColor: '#FDEDEC', borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8 }}>
            <Ionicons name="alert-circle-outline" size={16} color="#E74C3C" />
            <Text style={{ color: '#C0392B', fontSize: 13, flex: 1 }}>{error}</Text>
          </View>
        ) : null}

        <Searchbar
          placeholder="Search verified teachers..."
          value={search}
          onChangeText={setSearch}
          style={{ borderRadius: 12, elevation: 1 }}
          inputStyle={{ fontSize: 13 }}
        />

        {/* Table */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          {/* Table header */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#FAFAFA' }}>
            <Text style={{ flex: 2, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Teacher</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Subject</Text>
            <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Region</Text>
            <Text style={{ width: 70, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Docs</Text>
          </View>

          {loading && filtered.length === 0 ? (
            <View style={{ paddingVertical: 48, alignItems: 'center' }}><ActivityIndicator color={GREEN} /></View>
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 56, alignItems: 'center', gap: 8 }}>
              <Ionicons name="shield-checkmark-outline" size={48} color="#D5D8DC" />
              <Text style={{ fontSize: 15, color: '#BDC3C7', fontWeight: '500' }}>No verified teachers yet</Text>
            </View>
          ) : (
            filtered.map((item, idx) => (
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
                {/* Avatar + name */}
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#EAFAF1', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: GREEN }}>
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

                {/* Region */}
                <Text style={{ flex: 1, fontSize: 12, color: '#555' }} numberOfLines={1}>
                  {item.location ?? '—'}
                </Text>

                {/* Doc badges */}
                <View style={{ width: 70, flexDirection: 'row', gap: 4 }}>
                  {item.resumeUrl && <Ionicons name="document-text" size={14} color={PRIMARY} />}
                  {item.photoUrl  && <Ionicons name="image"         size={14} color={PRIMARY} />}
                  {item.videoUrl  && <Ionicons name="videocam"      size={14} color={PRIMARY} />}
                </View>
              </View>
            ))
          )}

          {hasMore && (
            <TouchableOpacity onPress={() => { setPage(p => p + 1); load(); }} style={{ padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
              {loading ? <ActivityIndicator color={GREEN} /> : <Text style={{ color: GREEN, fontWeight: '700', fontSize: 14 }}>Load More</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
