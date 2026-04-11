import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { extractErrorMessage } from '../../services/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try { return await notificationService.getNotifications(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId: string, { rejectWithValue }) => {
    try { return await notificationService.markAsRead(notificationId); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.notifications = payload;
        s.unreadCount = payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload as string;
      })
      .addCase(markNotificationRead.fulfilled, (s, { payload }) => {
        s.notifications = s.notifications.map(n => n.id === payload.id ? payload : n);
        s.unreadCount = s.notifications.filter(n => !n.isRead).length;
      });
  },
});

export const { clearNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
