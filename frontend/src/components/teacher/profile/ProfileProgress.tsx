import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import styles from "../styles/TeacherProfileScreen.styles";

const STEPS: { label: string; route: keyof RootStackParamList }[] = [
  { label: "Personal",         route: "TeacherProfile" },
  { label: "Professional",     route: "TeacherProfessional" },
  { label: "Documents Review", route: "TeacherDocuments" },
];

interface Props {
  currentStep?: number;
  /** Called before navigating forward. Return false to block navigation. */
  onValidate?: () => boolean;
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileProgress({ currentStep = 0, onValidate }: Props) {
  const navigation = useNavigation<Nav>();

  const handlePress = (i: number, route: keyof RootStackParamList) => {
    // Going forward — validate first
    if (i > currentStep && onValidate) {
      if (!onValidate()) return;
    }
    navigation.navigate(route as any);
  };

  return (
    <View style={styles.progressRow}>
      {STEPS.map(({ label, route }, i) => (
        <TouchableOpacity
          key={label}
          style={styles.progressItem}
          onPress={() => handlePress(i, route)}
          activeOpacity={0.7}
        >
          <View style={[styles.progressDot, i === currentStep && styles.progressDotActive]}>
            <Text style={[styles.progressNum, i === currentStep && styles.progressNumActive]}>
              {i + 1}
            </Text>
          </View>
          <Text style={[styles.progressLabel, i === currentStep && styles.progressLabelActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
