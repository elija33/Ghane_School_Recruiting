import api from './api';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications');
    return data;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const { data } = await api.put<Notification>(`/notifications/${notificationId}/read`);
    return data;
  },
};
