import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

interface User {
  _id: string;
  email: string;
  username: string;
  profileImage:string;
}

export interface MyJwtPayload {
  id: string;
  // add other fields if needed
}

export const getTimeSincePosted = (createdAt: string): string => {
  const now = new Date();
  const postedDate = new Date(createdAt);
  const diffInMs = now.getTime() - postedDate.getTime();

  const seconds = diffInMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30.44; // average month length
  const years = days / 365;

  if (years >= 1) {
    return `${Math.floor(years)} year${Math.floor(years) > 1 ? 's' : ''} ago`;
  } else if (months >= 1) {
    return `${Math.floor(months)} month${Math.floor(months) > 1 ? 's' : ''} ago`;
  } else if (days >= 1) {
    return `${Math.floor(days)} day${Math.floor(days) > 1 ? 's' : ''} ago`;
  } else if (hours >= 1) {
    return `${Math.floor(hours)} hour${Math.floor(hours) > 1 ? 's' : ''} ago`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} minute${Math.floor(minutes) > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const getTokenAndUserId = async (): Promise<{ token: string | null, userId: string | null,user:User | null }> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const storedUser = await AsyncStorage.getItem('user');

    let parsedUser: User | null = null;
    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      console.log('Loaded user from storage:', parsedUser);
    }

    if (token) {
      const decoded = jwtDecode<MyJwtPayload>(token);
      return {
        token,
        userId: decoded.id,
        user:parsedUser
      };
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return {
    token: null,
    userId: null,
    user: null,
  };
};
