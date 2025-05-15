import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ActivityIndicator, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import Header from './src/screens/Header';
import AuthScreen from './src/screens/AuthScreen';
import UserProfileScreen from './src/screens/ProfileScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SessionScreen from './src/screens/SessionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'MainTab' : 'Auth'}
        >
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{ headerShown: true, header: () => <Header /> }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Session"
            component={SessionScreen}
            options={{ headerShown: true, header: () => <Header /> }}
          />
          <Stack.Screen
            name="MainTab"
            component={TabNavigator}
            options={{ headerShown: true, header: () => <Header /> }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./src/static/home_icon.png')}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          title: 'Recommendations',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./src/static/recommendation_icon.png')}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./src/static/favorite_icon.png')}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./src/static/profile_icon.png')}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


export default App;
