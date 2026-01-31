import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  style?: any;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Wisata Indonesia',
  showBack = false,
  rightIcon,
  onRightPress,
  style,
}) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.primary },
        style,
      ]}
      edges={['top']}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Go back"
              accessibilityHint="Tap to go back to previous screen"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: '#fff' }]}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {rightIcon && onRightPress && (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}
              accessibilityLabel={`Action: ${rightIcon}`}
            >
              <Ionicons name={rightIcon as any} size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightButton: {
    padding: 8,
    marginRight: -8,
  },
});

export default Header;
