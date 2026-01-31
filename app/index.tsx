import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
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
import { fetchWisata as fetchAllWisata, Wisata } from '../utils/api';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Semua', 'Gunung', 'Pantai', 'Sejarah', 'Kuliner', 'Budaya'];

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');

  const {
    data: destinations,
    loading,
    error,
    refetch,
  } = useCachedFetch<Wisata[]>(
    () => fetchAllWisata(),
    'destinations'
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderDestination = useCallback(({ item }: { item: Wisata }) => {
    return <Card item={item} />;
  }, []);

  const renderShimmerCards = useCallback(() => (
    <>
      {[...Array(3)].map((_, index) => (
        <ShimmerCard key={`shimmer-${index}`} />
      ))}
    </>
  ), []);

  const filteredDestinations = destinations?.filter(item =>
    activeCategory === 'Semua' || item.kategori === activeCategory
  );

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState
          message="Gagal memuat destinasi. Periksa koneksi Anda."
          onRetry={handleRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Selamat Pagi,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Petualang!</Text>
          </View>
          <TouchableOpacity
            style={[styles.avatarContainer, { backgroundColor: colors.primaryLight }]}
            accessibilityLabel="User Profile"
          >
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar Placeholder */}
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
          accessibilityLabel="Search destinations"
        >
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <Text style={[styles.searchText, { color: colors.textTertiary }]}>
            Cari destinasi impianmu...
          </Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isActive
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[
                    styles.categoryText,
                    isActive ? { color: '#fff' } : { color: colors.textSecondary }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {activeCategory === 'Semua' ? 'Sedang Populer' : `Wisata ${activeCategory}`}
            </Text>
            <TouchableOpacity onPress={() => { }}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {renderShimmerCards()}
            </ScrollView>
          ) : (
            <FlatList
              data={filteredDestinations || []}
              renderItem={renderDestination}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => `pop-${item.id}`}
              initialNumToRender={4}
              windowSize={3}
              maxToRenderPerBatch={3}
              removeClippedSubviews={true}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="leaf-outline" size={48} color={colors.textTertiary} />
                  <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Belum ada data untuk kategori ini</Text>
                </View>
              }
            />
          )}
        </View>

        {/* Explore Map Banner */}
        <TouchableOpacity
          style={[styles.mapBanner, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/map')}
          activeOpacity={0.9}
        >
          <View style={[styles.mapOverlay, { backgroundColor: colors.primary }]}>
            <Ionicons name="map" size={24} color="#fff" />
            <View style={styles.mapTextContainer}>
              <Text style={styles.mapTitle}>Peta Interaktif</Text>
              <Text style={styles.mapSubtitle}>Jelajahi lokasi di sekitarmu</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Recommended "For You" (Vertical List Mockup) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Rekomendasi Untukmu</Text>
          {destinations?.slice(0, 3).map((item) => {
            if (!item) return null;
            return (
              <TouchableOpacity
                key={`rec-${item.id}`}
                style={[styles.recCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/detail/${item.id}`)}
              >
                <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.recImage} />
                <View style={styles.recContent}>
                  <Text style={[styles.recTitle, { color: colors.text }]} numberOfLines={1}>{item.nama}</Text>
                  <Text style={[styles.recLoc, { color: colors.textSecondary }]} numberOfLines={1}>{item.location}</Text>
                  <View style={styles.recRating}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.recRatingText, { color: colors.textSecondary }]}>{item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'System',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 10,
  },
  searchText: {
    fontSize: 14,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 20,
    paddingBottom: 20, // space for shadows
  },
  emptyState: {
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  mapBanner: {
    marginHorizontal: 20,
    height: 100,
    borderRadius: 20,
    marginBottom: 28,
    overflow: 'hidden',
  },
  mapOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  mapTextContainer: {
    flex: 1,
  },
  mapTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  mapSubtitle: {
    color: '#E0F2F1',
    fontSize: 13,
  },
  recCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    gap: 14,
  },
  recImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recLoc: {
    fontSize: 13,
    marginBottom: 6,
  },
  recRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recRatingText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
