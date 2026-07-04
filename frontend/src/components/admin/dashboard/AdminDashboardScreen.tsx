import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const NAVY = '#1A252F';

export default function AdminDashboardScreen() {
  const navigation = useNavigation<Nav>();

  const cards = [
    {
      label: 'Schools',
      description: 'Manage registered schools',
      icon: 'business',
      color: '#8E44AD',
      bg: '#F4ECF7',
      onPress: () => navigation.navigate('ManageSchools'),
    },
    {
      label: 'Teachers',
      description: 'Manage and verify teachers',
      icon: 'people',
      color: '#1B4F72',
      bg: '#EAF1FB',
      onPress: () => navigation.navigate('ManageTeachers'),
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F8FA' }} contentContainerStyle={{ flexGrow: 1 }}>

      {/* Header */}
      <View style={{ backgroundColor: NAVY, paddingTop: 56, paddingBottom: 40, paddingHorizontal: 24 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Ionicons name="shield-checkmark" size={28} color="#fff" />
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 }}>Admin Dashboard</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>Ghana Teacher Recruiting Platform</Text>
      </View>

      {/* Cards */}
      <View style={{ padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          Management
        </Text>

        {cards.map((card) => (
          <TouchableOpacity
            key={card.label}
            onPress={card.onPress}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
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
    </ScrollView>
  );
}
