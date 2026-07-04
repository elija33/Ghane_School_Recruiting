import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import api from '../../../services/api';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type AccessScope = 'SCHOOLS' | 'TEACHERS' | 'BOTH';

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  accessScope: string;
  isActive: boolean;
  createdAt: string;
}

const NAVY = '#1A252F';
const PRIMARY = '#1B4F72';
const GREEN = '#27AE60';
const PURPLE = '#8E44AD';
const RED = '#E74C3C';

const ACCESS_OPTIONS: { scope: AccessScope; label: string; description: string; icon: string; color: string; bg: string }[] = [
  { scope: 'SCHOOLS',  label: 'Schools Only',      description: 'Can manage school accounts',      icon: 'business',         color: PURPLE,  bg: '#F4ECF7' },
  { scope: 'TEACHERS', label: 'Teachers Only',     description: 'Can manage teacher accounts',     icon: 'people',           color: PRIMARY, bg: '#EAF1FB' },
  { scope: 'BOTH',     label: 'Both (Full Access)', description: 'Can manage schools & teachers',  icon: 'shield-checkmark', color: GREEN,   bg: '#EAFAF1' },
];

function ScopeBadge({ scope }: { scope: string }) {
  const upper = scope?.toUpperCase() ?? 'BOTH';
  return (
    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
      {(upper === 'SCHOOLS' || upper === 'BOTH') && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F4ECF7', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Ionicons name="business" size={11} color={PURPLE} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: PURPLE }}>Schools</Text>
        </View>
      )}
      {(upper === 'TEACHERS' || upper === 'BOTH') && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#EAF1FB', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Ionicons name="people" size={11} color={PRIMARY} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: PRIMARY }}>Teachers</Text>
        </View>
      )}
    </View>
  );
}

export default function AdminDashboardScreen() {
  const navigation = useNavigation<Nav>();

  // Admin list
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Create modal
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accessScope, setAccessScope] = useState<AccessScope>('BOTH');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await api.get<AdminUser[]>('/admin/admins');
      setAdmins(res.data);
    } catch {
      // silently fail — list stays empty
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleRemove = (admin: AdminUser) => {
    Alert.alert(
      'Remove Admin',
      `Remove ${admin.firstName ?? ''} ${admin.lastName ?? ''} (${admin.email}) from admin access?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingId(admin.id);
              await api.delete(`/admin/admins/${admin.id}`);
              setAdmins(prev => prev.filter(a => a.id !== admin.id));
            } catch {
              Alert.alert('Error', 'Could not remove admin. Please try again.');
            } finally {
              setRemovingId(null);
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFirstName(''); setLastName(''); setEmail(''); setPassword('');
    setFormError(''); setCreateSuccess(false); setShowPassword(false);
    setAccessScope('BOTH');
  };

  const handleCreateAdmin = async () => {
    setFormError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setFormError('All fields are required.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Enter a valid email address.'); return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.'); return;
    }
    try {
      setCreating(true);
      const res = await api.post<AdminUser>('/admin/admins', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        accessScope,
      });
      setAdmins(prev => [res.data, ...prev]);
      setCreateSuccess(true);
    } catch (e: any) {
      setFormError(e?.response?.data?.message ?? 'Failed to create admin. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const cards = [
    { label: 'Schools',  description: 'Manage registered schools',    icon: 'business', color: PURPLE,  bg: '#F4ECF7', onPress: () => navigation.navigate('ManageSchools') },
    { label: 'Teachers', description: 'Manage and verify teachers',   icon: 'people',   color: PRIMARY, bg: '#EAF1FB', onPress: () => navigation.navigate('ManageTeachers') },
  ];

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F5F8FA' }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={listLoading} onRefresh={fetchAdmins} />}
      >
        {/* Header */}
        <View style={{ backgroundColor: NAVY, paddingTop: 56, paddingBottom: 40, paddingHorizontal: 24 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="shield-checkmark" size={28} color="#fff" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Admin Dashboard</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>Ghana Teacher Recruiting Platform</Text>
        </View>

        <View style={{ padding: 24, gap: 20 }}>

          {/* Management section */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Management</Text>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.label}
                onPress={card.onPress}
                activeOpacity={0.85}
                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, flexDirection: 'row', alignItems: 'center', gap: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
              >
                <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: card.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={card.icon as any} size={32} color={card.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 }}>{card.label}</Text>
                  <Text style={{ fontSize: 14, color: '#888' }}>{card.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Admin Members section */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
                Admin Members
              </Text>
              <TouchableOpacity
                onPress={() => { resetForm(); setModalVisible(true); }}
                activeOpacity={0.8}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: PRIMARY, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 }}
              >
                <Ionicons name="person-add" size={14} color="#fff" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Add Admin</Text>
              </TouchableOpacity>
            </View>

            {listLoading && admins.length === 0 ? (
              <ActivityIndicator color={PRIMARY} style={{ marginTop: 16 }} />
            ) : admins.length === 0 ? (
              <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderStyle: 'dashed' }}>
                <Ionicons name="people-outline" size={32} color="#ccc" style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 14, color: '#aaa' }}>No admin members yet</Text>
              </View>
            ) : (
              admins.map((admin) => (
                <View
                  key={admin.id}
                  style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 }}
                >
                  {/* Avatar */}
                  <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#EAF1FB', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: PRIMARY }}>
                      {(admin.firstName?.[0] ?? admin.email[0]).toUpperCase()}
                    </Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A' }}>
                      {admin.firstName || admin.lastName
                        ? `${admin.firstName ?? ''} ${admin.lastName ?? ''}`.trim()
                        : admin.email}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>{admin.email}</Text>
                    <ScopeBadge scope={admin.accessScope} />
                  </View>

                  {/* Remove button */}
                  <TouchableOpacity
                    onPress={() => handleRemove(admin)}
                    disabled={removingId === admin.id}
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FDEDEC', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {removingId === admin.id
                      ? <ActivityIndicator size="small" color={RED} />
                      : <Ionicons name="trash-outline" size={17} color={RED} />
                    }
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

        </View>
      </ScrollView>

      {/* Create Admin Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => !creating && setModalVisible(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} activeOpacity={1} onPress={() => !creating && setModalVisible(false)} />

          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 }}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 28 }}>

              {/* Modal header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAF1FB', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person-add" size={20} color={PRIMARY} />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#1A1A1A' }}>Add Admin</Text>
                </View>
                <TouchableOpacity onPress={() => !creating && setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              {createSuccess ? (
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                  <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#EAFAF1', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Ionicons name="checkmark-circle" size={44} color={GREEN} />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 }}>Admin Added!</Text>
                  <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 6 }}>
                    <Text style={{ fontWeight: '700', color: '#1A1A1A' }}>{firstName} {lastName}</Text> can now access:
                  </Text>
                  <View style={{ marginBottom: 24 }}>
                    <ScopeBadge scope={accessScope} />
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 40 }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {formError ? (
                    <View style={{ backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="alert-circle-outline" size={16} color="#E74C3C" />
                      <Text style={{ color: '#C0392B', fontSize: 13, flex: 1 }}>{formError}</Text>
                    </View>
                  ) : null}

                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 }}>First Name</Text>
                      <TextInput value={firstName} onChangeText={setFirstName} mode="outlined" placeholder="e.g. Kofi" style={{ backgroundColor: '#fff' }} activeOutlineColor={PRIMARY} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 }}>Last Name</Text>
                      <TextInput value={lastName} onChangeText={setLastName} mode="outlined" placeholder="e.g. Mensah" style={{ backgroundColor: '#fff' }} activeOutlineColor={PRIMARY} />
                    </View>
                  </View>

                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 }}>Email Address</Text>
                  <TextInput value={email} onChangeText={setEmail} mode="outlined" placeholder="admin@example.com" keyboardType="email-address" autoCapitalize="none" style={{ backgroundColor: '#fff', marginBottom: 12 }} activeOutlineColor={PRIMARY} />

                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 }}>Password</Text>
                  <TextInput value={password} onChangeText={setPassword} mode="outlined" placeholder="Min. 8 characters" secureTextEntry={!showPassword} style={{ backgroundColor: '#fff', marginBottom: 20 }} activeOutlineColor={PRIMARY} right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(v => !v)} />} />

                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 10 }}>Access Level</Text>
                  <View style={{ gap: 8, marginBottom: 24 }}>
                    {ACCESS_OPTIONS.map((opt) => {
                      const selected = accessScope === opt.scope;
                      return (
                        <TouchableOpacity
                          key={opt.scope}
                          onPress={() => setAccessScope(opt.scope)}
                          activeOpacity={0.8}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 2, borderColor: selected ? opt.color : '#E8E8E8', borderRadius: 12, padding: 14, backgroundColor: selected ? opt.bg : '#fff' }}
                        >
                          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: selected ? opt.color : '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name={opt.icon as any} size={20} color={selected ? '#fff' : '#aaa'} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: selected ? opt.color : '#555' }}>{opt.label}</Text>
                            <Text style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{opt.description}</Text>
                          </View>
                          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selected ? opt.color : '#ccc', backgroundColor: selected ? opt.color : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                            {selected && <Ionicons name="checkmark" size={13} color="#fff" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    onPress={handleCreateAdmin}
                    disabled={creating}
                    activeOpacity={0.85}
                    style={{ backgroundColor: creating ? '#aaa' : PRIMARY, borderRadius: 10, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                  >
                    {creating ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="person-add" size={18} color="#fff" />}
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                      {creating ? 'Adding...' : 'Add Admin'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
