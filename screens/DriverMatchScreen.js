import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

export default function DriverMatchScreen({ route, navigation }) {
  const { originLocation, destinationLocation, destinationName, destinationAddress } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  useEffect(() => {
    // Simulate API call to find a driver
    const timerId = setTimeout(() => {
      // Mock driver data
      const mockDriver = {
        id: '123',
        name: 'John Doe',
        rating: 4.8,
        car: 'Toyota Camry',
        licensePlate: 'ABC123',
        photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        location: {
          latitude: originLocation.latitude - 0.01,
          longitude: originLocation.longitude - 0.01,
        },
        arrivalTime: 3, // minutes
      };

      // Calculate mock estimated time and price
      const distance = calculateDistance(
        originLocation.latitude,
        originLocation.longitude,
        destinationLocation.latitude,
        destinationLocation.longitude
      );
      
      const mockEstimatedTime = Math.round(distance * 3); // 3 min per km
      const mockEstimatedPrice = Math.round(5 + distance * 2); // $5 base + $2 per km

      setDriver(mockDriver);
      setEstimatedTime(mockEstimatedTime);
      setEstimatedPrice(mockEstimatedPrice);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timerId);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Simple distance calculation using Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleConfirmRide = () => {
    navigation.navigate('Ride', {
      driver,
      originLocation,
      destinationLocation,
      destinationName,
      destinationAddress,
      estimatedTime,
      estimatedPrice
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Finding you a driver...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: originLocation.latitude,
            longitude: originLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Origin marker */}
          <Marker
            coordinate={{
              latitude: originLocation.latitude,
              longitude: originLocation.longitude,
            }}
            title="Pick up"
            pinColor="blue"
          />
          
          {/* Destination marker */}
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title="Drop off"
            pinColor="red"
          />
          
          {/* Driver marker */}
          <Marker
            coordinate={{
              latitude: driver.location.latitude,
              longitude: driver.location.longitude,
            }}
            title={driver.name}
          >
            <View style={styles.driverMarker}>
              <MaterialIcons name="directions-car" size={24} color="white" />
            </View>
          </Marker>
          
          {/* Route line */}
          <Polyline
            coordinates={[
              { latitude: originLocation.latitude, longitude: originLocation.longitude },
              { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude },
            ]}
            strokeColor="#000"
            strokeWidth={3}
          />
        </MapView>
      </View>
      
      <View style={styles.bottomCard}>
        <View style={styles.rideDetails}>
          <View style={styles.driverInfo}>
            <View style={styles.driverImageContainer}>
              <Text style={styles.driverImagePlaceholder}>
                <MaterialIcons name="person" size={32} color="#444" />
              </Text>
            </View>
            <View style={styles.driverTextInfo}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverCar}>{driver.car} · {driver.licensePlate}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.driverRating}>{driver.rating}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.rideInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estimated time:</Text>
              <Text style={styles.infoValue}>{estimatedTime} min</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estimated price:</Text>
              <Text style={styles.infoValue}>${estimatedPrice}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Destination:</Text>
              <Text style={styles.infoValue}>{destinationName}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRide}>
            <Text style={styles.confirmButtonText}>Confirm Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  bottomCard: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  rideDetails: {
    marginBottom: 20,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  driverTextInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverCar: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  driverRating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  rideInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
