import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ErrorState } from '../components/ErrorState';
import { ShimmerCard } from '../components/Shimmer';
import { useCachedFetch } from '../hooks/useCachedFetch';
import { useTheme } from '../hooks/useTheme';
import api, { Wisata } from '../utils/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const {
    data: destinations,
    loading,
    error,
    refetch,
  } = useCachedFetch<Wisata[]>(
    () => api.fetchAllWisata(),
    'destinations'
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderDestination = useCallback(({ item }: { item: Wisata }) => (
    <Card item={item} />
  ), []);

  const renderShimmerCards = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <ShimmerCard key={`shimmer-${index}`} />
      ))}
    </>
  );

  const features = [
    {
      icon: 'map',
      title: 'Peta Interaktif',
      description: 'Jelajahi destinasi wisata Indonesia dengan peta yang mudah digunakan'
    },
    {
      icon: 'search',
      title: 'Pencarian Canggih',
      description: 'Temukan destinasi berdasarkan kategori, rating, dan lokasi'
    },
    {
      icon: 'cloud',
      title: 'Info Cuaca',
      description: 'Dapatkan informasi cuaca terkini untuk perencanaan perjalanan'
    },
    {
      icon: 'heart',
      title: 'Favorit',
      description: 'Simpan destinasi favorit Anda untuk akses cepat'
    },
    {
      icon: 'location',
      title: 'Lokasi Saat Ini',
      description: 'Temukan destinasi terdekat dari lokasi Anda'
    },
    {
      icon: 'information-circle',
      title: 'Detail Lengkap',
      description: 'Informasi lengkap tentang setiap destinasi wisata'
    }
  ];

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState
          message="Failed to load destinations. Please check your connection and try again."
          onRetry={handleRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: '#fff' }]}>
              Jelajahi Keindahan{'\n'}Indonesia
            </Text>
            <Text style={[styles.heroSubtitle, { color: '#fff', opacity: 0.9 }]}>
              Temukan destinasi wisata terbaik di Indonesia dengan peta interaktif dan informasi lengkap
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#fff' }]}
                onPress={() => router.push('/map')}
                accessibilityLabel="Explore map"
                accessibilityHint="Navigate to interactive map"
              >
                <Ionicons name="map" size={20} color={colors.primary} />
                <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
                  Jelajahi Peta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: '#fff' }]}
                onPress={() => {/* Scroll to features */}}
                accessibilityLabel="Learn more"
                accessibilityHint="Scroll to features section"
              >
                <Text style={[styles.secondaryButtonText, { color: '#fff' }]}>
                  Pelajari Lebih Lanjut
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Destination List */}
        <View style={[styles.destinationsSection, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Destinasi Populer
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Jelajahi destinasi wisata terbaik di Indonesia
            </Text>
          </View>

          {loading ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationsList}
            >
              {renderShimmerCards()}
            </ScrollView>
          ) : (
            <FlatList
              data={destinations?.slice(0, 6) || []}
              renderItem={renderDestination}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No destinations available
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* Features Section */}
        <View style={[styles.featuresSection, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Fitur Unggulan
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Temukan semua yang Anda butuhkan untuk merencanakan perjalanan wisata yang sempurna
            </Text>
          </View>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View
                key={`feature-${index}`}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: colors.cardBackground,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name={feature.icon as any} size={32} color={colors.primary} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.aboutSection, { backgroundColor: colors.surface }]}>
          <View style={styles.aboutContent}>
            <View style={styles.aboutText}>
              <Text style={[styles.aboutTitle, { color: colors.text }]}>
                Tentang Aplikasi
              </Text>
              <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
                Peta Pariwisata Indonesia adalah aplikasi mobile yang dirancang untuk membantu wisatawan domestik dan mancanegara menjelajahi keindahan Indonesia. Dengan teknologi peta interaktif terkini, informasi cuaca real-time, dan detail lengkap tentang setiap destinasi, aplikasi ini menjadi panduan wisata terpercaya untuk perjalanan Anda.
              </Text>
              <Text style={[styles.aboutDescription, { color: colors.textSecondary }]}>
                Dari candi bersejarah hingga pantai tropis, gunung megah hingga kuliner khas daerah, semua dapat Anda temukan dalam satu aplikasi. Mulai jelajahi sekarang dan buat kenangan tak terlupakan di tanah air tercinta.
              </Text>
            </View>
            <View style={styles.aboutImage}>
              <View style={[styles.placeholderImage, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name="images" size={64} color={colors.textTertiary} />
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.ctaContent}
          >
            <Text style={[styles.ctaTitle, { color: '#fff' }]}>
              Siap Memulai Petualangan?
            </Text>
            <Text style={[styles.ctaSubtitle, { color: '#fff', opacity: 0.9 }]}>
              Jelajahi ribuan destinasi wisata Indonesia sekarang juga
            </Text>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: '#fff' }]}
              onPress={() => router.push('/map')}
              accessibilityLabel="Start exploring"
              accessibilityHint="Navigate to map screen"
            >
              <Text style={[styles.ctaButtonText, { color: colors.primary }]}>
                Mulai Jelajah
              </Text>
              <Ionicons name="arrow-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.7,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  destinationsSection: {
    padding: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  destinationsList: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresSection: {
    padding: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: (width - 60) / 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  aboutSection: {
    padding: 20,
  },
  aboutContent: {
    flexDirection: width > 768 ? 'row' : 'column',
    alignItems: 'center',
    gap: 32,
  },
  aboutText: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  aboutDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  aboutImage: {
    flex: 1,
    alignItems: 'center',
  },
  placeholderImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSection: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaContent: {
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
