import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.5:8080/api/v1/authorization';

interface RegisterData {
  username: string;
  password: string;
  latitude: number;
  longitude: number;
}

interface LoginData {
  username: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  try
  {
    const response = await axios.post(`${API_BASE_URL}/register`, data);
    const accessToken = response.data.result.token;
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error: any)
  {
    const serverMessage = error.response.data.result.error || 'Unknown server error';
    throw new Error(serverMessage);
  }
};

export const loginUser = async (data: LoginData) => {
  try
  {
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    console.log(response.data.result.token);
    const accessToken = response.data.result.token;
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error: any)
  {
    const serverMessage = error.response.data.result.error || 'Unknown server error';
    throw new Error(serverMessage);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('accessToken');
};
