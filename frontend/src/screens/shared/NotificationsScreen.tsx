import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchNotifications, markNotificationRead } from '../../store/slices/notificationSlice';
import { Notification } from '../../types';

export default function NotificationsScreen() {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => !item.isRead && handleMarkRead(item.id)}>
      <Card style={[styles.card, !item.isRead && styles.unreadCard]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={item.isRead ? 'notifications-outline' : 'notifications'}
              size={24}
              color={item.isRead ? '#9E9E9E' : '#1B4F72'}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={[styles.notifTitle, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>
              {format(new Date(item.createdAt), 'MMM d, yyyy · h:mm a')}
            </Text>
          </View>
          {!item.isRead && <View style={styles.unreadDot} />}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={64} color="#D5D8DC" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
        onRefresh={() => dispatch(fetchNotifications())}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  headerBar: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  list: { padding: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#1B4F72' },
  cardContent: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrapper: { marginRight: 12, marginTop: 2 },
  textWrapper: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 4 },
  unreadTitle: { color: '#1B4F72' },
  message: { fontSize: 14, color: '#7F8C8D', marginBottom: 6, lineHeight: 20 },
  time: { fontSize: 12, color: '#BDC3C7' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B4F72',
    marginTop: 6,
    marginLeft: 8,
  },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#BDC3C7', marginTop: 16 },
});
