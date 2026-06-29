import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { teacherService } from '../../services/teacherService';
import { JobListing, TeacherStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';
import styles from './styles/JobDetailScreen.styles';

type Nav = NativeStackNavigationProp<TeacherStackParamList>;
type Route = RouteProp<TeacherStackParamList, 'JobDetail'>;

export default function JobDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { jobId } = route.params;

  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const jobs = await teacherService.browseJobs({ page: 0, size: 100 });
        const found = jobs.content.find((j) => j.id === jobId);
        if (found) setJob(found);
        else setError('Job listing not found');
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (error || !job) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error || 'Job not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Job Header */}
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.schoolName}>{job.schoolName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="book-outline" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>{job.subject}</Text>
          </View>
        </View>
        <Text style={styles.postedDate}>
          Posted {format(new Date(job.createdAt), 'MMMM d, yyyy')}
        </Text>
        {job.expiresAt && (
          <Text style={styles.expiresDate}>
            Closes {format(new Date(job.expiresAt), 'MMMM d, yyyy')}
          </Text>
        )}
      </View>

      {/* Description */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.bodyText}>{job.description}</Text>
        </Card.Content>
      </Card>

      {/* Requirements */}
      {job.requirements && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.bodyText}>{job.requirements}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Screening Questions */}
      {job.screeningQuestions.length > 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Screening Questions ({job.screeningQuestions.length})
            </Text>
            <Text style={styles.screeningNote}>
              You will need to answer these questions when applying.
            </Text>
            {job.screeningQuestions.map((q, i) => (
              <View key={q.id} style={styles.questionItem}>
                <Text style={styles.questionNum}>Q{i + 1}</Text>
                <Text style={styles.questionText}>
                  {q.questionText}
                  {q.isRequired ? ' *' : ''}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('ApplyJob', { jobId: job.id, jobTitle: job.title })}
        disabled={alreadyApplied}
        style={styles.applyBtn}
        contentStyle={{ paddingVertical: 10 }}
        buttonColor="#1B4F72"
      >
        {alreadyApplied ? 'Already Applied' : 'Apply Now'}
      </Button>
    </ScrollView>
  );
}

