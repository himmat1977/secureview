import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'large',
  fullWidth = true,
  icon,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.buttonDisabled,
    style as ViewStyle,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.background : theme.colors.primary}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  button_primary: {
    backgroundColor: '#5FBB97',
  },
  button_secondary: {
    backgroundColor: theme.colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  button_text: {
    backgroundColor: 'transparent',
  },

  // Sizes
  button_small: {
    height: 36,
  },
  button_medium: {
    height: 44,
  },
  button_large: {
    height: 56,
  },

  // Disabled
  buttonDisabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  text_primary: {
    color: theme.colors.background,
  },
  text_secondary: {
    color: theme.colors.background,
  },
  text_outline: {
    color: theme.colors.primary,
  },
  text_text: {
    color: theme.colors.primary,
  },
  text_small: {
    fontSize: theme.typography.fontSize.sm,
  },
  text_medium: {
    fontSize: theme.typography.fontSize.base,
  },
  text_large: {
    fontSize: theme.typography.fontSize.lg,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
