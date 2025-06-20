import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

 const LOCAL_IP = '192.168.0.10';
        const URL = `http://${LOCAL_IP}:8000/api` //Platform.OS === 'android' ? `http://${LOCAL_IP}:8000/api` : `http://localhost:8000/api`;

const api = axios.create({
  baseURL: URL,//'http://localhost:8000/api',
});

api.interceptors.request.use(async (config) => {
  // const token = await SecureStore.getItemAsync('userToken');
   const token = await AsyncStorage.getItem('userToken');
  // console.log('Attaching token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
