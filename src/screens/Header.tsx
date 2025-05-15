import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../components/styles';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const shouldShowBackArrow = route.name === 'Detail' || route.name === 'UserProfile' || route.name === 'Session';

  return (
    <SafeAreaView>
      <View style={[styles.header, { paddingTop: StatusBar.currentHeight }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {shouldShowBackArrow && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('MainTab')}

              style={styles.backButton}
            >
              <Text style={{ fontSize: 18 }}>{'<'}</Text>
            </TouchableOpacity>
          )}
          {route.name !== 'Detail' && route.name !== 'UserProfile' && (
            <Text style={styles.text}>MOBILE MOVIE RECOMMENDER</Text>
          )}
        </View>
      </View>
      <Text style={styles.line}></Text>
    </SafeAreaView>
  );
};

export default Header;
