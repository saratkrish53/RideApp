import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DestinationScreen({ route, navigation }) {
  const { originLocation } = route.params;
  const [destination, setDestination] = useState('');
  
  // Mock suggested locations
  const suggestedLocations = [
    { id: '1', name: 'Home', address: '123 Home Street', icon: 'home' },
    { id: '2', name: 'Work', address: '456 Work Avenue', icon: 'work' },
    { id: '3', name: 'Shopping Mall', address: '789 Mall Road', icon: 'shopping-bag' },
    { id: '4', name: 'Airport', address: 'International Airport', icon: 'flight' },
    { id: '5', name: 'Restaurant', address: 'Downtown Food Street', icon: 'restaurant' },
  ];

  const handleDestinationSelect = (selectedDestination) => {
    // In a real app, we would get coordinates for the selected destination
    // Here we're just creating mock coordinates based on the origin
    const mockDestinationLocation = {
      latitude: originLocation.latitude + (Math.random() * 0.05),
      longitude: originLocation.longitude + (Math.random() * 0.05),
    };
    
    navigation.navigate('DriverMatch', {
      originLocation: originLocation,
      destinationLocation: mockDestinationLocation,
      destinationName: selectedDestination.name,
      destinationAddress: selectedDestination.address
    });
  };

  const renderSuggestedLocation = ({ item }) => (
    <TouchableOpacity 
      style={styles.locationItem}
      onPress={() => handleDestinationSelect(item)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.icon} size={24} color="#333" />
      </View>
      <View>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#888"
          />
        </View>
        
        {destination.length > 0 && (
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => handleDestinationSelect({ 
              name: destination, 
              address: destination,
              icon: 'location-on'
            })}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.sectionTitle}>Suggested locations</Text>
      
      <FlatList
        data={suggestedLocations}
        renderItem={renderSuggestedLocation}
        keyExtractor={item => item.id}
        style={styles.locationsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    padding: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  locationsList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationAddress: {
    color: '#888',
    marginTop: 3,
  },
});
