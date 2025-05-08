import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getCurrentLocation, requestLocationPermission } from '../services/locationService';
import { fetchUserProfile, updateUserProfile } from '../services/profileService';

export default function UserProfileScreen() {
  const [name, setName] = useState<string>('Username');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setName(profile.name);
        setLatitude(profile.latitude);
        setLongitude(profile.longitude);
      } catch (err) {
        console.error('Failed to retrieve profile', err);
      }
    };

    loadProfile();
  }, []);

  const handleNameChange = async () => {
    if (newName.trim()) {
      const updatedName = newName.trim();
      setName(updatedName);
      setNewName('');
      try {
        await updateUserProfile({ name: updatedName, latitude: latitude!, longitude: longitude! });
      } catch (err) {
        console.error('Profile update error:', err);
      }
    }
  };

  const handleLocationUpdate = async () => {
    try {
      const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'App needs location permission to register');
            return;
        }
      const location = await getCurrentLocation();
      setLatitude(location.latitude);
      setLongitude(location.longitude);
      await updateUserProfile({ name, latitude: location.latitude, longitude: location.longitude });
    } catch (err) {
      console.error('Geolocation error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Username: <Text style={styles.infoValue}>{name}</Text></Text>
        <Text style={styles.infoText}>Latitude: <Text style={styles.infoValue}>{latitude?.toFixed(6)}</Text></Text>
        <Text style={styles.infoText}>Longitude: <Text style={styles.infoValue}>{longitude?.toFixed(6)}</Text></Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter new username"
        value={newName}
        onChangeText={setNewName}
      />

      <TouchableOpacity style={styles.button} onPress={handleNameChange}>
        <Text style={styles.buttonText}>Change Username</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleLocationUpdate}>
        <Text style={styles.buttonText}>Update Geolocation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  infoValue: {
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});