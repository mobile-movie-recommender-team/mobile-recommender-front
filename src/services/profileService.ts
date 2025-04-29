import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.100:8080/api/v1/profile';

interface UserProfile {
  name: string;
  latitude: number;
  longitude: number;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = await AsyncStorage.getItem('accessToken');
  const response = await axios.get<UserProfile>(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserProfile = async (data: UserProfile): Promise<void> => {
  const token = await AsyncStorage.getItem('accessToken');
  await axios.put(`${API_URL}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
