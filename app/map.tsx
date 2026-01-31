import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorState } from '../components/ErrorState';
import { Header } from '../components/Header';
import { useCachedFetch } from '../hooks/useCachedFetch';
import { useTheme } from '../hooks/useTheme';
import { fetchWisata as fetchAllWisata, Wisata } from '../utils/api';

// Constants
const INDONESIA_CENTER = {
  latitude: -2.5489,
  longitude: 118.0149,
  latitudeDelta: 20,
  longitudeDelta: 50,
};

const MIN_COORDINATE_VALUE = 0.001;

export default function MapScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedWisata, setSelectedWisata] = useState<Wisata | null>(null);

  const {
    data: wisata = [],
    loading,
    error,
    refetch,
  } = useCachedFetch<Wisata[]>(
    () => fetchAllWisata(),
    'map-destinations'
  );

  // Memoize filtered wisata to avoid filtering on every render
  const validWisata = useMemo(
    () => (wisata || []).filter(item =>
      item && item.coordinates &&
      Math.abs(item.coordinates.latitude) > MIN_COORDINATE_VALUE &&
      Math.abs(item.coordinates.longitude) > MIN_COORDINATE_VALUE
    ),
    [wisata]
  );

  const handleMarkerPress = useCallback((item: Wisata) => {
    setSelectedWisata(item);
  }, []);

  const handleCardPress = useCallback(() => {
    if (selectedWisata) {
      router.push(`/detail/${selectedWisata.id}`);
    }
  }, [selectedWisata, router]);

  const handleCloseCard = useCallback(() => {
    setSelectedWisata(null);
  }, []);

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Peta Wisata" showBack />
        <ErrorState
          message="Failed to load destinations. Please check your connection and try again."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Peta Wisata" showBack />

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INDONESIA_CENTER}
          showsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          accessibilityLabel="Interactive map of Indonesian tourist destinations"
        >
          {validWisata.map((item) => (
            <Marker
              key={`marker-${item.id}`}
              coordinate={{
                latitude: item.coordinates.latitude,
                longitude: item.coordinates.longitude,
              }}
              title={item.nama}
              description={item.short_desc}
              onPress={() => handleMarkerPress(item)}
              accessibilityLabel={`Destination: ${item.nama}`}
              accessibilityHint={`${item.short_desc}. Press to view details.`}
            >
              <Ionicons
                name="location"
                size={40}
                color={colors.primary}
              />
            </Marker>
          ))}
        </MapView>

        {/* Selected Wisata Card */}
        {selectedWisata && (
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.cardBackground },
            ]}
            accessible={true}
            accessibilityLabel="Selected destination details"
          >
            <TouchableOpacity
              style={styles.card}
              onPress={handleCardPress}
              activeOpacity={0.8}
              accessibilityLabel={`Open details for ${selectedWisata.nama}`}
              accessibilityHint="Double tap to view full details"
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text
                    style={[styles.cardTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {selectedWisata.nama}
                  </Text>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.categoryText}>
                      {selectedWisata.kategori}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.cardDescription,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {selectedWisata.short_desc}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons
                      name="star"
                      size={14}
                      color={colors.accent}
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedWisata.rating.toFixed(1)}
                    </Text>
                  </View>

                  <View style={styles.locationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.locationText,
                        { color: colors.textTertiary },
                      ]}
                      numberOfLines={1}
                    >
                      {selectedWisata.location}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseCard}
                accessibilityLabel="Close destination card"
                accessibilityHint="Double tap to close"
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Overlay */}
        {loading && (
          <View
            style={[
              styles.loadingOverlay,
              { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={colors.primary}
              accessibilityLabel="Loading destinations"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 2,
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
