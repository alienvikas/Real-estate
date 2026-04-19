import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProperty } from '../context/PropertyContext';

const { width } = Dimensions.get('window');

export const PropertyDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { propertyId } = route.params;
  const { getPropertyById, deleteProperty } = useProperty();
  const property = getPropertyById(propertyId);
  const [imageIndex, setImageIndex] = React.useState(0);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteProperty(property.id);
              Alert.alert('Success', 'Property deleted successfully!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete property');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleImageScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const imageWidth = width - 32;
    const index = Math.round(scrollPosition / (imageWidth + 12));
    setImageIndex(index);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {property.images.length > 0 && (
          <View style={styles.imageSection}>
            <FlatList
              data={property.images}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={[styles.mainImage, { width: width - 32 }]}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              scrollEventThrottle={16}
              onScroll={handleImageScroll}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={width - 32 + 12}
              decelerationRate="fast"
              contentContainerStyle={styles.imageListContent}
            />
            <View style={styles.imagePagination}>
              <Text style={styles.paginationText}>
                {imageIndex + 1} / {property.images.length}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.content}>
          {/* Title and Type */}
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.title}>{property.title}</Text>
              <Text style={styles.type}>
                {property.propertyType.charAt(0).toUpperCase() +
                  property.propertyType.slice(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📍 Address</Text>
            <Text style={styles.sectionValue}>{property.location.address}</Text>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>💰 Price</Text>
            <View style={styles.priceRow}>
              {property.price.sale && (
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>For Sale</Text>
                  <Text style={styles.priceValue}>
                    ₹{property.price.sale.toLocaleString()}
                  </Text>
                </View>
              )}
              {property.price.rent && (
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>For Rent</Text>
                  <Text style={styles.priceValue}>
                    ₹{property.price.rent.toLocaleString()}/month
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🏠 Specifications</Text>
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specValue}>{property.bhk}</Text>
                <Text style={styles.specLabel}>BHK</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specValue}>{property.area}</Text>
                <Text style={styles.specLabel}>sq ft</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📝 Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>✨ Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityTagText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Coordinates */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📡 Coordinates</Text>
            <View style={styles.coordsGrid}>
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>Latitude</Text>
                <Text style={styles.coordValue}>
                  {property.location.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>Longitude</Text>
                <Text style={styles.coordValue}>
                  {property.location.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>

          {/* Timestamps */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📅 Timeline</Text>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Added</Text>
              <Text style={styles.timelineValue}>
                {formatDate(property.createdAt)}
              </Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Updated</Text>
              <Text style={styles.timelineValue}>
                {formatDate(property.updatedAt)}
              </Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  imageSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 12,
  },
  imageListContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  mainImage: {
    height: 250,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  imagePagination: {
    alignItems: 'center',
    marginTop: 8,
  },
  paginationText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  type: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c62828',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  specsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  specValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  specLabel: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1976d2',
  },
  coordsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  coordItem: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  coordLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace',
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timelineLabel: {
    fontSize: 13,
    color: '#666',
  },
  timelineValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});
