import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, firebase, firestore, storage, timestamp } from '../../firebase/config';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if we have updated user data from the navigation params
        const updatedData = navigation.getParam ? 
          navigation.getParam('updatedUserData') : 
          (navigation.route && navigation.route.params && navigation.route.params.updatedUserData);

        if (updatedData) {
          // Use the updated data directly
          setUserData(updatedData);
          setLoading(false);
          return;
        }

        // Otherwise fetch from Firestore
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            // If user doc doesn't exist (may happen with guest login)
            setUserData({
              fullName: currentUser.displayName || 'User',
              email: currentUser.email || 'guest@example.com',
              phoneNumber: '',
              profileImage: null
            });
          }
        } else {
          // Handle the case when there's no user (guest mode)
          setUserData({
            fullName: 'Guest User',
            email: 'guest@example.com',
            phoneNumber: '',
            profileImage: null
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };

    fetchUserData();

    // Listen for profile updates
    const unsubscribe = navigation.addListener('focus', fetchUserData);

    return unsubscribe;
  }, [navigation]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // The onAuthStateChanged listener in App.js will handle navigation
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  const handlePickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to update your profile picture.');
      return;
    }

    setImageUploading(true);
    
    try {
      // Create a reference to the storage location
      const fileRef = storage.ref(`profileImages/${currentUser.uid}`);
      
      // Fetch the image data
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload image
      await fileRef.put(blob);
      
      // Get download URL
      const downloadURL = await fileRef.getDownloadURL();
      
      // Update user document
      if (currentUser.uid) {
        try {
          await firestore.collection('users').doc(currentUser.uid).update({
            profileImage: downloadURL
          });
        } catch (firestoreError) {
          console.error('Firestore update error:', firestoreError);
          // If the document doesn't exist, create it
          await firestore.collection('users').doc(currentUser.uid).set({
            id: currentUser.uid,
            email: currentUser.email,
            profileImage: downloadURL,
            createdAt: firestore.FieldValue.serverTimestamp()
          });
        }
      }
      
      // Update local state
      setUserData(prevData => ({
        ...prevData,
        profileImage: downloadURL
      }));
      
      setImageUploading(false);
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageUploading(false);
      Alert.alert('Error', `Failed to update profile picture: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {imageUploading ? (
              <View style={styles.profileImage}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <MaterialIcons name="person" size={80} color="#666" />
              </View>
            )}
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handlePickImage}
            >
              <MaterialIcons name="camera-alt" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userData.fullName}</Text>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile', { userData })}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialIcons name="email" size={24} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="phone" size={24} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userData.phoneNumber || 'Not set'}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="star" size={24} color="#666" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{userData.rating || 'No ratings yet'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('RideHistory')}>
            <MaterialIcons name="history" size={24} color="#000" style={styles.actionIcon} />
            <Text style={styles.actionText}>Ride History</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('PaymentMethods')}>
            <MaterialIcons name="payment" size={24} color="#000" style={styles.actionIcon} />
            <Text style={styles.actionText}>Payment Methods</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Help', 'Contact support at support@uberapp.com')}>
            <MaterialIcons name="help" size={24} color="#000" style={styles.actionIcon} />
            <Text style={styles.actionText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={24} color="#000" style={styles.actionIcon} />
            <Text style={styles.actionText}>Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  actionsSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
  signOutButton: {
    marginVertical: 30,
    marginHorizontal: 20,
    backgroundColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
