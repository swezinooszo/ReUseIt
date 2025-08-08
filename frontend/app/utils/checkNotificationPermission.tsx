// utils/checkNotificationPermission.ts
import * as Notifications from 'expo-notifications';

export const isNotificationEnabled = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};
