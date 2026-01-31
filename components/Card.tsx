import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Wisata } from '../utils/api';
import { formatCurrency } from '../utils/format';

const { width } = Dimensions.get('window');

interface CardProps {
  item: Wisata;
  style?: any;
}

export const Card: React.FC<CardProps> = React.memo(({ item, style }) => {
  const { colors } = useTheme();
  const router = useRouter();

  const mainImage = item.images && item.images.length > 0
    ? item.images[0]
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const [imageSource, setImageSource] = React.useState({ uri: mainImage });

  const handleImageError = () => {
    setImageSource({ uri: 'https://via.placeholder.com/400x300?text=No+Image' });
  };

  const handlePress = () => {
    router.push(`/detail/${item.id}`);
  };

  // Modern Card Design
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          onError={handleImageError}
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.nama}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.locationText, { color: colors.textTertiary }]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: width * 0.7,
    marginRight: 20,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 8, // space for shadow
  },
  imageContainer: {
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backdropFilter: 'blur(4px)', // Optional for supported platforms
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857', // Emerald 700
  },
  content: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB', // Amber 50
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309', // Amber 700
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});

export default Card;
