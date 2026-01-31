import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  height?: number;
  style?: any;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 250,
  style,
}) => {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? colors.primary : colors.surfaceSecondary,
              },
            ]}
            onPress={() => scrollToIndex(index)}
            accessibilityLabel={`Go to image ${index + 1}`}
          />
        ))}
      </View>
    );
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { height, backgroundColor: colors.surface }, style]}>
        <View style={styles.placeholderContainer}>
          <Ionicons
            name="images"
            size={48}
            color={colors.textSecondary}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <View key={index} style={[styles.imageContainer, { width }]}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && renderDots()}

      {/* Navigation arrows for larger screens */}
      {images.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.navButton, styles.leftButton, { backgroundColor: colors.surface + '80' }]}
            onPress={() => {
              const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
              scrollToIndex(newIndex);
            }}
            accessibilityLabel="Previous image"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.rightButton, { backgroundColor: colors.surface + '80' }]}
            onPress={() => {
              const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
              scrollToIndex(newIndex);
            }}
            accessibilityLabel="Next image"
          >
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftButton: {
    left: 16,
  },
  rightButton: {
    right: 16,
  },
});

export default ImageCarousel;
