import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  createSchoolProfile,
  fetchSchoolProfile,
  updateSchoolProfile,
} from '../../store/slices/schoolSlice';
import { extractErrorMessage } from '../../services/api';

export default function SchoolProfileScreen() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.school);

  const [schoolName, setSchoolName] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchSchoolProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setSchoolName(profile.schoolName ?? '');
      setLocation(profile.location ?? '');
      setContactPerson(profile.contactPerson ?? '');
      setPhoneNumber(profile.phoneNumber ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!schoolName.trim() || !location.trim()) {
      setError('School name and location are required.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const payload = { schoolName, location, contactPerson, phoneNumber };
      if (profile) {
        await dispatch(updateSchoolProfile(payload)).unwrap();
      } else {
        await dispatch(createSchoolProfile(payload)).unwrap();
      }
      setSuccess(true);
      setEditing(false);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.avatarCircle}>
              <Ionicons name="business" size={44} color="#FFFFFF" />
            </View>
            <Text style={styles.schoolNameText}>{profile?.schoolName ?? 'Your School'}</Text>
            <Text style={styles.locationText}>
              {profile?.location ? `📍 ${profile.location}` : 'No location set'}
            </Text>
            {profile?.subscriptionTier && (
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>{profile.subscriptionTier} Plan</Text>
              </View>
            )}
            {profile?.subscriptionEnd && profile.isSubscriptionActive && (
              <Text style={styles.expiryText}>
                Subscription valid until {format(new Date(profile.subscriptionEnd), 'MMM d, yyyy')}
              </Text>
            )}
          </Card.Content>
        </Card>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success && (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={18} color="#27AE60" />
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        {/* Profile Form */}
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <View style={styles.formHeader}>
              <Text style={styles.sectionTitle}>School Information</Text>
              {!editing && profile && (
                <Button
                  mode="text"
                  onPress={() => setEditing(true)}
                  textColor="#1B4F72"
                  icon="pencil"
                  compact
                >
                  Edit
                </Button>
              )}
            </View>

            <TextInput
              label="School Name *"
              value={schoolName}
              onChangeText={setSchoolName}
              mode="outlined"
              style={styles.input}
              editable={editing || !profile}
              left={<TextInput.Icon icon="school" />}
            />
            <TextInput
              label="Location *"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={styles.input}
              editable={editing || !profile}
              placeholder="e.g. Accra, Ghana"
              left={<TextInput.Icon icon="map-marker" />}
            />
            <TextInput
              label="Contact Person"
              value={contactPerson}
              onChangeText={setContactPerson}
              mode="outlined"
              style={styles.input}
              editable={editing || !profile}
              placeholder="e.g. Head Teacher / HR Manager"
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              editable={editing || !profile}
              left={<TextInput.Icon icon="phone" />}
            />

            {(editing || !profile) && (
              <View style={styles.actionRow}>
                {editing && (
                  <Button
                    mode="outlined"
                    onPress={() => { setEditing(false); setError(''); }}
                    style={[styles.btn, { flex: 1 }]}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                  buttonColor="#1B4F72"
                  style={[styles.btn, { flex: 1 }]}
                >
                  {profile ? 'Save Changes' : 'Create Profile'}
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: { borderRadius: 16, marginBottom: 16, elevation: 3 },
  headerContent: { alignItems: 'center', paddingVertical: 24 },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1B4F72',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  schoolNameText: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  locationText: { fontSize: 14, color: '#7F8C8D', marginBottom: 8 },
  tierBadge: {
    backgroundColor: '#1B4F72' + '18',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  tierText: { color: '#1B4F72', fontWeight: '600', fontSize: 13 },
  expiryText: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAFAF1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  successText: { color: '#1E8449', fontSize: 14 },
  formCard: { borderRadius: 16, elevation: 2 },
  formContent: { paddingVertical: 8 },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  input: { marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { borderRadius: 10 },
});
