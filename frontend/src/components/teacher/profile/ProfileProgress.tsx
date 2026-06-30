import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from "../styles/TeacherProfileScreen.styles";

const STEPS = ["Personal", "Professional", "Documents Review"];

interface Props {
  currentStep?: number;
}

export default function ProfileProgress({ currentStep = 0 }: Props) {
  return (
    <View style={styles.progressRow}>
      {STEPS.map((label, i) => (
        <View key={label} style={styles.progressItem}>
          <View
            style={[
              styles.progressDot,
              i === currentStep && styles.progressDotActive,
            ]}
          >
            <Text
              style={[
                styles.progressNum,
                i === currentStep && styles.progressNumActive,
              ]}
            >
              {i + 1}
            </Text>
          </View>
          <Text
            style={[
              styles.progressLabel,
              i === currentStep && styles.progressLabelActive,
            ]}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
