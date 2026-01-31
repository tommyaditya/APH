import { useColorScheme } from 'react-native';
import { useThemeColors } from '../utils/colors';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();

  return {
    isDark: colorScheme === 'dark',
    colors,
    colorScheme,
  };
};

export default useTheme;
