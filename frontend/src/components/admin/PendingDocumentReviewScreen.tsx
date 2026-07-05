import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { adminService } from '../../services/adminService';
import { ReferenceItem, TeacherProfile, RootStackParamList } from '../../types';
import { extractErrorMessage } from '../../services/api';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1B4F72';
const ORANGE  = '#F39C12';
const GREEN   = '#27AE60';
const RED     = '#E74C3C';

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
      <Text style={{ width: 170, fontSize: 13, color: '#999' }}>{label}</Text>
      <Text style={{ flex: 1, fontSize: 13, color: '#1A1A1A', fontWeight: '500' }}>{value}</Text>
    </View>
  );
}

function SectionBlock({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name={icon as any} size={18} color={PRIMARY} />
        <Text style={{ fontSize: 15, fontWeight: '700', color: PRIMARY }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DocBadge({ label, icon, uploaded }: { label: string; icon: string; uploaded: boolean }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
      backgroundColor: uploaded ? '#EAFAF1' : '#F8F9FA',
      borderWidth: 1, borderColor: uploaded ? '#A9DFBF' : '#E0E0E0',
    }}>
      <Ionicons name={icon as any} size={14} color={uploaded ? GREEN : '#ccc'} />
      <Text style={{ fontSize: 12, fontWeight: '600', color: uploaded ? GREEN : '#aaa' }}>{label}</Text>
      <Ionicons name={uploaded ? 'checkmark-circle' : 'close-circle'} size={13} color={uploaded ? GREEN : '#ddd'} />
    </View>
  );
}

function DocumentReviewModal({
  teacher,
  visible,
  onClose,
  onApprove,
  onReject,
}: {
  teacher: TeacherProfile | null;
  visible: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (!teacher) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>

        {/* Modal header */}
        <View style={{ backgroundColor: PRIMARY, paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
                {teacher.fullName ?? teacher.email}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Document Review</Text>
            </View>
            <View style={{ backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Step indicator */}
        <View style={{ backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="document-text" size={16} color={PRIMARY} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: PRIMARY }}>Documents Review</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

          {/* Personal Information */}
          <SectionBlock icon="person-outline" title="Personal Information">
            <InfoRow label="Full Name"     value={teacher.fullName} />
            <InfoRow label="Date of Birth" value={teacher.dateOfBirth} />
            <InfoRow label="Phone Number"  value={teacher.phoneNumber} />
            <InfoRow label="Email Address" value={teacher.email} />
            <InfoRow label="Region"        value={teacher.location} />
          </SectionBlock>

          {/* Professional Information */}
          <SectionBlock icon="briefcase-outline" title="Professional Information">
            <InfoRow label="Subjects"            value={teacher.subjectSpecialization} />
            <InfoRow label="Years of Experience" value={teacher.yearsOfExperience > 0 ? String(teacher.yearsOfExperience) : null} />
            <InfoRow label="About Yourself"      value={teacher.bio} />
          </SectionBlock>

          {/* Professional References */}
          {teacher.references && teacher.references.length > 0 ? (
            <SectionBlock icon="people-outline" title="Professional References">
              {teacher.references.map((ref: ReferenceItem, i: number) => (
                <View key={i} style={{ marginBottom: i < teacher.references.length - 1 ? 16 : 0 }}>
                  {i > 0 && <View style={{ borderTopWidth: 1, borderTopColor: '#F0F0F0', marginBottom: 12 }} />}
                  <Text style={{ fontSize: 12, fontWeight: '700', color: PRIMARY, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Reference {i + 1}
                  </Text>
                  <InfoRow label="Name"     value={ref.name} />
                  <InfoRow label="Position" value={ref.position} />
                  <InfoRow label="Phone"    value={ref.phone} />
                  <InfoRow label="Email"    value={ref.email} />
                </View>
              ))}
            </SectionBlock>
          ) : null}

          {/* Documents & Verification */}
          <SectionBlock icon="shield-checkmark-outline" title="Documents & Verification">
            <InfoRow label="Ghana Card No." value={teacher.idNumber} />
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <DocBadge label="CV / Resume" icon="document-text" uploaded={!!teacher.resumeUrl} />
              <DocBadge label="Photo"       icon="image"         uploaded={!!teacher.photoUrl}  />
              <DocBadge label="Intro Video" icon="videocam"      uploaded={!!teacher.videoUrl}  />
            </View>
          </SectionBlock>

          {/* Approve / Reject */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => onReject(teacher.id)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: RED, borderRadius: 12, paddingVertical: 14 }}
            >
              <Ionicons name="close-circle-outline" size={18} color={RED} />
              <Text style={{ color: RED, fontWeight: '700', fontSize: 15 }}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onApprove(teacher.id)}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14 }}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Approve</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

export default function PendingDocumentReviewScreen() {
  const navigation = useNavigation<Nav>();
  const [teachers, setTeachers]         = useState<TeacherProfile[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState('');
  const [selected, setSelected]         = useState<TeacherProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await adminService.getAllTeachers({ status: 'PENDING', page: 0, size: 50 });
      setTeachers(data.content);
    } catch (e) { setError(extractErrorMessage(e)); }
    finally     { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const openReview = (teacher: TeacherProfile) => {
    setSelected(teacher);
    setModalVisible(true);
  };

  const closeReview = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const handleApprove = async (teacherId: string) => {
    try {
      await adminService.approveTeacher(teacherId);
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
      closeReview();
    } catch (e) { setError(extractErrorMessage(e)); }
  };

  const handleReject = (teacherId: string) => {
    Alert.alert('Reject Teacher', "Reject this teacher's application?", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive',
        onPress: async () => {
          try {
            await adminService.rejectTeacher(teacherId, 'Did not meet verification requirements');
            setTeachers(prev => prev.filter(t => t.id !== teacherId));
            closeReview();
          } catch (e) { setError(extractErrorMessage(e)); }
        },
      },
    ]);
  };

  return (
    <>
      <DocumentReviewModal
        teacher={selected}
        visible={modalVisible}
        onClose={closeReview}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: '#F5F6FA' }}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {/* Header */}
        <View style={{ backgroundColor: PRIMARY, paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>Pending Review</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
                {teachers.length} application{teachers.length !== 1 ? 's' : ''} awaiting review
              </Text>
            </View>
            <View style={{ backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>{teachers.length}</Text>
            </View>
          </View>
        </View>

        {/* Documents Review label */}
        <View style={{ backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="document-text" size={18} color={PRIMARY} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: PRIMARY }}>Documents Review</Text>
        </View>

        <View style={{ padding: 16 }}>
          {error ? (
            <View style={{ backgroundColor: '#FDEDEC', borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <Ionicons name="alert-circle-outline" size={16} color={RED} />
              <Text style={{ color: '#C0392B', fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          ) : null}

          {loading ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <ActivityIndicator color={ORANGE} size="large" />
              <Text style={{ color: '#aaa', marginTop: 12, fontSize: 14 }}>Loading pending teachers…</Text>
            </View>
          ) : teachers.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center', gap: 10 }}>
              <Ionicons name="checkmark-circle" size={56} color="#A9DFBF" />
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#555' }}>All caught up!</Text>
              <Text style={{ fontSize: 13, color: '#aaa' }}>No pending applications to review.</Text>
            </View>
          ) : (

            /* ── Teacher list ── */
            <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>

              {/* Table column headers */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FAFAFA', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
                <Text style={{ width: 150, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Action</Text>
                <Text style={{ flex: 1, fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Full Name</Text>
              </View>

              {teachers.map((teacher, idx) => (
                <View
                  key={teacher.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: idx < teachers.length - 1 ? 1 : 0,
                    borderBottomColor: '#F5F5F5',
                    backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA',
                  }}
                >
                  {/* LEFT: View Documents button */}
                  <TouchableOpacity
                    onPress={() => openReview(teacher)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: PRIMARY,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      width: 150,
                    }}
                  >
                    <Ionicons name="document-text-outline" size={14} color="#fff" />
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>View Documents</Text>
                  </TouchableOpacity>

                  {/* RIGHT: Full name + email */}
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A1A1A' }}>
                      {teacher.fullName ?? '—'}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{teacher.email}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
