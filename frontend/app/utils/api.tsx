import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

 const LOCAL_IP = '192.168.0.10';
        const URL = Platform.OS === 'android' ? `http://${LOCAL_IP}:8000/api` : `http://localhost:8000/api`;

const api = axios.create({
  baseURL: URL,//'http://localhost:8000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
