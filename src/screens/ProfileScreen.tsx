import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getCurrentLocation, requestLocationPermission } from '../services/locationService';
import ProfileInfo from '../components/ProfileInfo';
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
    <View style={styles.container}>
      <ProfileInfo name={name} latitude={latitude} longitude={longitude} />

      <TextInput
        style={styles.input}
        placeholder="New username"
        value={newName}
        onChangeText={setNewName}
      />
      <Button title="Change username" onPress={handleNameChange} />
      <View style={{ marginTop: 10 }}>
        <Button title="Update geolocation" onPress={handleLocationUpdate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
