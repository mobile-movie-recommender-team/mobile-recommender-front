import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../components/styles';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const response = await fetch('http://192.168.0.102:8080/api/v1/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserName(data.name);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserName();
  }, []);

  const shouldShowBackArrow = route.name === 'Detail' || route.name === 'UserProfile';

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {shouldShowBackArrow && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Home')}
              style={styles.backButton}
            >
              <Text style={{ fontSize: 18 }}>{'<'}</Text>
            </TouchableOpacity>
          )}
          {route.name !== 'Detail' && route.name !== 'UserProfile' && (
            <Text style={styles.text}>Movies</Text>
          )}
        </View>
        {route.name !== 'Recommendations' && route.name !== 'Detail' && (
            <TouchableOpacity onPress={() => navigation.navigate('Recommendations')} style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 20, paddingTop: 8, fontWeight: 'bold'}}>Recommendations</Text>
            </TouchableOpacity>
          )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {userName && route.name !== 'Detail' && route.name !== 'UserProfile' && (
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
              <Text style={{ fontSize: 14, paddingTop: 8, fontWeight: 'bold' }}>{userName}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.line}></Text>
    </SafeAreaView>
  );
};

export default Header;
