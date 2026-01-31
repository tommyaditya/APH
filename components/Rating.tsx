import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface RatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  style?: any;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  size = 16,
  showValue = false,
  style,
}) => {
  const { colors } = useTheme();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      let starName: 'star' | 'star-half' | 'star-outline' = 'star-outline';

      if (i <= fullStars) {
        starName = 'star';
      } else if (i === fullStars + 1 && hasHalfStar) {
        starName = 'star-half';
      }

      stars.push(
        <Ionicons
          key={i}
          name={starName}
          size={size}
          color={colors.accent}
          style={styles.star}
        />
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showValue && (
        <View style={styles.valueContainer}>
          <Ionicons
            name="star"
            size={size * 0.8}
            color={colors.accent}
            style={styles.valueIcon}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  valueContainer: {
    marginLeft: 4,
  },
  valueIcon: {
    marginRight: 2,
  },
});

export default Rating;
