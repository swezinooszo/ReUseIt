// utils/notificationsUtils.ts
import api from './api';
import { getTokenAndUserId } from './listingDetailsUtils';
import { handleApiError } from './chatUtils';

interface User {
    _id:string;
    username:string;
    createdAt:string;
    expoPushTokens:[string];
    profileImage:string;
}

interface Notification {
  _id: string;
  user: User;
  type: string;
  message: string;
  reviewer: User;
  isRead:boolean;
   createdAt:string;
}

export const fetchUnreadCount = async () => {
  try {
    const { userId } = await getTokenAndUserId();
    const res = await api.get<Notification[]>(`/notifications/${userId}`);
    return res.data.filter((n) => !n.isRead).length;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

export const markNotificationAsRead = async (id:string) => {
  try {
    const res = await api.patch(`/notifications/${id}`);
    return true;
  } catch (error) {
    console.error("Error markNotificationAsRead:", error);
    handleApiError(error, 'markNotificationAsRead failed');
    return false;
  }
};