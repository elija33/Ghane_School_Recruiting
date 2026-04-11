import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text, TextInput } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { adminService } from '../../services/adminService';
import {
  TeacherProfile,
  VerificationRequest,
  VerificationResult,
  AdminStackParamList,
} from '../../types';
import { extractErrorMessage } from '../../services/api';

type Route = RouteProp<AdminStackParamList, 'TeacherVerification'>;

const RESULT_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  VERIFIED: { color: '#27AE60', icon: 'checkmark-circle', label: 'Verified' },
  UNVERIFIED: { color: '#F39C12', icon: 'alert-circle', label: 'Unverified' },
  FLAGGED: { color: '#E74C3C', icon: 'flag', label: 'Flagged' },
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F39C12',
  IN_PROGRESS: '#3498DB',
  COMPLETED: '#27AE60',
  FAILED: '#E74C3C',
};

export default function TeacherVerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { teacherId } = route.params;

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [triggeringEducation, setTriggeringEducation] = useState(false);
  const [triggeringCriminal, setTriggeringCriminal] = useState(false);

  const [selectedVerId, setSelectedVerId] = useState<string | null>(null);
  const [manualResult, setManualResult] = useState<VerificationResult>('VERIFIED');
  const [manualNotes, setManualNotes] = useState('');
  const [submittingManual, setSubmittingManual] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [teacherData, verData] = await Promise.all([
        adminService.getTeacherById(teacherId),
        adminService.getVerifications(teacherId),
      ]);
      setTeacher(teacherData);
      setVerifications(verData);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [teacherId]);

  const triggerVerification = async (type: 'EDUCATION' | 'CRIMINAL') => {
    const setter = type === 'EDUCATION' ? setTriggeringEducation : setTriggeringCriminal;
    setter(true);
    try {
      await adminService.initiateVerification(teacherId, type);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setter(false);
    }
  };

  const submitManualResult = async () => {
    if (!selectedVerId) return;
    setSubmittingManual(true);
    try {
      await adminService.updateVerificationResult(selectedVerId, {
        result: manualResult,
        notes: manualNotes,
      });
      setSelectedVerId(null);
      setManualNotes('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmittingManual(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading verification details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Teacher Summary */}
      {teacher && (
        <Card style={styles.section}>
          <Card.Content>
            <View style={styles.teacherRow}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={28} color="#1B4F72" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.teacherName}>{teacher.fullName ?? teacher.email}</Text>
                <Text style={styles.teacherEmail}>{teacher.email}</Text>
                {teacher.subjectSpecialization && (
                  <Text style={styles.teacherSubject}>{teacher.subjectSpecialization}</Text>
                )}
              </View>
              <View style={[
                styles.verBadge,
                { backgroundColor: teacher.verificationStatus === 'VERIFIED' ? '#EAFAF1' : '#FEF9E7' }
              ]}>
                <Text style={[
                  styles.verBadgeText,
                  { color: teacher.verificationStatus === 'VERIFIED' ? '#27AE60' : '#F39C12' }
                ]}>
                  {teacher.verificationStatus}
                </Text>
              </View>
            </View>
            <View style={styles.docsRow}>
              <Text style={styles.docItem}>
                {teacher.resumeUrl ? '✅' : '❌'} Resume
              </Text>
              <Text style={styles.docItem}>
                {teacher.photoUrl ? '✅' : '❌'} Photo
              </Text>
              <Text style={styles.docItem}>
                {teacher.videoUrl ? '✅' : '❌'} Video
              </Text>
              <Text style={styles.docItem}>
                {teacher.idNumber ? '✅' : '❌'} ID Number
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Trigger Verifications */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Trigger Automated Verification</Text>
          <Text style={styles.sectionNote}>
            Runs background checks via ETX.NG (education) and Prembly (criminal).
          </Text>
          <View style={styles.triggerRow}>
            <Button
              mode="contained"
              onPress={() => triggerVerification('EDUCATION')}
              loading={triggeringEducation}
              disabled={triggeringEducation || triggeringCriminal}
              buttonColor="#1B4F72"
              icon="school"
              style={styles.triggerBtn}
            >
              Education Check
            </Button>
            <Button
              mode="contained"
              onPress={() => triggerVerification('CRIMINAL')}
              loading={triggeringCriminal}
              disabled={triggeringEducation || triggeringCriminal}
              buttonColor="#8E44AD"
              icon="shield-search"
              style={styles.triggerBtn}
            >
              Criminal Check
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Verification History */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Verification History ({verifications.length})</Text>
          {verifications.length === 0 ? (
            <View style={styles.noVerifications}>
              <Ionicons name="document-outline" size={36} color="#D5D8DC" />
              <Text style={styles.noVerText}>No verifications run yet</Text>
            </View>
          ) : (
            verifications.map((v, i) => {
              const resultCfg = v.result ? RESULT_CONFIG[v.result] : null;
              return (
                <View key={v.id}>
                  {i > 0 && <Divider style={styles.divider} />}
                  <View style={styles.verRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.verType}>
                        {v.type === 'EDUCATION' ? '🎓 Education' : '🛡️ Criminal'} · {v.provider}
                      </Text>
                      <View style={styles.verMeta}>
                        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[v.status] ?? '#BDC3C7' }]} />
                        <Text style={styles.verStatus}>{v.status}</Text>
                        <Text style={styles.verDate}>
                          {format(new Date(v.requestedAt), 'MMM d, HH:mm')}
                        </Text>
                      </View>
                      {v.notes && (
                        <Text style={styles.verNotes}>{v.notes}</Text>
                      )}
                    </View>
                    {resultCfg && (
                      <View style={[styles.resultBadge, { backgroundColor: resultCfg.color + '18' }]}>
                        <Ionicons name={resultCfg.icon as any} size={14} color={resultCfg.color} />
                        <Text style={[styles.resultText, { color: resultCfg.color }]}>{resultCfg.label}</Text>
                      </View>
                    )}
                  </View>

                  {/* Manual Override */}
                  {v.status === 'COMPLETED' && (
                    <Button
                      mode="text"
                      compact
                      onPress={() => setSelectedVerId(selectedVerId === v.id ? null : v.id)}
                      textColor="#7F8C8D"
                    >
                      {selectedVerId === v.id ? 'Cancel Override' : 'Manual Override'}
                    </Button>
                  )}

                  {selectedVerId === v.id && (
                    <View style={styles.manualOverride}>
                      <Text style={styles.overrideLabel}>Override Result:</Text>
                      <View style={styles.resultOptions}>
                        {(['VERIFIED', 'UNVERIFIED', 'FLAGGED'] as VerificationResult[]).map((r) => (
                          <Button
                            key={r}
                            mode={manualResult === r ? 'contained' : 'outlined'}
                            compact
                            onPress={() => setManualResult(r)}
                            buttonColor={RESULT_CONFIG[r].color}
                            textColor={manualResult === r ? '#FFF' : RESULT_CONFIG[r].color}
                            style={{ borderRadius: 8 }}
                          >
                            {r}
                          </Button>
                        ))}
                      </View>
                      <TextInput
                        label="Notes"
                        value={manualNotes}
                        onChangeText={setManualNotes}
                        mode="outlined"
                        multiline
                        numberOfLines={2}
                        style={styles.notesInput}
                      />
                      <Button
                        mode="contained"
                        onPress={submitManualResult}
                        loading={submittingManual}
                        disabled={submittingManual}
                        buttonColor="#1B4F72"
                        style={styles.submitOverrideBtn}
                      >
                        Submit Override
                      </Button>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </Card.Content>
      </Card>

      {/* Admin Actions */}
      {teacher && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Admin Actions</Text>
            <View style={styles.adminActions}>
              <Button
                mode="contained"
                onPress={async () => {
                  await adminService.approveTeacher(teacherId);
                  await load();
                }}
                icon="checkmark-circle"
                buttonColor="#27AE60"
                style={styles.adminBtn}
                disabled={teacher.verificationStatus === 'VERIFIED'}
              >
                Approve & Make Visible
              </Button>
              <Button
                mode="outlined"
                onPress={async () => {
                  await adminService.rejectTeacher(teacherId, 'Manual review rejection');
                  await load();
                }}
                icon="close-circle"
                textColor="#E74C3C"
                style={[styles.adminBtn, { borderColor: '#E74C3C' }]}
                disabled={teacher.verificationStatus === 'FAILED'}
              >
                Reject
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { color: '#7F8C8D', fontSize: 16 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  section: { borderRadius: 14, marginBottom: 16, elevation: 2 },
  teacherRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherName: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  teacherEmail: { fontSize: 13, color: '#7F8C8D', marginTop: 2 },
  teacherSubject: { fontSize: 13, color: '#1B4F72', marginTop: 2, fontWeight: '500' },
  verBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  verBadgeText: { fontSize: 12, fontWeight: '700' },
  docsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  docItem: { fontSize: 13, color: '#2C3E50' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  sectionNote: { fontSize: 13, color: '#7F8C8D', marginBottom: 12, fontStyle: 'italic' },
  triggerRow: { flexDirection: 'row', gap: 10 },
  triggerBtn: { flex: 1, borderRadius: 10 },
  noVerifications: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  noVerText: { fontSize: 14, color: '#BDC3C7' },
  divider: { marginVertical: 12 },
  verRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  verType: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 4 },
  verMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  verStatus: { fontSize: 12, color: '#7F8C8D', fontWeight: '500' },
  verDate: { fontSize: 12, color: '#BDC3C7' },
  verNotes: { fontSize: 12, color: '#7F8C8D', fontStyle: 'italic', marginTop: 4 },
  resultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  resultText: { fontSize: 11, fontWeight: '700' },
  manualOverride: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, marginTop: 8, gap: 8 },
  overrideLabel: { fontSize: 13, fontWeight: '600', color: '#2C3E50' },
  resultOptions: { flexDirection: 'row', gap: 8 },
  notesInput: { marginTop: 4 },
  submitOverrideBtn: { borderRadius: 8, marginTop: 4 },
  adminActions: { gap: 10 },
  adminBtn: { borderRadius: 10 },
});
