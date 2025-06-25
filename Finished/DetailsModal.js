import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const DetailsModal = ({ visible, command, onClose }) => {
  if (!command) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{command.name}</Text>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailText}>
              Aantal keer uitgevoerd: {command.count}
            </Text>
            
            {command.date && (
              <Text style={styles.detailText}>
                Datum: {command.date}
              </Text>
            )}
          </View>
          
          <View style={styles.locationsSection}>
            <Text style={styles.subtitle}>Locaties:</Text>
            {command.locations.length > 0 ? (
              command.locations.map((location, index) => (
                <Text key={index} style={styles.locationText}>
                  • Locatie {index + 1}: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
              ))
            ) : (
              <Text style={styles.noLocations}>Geen locaties beschikbaar</Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  detailSection: {
    backgroundColor: '#e9f5e9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2c3e50',
  },
  locationsSection: {
    backgroundColor: '#edf7ed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2c3e50',
  },
  noLocations: {
    fontStyle: 'italic',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#367c2b',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetailsModal;