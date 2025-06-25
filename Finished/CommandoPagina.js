import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import axios from 'axios';

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

export default function CommandoPagina() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [stats, setStats] = useState([]);

  const handlePress = async (digit) => {
    const payload = {
      user: 'ChessMasters',
      command: digit,
    };

    try {
      await axios.post('https://to.internus.info/api/monkeyalpha', payload);
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

  return (
    <View style={styles.container}>
      <Text style={styles.inputText}>Klik op een cijfer om te verzenden</Text>
      <View style={styles.grid}>
        {[...'1234567890'].map((num, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handlePress(num)}>
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
              {Object.entries(item.commands).map(([i, count]) => {
                const key = Object.keys(CommandsNames)[i];
                return (
                  <View key={i} style={styles.row}>
                    <Text style={styles.text}>
                      {CommandsNames[key] || 'Onbekend commando'}: {count} keer
                    </Text>
                    <Text style={styles.info}>(?)</Text>
                  </View>
                );
              })}
            </View>
          )}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6ea352', alignItems: 'center', justifyContent: 'center', padding: 20 },
  inputText: { fontSize: 20, marginBottom: 10, color: '#fff', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 200, justifyContent: 'center' },
  button: { width: 60, height: 60, margin: 5, backgroundColor: '#367c2b', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  buttonText: { fontSize: 22, color: '#fff' },
  statsButton: { marginTop: 20, backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 10 },
  statsText: { fontSize: 18, color: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#244e1e', marginTop: 40 },
  close: { fontSize: 24, color: '#f2c94c', marginRight: 20 },
  title: { fontSize: 20, color: '#d0f0c0', fontWeight: 'bold' },
  list: { padding: 20, paddingTop: 50, backgroundColor: '#2f4f2f' },
  dayBlock: { marginBottom: 15, backgroundColor: '#3e7d44', padding: 12, borderRadius: 10 },
  date: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#193d0e', paddingVertical: 4 },
  text: { flex: 1, color: '#fff' },
  info: { color: '#f2c94c', fontWeight: 'bold' },
});
