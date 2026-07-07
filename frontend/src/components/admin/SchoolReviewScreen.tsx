import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { adminService } from '../../services/adminService';
import { RootStackParamList, SchoolProfile, RegistrationStatus } from '../../types';
import { extractErrorMessage } from '../../services/api';
import styles from './style/SchoolReviewScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SchoolReview'>;
  route: RouteProp<RootStackParamList, 'SchoolReview'>;
};

const STATUS_COLORS: Record<RegistrationStatus, { bg: string; text: string }> = {
  PENDING:  { bg: '#FEF9E7', text: '#D4AC0D' },
  APPROVED: { bg: '#EAFAF1', text: '#1E8449' },
  REJECTED: { bg: '#FDEDEC', text: '#C0392B' },
};

export default function SchoolReviewScreen({ navigation, route }: Props) {
  const { schoolId } = route.params;

  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    adminService.getSchoolById(schoolId)
      .then(setSchool)
      .catch((e) => setError(extractErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const updated = await adminService.approveSchool(schoolId);
      setSchool(updated);
      setSuccessMsg('School registration approved successfully.');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const updated = await adminService.rejectSchool(schoolId, reason.trim() || undefined);
      setSchool(updated);
      setSuccessMsg('School registration rejected.');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

  const isPending = school?.registrationStatus === 'PENDING';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1B4F72" />
        <Text style={styles.loadingText}>Loading school details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>School Application</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successMsg}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        {school && (
          <>
            <Card style={styles.section}>
              <Card.Content>
                <Text style={styles.sectionTitle}>School Details</Text>

                {school.registrationStatus && (() => {
                  const colors = STATUS_COLORS[school.registrationStatus];
                  return (
                    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.statusText, { color: colors.text }]}>
                        {school.registrationStatus}
                      </Text>
                    </View>
                  );
                })()}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>School Name</Text>
                  <Text style={styles.infoValue}>{school.schoolName ?? '—'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{school.location ?? '—'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{school.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Contact Person</Text>
                  <Text style={styles.infoValue}>{school.contactPerson ?? '—'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{school.phoneNumber ?? '—'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Applied</Text>
                  <Text style={styles.infoValue}>
                    {format(new Date(school.createdAt), 'MMMM d, yyyy')}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.section}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Decision</Text>

                {isPending ? (
                  <>
                    <TextInput
                      label="Rejection reason (optional)"
                      value={reason}
                      onChangeText={setReason}
                      mode="outlined"
                      multiline
                      numberOfLines={3}
                      style={styles.reasonInput}
                      placeholder="Leave blank if approving"
                    />
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[
                          styles.approveBtn,
                          {
                            backgroundColor: '#27AE60',
                            padding: 14,
                            borderRadius: 10,
                            alignItems: 'center',
                            opacity: actionLoading ? 0.7 : 1,
                          },
                        ]}
                        onPress={handleApprove}
                        disabled={actionLoading}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                          {actionLoading ? 'Processing…' : 'Approve'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.rejectBtn,
                          {
                            backgroundColor: '#E74C3C',
                            padding: 14,
                            borderRadius: 10,
                            alignItems: 'center',
                            opacity: actionLoading ? 0.7 : 1,
                          },
                        ]}
                        onPress={handleReject}
                        disabled={actionLoading}
                      >
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                          {actionLoading ? 'Processing…' : 'Reject'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <Text style={{ color: '#7F8C8D', fontSize: 14 }}>
                    This application has already been {school.registrationStatus.toLowerCase()}.
                  </Text>
                )}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}
