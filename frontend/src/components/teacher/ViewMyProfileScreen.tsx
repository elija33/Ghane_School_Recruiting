import React, { useEffect } from 'react';
import { Image, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTeacherProfile } from '../../store/slices/teacherSlice';
import { TeacherStackParamList, VerificationStatus } from '../../types';

type Nav = NativeStackNavigationProp<TeacherStackParamList>;

const PRIMARY = '#1B4F72';
const GREEN = '#27AE60';
const ORANGE = '#F39C12';
const RED = '#E74C3C';

const VERIFICATION_COLOR: Record<VerificationStatus, string> = {
  PENDING: ORANGE,
  IN_REVIEW: '#3498DB',
  VERIFIED: GREEN,
  FAILED: RED,
};

const VERIFICATION_ICON: Record<VerificationStatus, string> = {
  PENDING: 'time-outline',
  IN_REVIEW: 'eye-outline',
  VERIFIED: 'shield-checkmark',
  FAILED: 'shield-outline',
};

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
      <Ionicons name={icon as any} size={18} color={PRIMARY} style={{ marginTop: 2, marginRight: 12, width: 20 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 15, color: '#1A1A1A' }}>{value}</Text>
      </View>
    </View>
  );
}

export default function ViewMyProfileScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.teacher);

  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchTeacherProfile());
  };

  const verStatus: VerificationStatus = profile?.verificationStatus ?? 'PENDING';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F5F8FA' }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[PRIMARY]} />}
    >
      {/* Header Banner */}
      <View style={{ backgroundColor: PRIMARY, paddingTop: 56, paddingBottom: 64, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 }}>My Profile</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>View and manage your information</Text>
      </View>

      {/* Avatar Card */}
      <View style={{ alignItems: 'center', marginTop: -48, paddingHorizontal: 20 }}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          {profile?.photoUrl ? (
            <Image
              source={{ uri: profile.photoUrl }}
              style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#fff' }}
            />
          ) : (
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' }}>
              <Ionicons name="person" size={48} color="rgba(255,255,255,0.85)" />
            </View>
          )}
          <View style={{
            position: 'absolute', bottom: 0, right: 0,
            backgroundColor: VERIFICATION_COLOR[verStatus],
            borderRadius: 12, padding: 4, borderWidth: 2, borderColor: '#fff',
          }}>
            <Ionicons name={VERIFICATION_ICON[verStatus] as any} size={12} color="#fff" />
          </View>
        </View>

        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' }}>
          {profile?.fullName ?? 'Your Name'}
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{profile?.email ?? ''}</Text>

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          backgroundColor: VERIFICATION_COLOR[verStatus] + '18',
          borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10,
        }}>
          <Ionicons name={VERIFICATION_ICON[verStatus] as any} size={14} color={VERIFICATION_COLOR[verStatus]} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: VERIFICATION_COLOR[verStatus] }}>
            {verStatus.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 16 }}>

        {/* Personal Information */}
        <Card style={{ borderRadius: 12 }} elevation={1}>
          <Card.Content style={{ paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="person-circle-outline" size={20} color={PRIMARY} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: PRIMARY }}>Personal Information</Text>
            </View>
            <InfoRow icon="call-outline" label="Phone Number" value={profile?.phoneNumber} />
            <InfoRow icon="location-outline" label="Location / Region" value={profile?.location} />
            <InfoRow icon="calendar-outline" label="Date of Birth" value={profile?.dateOfBirth} />
            <InfoRow icon="card-outline" label="Ghana Card / ID Number" value={profile?.idNumber} />
            {!profile?.phoneNumber && !profile?.location && (
              <Text style={{ fontSize: 13, color: '#aaa', textAlign: 'center', paddingVertical: 8 }}>
                No personal details added yet
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Professional Information */}
        <Card style={{ borderRadius: 12 }} elevation={1}>
          <Card.Content style={{ paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="briefcase-outline" size={20} color={PRIMARY} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: PRIMARY }}>Professional Information</Text>
            </View>
            <InfoRow icon="book-outline" label="Subject Specialization" value={profile?.subjectSpecialization} />
            <InfoRow
              icon="time-outline"
              label="Years of Experience"
              value={profile?.yearsOfExperience != null ? `${profile.yearsOfExperience} year${profile.yearsOfExperience !== 1 ? 's' : ''}` : null}
            />
            <InfoRow icon="document-text-outline" label="Bio / About Me" value={profile?.bio} />
            {!profile?.subjectSpecialization && !profile?.bio && (
              <Text style={{ fontSize: 13, color: '#aaa', textAlign: 'center', paddingVertical: 8 }}>
                No professional details added yet
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Documents & Media */}
        <Card style={{ borderRadius: 12 }} elevation={1}>
          <Card.Content style={{ paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="folder-outline" size={20} color={PRIMARY} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: PRIMARY }}>Documents & Media</Text>
            </View>

            {/* CV */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="document-attach-outline" size={20} color={profile?.resumeUrl ? GREEN : '#ccc'} />
                <Text style={{ fontSize: 14, color: '#1A1A1A' }}>CV / Resume</Text>
              </View>
              {profile?.resumeUrl
                ? <Ionicons name="checkmark-circle" size={20} color={GREEN} />
                : <Text style={{ fontSize: 12, color: '#aaa' }}>Not uploaded</Text>}
            </View>

            {/* Profile Photo */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="image-outline" size={20} color={profile?.photoUrl ? GREEN : '#ccc'} />
                <Text style={{ fontSize: 14, color: '#1A1A1A' }}>Profile Photo</Text>
              </View>
              {profile?.photoUrl
                ? <Ionicons name="checkmark-circle" size={20} color={GREEN} />
                : <Text style={{ fontSize: 12, color: '#aaa' }}>Not uploaded</Text>}
            </View>

            {/* Video */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="videocam-outline" size={20} color={profile?.videoUrl ? GREEN : '#ccc'} />
                <Text style={{ fontSize: 14, color: '#1A1A1A' }}>Intro Video</Text>
              </View>
              {profile?.videoUrl
                ? <Ionicons name="checkmark-circle" size={20} color={GREEN} />
                : <Text style={{ fontSize: 12, color: '#aaa' }}>Not recorded</Text>}
            </View>
          </Card.Content>
        </Card>

        {/* Visibility Toggle Info */}
        <Card style={{ borderRadius: 12, backgroundColor: profile?.isVisibleToSchools ? '#EAF7EE' : '#FEF9EC' }} elevation={0}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
            <Ionicons
              name={profile?.isVisibleToSchools ? 'eye' : 'eye-off-outline'}
              size={22}
              color={profile?.isVisibleToSchools ? GREEN : ORANGE}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: profile?.isVisibleToSchools ? GREEN : ORANGE }}>
                {profile?.isVisibleToSchools ? 'Visible to Schools' : 'Hidden from Schools'}
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                {profile?.isVisibleToSchools
                  ? 'Schools can find and contact you.'
                  : 'Complete your profile to become visible.'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Edit Profile Button */}
        <Button
          mode="contained"
          onPress={() => (navigation.navigate as any)('EditProfile')}
          buttonColor={PRIMARY}
          style={{ borderRadius: 10, marginTop: 4 }}
          contentStyle={{ paddingVertical: 6 }}
          icon="pencil"
        >
          Edit Profile
        </Button>
      </View>
    </ScrollView>
  );
}
