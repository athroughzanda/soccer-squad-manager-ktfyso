
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const lightColors = {
  primary: '#22C55E',      // Soccer green
  secondary: '#16A34A',    // Darker green
  accent: '#84CC16',       // Light green
  background: '#FFFFFF',   // White background
  backgroundAlt: '#F8FAFC', // Light gray background
  text: '#1F2937',         // Dark gray text
  textSecondary: '#6B7280', // Medium gray text
  grey: '#E5E7EB',         // Light gray
  card: '#FFFFFF',         // White card background
  border: '#E5E7EB',       // Border color
  success: '#10B981',      // Success green
  warning: '#F59E0B',      // Warning orange
  error: '#EF4444',        // Error red
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors = {
  primary: '#22C55E',      // Soccer green (same)
  secondary: '#16A34A',    // Darker green (same)
  accent: '#84CC16',       // Light green (same)
  background: '#111827',   // Dark background
  backgroundAlt: '#1F2937', // Darker gray background
  text: '#F9FAFB',         // Light text
  textSecondary: '#9CA3AF', // Medium gray text
  grey: '#374151',         // Dark gray
  card: '#1F2937',         // Dark card background
  border: '#374151',       // Dark border color
  success: '#10B981',      // Success green (same)
  warning: '#F59E0B',      // Warning orange (same)
  error: '#EF4444',        // Error red (same)
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Default to light colors for backward compatibility
export const colors = lightColors;

export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;

export const getButtonStyles = (isDark: boolean) => {
  const themeColors = getColors(isDark);
  
  return StyleSheet.create({
    primary: {
      backgroundColor: themeColors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: themeColors.backgroundAlt,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    small: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
  });
};

export const buttonStyles = getButtonStyles(false); // Default light theme

export const getCommonStyles = (isDark: boolean) => {
  const themeColors = getColors(isDark);
  
  return StyleSheet.create({
    wrapper: {
      backgroundColor: themeColors.background,
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      width: '100%',
      height: '100%',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 16,
    },
    text: {
      fontSize: 16,
      fontWeight: '400',
      color: themeColors.text,
      lineHeight: 24,
    },
    textSecondary: {
      fontSize: 14,
      fontWeight: '400',
      color: themeColors.textSecondary,
      lineHeight: 20,
    },
    section: {
      marginBottom: 24,
    },
    card: {
      backgroundColor: themeColors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      boxShadow: `0px 2px 8px ${themeColors.shadow}`,
      elevation: 2,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: themeColors.background,
      color: themeColors.text,
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 8,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
  });
};

export const commonStyles = getCommonStyles(false); // Default light theme
