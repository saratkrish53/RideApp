import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

export default function RideScreen({ route, navigation }) {
  const { 
    driver, 
    originLocation, 
    destinationLocation, 
    destinationName, 
    destinationAddress,
    estimatedTime,
    estimatedPrice
  } = route.params;
  
  const [rideStatus, setRideStatus] = useState('arriving'); // 'arriving', 'inProgress', 'completed'
  const [remainingTime, setRemainingTime] = useState(estimatedTime);
  const [driverCurrentLocation, setDriverCurrentLocation] = useState(driver.location);
  const [progress, setProgress] = useState(0); // 0 to 1
  
  // Simulate driver movement and ride progress
  useEffect(() => {
    // Simulation for driver arriving to pick up
    const arrivalTimer = setTimeout(() => {
      setRideStatus('inProgress');
      Alert.alert('Your ride has started!');
      
      // Interpolate driver position every 3 seconds
      const interval = setInterval(() => {
        if (progress >= 1) {
          clearInterval(interval);
          setRideStatus('completed');
          navigation.navigate('Rating', { 
            driver,
            estimatedPrice
          });
          return;
        }
        
        const newProgress = progress + 0.1;
        setProgress(newProgress);
        
        // Interpolate driver's position between origin and destination
        const newDriverLocation = {
          latitude: originLocation.latitude + (destinationLocation.latitude - originLocation.latitude) * newProgress,
          longitude: originLocation.longitude + (destinationLocation.longitude - originLocation.longitude) * newProgress,
        };
        setDriverCurrentLocation(newDriverLocation);
        
        // Update remaining time
        const newRemainingTime = Math.round(estimatedTime * (1 - newProgress));
        setRemainingTime(newRemainingTime);
      }, 3000);
      
      return () => clearInterval(interval);
    }, 5000); // Driver arrives after 5 seconds
    
    return () => clearTimeout(arrivalTimer);
  }, [progress]);
  
  const handleContactDriver = () => {
    Alert.alert('Contact Driver', 'This feature would allow you to call or message your driver in a real app.');
  };
  
  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Home'),
        },
      ],
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: driverCurrentLocation.latitude,
            longitude: driverCurrentLocation.longitude,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0121,
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
            coordinate={driverCurrentLocation}
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
        <View style={styles.statusBar}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusLine, styles.statusLineComplete]} />
            <View style={[styles.statusDot, styles.statusDotComplete]}>
              <MaterialIcons name="check" size={12} color="white" />
            </View>
            <Text style={styles.statusText}>Driver Matched</Text>
          </View>
          
          <View style={styles.statusIndicator}>
            <View 
              style={[
                styles.statusLine, 
                rideStatus === 'arriving' ? styles.statusLineActive : 
                (rideStatus === 'inProgress' || rideStatus === 'completed') ? styles.statusLineComplete : null
              ]} 
            />
            <View 
              style={[
                styles.statusDot, 
                rideStatus === 'arriving' ? styles.statusDotActive : 
                (rideStatus === 'inProgress' || rideStatus === 'completed') ? styles.statusDotComplete : null
              ]}
            >
              {(rideStatus === 'inProgress' || rideStatus === 'completed') && <MaterialIcons name="check" size={12} color="white" />}
            </View>
            <Text style={styles.statusText}>Driver Arrived</Text>
          </View>
          
          <View style={styles.statusIndicator}>
            <View 
              style={[
                styles.statusLine, 
                rideStatus === 'inProgress' ? styles.statusLineActive : 
                rideStatus === 'completed' ? styles.statusLineComplete : null
              ]} 
            />
            <View 
              style={[
                styles.statusDot, 
                rideStatus === 'inProgress' ? styles.statusDotActive : 
                rideStatus === 'completed' ? styles.statusDotComplete : null
              ]}
            >
              {rideStatus === 'completed' && <MaterialIcons name="check" size={12} color="white" />}
            </View>
            <Text style={styles.statusText}>In Progress</Text>
          </View>
          
          <View style={styles.statusIndicator}>
            <View 
              style={[
                styles.statusLine, 
                rideStatus === 'completed' ? styles.statusLineComplete : null
              ]} 
            />
            <View 
              style={[
                styles.statusDot, 
                rideStatus === 'completed' ? styles.statusDotComplete : null
              ]}
            />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
        
        <View style={styles.rideInfo}>
          <View style={styles.destinationInfo}>
            <MaterialIcons name="place" size={20} color="#666" />
            <View style={styles.destinationTextContainer}>
              <Text style={styles.destinationTitle}>Drop-off Location</Text>
              <Text style={styles.destinationAddress}>{destinationName}</Text>
            </View>
          </View>
          
          <View style={styles.timeInfo}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <View style={styles.timeTextContainer}>
              <Text style={styles.timeTitle}>Estimated Time</Text>
              <Text style={styles.timeValue}>{remainingTime} min remaining</Text>
            </View>
          </View>
          
          <View style={styles.priceInfo}>
            <MaterialIcons name="attach-money" size={20} color="#666" />
            <View style={styles.priceTextContainer}>
              <Text style={styles.priceTitle}>Estimated Price</Text>
              <Text style={styles.priceValue}>${estimatedPrice}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactDriver}>
            <MaterialIcons name="phone" size={20} color="#000" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
            <MaterialIcons name="cancel" size={20} color="#fff" />
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statusIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  statusLine: {
    height: 3,
    backgroundColor: '#ddd',
    width: '100%',
    position: 'absolute',
    top: 8,
    zIndex: 1,
  },
  statusLineActive: {
    backgroundColor: '#000',
  },
  statusLineComplete: {
    backgroundColor: '#4CAF50',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotActive: {
    backgroundColor: '#000',
  },
  statusDotComplete: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  rideInfo: {
    marginBottom: 20,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  destinationTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  destinationTitle: {
    fontSize: 14,
    color: '#666',
  },
  destinationAddress: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  timeTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  timeTitle: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  priceTitle: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 15,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});
