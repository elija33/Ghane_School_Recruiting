import React, { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { deactivateJob, fetchSchoolJobs, fetchApplicationsForJob } from '../../store/slices/schoolSlice';
import { JobListing, SchoolStackParamList } from '../../types';
import styles from './style/ManageJobsScreen.styles';

type Nav = NativeStackNavigationProp<SchoolStackParamList>;

export default function ManageJobsScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((s) => s.school);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    dispatch(fetchSchoolJobs());
  }, [dispatch]);

  const filtered = jobs.filter((j) => {
    if (filter === 'active') return j.isActive;
    if (filter === 'inactive') return !j.isActive;
    return true;
  });

  const handleDeactivate = (job: JobListing) => {
    Alert.alert(
      'Deactivate Job',
      `Are you sure you want to deactivate "${job.title}"? This will hide it from teachers.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => dispatch(deactivateJob(job.id)),
        },
      ]
    );
  };

  const renderJob = ({ item }: { item: JobListing }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobMeta}>{item.subject} · {item.location}</Text>
          </View>
          <Chip
            compact
            style={[styles.statusChip, { backgroundColor: item.isActive ? '#EAFAF1' : '#F9EBEA' }]}
            textStyle={{ color: item.isActive ? '#27AE60' : '#E74C3C', fontSize: 12 }}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </Chip>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color="#BDC3C7" />
            <Text style={styles.metaText}>
              Posted {format(new Date(item.createdAt), 'MMM d, yyyy')}
            </Text>
          </View>
          {item.expiresAt && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color="#F39C12" />
              <Text style={[styles.metaText, { color: '#F39C12' }]}>
                Closes {format(new Date(item.expiresAt), 'MMM d')}
              </Text>
            </View>
          )}
        </View>

        {item.screeningQuestions.length > 0 && (
          <Text style={styles.questionsNote}>
            {item.screeningQuestions.length} screening question{item.screeningQuestions.length > 1 ? 's' : ''}
          </Text>
        )}

        <View style={styles.actions}>
          <Button
            mode="outlined"
            compact
            onPress={() => {
              dispatch(fetchApplicationsForJob(item.id));
              navigation.navigate('Applications', { jobId: item.id, jobTitle: item.title });
            }}
            icon="people"
            textColor="#1B4F72"
            style={styles.actionBtn}
          >
            Applications
          </Button>
          {item.isActive && (
            <Button
              mode="outlined"
              compact
              onPress={() => handleDeactivate(item)}
              icon="close-circle"
              textColor="#E74C3C"
              style={[styles.actionBtn, { borderColor: '#E74C3C' }]}
            >
              Deactivate
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Jobs</Text>
        <View style={styles.filters}>
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.list}
        onRefresh={() => dispatch(fetchSchoolJobs())}
        refreshing={loading}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyTitle}>No Jobs Found</Text>
              <Text style={styles.emptySub}>
                {filter === 'all' ? 'Post your first job to attract teachers.' : `No ${filter} jobs.`}
              </Text>
              {filter === 'all' && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('PostJob')}
                  buttonColor="#1B4F72"
                  style={{ borderRadius: 10, marginTop: 8 }}
                >
                  Post a Job
                </Button>
              )}
            </View>
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostJob')}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

