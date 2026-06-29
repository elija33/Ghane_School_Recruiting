import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { StyleProp, ViewStyle } from 'react-native';

interface SaveProfileButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SaveProfileButton({
  onPress,
  loading = false,
  disabled = false,
  label = 'Save Profile',
  style,
}: SaveProfileButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={[styles.btn, style]}
      contentStyle={styles.content}
      buttonColor="#1B4F72"
      icon="check-circle"
      loading={loading}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  btn: { marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  content: { paddingVertical: 10 },
});
