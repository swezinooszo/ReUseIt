import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config/config';

// android simulator and ios physic device need mac's local ip addreess for backend api url
// while ios simulator just work with localhost
 const LOCAL_IP = '192.168.0.10'//'142.3.66.244';//;
        const URL = `http://${LOCAL_IP}:8000/api` //Platform.OS === 'android' ? `http://${LOCAL_IP}:8000/api` : `http://localhost:8000/api`;

const api = axios.create({
  baseURL: API_BASE_URL//URL,
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
