import { useState, useEffect } from 'react';
import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Commands = {
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

export default function App() {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      fetch('https://to.internus.info/api/monkeyalpha/statistics')
        .then(response => response.json())
        .then(data => setStats(data.reverse()))
        .catch(console.error)
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Statistieken" onPress={() => setVisible(true)} disabled={loading || stats.length === 0} />

      {/* MODAL DO NOT REMOVE */}
      <Modal visible={visible} animationType="slide">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistieken</Text>
        </View>

        {/* Statistics */}
        <View style={styles.modal}>
          <FlatList
            contentContainerStyle={{ paddingTop: 50 }}
            data={stats}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.block}>
                <Text style={styles.date}>{item.date}</Text>
                {Object.entries(item.commands).map(([CommandIndex, count]) => (
                  <View key={CommandIndex} style={{flexDirection: 'row',
                                                       alignItems: 'center',
                                                       marginVertical: 1,
                                                       borderBottomWidth: 1,
                                                       borderColor: '#193d0e',
                                                       paddingVertical: 5, }}>
                    <Text style={styles.stats}>
                      {Commands[CommandIndex] || CommandIndex}: {count} keer
                    </Text>
                    <TouchableOpacity onPress={() => {

                    }}>
                      <Text style={styles.info}>?</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center',},
  modal: { flex: 1,  marginTop: 0, padding: 20, backgroundColor: '#2f4f2f', },
  block: { marginVertical: 10, padding: 15, backgroundColor: '#3e7d44', borderRadius: 12, shadowColor: '#0a1e07', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 6, },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#244e1e', marginTop:40, borderTopLeftRadius: 18, borderTopRightRadius: 18,},
  closeButton: { padding: 8, marginRight: 20, },
  closeText: { fontSize: 26, fontWeight: 'bold', color: '#f2c94c', },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#d0f0c0', },
  date: {color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  statBox: {flexDirection: 'row', alignItems: 'center', marginVertical: 1, borderBottomWidth: 1, borderColor: '#193d0e', paddingVertical: 5,},
  stats: {flex: 1, color: '#fff'},
  info: { color: '#f2c94c', fontWeight: 'bold', fontSize: 16,},
});


