import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch,
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase/config';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saveRideHistory, setSaveRideHistory] = useState(true);

  const toggleSwitch = (setting, value) => {
    switch(setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'locationTracking':
        setLocationTracking(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'saveRideHistory':
        setSaveRideHistory(value);
        break;
      default:
        break;
    }
    
    // In a real app, you would save these settings to the user's preferences
    // firestore.collection('users').doc(auth.currentUser.uid).update({
    //   [`settings.${setting}`]: value
    // });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Ride History',
      'Are you sure you want to clear all your ride history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would clear the ride history from Firestore
            Alert.alert('Success', 'Your ride history has been cleared.');
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset the app? This will clear all your data and preferences.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // In a real app, you would reset all user preferences
            Alert.alert('Success', 'The app has been reset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color="#666" style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts for ride updates</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => toggleSwitch('notifications', value)}
              trackColor={{ false: '#e1e1e1', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="location-on" size={24} color="#666" style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingDescription}>Allow app to track your location</Text>
              </View>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={(value) => toggleSwitch('locationTracking', value)}
              trackColor={{ false: '#e1e1e1', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="brightness-3" size={24} color="#666" style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Switch to dark color theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(value) => toggleSwitch('darkMode', value)}
              trackColor={{ false: '#e1e1e1', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="history" size={24} color="#666" style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>Save Ride History</Text>
                <Text style={styles.settingDescription}>Keep a record of your past rides</Text>
              </View>
            </View>
            <Switch
              value={saveRideHistory}
              onValueChange={(value) => toggleSwitch('saveRideHistory', value)}
              trackColor={{ false: '#e1e1e1', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('ChangePassword')}>
            <MaterialIcons name="lock" size={24} color="#666" style={styles.actionIcon} />
            <Text style={styles.actionText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <MaterialIcons name="security" size={24} color="#666" style={styles.actionIcon} />
            <Text style={styles.actionText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('TermsOfService')}>
            <MaterialIcons name="description" size={24} color="#666" style={styles.actionIcon} />
            <Text style={styles.actionText}>Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleClearHistory}>
            <MaterialIcons name="delete" size={24} color="#f44336" style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: '#f44336' }]}>Clear Ride History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleResetApp}>
            <MaterialIcons name="refresh" size={24} color="#f44336" style={styles.actionIcon} />
            <Text style={[styles.actionText, { color: '#f44336' }]}>Reset App</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Uber Clone MVP</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 30, // To balance the back button
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#aaa',
  },
});
