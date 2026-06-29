import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface SummitProfileButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

export default function SummitProfileButton({
  onPress,
  loading = false,
  disabled = false,
  label = 'Summit Profile',
}: SummitProfileButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={styles.btn}
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
