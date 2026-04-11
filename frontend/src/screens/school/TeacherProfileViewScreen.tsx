import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { schoolService } from '../../services/schoolService';
import { TeacherProfile, SchoolStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Route = RouteProp<SchoolStackParamList, 'TeacherProfileView'>;

const VER_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  VERIFIED: { color: '#27AE60', icon: 'shield-checkmark', label: 'Verified' },
  UNVERIFIED: { color: '#F39C12', icon: 'shield-outline', label: 'Unverified' },
  IN_REVIEW: { color: '#3498DB', icon: 'time-outline', label: 'Under Review' },
  FAILED: { color: '#E74C3C', icon: 'close-circle', label: 'Failed' },
};

export default function TeacherProfileViewScreen() {
  const route = useRoute<Route>();
  const { teacherId } = route.params;

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await schoolService.getTeacherProfile(teacherId);
        setTeacher(data);
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [teacherId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-remove-outline" size={64} color="#D5D8DC" />
        <Text style={styles.errorText}>{error || 'Teacher profile not found'}</Text>
      </View>
    );
  }

  const verConfig = VER_CONFIG[teacher.verificationStatus] ?? VER_CONFIG.UNVERIFIED;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={52} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>{teacher.fullName ?? teacher.email}</Text>
        {teacher.subjectSpecialization && (
          <Text style={styles.subject}>{teacher.subjectSpecialization}</Text>
        )}
        <View style={[styles.verBadge, { backgroundColor: verConfig.color + '22' }]}>
          <Ionicons name={verConfig.icon as any} size={14} color={verConfig.color} />
          <Text style={[styles.verLabel, { color: verConfig.color }]}>{verConfig.label}</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        {[
          { icon: 'school-outline', label: 'Experience', value: teacher.yearsOfExperience > 0 ? `${teacher.yearsOfExperience} yrs` : '—' },
          { icon: 'location-outline', label: 'Location', value: teacher.location ?? '—' },
          { icon: 'book-outline', label: 'Subjects', value: teacher.subjectSpecialization ?? '—' },
        ].map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name={stat.icon as any} size={20} color="#1B4F72" />
              <Text style={styles.statValue} numberOfLines={1}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Bio */}
      {teacher.bio && (
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bodyText}>{teacher.bio}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Details */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Details</Text>
          {[
            { icon: 'book-outline', label: 'Subject Specialization', value: teacher.subjectSpecialization },
            { icon: 'location-outline', label: 'Location', value: teacher.location },
            { icon: 'briefcase-outline', label: 'Years of Experience', value: teacher.yearsOfExperience > 0 ? `${teacher.yearsOfExperience} years` : null },
            { icon: 'call-outline', label: 'Phone', value: teacher.phoneNumber },
          ]
            .filter((d) => !!d.value)
            .map((d, i) => (
              <View key={d.label}>
                {i > 0 && <Divider style={{ marginVertical: 8 }} />}
                <View style={styles.detailRow}>
                  <Ionicons name={d.icon as any} size={16} color="#7F8C8D" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailLabel}>{d.label}</Text>
                    <Text style={styles.detailValue}>{d.value}</Text>
                  </View>
                </View>
              </View>
            ))}
        </Card.Content>
      </Card>

      {/* Documents */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Documents & Media</Text>
          <View style={styles.docsRow}>
            <Button
              mode={teacher.resumeUrl ? 'contained' : 'outlined'}
              icon="file-document-outline"
              onPress={() => teacher.resumeUrl && Linking.openURL(teacher.resumeUrl)}
              disabled={!teacher.resumeUrl}
              buttonColor="#1B4F72"
              style={styles.docBtn}
              compact
            >
              Resume
            </Button>
            <Button
              mode={teacher.photoUrl ? 'contained' : 'outlined'}
              icon="image-outline"
              onPress={() => teacher.photoUrl && Linking.openURL(teacher.photoUrl)}
              disabled={!teacher.photoUrl}
              buttonColor="#8E44AD"
              style={styles.docBtn}
              compact
            >
              Photo
            </Button>
            <Button
              mode={teacher.videoUrl ? 'contained' : 'outlined'}
              icon="play-circle-outline"
              onPress={() => teacher.videoUrl && Linking.openURL(teacher.videoUrl)}
              disabled={!teacher.videoUrl}
              buttonColor="#E74C3C"
              style={styles.docBtn}
              compact
            >
              Video
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { color: '#7F8C8D', fontSize: 16 },
  errorText: { color: '#E74C3C', fontSize: 15, textAlign: 'center', marginTop: 12 },
  profileHeader: {
    backgroundColor: '#1B4F72',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  subject: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  verBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
  verLabel: { fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', padding: 12, gap: 8 },
  statCard: { flex: 1, borderRadius: 12, elevation: 2 },
  statContent: { alignItems: 'center', paddingVertical: 12, gap: 4 },
  statValue: { fontSize: 13, fontWeight: '700', color: '#2C3E50', textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#7F8C8D' },
  section: { margin: 16, marginBottom: 0, borderRadius: 14, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
  bodyText: { fontSize: 14, color: '#555', lineHeight: 22 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  detailLabel: { fontSize: 12, color: '#7F8C8D', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#2C3E50', fontWeight: '500' },
  docsRow: { flexDirection: 'row', gap: 8 },
  docBtn: { flex: 1, borderRadius: 8 },
});
