
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {jwtDecode} from 'jwt-decode';
import api from '@/app/utils/api';

interface User {
  id: string;
  email: string;
  username: string;
}

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string,user:User) => void;
  logout: () => void;
  loading: boolean; 
  saveExpoPushToken: (userId: string,expoPushToken:string) => void;
  // userId: string | null;
  // setUserId: (id: string | null) => void;
  // expoPushToken: string | null;
  // setExpoPushToken: (token: string | null) => void;
};

type MyJwtPayload = {
  id: string; // or userId: string;
};

//React context — a way to share state globally
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  loading: true,
  saveExpoPushToken:() => {},
  // userId: null,
  // setUserId: () => {},
  // expoPushToken: null,
  // setExpoPushToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    //this token, settoken state is used to check 'isLoggedIn'. the actual token is stored. in 'AsyncStorage'
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const [userId, setUserId] = useState<string | null>(null);
  // const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  //** This runs once — when <AuthProvider> mounts
  useEffect(() => {
    const loadToken = async () => {
      console.log("loadToken")
      const storedToken = await AsyncStorage.getItem('userToken');
       console.log(`storedToken ${storedToken}`)

      if (storedToken) {
          try {
              const decoded = jwtDecode<MyJwtPayload & { exp: number }>(storedToken);

              // Check if token is expired
              const isExpired = decoded.exp * 1000 < Date.now();
              console.log(`isExpired ${isExpired} decoded.exp  ${decoded.exp }`)
              if (!isExpired) {
                setToken(storedToken);
              } else {
                console.log('Token expired');
                //need to check if token expired, ask user to login again.
                setToken(null);
                await AsyncStorage.removeItem('userToken');
              }
          } catch (err) {
              console.error('Invalid token:', err);
              await AsyncStorage.removeItem('userToken');
          }
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string,user:User) => {
    console.log(`login in AuthContext ${newToken}`)
    await AsyncStorage.setItem('userToken', newToken);
    await AsyncStorage.setItem('user', JSON.stringify(user)); 
    setToken(newToken);
    router.replace('/');
  };

  const saveExpoPushToken = async (userId:string,expoPushToken:string) => {
    await AsyncStorage.setItem('userId', userId);
    await AsyncStorage.setItem('expoPushToken', expoPushToken);
  }

  const removeExpoToken = async () =>{
    try {
        const userId = await AsyncStorage.getItem('userId');
        const expoPushToken = await AsyncStorage.getItem('expoPushToken');

      console.log(`logout  removeExpoToken userId ${userId} expoPushToken ${expoPushToken}`);
      if (userId && expoPushToken) {
      const result = await api.post('/users/removetoken', {
          userId: userId,
          expoPushToken: expoPushToken,
        });
        console.log(`Expo push token removed on logout ${result.data}`);
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('expoPushToken');
      }
    } catch (error) {
      console.error('Error removing push token on logout:', error);
    }
  }

  const logout = async () => {
     //remove expoPushTOken 
    const result = await removeExpoToken();

    //remove token from jwt
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    router.replace('/signin');
};


  return (
    //  userId, setUserId, expoPushToken, setExpoPushToken 
    <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, loading, saveExpoPushToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
