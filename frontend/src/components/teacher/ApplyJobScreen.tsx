import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { teacherService } from '../../services/teacherService';
import { JobListing, TeacherStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';
import styles from './styles/ApplyJobScreen.styles';

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

