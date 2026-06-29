import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Card, HelperText, Switch, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../../store';
import { createJob } from '../../store/slices/schoolSlice';
import { SchoolStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';
import styles from './style/PostJobScreen.styles';

type Nav = NativeStackNavigationProp<SchoolStackParamList>;

interface ScreeningQ {
  questionText: string;
  isRequired: boolean;
  questionOrder: number;
}

export default function PostJobScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQ[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const addQuestion = () => {
    setScreeningQuestions([
      ...screeningQuestions,
      { questionText: '', isRequired: true, questionOrder: screeningQuestions.length + 1 },
    ]);
  };

  const removeQuestion = (index: number) => {
    setScreeningQuestions(screeningQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof ScreeningQ, value: string | boolean) => {
    const updated = [...screeningQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setScreeningQuestions(updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    screeningQuestions.forEach((q, i) => {
      if (!q.questionText.trim()) {
        newErrors[`q_${i}`] = 'Question text is required';
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
      await dispatch(createJob({
        title,
        subject,
        location,
        description,
        requirements: requirements || undefined,
        expiresAt: expiresAt || undefined,
        screeningQuestions: screeningQuestions.map((q) => ({
          questionText: q.questionText,
          questionOrder: q.questionOrder,
          required: q.isRequired,
        })),
      })).unwrap();
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
        <Text style={styles.successTitle}>Job Posted!</Text>
        <Text style={styles.successMsg}>
          Your job listing is now live. Teachers can browse and apply.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ManageJobs')}
          buttonColor="#1B4F72"
          style={styles.successBtn}
        >
          View My Jobs
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()} textColor="#7F8C8D">
          Post Another Job
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {submitError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        ) : null}

        {/* Basic Info */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <TextInput
              label="Job Title *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              error={!!errors.title}
              placeholder="e.g. Secondary School Mathematics Teacher"
            />
            <HelperText type="error" visible={!!errors.title}>{errors.title}</HelperText>

            <TextInput
              label="Subject *"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              style={styles.input}
              error={!!errors.subject}
              placeholder="e.g. Mathematics, Science, English"
            />
            <HelperText type="error" visible={!!errors.subject}>{errors.subject}</HelperText>

            <TextInput
              label="Location *"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
              error={!!errors.location}
              placeholder="e.g. Accra, Kumasi"
            />
            <HelperText type="error" visible={!!errors.location}>{errors.location}</HelperText>
          </Card.Content>
        </Card>

        {/* Description */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Description & Requirements</Text>
            <TextInput
              label="Job Description *"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={5}
              error={!!errors.description}
              placeholder="Describe the role, responsibilities, and what you expect from candidates..."
            />
            <HelperText type="error" visible={!!errors.description}>{errors.description}</HelperText>

            <TextInput
              label="Requirements (Optional)"
              value={requirements}
              onChangeText={setRequirements}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Qualifications, certifications, years of experience..."
            />

            <TextInput
              label="Application Deadline (Optional)"
              value={expiresAt}
              onChangeText={setExpiresAt}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />
          </Card.Content>
        </Card>

        {/* Screening Questions */}
        <Card style={styles.section}>
          <Card.Content>
            <View style={styles.qHeader}>
              <Text style={styles.sectionTitle}>
                Screening Questions ({screeningQuestions.length})
              </Text>
              <Button
                mode="text"
                onPress={addQuestion}
                icon="plus"
                textColor="#1B4F72"
                compact
              >
                Add
              </Button>
            </View>
            <Text style={styles.qNote}>
              Applicants will answer these questions when applying.
            </Text>

            {screeningQuestions.map((q, i) => (
              <Card key={i} style={styles.questionCard}>
                <Card.Content>
                  <View style={styles.qTopRow}>
                    <Text style={styles.qNum}>Q{i + 1}</Text>
                    <TouchableOpacity onPress={() => removeQuestion(i)}>
                      <Ionicons name="trash-outline" size={18} color="#E74C3C" />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    label="Question *"
                    value={q.questionText}
                    onChangeText={(v) => updateQuestion(i, 'questionText', v)}
                    mode="outlined"
                    style={styles.qInput}
                    multiline
                    error={!!errors[`q_${i}`]}
                    placeholder="Enter your screening question..."
                  />
                  <HelperText type="error" visible={!!errors[`q_${i}`]}>
                    {errors[`q_${i}`]}
                  </HelperText>
                  <View style={styles.qRequiredRow}>
                    <Text style={styles.qRequiredLabel}>Required</Text>
                    <Switch
                      value={q.isRequired}
                      onValueChange={(v) => updateQuestion(i, 'isRequired', v)}
                      color="#1B4F72"
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}

            {screeningQuestions.length === 0 && (
              <View style={styles.noQPlaceholder}>
                <Ionicons name="help-circle-outline" size={36} color="#D5D8DC" />
                <Text style={styles.noQText}>No screening questions added.</Text>
                <Text style={styles.noQSub}>Add questions to filter applicants.</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonColor="#1B4F72"
          style={styles.submitBtn}
          contentStyle={{ paddingVertical: 10 }}
        >
          Post Job Listing
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

