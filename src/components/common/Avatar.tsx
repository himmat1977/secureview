import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

interface AvatarProps {
  initials?: string;
  size?: number;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials = 'JD',
  size = 48,
  onPress,
}) => {
  const containerStyle = {
    ...styles.container,
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const textStyle = {
    ...styles.text,
    fontSize: size * 0.4,
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={containerStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={textStyle}>{initials}</Text>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5FBB97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
