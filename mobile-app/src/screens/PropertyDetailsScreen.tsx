import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { useProperty } from '../context/PropertyContext';
import { Property } from '../types';

type PropertyDetailsScreenProps = {
  route: any;
  navigation: any;
};

const { width } = Dimensions.get('window');

export const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { propertyId } = route.params;
  const { getPropertyById, deleteProperty } = useProperty();
  const property = useMemo(() => getPropertyById(propertyId), [propertyId]);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete property');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderImageSlider = () => (
    <View style={styles.imageSliderContainer}>
      <FlatList
        data={property.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.sliderImage}
            resizeMode="cover"
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEventThrottle={16}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageSlider()}

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{property.title}</Text>
              <Text style={styles.propertyType}>
                {property.propertyType.charAt(0).toUpperCase() +
                  property.propertyType.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            {property.price.sale && (
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Sale Price</Text>
                <Text style={styles.priceValue}>
                  ₹{property.price.sale.toLocaleString()}
                </Text>
              </View>
            )}
            {property.price.rent && (
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Rent/Month</Text>
                <Text style={styles.priceValue}>
                  ₹{property.price.rent.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Text style={styles.detailIcon}>🛏️</Text>
                <Text style={styles.detailLabel}>BHK</Text>
                <Text style={styles.detailValue}>{property.bhk}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailIcon}>📐</Text>
                <Text style={styles.detailLabel}>Area</Text>
                <Text style={styles.detailValue}>{property.area} sq ft</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.address}>{property.location.address}</Text>
            <View style={styles.coordsContainer}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Latitude</Text>
                <Text style={styles.coordValue}>
                  {property.location.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Longitude</Text>
                <Text style={styles.coordValue}>
                  {property.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {property.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {property.amenities.map((amenity) => (
                  <View key={amenity} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>✓ {amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Added:</Text>
              <Text style={styles.infoValue}>
                {new Date(property.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Updated:</Text>
              <Text style={styles.infoValue}>
                {new Date(property.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete Property</Text>
            </TouchableOpacity>
          </View>
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
  imageSliderContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  sliderImage: {
    width: width,
    height: 300,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerSection: {
    marginBottom: 12,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  priceSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  coordsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  coordBox: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amenityText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
});
