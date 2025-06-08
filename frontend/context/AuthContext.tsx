
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //** This runs once — when <AuthProvider> mounts
  useEffect(() => {
    const loadToken = async () => {
      console.log("loadToken")
      const storedToken = await AsyncStorage.getItem('userToken');
       console.log(`storedToken ${storedToken}`)
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem('userToken', newToken);
    setToken(newToken);
    router.replace('/');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    router.replace('/signin');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
