import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, Chip, Searchbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { browseJobs } from '../../store/slices/teacherSlice';
import { JobListing, TeacherStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<TeacherStackParamList>;

export default function BrowseJobsScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((s) => s.teacher);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(browseJobs({ subject: search || undefined, location: location || undefined, page, size: 20 }));
  }, [dispatch, search, location, page]);

  const renderJob = ({ item }: { item: JobListing }) => (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.schoolName}>{item.schoolName}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#7F8C8D" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={14} color="#7F8C8D" />
              <Text style={styles.metaText}>{item.subject}</Text>
            </View>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.posted}>
              {format(new Date(item.createdAt), 'MMM d, yyyy')}
            </Text>
            {item.screeningQuestions.length > 0 && (
              <Chip compact style={styles.questionChip} textStyle={{ fontSize: 11 }}>
                {item.screeningQuestions.length} question{item.screeningQuestions.length > 1 ? 's' : ''}
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Jobs</Text>
        <Searchbar
          placeholder="Search by subject..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
        />
        <Searchbar
          placeholder="Filter by location..."
          value={location}
          onChangeText={setLocation}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
          icon="map-marker"
        />
      </View>

      <FlatList
        data={jobs?.content ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.list}
        onRefresh={() => dispatch(browseJobs({ subject: search || undefined, location: location || undefined, page: 0 }))}
        refreshing={loading}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyText}>No jobs found</Text>
              <Text style={styles.emptySub}>Try adjusting your search criteria</Text>
            </View>
          )
        }
        ListFooterComponent={
          jobs && !jobs.last ? (
            <Button
              mode="outlined"
              onPress={() => setPage((p) => p + 1)}
              style={styles.loadMoreBtn}
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
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  searchBar: { borderRadius: 10, height: 44 },
  list: { padding: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
  schoolName: { fontSize: 14, color: '#1B4F72', fontWeight: '500', marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: '#7F8C8D' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  posted: { fontSize: 12, color: '#BDC3C7' },
  questionChip: { backgroundColor: '#EBF5FB' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 17, color: '#BDC3C7', fontWeight: '600' },
  emptySub: { fontSize: 14, color: '#D5D8DC' },
  loadMoreBtn: { margin: 16 },
});
