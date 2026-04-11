import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Card, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { teacherService } from '../../services/teacherService';
import { JobListing, TeacherStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Nav = NativeStackNavigationProp<TeacherStackParamList>;
type Route = RouteProp<TeacherStackParamList, 'ApplyJob'>;

export default function ApplyJobScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { jobId, jobTitle } = route.params;

  const [job, setJob] = useState<JobListing | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    teacherService.browseJobs({ page: 0, size: 100 }).then((jobs) => {
      const found = jobs.content.find((j) => j.id === jobId);
      if (found) setJob(found);
    });
  }, [jobId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    job?.screeningQuestions
      .filter((q) => q.isRequired)
      .forEach((q) => {
        if (!answers[q.id]?.trim()) {
          newErrors[q.id] = 'This answer is required';
        }
      });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const screeningAnswers = Object.entries(answers)
        .filter(([, text]) => text.trim())
        .map(([questionId, answerText]) => ({ questionId, answerText }));

      await teacherService.applyForJob(jobId, { screeningAnswers });
      setSuccess(true);
    } catch (e) {
      setSubmitError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#27AE60" />
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successMsg}>
          Your application for "{jobTitle}" has been submitted. You will be notified about any updates.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ApplicationStatus')}
          buttonColor="#1B4F72"
          style={styles.doneBtn}
        >
          View My Applications
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.jobCard}>
          <Card.Content>
            <Text style={styles.jobTitle}>{jobTitle}</Text>
            <Text style={styles.jobSchool}>{job?.schoolName ?? ''}</Text>
          </Card.Content>
        </Card>

        {submitError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        ) : null}

        {(job?.screeningQuestions ?? []).length === 0 ? (
          <Card style={styles.noQCard}>
            <Card.Content style={styles.noQContent}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#27AE60" />
              <Text style={styles.noQText}>No screening questions for this job. You can submit directly.</Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Screening Questions ({job?.screeningQuestions.length})
            </Text>
            {(job?.screeningQuestions ?? []).map((q, i) => (
              <Card key={q.id} style={styles.questionCard}>
                <Card.Content>
                  <Text style={styles.questionLabel}>
                    Q{i + 1}. {q.questionText}
                    {q.isRequired && <Text style={styles.required}> *</Text>}
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Type your answer here..."
                    value={answers[q.id] ?? ''}
                    onChangeText={(v) => setAnswers({ ...answers, [q.id]: v })}
                    multiline
                    numberOfLines={3}
                    style={styles.answerInput}
                    error={!!errors[q.id]}
                  />
                  <HelperText type="error" visible={!!errors[q.id]}>
                    {errors[q.id]}
                  </HelperText>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitBtn}
          contentStyle={{ paddingVertical: 10 }}
          buttonColor="#1B4F72"
        >
          Submit Application
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  jobCard: { borderRadius: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#1B4F72' },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  jobSchool: { fontSize: 14, color: '#1B4F72', marginTop: 4 },
  errorBox: { backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#E74C3C' },
  errorText: { color: '#C0392B', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
  questionCard: { borderRadius: 12, marginBottom: 12 },
  questionLabel: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 10 },
  required: { color: '#E74C3C' },
  answerInput: { marginBottom: 0 },
  submitBtn: { borderRadius: 12, marginTop: 8 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 12 },
  successMsg: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  doneBtn: { width: '100%', borderRadius: 12 },
  noQCard: { borderRadius: 12, marginBottom: 16 },
  noQContent: { alignItems: 'center', padding: 20, gap: 12 },
  noQText: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', lineHeight: 20 },
});
