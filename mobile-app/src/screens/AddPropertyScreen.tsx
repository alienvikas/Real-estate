import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Picker,
} from 'react-native';
import { useProperty } from '../context/PropertyContext';
import { ImagePickerComponent } from '../components/ImagePickerComponent';
import { LocationPicker } from '../components/LocationPicker';
import { PropertyFormData, LocationData } from '../types';

type AddPropertyScreenProps = {
  navigation: any;
};

const AMENITIES = [
  'WiFi',
  'AC',
  'Parking',
  'Garden',
  'Gym',
  'Pool',
  'Security',
  'Lift',
  'Balcony',
];

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'commercial'];

export const AddPropertyScreen: React.FC<AddPropertyScreenProps> = ({
  navigation,
}) => {
  const { addProperty } = useProperty();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    priceForSale: '',
    priceForRent: '',
    address: '',
    latitude: 0,
    longitude: 0,
    bhk: '1',
    area: '',
    amenities: [],
    propertyType: 'apartment',
    images: [],
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter property title');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter property description');
      return;
    }

    if (!formData.priceForSale && !formData.priceForRent) {
      Alert.alert('Error', 'Please enter price for sale or rent');
      return;
    }

    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter property address');
      return;
    }

    if (!formData.area.trim()) {
      Alert.alert('Error', 'Please enter property area');
      return;
    }

    if (formData.images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      await addProperty(formData);
      Alert.alert('Success', 'Property added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding property:', error);
      Alert.alert('Error', 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    const updated = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updated });
  };

  const handleLocationChange = (location: LocationData) => {
    setFormData({
      ...formData,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Details</Text>

          <Text style={styles.label}>Property Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Luxury 2BHK Apartment"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe the property..."
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type & Specs</Text>

          <Text style={styles.label}>Property Type *</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={formData.propertyType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  propertyType: value as any,
                })
              }
            >
              {PROPERTY_TYPES.map((type) => (
                <Picker.Item
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  value={type}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>BHK (Bedrooms) *</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={formData.bhk}
              onValueChange={(value) =>
                setFormData({ ...formData, bhk: value })
              }
            >
              {['1', '2', '3', '4', '5'].map((bhk) => (
                <Picker.Item key={bhk} label={`${bhk} BHK`} value={bhk} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Area (sq ft) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1200"
            value={formData.area}
            onChangeText={(text) => setFormData({ ...formData, area: text })}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <Text style={styles.label}>Price for Sale (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5000000"
            value={formData.priceForSale}
            onChangeText={(text) =>
              setFormData({ ...formData, priceForSale: text })
            }
            placeholderTextColor="#999"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Price for Rent (₹/month)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 25000"
            value={formData.priceForRent}
            onChangeText={(text) =>
              setFormData({ ...formData, priceForRent: text })
            }
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <ImagePickerComponent
            images={formData.images}
            onImagesChange={handleImagesChange}
          />
        </View>

        <View style={styles.section}>
          <LocationPicker
            location={{
              address: formData.address,
              latitude: formData.latitude,
              longitude: formData.longitude,
            }}
            onLocationChange={handleLocationChange}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityButton,
                  formData.amenities.includes(amenity) &&
                    styles.amenityButtonActive,
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <Text
                  style={[
                    styles.amenityText,
                    formData.amenities.includes(amenity) &&
                      styles.amenityTextActive,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Property</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  amenityButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  amenityTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
