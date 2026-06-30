import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/TeacherProfileScreen.styles';

interface Props {
  photoUri: string | null;
  onPickPhoto: () => void;
}

export default function ProfileHeader({ photoUri, onPickPhoto }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.avatarWrapper} onPress={onPickPhoto}>
        <View style={styles.avatar}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={48} color="rgba(255,255,255,0.7)" />
          )}
        </View>
        <View style={styles.cameraBtn}>
          <Ionicons name="camera" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Create Your Profile</Text>
      <Text style={styles.headerSubtitle}>Help schools find the right teacher — that's you!</Text>
    </View>
  );
}
