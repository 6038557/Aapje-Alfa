import { useState, useEffect } from 'react';
import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

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

export default function App() {
  const [visible, setVisible] = useState(false);

  /* Maak lege array voor de fetch van de api */
  const [stats, setStats] = useState([]);


   /* hij  fetch de api en zet hem andersom in de array zodat de nieuwe data eerst komt */
  useEffect(() => {
    fetch('https://to.internus.info/api/monkeyalpha/statistics')
      .then(res => res.json())
      .then(data => setStats(data.reverse()))
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Statistieken" onPress={() => setVisible(true)}/>

      <Modal visible={visible} animationType="slide">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.close}>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Statistieken</Text>
        </View>

        <FlatList
          style={styles.list}
          data={stats}  /*stop de stats in een array die je ziet in elke dag*/
          renderItem={({ item }) => ( /* renderd alle items in een lijst */
            <View style={styles.dayBlock}>
              <Text style={styles.date}>{item.date}</Text>
              /* loopt door alle commands  */
              {Object.entries(item.commands).map(([i, count]) => {
                const key = Object.keys(CommandsNames)[i];
                return (
                  <View key={i} style={styles.row}>
                    <Text style={styles.text}>{CommandsNames[key] || `Onbekende command`}: {count} keer</Text>
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#244e1e', marginTop: 40 },
  close: { fontSize: 24, color: '#f2c94c', marginRight: 20 },
  title: { fontSize: 20, color: '#d0f0c0', fontWeight: 'bold'  },
  list: { padding: 20, paddingTop: 50, backgroundColor: '#2f4f2f' },
  dayBlock: { marginBottom: 15, backgroundColor: '#3e7d44', padding: 12, borderRadius: 10 },
  date: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#193d0e', paddingVertical: 4 },
  text: { flex: 1, color: '#fff' },
  info: { color: '#f2c94c', fontWeight: 'bold' },
});
