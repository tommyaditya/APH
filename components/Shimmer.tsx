import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

interface ShimmerProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width: shimmerWidth = width * 0.8,
  height = 100,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmer();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, shimmerWidth],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: shimmerWidth,
          height,
          borderRadius,
          backgroundColor: colors.shimmer,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            backgroundColor: colors.surface,
          },
        ]}
      />
    </View>
  );
};

interface ShimmerCardProps {
  style?: any;
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({ style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.cardBackground }, style]}>
      <Shimmer width={width * 0.7} height={150} borderRadius={12} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Shimmer width={width * 0.5} height={20} borderRadius={4} style={styles.cardTitle} />
        <Shimmer width={width * 0.3} height={16} borderRadius={4} style={styles.cardSubtitle} />
        <View style={styles.cardRating}>
          <Shimmer width={80} height={16} borderRadius={4} />
        </View>
        <Shimmer width={width * 0.6} height={16} borderRadius={4} style={styles.cardDescription} />
      </View>
    </View>
  );
};

interface ShimmerDetailProps {
  style?: any;
}

export const ShimmerDetail: React.FC<ShimmerDetailProps> = ({ style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.detailContainer, { backgroundColor: colors.background }, style]}>
      <Shimmer width={width} height={250} borderRadius={0} style={styles.detailHero} />
      <View style={styles.detailContent}>
        <Shimmer width={width * 0.8} height={28} borderRadius={4} style={styles.detailTitle} />
        <Shimmer width={width * 0.4} height={20} borderRadius={4} style={styles.detailCategory} />
        <View style={styles.detailRating}>
          <Shimmer width={100} height={20} borderRadius={4} />
        </View>
        <View style={styles.detailInfo}>
          <Shimmer width={width * 0.9} height={16} borderRadius={4} style={styles.detailInfoItem} />
          <Shimmer width={width * 0.9} height={16} borderRadius={4} style={styles.detailInfoItem} />
          <Shimmer width={width * 0.9} height={16} borderRadius={4} style={styles.detailInfoItem} />
        </View>
        <Shimmer width={width * 0.9} height={100} borderRadius={4} style={styles.detailDescription} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  cardContainer: {
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    marginBottom: 0,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardSubtitle: {
    marginBottom: 8,
  },
  cardRating: {
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 0,
  },
  detailContainer: {
    flex: 1,
  },
  detailHero: {
    marginBottom: 0,
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    marginBottom: 8,
  },
  detailCategory: {
    marginBottom: 12,
  },
  detailRating: {
    marginBottom: 20,
  },
  detailInfo: {
    marginBottom: 20,
  },
  detailInfoItem: {
    marginBottom: 8,
  },
  detailDescription: {
    marginBottom: 0,
  },
});

export default Shimmer;
