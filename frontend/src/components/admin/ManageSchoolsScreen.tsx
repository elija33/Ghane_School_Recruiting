import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, Searchbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { adminService } from '../../services/adminService';
import { RootStackParamList, SchoolProfile, RegistrationStatus } from '../../types';
import { extractErrorMessage } from '../../services/api';
import styles from './style/ManageSchoolsScreen.styles';

const STATUS_COLORS: Record<RegistrationStatus, { bg: string; text: string }> = {
  PENDING:  { bg: '#FEF9E7', text: '#D4AC0D' },
  APPROVED: { bg: '#EAFAF1', text: '#1E8449' },
  REJECTED: { bg: '#FDEDEC', text: '#C0392B' },
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ManageSchools'>;
};

export default function ManageSchoolsScreen({ navigation }: Props) {
  const [schools, setSchools] = useState<SchoolProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadSchools = async (reset = false) => {
    setLoading(true);
    setError('');
    try {
      const currentPage = reset ? 0 : page;
      const data = await adminService.getAllSchools({ page: currentPage, size: 20 });
      if (reset) {
        setSchools(data.content);
        setPage(0);
      } else {
        setSchools((prev) => (currentPage === 0 ? data.content : [...prev, ...data.content]));
      }
      setHasMore(!data.last);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadSchools(true); }, []));

  const filtered = search
    ? schools.filter((s) =>
        (s.schoolName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (s.location ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : schools;

  const renderSchool = ({ item }: { item: SchoolProfile }) => {
    const regColors = item.registrationStatus
      ? STATUS_COLORS[item.registrationStatus]
      : STATUS_COLORS.PENDING;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('SchoolReview', { schoolId: item.id })}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Ionicons name="business" size={24} color="#1B4F72" />
              </View>
              <View style={styles.info}>
                <Text style={styles.schoolName}>{item.schoolName ?? 'Unnamed School'}</Text>
                {item.location && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={13} color="#BDC3C7" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                )}
                {item.contactPerson && (
                  <Text style={styles.contactText}>Contact: {item.contactPerson}</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Chip
                  compact
                  style={{ backgroundColor: regColors.bg }}
                  textStyle={{ color: regColors.text, fontSize: 11, fontWeight: '600' }}
                >
                  {item.registrationStatus ?? 'PENDING'}
                </Chip>
                {item.subscriptionTier && (
                  <Text style={styles.tierText}>{item.subscriptionTier}</Text>
                )}
              </View>
            </View>

            {item.subscriptionStart && item.subscriptionEnd && (
              <View style={styles.subRow}>
                <Ionicons name="calendar-outline" size={12} color="#BDC3C7" />
                <Text style={styles.subText}>
                  {format(new Date(item.subscriptionStart), 'MMM d, yyyy')}
                  {' → '}
                  {format(new Date(item.subscriptionEnd), 'MMM d, yyyy')}
                </Text>
              </View>
            )}

            <Text style={styles.joinedText}>
              Joined {format(new Date(item.createdAt), 'MMMM d, yyyy')}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const pendingCount = schools.filter((s) => (s.registrationStatus ?? 'PENDING') === 'PENDING').length;
  const approvedCount = schools.filter((s) => s.registrationStatus === 'APPROVED').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Schools</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNum}>{schools.length}</Text>
            <Text style={styles.headerStatLabel}>Total</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={[styles.headerStatNum, { color: '#D4AC0D' }]}>{pendingCount}</Text>
            <Text style={styles.headerStatLabel}>Pending</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={[styles.headerStatNum, { color: '#27AE60' }]}>{approvedCount}</Text>
            <Text style={styles.headerStatLabel}>Approved</Text>
          </View>
        </View>
        <Searchbar
          placeholder="Search by name or location..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
          inputStyle={{ fontSize: 13 }}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList<SchoolProfile>
        data={filtered}
        keyExtractor={(item: SchoolProfile) => item.id}
        renderItem={renderSchool}
        contentContainerStyle={styles.list}
        onRefresh={() => loadSchools(true)}
        refreshing={loading && page === 0}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="business-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyText}>No schools found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          hasMore ? (
            <Button
              mode="outlined"
              onPress={() => { setPage((p) => p + 1); loadSchools(); }}
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

