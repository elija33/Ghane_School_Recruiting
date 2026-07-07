import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { adminService } from '../../services/adminService';
import { JobListing, RegistrationStatus, RootStackParamList, SchoolProfile } from '../../types';
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
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      adminService.getSchoolById(schoolId),
      adminService.getSchoolJobs(schoolId),
    ])
      .then(([schoolData, jobsData]) => {
        setSchool(schoolData);
        setJobs(jobsData);
      })
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
            {/* School Details */}
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

            {/* Job Listings — hidden for rejected schools */}
            {school.registrationStatus !== 'REJECTED' && <Card style={styles.section}>
              <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={styles.sectionTitle}>Job Postings</Text>
                  <Text style={{ fontSize: 13, color: '#7F8C8D' }}>{jobs.length} total</Text>
                </View>

                {jobs.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 20, gap: 6 }}>
                    <Ionicons name="briefcase-outline" size={36} color="#D5D8DC" />
                    <Text style={{ color: '#BDC3C7', fontSize: 14 }}>No jobs posted yet</Text>
                  </View>
                ) : (
                  jobs.map((job) => (
                    <View key={job.id} style={styles.jobRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.jobTitle}>{job.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 3 }}>
                          {job.subject ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Ionicons name="book-outline" size={12} color="#7F8C8D" />
                              <Text style={styles.jobMeta}>{job.subject}</Text>
                            </View>
                          ) : null}
                          {job.location ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Ionicons name="location-outline" size={12} color="#7F8C8D" />
                              <Text style={styles.jobMeta}>{job.location}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.jobDate}>
                          Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                        </Text>
                      </View>
                      <Chip
                        compact
                        style={{ backgroundColor: job.isActive ? '#EAFAF1' : '#F2F3F4' }}
                        textStyle={{ color: job.isActive ? '#27AE60' : '#7F8C8D', fontSize: 11, fontWeight: '600' }}
                      >
                        {job.isActive ? 'Active' : 'Closed'}
                      </Chip>
                    </View>
                  ))
                )}
              </Card.Content>
            </Card>}

            {/* Decision */}
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
