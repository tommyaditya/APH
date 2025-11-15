import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorState } from '../../components/ErrorState';
import { Header } from '../../components/Header';
import { ImageCarousel } from '../../components/ImageCarousel';
import { Rating } from '../../components/Rating';
import { Shimmer } from '../../components/Shimmer';
import { Tag } from '../../components/Tag';
import { useTheme } from '../../hooks/useTheme';
import api, { Wisata } from '../utils/api';
import { formatCurrency, formatRating } from '../../utils/format';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [destination, setDestination] = useState<Wisata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    loadDestination();
  }, [id]);

  const loadDestination = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await api.fetchWisataById(id);
      if (data) {
        setDestination(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error loading destination:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadDestination();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Detail" showBack />
        <ScrollView style={styles.scrollView}>
          <Shimmer style={styles.imageShimmer} />
          <View style={styles.content}>
            <Shimmer style={styles.titleShimmer} />
            <Shimmer style={styles.categoryShimmer} />
            <Shimmer style={styles.locationShimmer} />
            <Shimmer style={styles.ratingShimmer} />
            <Shimmer style={styles.priceShimmer} />
            <Shimmer style={styles.hoursShimmer} />
            <Shimmer style={styles.tagsShimmer} />
            <Shimmer style={styles.descriptionShimmer} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !destination) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Detail" showBack />
        <ErrorState onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Detail" showBack />
      <ScrollView style={styles.scrollView}>
        <ImageCarousel images={destination.images} />

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>{destination.nama}</Text>

          <View style={styles.categoryContainer}>
            <Text style={[styles.category, { color: colors.primary }]}>{destination.kategori}</Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={[styles.location, { color: colors.textSecondary }]}>{destination.location}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Rating rating={destination.rating} size={20} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {formatRating(destination.rating)}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="cash" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{formatCurrency(destination.price)}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{destination.hours}</Text>
            </View>
          </View>

          {destination.tags && destination.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {destination.tags.map((tag: string, index: number) => (
                <Tag key={`${tag}-${index}`} text={tag} />
              ))}
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Deskripsi</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {destination.long_desc}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageShimmer: {
    width: width,
    height: 250,
    borderRadius: 0,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleShimmer: {
    height: 28,
    width: '80%',
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryShimmer: {
    height: 18,
    width: '40%',
    borderRadius: 4,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  locationShimmer: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 8,
  },
  ratingShimmer: {
    height: 20,
    width: '30%',
    borderRadius: 4,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  priceShimmer: {
    height: 18,
    width: '50%',
    borderRadius: 4,
    marginBottom: 12,
  },
  hoursShimmer: {
    height: 18,
    width: '40%',
    borderRadius: 4,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tagsShimmer: {
    height: 32,
    width: '100%',
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  descriptionShimmer: {
    height: 100,
    width: '100%',
    borderRadius: 4,
  },
});
