import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';

import KaartPagina from './KaartPagina';
import CommandoPagina from './CommandoPagina';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Kaart" component={KaartPagina} />
        <Stack.Screen name="Commando's" component={CommandoPagina} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Welkom bij Aapje Alfa</Text>
      <Button title="🗺️ Naar de Kaart" onPress={() => navigation.navigate('Kaart')} />
      <View style={{ height: 10 }} />
      <Button title="🔢 Naar de Commando's" onPress={() => navigation.navigate("Commando's")} />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
  },
});
