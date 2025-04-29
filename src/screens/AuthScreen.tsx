import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import { registerUser, loginUser } from '../services/authService';
import { getCurrentLocation, requestLocationPermission } from '../services/locationService';
import { useNavigation } from '@react-navigation/native';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation<any>();

  const toggleForm = () => setIsLogin(!isLogin);

  const handleRegister = async (
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'App needs location permission to register');
      return;
    }

    try {
      const location = await getCurrentLocation();
      await registerUser({ username, password, latitude: location.latitude, longitude: location.longitude });
      Alert.alert('Success', 'Registration successful!');
      setIsLogin(true);
    } catch (error: any) {
      Alert.alert('Registration failed', error.message || 'Unknown error');
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      await loginUser({ username, password });
      Alert.alert('Success', 'Login successful!');
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Login failed', error.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      {isLogin ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <RegistrationForm onRegister={handleRegister} />
      )}
      <Button
        title={isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        onPress={toggleForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
});

export default AuthScreen;
