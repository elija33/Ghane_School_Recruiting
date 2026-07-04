import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../store";
import { registerUser } from "../../store/slices/authSlice";
import { RootStackParamList, UserRole } from "../../types";
import styles from "./style/RegisterScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const appType = process.env.EXPO_PUBLIC_APP_TYPE ?? "teacher";
const isSchoolApp = appType === "school";
const primaryColor = isSchoolApp ? "#2C3E50" : "#1B4F72";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 60 }, (_, i) =>
  String(new Date().getFullYear() - i),
);
const GENDERS = ["Male", "Female"];

function NativeSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  if (Platform.OS === "web") {
    return React.createElement(
      "select",
      {
        value,
        onChange: (e: any) => onChange(e.target.value),
        style: {
          width: "100%",
          height: 52,
          borderRadius: 6,
          border: "1px solid #ccc",
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: 14,
          color: value ? "#1A1A1A" : "#999",
          backgroundColor: "#fff",
          outline: "none",
          cursor: "pointer",
        },
      },
      React.createElement("option", { value: "", disabled: true }, placeholder),
      ...options.map((o) =>
        React.createElement("option", { key: o, value: o }, o),
      ),
    );
  }

  return (
    <>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={{ backgroundColor: "#fff", maxHeight: 340, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#1A1A1A" }}>{placeholder}</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {options.map((o) => (
              <TouchableOpacity
                key={o}
                onPress={() => { onChange(o); setOpen(false); }}
                style={{ paddingHorizontal: 20, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F5F5F5" }}
              >
                <Text style={{ fontSize: 15, color: "#1A1A1A" }}>{o}</Text>
                {value === o && <Ionicons name="checkmark" size={18} color={primaryColor} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{ height: 52, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingHorizontal: 12, justifyContent: "space-between", flexDirection: "row", alignItems: "center", backgroundColor: "#fff" }}
      >
        <Text style={{ color: value ? "#1A1A1A" : "#999", fontSize: 14 }}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>
    </>
  );
}

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!month || !day || !year) {
      errors.birthday = "Please select your full birthday";
    } else {
      const monthIndex = MONTHS.indexOf(month);
      const dob = new Date(Number(year), monthIndex, Number(day));
      const today = new Date();
      const age =
        today.getFullYear() -
        dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
          ? 1
          : 0);
      if (age < 21)
        errors.birthday = "You must be at least 21 years old to register";
    }
    if (!gender) errors.gender = "Please select your gender";
    if (!email.trim()) errors.email = "Mobile number or email is required";
    else if (email.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const role: UserRole = "TEACHER";
    const username = `${firstName.trim().toLowerCase()}${lastName.trim().toLowerCase()}`;
    const result = await dispatch(
      registerUser({
        email: email.trim().toLowerCase(),
        password,
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username,
      }),
    );
    if (registerUser.fulfilled.match(result)) {
      setWelcomeVisible(true);
    }
  };

  return (
    <>
      <Modal visible={welcomeVisible} transparent animationType="fade" onRequestClose={() => setWelcomeVisible(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 }}
          activeOpacity={1}
          onPress={() => setWelcomeVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 400, alignItems: "center" }}>
            <Ionicons name="checkmark-circle" size={64} color="#27AE60" style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1A1A1A", textAlign: "center", marginBottom: 8 }}>
              Hello {firstName.trim()} {lastName.trim()}!
            </Text>
            <Text style={{ fontSize: 16, color: "#555", textAlign: "center", marginBottom: 8 }}>
              Welcome to the Ghana Teacher Recruiting Platform.
            </Text>
            <Text style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 24 }}>
              Your username: <Text style={{ fontWeight: "700", color: primaryColor }}>{firstName.trim().toLowerCase()}{lastName.trim().toLowerCase()}</Text>
            </Text>
            <Button
              mode="contained"
              onPress={() => setWelcomeVisible(false)}
              buttonColor={primaryColor}
              style={{ borderRadius: 10, width: "100%" }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Get Started
            </Button>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header — keep as-is */}
        <View style={[styles.header, { backgroundColor: primaryColor }]}>
          <Text style={styles.title}>
            {isSchoolApp ? "School Portal" : "Create Account"}
          </Text>
          <Text style={styles.subtitle}>
            {isSchoolApp ? "Post jobs and find qualified teachers" : "Join the Ghana Teacher Recruiting Platform"}
          </Text>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <View style={{ width: "100%", maxWidth: 500, paddingHorizontal: 24 }}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Name */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1A1A1A",
                marginBottom: 8,
              }}
            >
              Name
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 4 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  mode="outlined"
                  style={{ backgroundColor: "#fff" }}
                  error={!!fieldErrors.firstName}
                  activeOutlineColor={primaryColor}
                  outlineColor="#ccc"
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  mode="outlined"
                  style={{ backgroundColor: "#fff" }}
                  error={!!fieldErrors.lastName}
                  activeOutlineColor={primaryColor}
                  outlineColor="#ccc"
                />
              </View>
            </View>
            <HelperText
              type="error"
              visible={!!(fieldErrors.firstName || fieldErrors.lastName)}
            >
              {fieldErrors.firstName || fieldErrors.lastName}
            </HelperText>

            {/* Birthday */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1A1A1A",
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              Birthday{"  "}
              <Ionicons name="help-circle-outline" size={15} color="#888" />
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 4 }}>
              <View style={{ flex: 2 }}>
                <NativeSelect
                  value={month}
                  onChange={setMonth}
                  options={MONTHS}
                  placeholder="Month"
                />
              </View>
              <View style={{ flex: 1 }}>
                <NativeSelect
                  value={day}
                  onChange={setDay}
                  options={DAYS}
                  placeholder="Day"
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <NativeSelect
                  value={year}
                  onChange={setYear}
                  options={YEARS}
                  placeholder="Year"
                />
              </View>
            </View>
            <HelperText type="error" visible={!!fieldErrors.birthday}>
              {fieldErrors.birthday}
            </HelperText>

            {/* Gender */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1A1A1A",
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              Gender{"  "}
              <Ionicons name="help-circle-outline" size={15} color="#888" />
            </Text>
            <NativeSelect
              value={gender}
              onChange={setGender}
              options={GENDERS}
              placeholder="Select your gender"
            />
            <HelperText type="error" visible={!!fieldErrors.gender}>
              {fieldErrors.gender}
            </HelperText>

            {/* Mobile / Email */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1A1A1A",
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Mobile number or email
            </Text>
            <TextInput
              placeholder="Mobile number or email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ backgroundColor: "#fff" }}
              error={!!fieldErrors.email}
              activeOutlineColor={primaryColor}
              outlineColor="#ccc"
            />
            <Text style={{ fontSize: 11, color: "#606770", marginTop: 4 }}>
              You may receive notifications from us.{" "}
              <Text style={{ color: primaryColor }}>
                Learn why we ask for your contact information
              </Text>
            </Text>
            <HelperText type="error" visible={!!fieldErrors.email}>
              {fieldErrors.email}
            </HelperText>

            {/* Password */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1A1A1A",
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Password
            </Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={{ backgroundColor: "#fff" }}
              error={!!fieldErrors.password}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword((v) => !v)}
                />
              }
              activeOutlineColor={primaryColor}
              outlineColor="#ccc"
            />
            <HelperText type="error" visible={!!fieldErrors.password}>
              {fieldErrors.password}
            </HelperText>

            {/* Confirm Password */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1A1A1A",
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Confirm Password
            </Text>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={{ backgroundColor: "#fff" }}
              error={!!fieldErrors.confirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                />
              }
              activeOutlineColor={primaryColor}
              outlineColor="#ccc"
            />
            <HelperText type="error" visible={!!fieldErrors.confirmPassword}>
              {fieldErrors.confirmPassword}
            </HelperText>

            {/* Submit */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={[styles.button, { borderRadius: 6 }]}
              contentStyle={{ paddingVertical: 6 }}
              buttonColor={primaryColor}
            >
              Submit
            </Button>

            {/* Already have account */}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Onboarding")}
              style={{ borderRadius: 6, borderColor: "#ccc" }}
              contentStyle={{ paddingVertical: 6 }}
              textColor="#1A1A1A"
            >
              I already have an account
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
}
