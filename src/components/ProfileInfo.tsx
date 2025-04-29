import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  latitude: number | null;
  longitude: number | null;
}

export default function ProfileInfo({ name, latitude, longitude }: Props) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.label}>Username: {name}</Text>
      <Text style={styles.label}>Latitude: {latitude ?? 'Downloading...'}</Text>
      <Text style={styles.label}>Longitude: {longitude ?? 'Downloading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
