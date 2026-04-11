import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Menu, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateApplicationStatus } from '../../store/slices/schoolSlice';
import { Application, ApplicationStatus, SchoolStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Nav = NativeStackNavigationProp<SchoolStackParamList>;
type Route = RouteProp<SchoolStackParamList, 'ApplicationDetail'>;

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'SUBMITTED',           label: 'Submitted',           color: '#3498DB' },
  { value: 'UNDER_REVIEW',        label: 'Under Review',        color: '#F39C12' },
  { value: 'SHORTLISTED',         label: 'Shortlisted',         color: '#8E44AD' },
  { value: 'INTERVIEW_REQUESTED', label: 'Interview Requested', color: '#1ABC9C' },
  { value: 'REJECTED',            label: 'Rejected',            color: '#E74C3C' },
  { value: 'HIRED',               label: 'Hired',               color: '#27AE60' },
];

export default function ApplicationDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { applicationId, jobTitle } = route.params;
  const dispatch = useAppDispatch();
  const { applications } = useAppSelector((s) => s.school);

  // Use application from Redux store (loaded by ApplicationsScreen)
  const [application, setApplication] = useState<Application | null>(
    () => applications.find((a) => a.id === applicationId) ?? null
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const found = applications.find((a) => a.id === applicationId);
    if (found) setApplication(found);
  }, [applications, applicationId]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;
    setMenuVisible(false);
    setUpdating(true);
    setUpdateError('');
    try {
      await dispatch(updateApplicationStatus({
        applicationId: application.id,
        status: newStatus,
      })).unwrap();
    } catch (e) {
      setUpdateError(extractErrorMessage(e));
    } finally {
      setUpdating(false);
    }
  };

  if (!application) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Application not found</Text>
      </View>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === application.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Job & Teacher Info */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <View style={styles.teacherRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#1B4F72" />
            </View>
            <View>
              <Text style={styles.teacherName}>
                {application.teacherName ?? application.teacherEmail}
              </Text>
              <Text style={styles.teacherEmail}>{application.teacherEmail}</Text>
            </View>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={13} color="#BDC3C7" />
            <Text style={styles.dateText}>
              Applied {format(new Date(application.appliedAt), 'MMMM d, yyyy')}
            </Text>
            {application.updatedAt !== application.appliedAt && (
              <Text style={styles.dateText}>
                · Updated {format(new Date(application.updatedAt), 'MMM d')}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Status Management */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Application Status</Text>
          {updateError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorMsg}>{updateError}</Text>
            </View>
          ) : null}
          <View style={styles.statusRow}>
            <View style={[styles.currentStatus, { backgroundColor: (currentStatus?.color ?? '#BDC3C7') + '18' }]}>
              <Text style={[styles.currentStatusText, { color: currentStatus?.color ?? '#BDC3C7' }]}>
                {currentStatus?.label ?? application.status}
              </Text>
            </View>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="contained"
                  onPress={() => setMenuVisible(true)}
                  buttonColor="#1B4F72"
                  loading={updating}
                  disabled={updating}
                  icon="chevron-down"
                  compact
                >
                  Update
                </Button>
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <Menu.Item
                  key={s.value}
                  onPress={() => handleStatusChange(s.value)}
                  title={s.label}
                  titleStyle={{ color: s.color, fontWeight: '600' }}
                  disabled={s.value === application.status}
                />
              ))}
            </Menu>
          </View>
          <Text style={styles.statusNote}>
            The teacher will be notified when you update their application status.
          </Text>
        </Card.Content>
      </Card>

      {/* Screening Answers */}
      {application.screeningAnswers.length > 0 && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Screening Answers ({application.screeningAnswers.length})
            </Text>
            {application.screeningAnswers.map((answer, i) => (
              <View key={`${answer.questionId}-${i}`}>
                {i > 0 && <Divider style={styles.divider} />}
                <Text style={styles.questionText}>
                  Q{i + 1}. {answer.questionText}
                </Text>
                <View style={styles.answerBox}>
                  <Text style={styles.answerText}>{answer.answerText}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* View Teacher Profile */}
      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate('TeacherProfileView', { teacherId: application.teacherId })
        }
        icon="person-outline"
        textColor="#1B4F72"
        style={styles.profileBtn}
        contentStyle={{ paddingVertical: 8 }}
      >
        View Full Teacher Profile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: '#E74C3C', fontSize: 15, textAlign: 'center' },
  section: { borderRadius: 14, marginBottom: 16, elevation: 2 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherName: { fontSize: 15, fontWeight: '700', color: '#2C3E50' },
  teacherEmail: { fontSize: 13, color: '#7F8C8D', marginTop: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, color: '#BDC3C7' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E74C3C',
  },
  errorMsg: { color: '#C0392B', fontSize: 13 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  currentStatus: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14 },
  currentStatusText: { fontSize: 14, fontWeight: '700' },
  statusNote: { fontSize: 12, color: '#7F8C8D', fontStyle: 'italic', marginTop: 4 },
  divider: { marginVertical: 12 },
  questionText: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
  answerBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#1B4F72',
  },
  answerText: { fontSize: 14, color: '#555', lineHeight: 20 },
  profileBtn: { borderRadius: 12, marginTop: 4 },
});
