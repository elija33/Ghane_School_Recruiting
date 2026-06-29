import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, Searchbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchBrowseTeachers } from '../../store/slices/schoolSlice';
import { TeacherProfile, SchoolStackParamList } from '../../types';
import styles from './style/BrowseTeachersScreen.styles';

type Nav = NativeStackNavigationProp<SchoolStackParamList>;

const VERIFICATION_COLORS: Record<string, string> = {
  VERIFIED: '#27AE60',
  UNVERIFIED: '#F39C12',
  IN_REVIEW: '#3498DB',
  FAILED: '#E74C3C',
};

export default function BrowseTeachersScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { teachers, loading } = useAppSelector((s) => s.school);

  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchBrowseTeachers({
      subject: subject || undefined,
      location: location || undefined,
      page,
      size: 20,
    }));
  }, [dispatch, subject, location, page]);

  const renderTeacher = ({ item }: { item: TeacherProfile }) => {
    const verColor = VERIFICATION_COLORS[item.verificationStatus] ?? '#BDC3C7';
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TeacherProfileView', { teacherId: item.id })}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={28} color="#7F8C8D" />
              </View>
              <View style={[styles.verDot, { backgroundColor: verColor }]} />
            </View>

            {/* Info */}
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.fullName ?? item.email}
                </Text>
                {item.verificationStatus === 'VERIFIED' && (
                  <Ionicons name="shield-checkmark" size={16} color="#27AE60" />
                )}
              </View>
              {item.subjectSpecialization && (
                <Text style={styles.subjects} numberOfLines={1}>
                  {item.subjectSpecialization}
                </Text>
              )}
              {item.location && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color="#BDC3C7" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              )}
              <View style={styles.badgeRow}>
                {item.resumeUrl && (
                  <Chip compact style={styles.badge} textStyle={{ fontSize: 10, color: '#1B4F72' }}>
                    Resume
                  </Chip>
                )}
                {item.videoUrl && (
                  <Chip compact style={[styles.badge, { backgroundColor: '#FDEDEC' }]} textStyle={{ fontSize: 10, color: '#E74C3C' }}>
                    Video
                  </Chip>
                )}
                {item.yearsOfExperience > 0 && (
                  <Chip compact style={[styles.badge, { backgroundColor: '#EAFAF1' }]} textStyle={{ fontSize: 10, color: '#27AE60' }}>
                    {item.yearsOfExperience}y exp
                  </Chip>
                )}
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Teachers</Text>
        <Searchbar
          placeholder="Search by subject..."
          value={subject}
          onChangeText={(v) => { setSubject(v); setPage(0); }}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
        />
        <Searchbar
          placeholder="Filter by location..."
          value={location}
          onChangeText={(v) => { setLocation(v); setPage(0); }}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
          icon="map-marker"
        />
      </View>

      <FlatList
        data={teachers?.content ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderTeacher}
        contentContainerStyle={styles.list}
        onRefresh={() => {
          setPage(0);
          dispatch(fetchBrowseTeachers({ subject: subject || undefined, location: location || undefined, page: 0 }));
        }}
        refreshing={loading}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={64} color="#D5D8DC" />
              <Text style={styles.emptyText}>No Teachers Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search filters</Text>
            </View>
          )
        }
        ListFooterComponent={
          teachers && !teachers.last ? (
            <Button
              mode="outlined"
              onPress={() => setPage((p) => p + 1)}
              style={styles.loadMore}
            >
              Load More
            </Button>
          ) : null
        }
      />
    </View>
  );
}

