import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationData } from '../types';

interface LocationPickerProps {
  location: LocationData;
  onLocationChange: (location: LocationData) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange,
}) => {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationChange({
            ...location,
            latitude,
            longitude,
          });
          Alert.alert('Success', 'Location updated');
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          Alert.alert('Error', 'Failed to get current location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to get location');
      setLoading(false);
    }
  };

  const handleAddressChange = (address: string) => {
    onLocationChange({
      ...location,
      address,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={getCurrentLocation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '📍 Getting Location...' : '📍 Get Current Location'}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <Text style={styles.inputLabel}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full address"
        value={location.address}
        onChangeText={handleAddressChange}
        placeholderTextColor="#999"
        multiline
      />

      <View style={styles.coordsContainer}>
        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>Latitude</Text>
          <Text style={styles.coordValue}>{location.latitude.toFixed(6)}</Text>
        </View>
        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>Longitude</Text>
          <Text style={styles.coordValue}>{location.longitude.toFixed(6)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  coordsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  coordBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  coordLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
});
