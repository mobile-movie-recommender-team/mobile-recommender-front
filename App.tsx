import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import Header from './src/screens/Header';
import { SafeAreaView } from 'react-native';

const Stack = createStackNavigator()

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true, header: () => <Header /> }} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: true, header: () => <Header /> }} />
          </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;