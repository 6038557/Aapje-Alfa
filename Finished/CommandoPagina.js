import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailsModal from './DetailsModal';

const CommandsNames = {
  Power: "uitgezet",
  Eyes: "Ogen knipperen",
  Mouth: "Knight Rider effect",
  Head: "Hoofd draaien",
  Arms: "armen op en neer",
  Front: "Vooruit",
  Back: "Achteruit",
  Left: "Linksom",
  Right: "Rightom",
  Rickroll: "Muziek afgespeeld"
};

// Helper to get unique locations
const getUniqueLocations = (history) => {
  const uniqueLocations = new Set();
  const locations = [];
  
  history.forEach(item => {
    if (item.location) {
      const locStr = `${item.location.latitude},${item.location.longitude}`;
      if (!uniqueLocations.has(locStr)) {
        uniqueLocations.add(locStr);
        locations.push(item.location);
      }
    }
  });
  
  return locations;
};

// Helper to get the last execution date
const getLastDate = (history) => {
  if (history.length === 0) return null;
  const lastItem = history.reduce((latest, current) => 
    new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
  );
  return new Date(lastItem.timestamp).toISOString().split('T')[0];
};

// Local storage key
const STORAGE_KEY = '@command_history';

export default function App() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [stats, setStats] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);

  // Load command history from local storage on app start
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
          setCommandHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };
    
    loadHistory();
  }, []);

  const handlePress = async (digit) => {
    let locationStatus = await Location.requestForegroundPermissionsAsync();
    if (locationStatus.status !== 'granted') {
      Alert.alert('Locatie toestemming nodig', 'We hebben locatietoestemming nodig om door te gaan');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    
    const payload = {
      user: 'ChessMasters',
      command: digit,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      timestamp: new Date().toISOString()
    };

    try {
      // Save to API
      await axios.post('https://to.internus.info/api/monkeyalpha', payload);
      
      // Save locally
      const newEntry = {
        command: digit,
        timestamp: payload.timestamp,
        location: payload.location
      };
      
      const updatedHistory = [...commandHistory, newEntry];
      setCommandHistory(updatedHistory);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      
      Alert.alert('✅ Succes', `Commando "${digit}" is verstuurd.`);
    } catch (error) {
      console.error('❌ API Fout:', error);
      const errorMsg = error?.response?.data?.message || error.message || 'Onbekende fout';
      Alert.alert('❌ Fout bij verzenden', errorMsg);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('https://to.internus.info/api/monkeyalpha/statistics');
      const data = await res.json();
      setStats(data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const openStats = () => {
    fetchStats();
    setStatsVisible(true);
  };

  const showCommandDetails = (commandId) => {
    const historyForCommand = commandHistory.filter(
      item => item.command === commandId
    );
    
    const commandName = CommandsNames[Object.keys(CommandsNames)[commandId]];
    const locations = getUniqueLocations(historyForCommand);
    const lastDate = getLastDate(historyForCommand);
    
    setSelectedCommand({
      id: commandId,
      name: commandName,
      count: historyForCommand.length,
      date: lastDate,
      locations: locations
    });
    setDetailsVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputText}>Klik op een cijfer om te verzenden</Text>
      <View style={styles.grid}>
        {[...'1234567890'].map((num, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.button} 
            onPress={() => handlePress(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.statsButton} onPress={openStats}>
        <Text style={styles.statsText}>📊 Statistieken</Text>
      </TouchableOpacity>

      <Modal visible={statsVisible} animationType="slide">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStatsVisible(false)}>
            <Text style={styles.close}>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Statistieken</Text>
        </View>

        <FlatList
          style={styles.list}
          data={stats}
          renderItem={({ item }) => (
            <View style={styles.dayBlock}>
              <Text style={styles.date}>{item.date}</Text>
              {Object.entries(item.commands).map(([commandId, count]) => {
                const key = Object.keys(CommandsNames)[commandId];
                return (
                  <View key={commandId} style={styles.row}>
                    <Text style={styles.text}>
                      {CommandsNames[key] || `Onbekende command`}: {count} keer
                    </Text>
                    <TouchableOpacity onPress={() => showCommandDetails(commandId)}>
                      <Text style={styles.info}>(i)</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        />
      </Modal>
      
      <DetailsModal
        visible={detailsVisible}
        command={selectedCommand}
        onClose={() => setDetailsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#6ea352', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  inputText: { 
    fontSize: 20, 
    marginBottom: 10, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    width: 200, 
    justifyContent: 'center' 
  },
  button: { 
    width: 60, 
    height: 60, 
    margin: 5, 
    backgroundColor: '#367c2b', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10 
  },
  buttonText: { 
    fontSize: 22, 
    color: '#fff' 
  },
  statsButton: { 
    marginTop: 20, 
    backgroundColor: '#007bff', 
    paddingVertical: 10, 
    paddingHorizontal: 40, 
    borderRadius: 10 
  },
  statsText: { 
    fontSize: 18, 
    color: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#244e1e', 
    marginTop: 40 
  },
  close: { 
    fontSize: 24, 
    color: '#f2c94c', 
    marginRight: 20 
  },
  title: { 
    fontSize: 20, 
    color: '#d0f0c0', 
    fontWeight: 'bold' 
  },
  list: { 
    padding: 20, 
    paddingTop: 50, 
    backgroundColor: '#2f4f2f' 
  },
  dayBlock: { 
    marginBottom: 15, 
    backgroundColor: '#3e7d44', 
    padding: 12, 
    borderRadius: 10 
  },
  date: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#193d0e', 
    paddingVertical: 4 
  },
  text: { 
    flex: 1, 
    color: '#fff' 
  },
  info: { 
    color: '#f2c94c', 
    fontWeight: 'bold',
    padding: 5,
    fontSize: 16,
  },
});