import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { StyleProp, ViewStyle } from 'react-native';

interface SaveAndNextButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SaveAndNextButton({
  onPress,
  loading = false,
  disabled = false,
  label = 'Save and Next',
  style,
}: SaveAndNextButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={[styles.btn, style]}
      contentStyle={styles.content}
      buttonColor="#1B4F72"
      icon="arrow-right"
      loading={loading}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  btn: { marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  content: { paddingVertical: 10, flexDirection: 'row-reverse' },
});
