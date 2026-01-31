import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../../components/ErrorState';
import { Shimmer } from '../../components/Shimmer';
import { Tag } from '../../components/Tag';
import { useTheme } from '../../hooks/useTheme';
import { fetchWisataById, Wisata } from '../../utils/api';
import { formatCurrency } from '../../utils/format';

const { width, height } = Dimensions.get('window');
const IMG_HEIGHT = 400;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [destination, setDestination] = useState<Wisata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { colors } = useTheme();

  const loadDestination = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchWisataById(id);
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
  }, [id]);

  useEffect(() => {
    loadDestination();
  }, [loadDestination]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ height: IMG_HEIGHT, backgroundColor: colors.shimmer }} />
        <View style={{ padding: 20 }}>
          <Shimmer style={{ width: '60%', height: 32, marginBottom: 12 }} />
          <Shimmer style={{ width: '40%', height: 20, marginBottom: 24 }} />
          <Shimmer style={{ width: '100%', height: 100 }} />
        </View>
      </View>
    );
  }

  if (error || !destination) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ErrorState onRetry={loadDestination} />
      </SafeAreaView>
    );
  }

  // Parallax Animations
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateRight: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, IMG_HEIGHT],
    outputRange: [0, 0, IMG_HEIGHT * 0.5], // Parallax speed
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, IMG_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Floating Header */}
      <Animated.View
        style={[
          styles.floatingHeader,
          {
            height: 60 + insets.top,
            paddingTop: insets.top,
            backgroundColor: colors.background,
            opacity: headerOpacity,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {destination.nama}
        </Text>
      </Animated.View>

      <View style={[styles.controlOverlay, { top: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.circleButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Parallax Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [
                { translateY: imageTranslateY },
                { scale: imageScale },
              ],
            },
          ]}
        >
          <Image
            source={{ uri: destination.images[0] || 'https://via.placeholder.com/400' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />
        </Animated.View>

        {/* Content Sheet */}
        <View style={[styles.contentSheet, { backgroundColor: colors.surface }]}>
          <View style={styles.handleBar} />

          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{destination.nama}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{destination.rating}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>{destination.location}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            <Tag text={destination.kategori} active />
            {destination.tags?.map((t, i) => <Tag key={i} text={t} />)}
          </View>

          <View style={styles.divider} />

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Jam Buka</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{destination.hours}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="wallet-outline" size={24} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Tiket</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{formatCurrency(destination.price)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionHeader, { color: colors.text }]}>Tentang Destinasi</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {destination.long_desc || destination.short_desc}
          </Text>

          <View style={{ height: 40 }} />
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Bar */}
      <View style={[
        styles.bottomBar,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          borderColor: colors.border
        }
      ]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Mulai dari</Text>
          <Text style={[styles.priceValue, { color: colors.primary }]}>{formatCurrency(destination.price)}</Text>
        </View>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.bookButtonText}>Navigasi</Text>
          <Ionicons name="navigate" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: IMG_HEIGHT,
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
  },
  controlOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 101,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  contentSheet: {
    marginTop: IMG_HEIGHT - 40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    minHeight: height,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
    lineHeight: 34,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
    color: '#B45309',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  locationText: {
    fontSize: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  bookButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  headerBar: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
});
