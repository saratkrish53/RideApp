import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RatingScreen({ route, navigation }) {
  const { driver, estimatedPrice } = route.params;
  const [rating, setRating] = useState(5);
  const [tipAmount, setTipAmount] = useState(0);
  
  const tipOptions = [0, 1, 2, 5];
  
  const handleSubmitRating = () => {
    Alert.alert(
      'Thank you!',
      `Your rating has been submitted. Your total is $${estimatedPrice + tipAmount}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>How was your trip?</Text>
        </View>
        
        <View style={styles.driverInfo}>
          <View style={styles.driverImageContainer}>
            <Text style={styles.driverImagePlaceholder}>
              <MaterialIcons name="person" size={32} color="#444" />
            </Text>
          </View>
          <View style={styles.driverTextInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.driverCar}>{driver.car}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rate your experience:</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <MaterialIcons
                  name={star <= rating ? 'star' : 'star-border'}
                  size={40}
                  color={star <= rating ? '#FFD700' : '#ccc'}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipLabel}>Add a tip for {driver.name.split(' ')[0]}:</Text>
          <View style={styles.tipOptions}>
            {tipOptions.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.tipOption,
                  tipAmount === amount && styles.tipOptionSelected,
                ]}
                onPress={() => setTipAmount(amount)}
              >
                <Text
                  style={[
                    styles.tipOptionText,
                    tipAmount === amount && styles.tipOptionTextSelected,
                  ]}
                >
                  {amount === 0 ? 'No Tip' : `$${amount}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.fareContainer}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Trip total:</Text>
            <Text style={styles.fareValue}>${estimatedPrice}</Text>
          </View>
          {tipAmount > 0 && (
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Tip:</Text>
              <Text style={styles.fareValue}>${tipAmount}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${estimatedPrice + tipAmount}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRating}>
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
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
    marginBottom: 25,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: 5,
  },
  tipContainer: {
    marginBottom: 25,
  },
  tipLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  tipOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tipOptionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tipOptionText: {
    color: '#333',
    fontWeight: '500',
  },
  tipOptionTextSelected: {
    color: 'white',
  },
  fareContainer: {
    marginBottom: 25,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 15,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 15,
    color: '#666',
  },
  fareValue: {
    fontSize: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
