import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTeacherApplications } from '../../store/slices/teacherSlice';
import { Application, ApplicationStatus } from '../../types';
import styles from './styles/ApplicationStatusScreen.styles';

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

