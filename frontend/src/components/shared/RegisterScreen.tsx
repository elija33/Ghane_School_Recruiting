import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../store";
import { registerUser, logoutUser } from "../../store/slices/authSlice";
import { createSchoolProfile } from "../../store/slices/schoolSlice";
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

// ── School Registration ────────────────────────────────────────────────────

function SchoolRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [schoolName, setSchoolName] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!schoolName.trim()) errors.schoolName = "School name is required";
    if (!schoolLocation.trim()) errors.schoolLocation = "School location is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setProfileSaving(true);
    try {
      const result = await dispatch(
        registerUser({ email: email.trim().toLowerCase(), password, role: "SCHOOL" as UserRole }),
      );
      if (registerUser.rejected.match(result)) {
        const msg = result.payload as string;
        if (msg?.toLowerCase().includes("email") && msg?.toLowerCase().includes("already")) {
          setFieldErrors((prev) => ({ ...prev, email: "This email is already registered. Please sign in." }));
        }
        return;
      }
      if (!registerUser.fulfilled.match(result)) return;
      await dispatch(createSchoolProfile({ schoolName: schoolName.trim(), location: schoolLocation.trim() }));
      setWelcomeVisible(true);
    } finally {
      setProfileSaving(false);
    }
  };

  const busy = loading || profileSaving;

  return (
    <>
      {/* Success modal */}
      <Modal visible={welcomeVisible} transparent animationType="fade" onRequestClose={() => setWelcomeVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400, alignItems: "center" }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "#EAFAF1", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Ionicons name="checkmark-circle" size={44} color="#27AE60" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1A1A1A", textAlign: "center", marginBottom: 8 }}>
              Welcome aboard!
            </Text>
            <Text style={{ fontSize: 15, color: "#555", textAlign: "center", marginBottom: 6 }}>
              {schoolName.trim()} is now registered on the Ghana Teacher Recruiting Platform.
            </Text>
            <Text style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 28 }}>
              You can now post jobs and find qualified teachers.
            </Text>
            <Button
              mode="contained"
              onPress={async () => { setWelcomeVisible(false); await dispatch(logoutUser()); navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] }); }}
              buttonColor={primaryColor}
              style={{ borderRadius: 10, width: "100%" }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Get Started
            </Button>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#F5F8FA" }} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={{ backgroundColor: primaryColor, paddingTop: 56, paddingBottom: 32, paddingHorizontal: 32, alignItems: "center" }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Ionicons name="school-outline" size={34} color="#fff" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 6 }}>
              Register Your School
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", textAlign: "center" }}>
              Create an account to post jobs and find qualified teachers
            </Text>
          </View>

          <View style={{ alignItems: "center", paddingTop: 28, paddingBottom: 40 }}>
            <View style={{ width: "100%", maxWidth: 480, paddingHorizontal: 24 }}>

              {error ? (
                <View style={{ backgroundColor: "#FDEDEC", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#E74C3C", flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="alert-circle-outline" size={18} color="#E74C3C" />
                  <Text style={{ color: "#C0392B", fontSize: 13, flex: 1 }}>{error}</Text>
                </View>
              ) : null}

              {/* School Name */}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 6 }}>School Name</Text>
              <TextInput
                placeholder="e.g. Accra Academy Senior High"
                value={schoolName}
                onChangeText={setSchoolName}
                mode="outlined"
                style={{ backgroundColor: "#fff", marginBottom: 2 }}
                error={!!fieldErrors.schoolName}
                activeOutlineColor={primaryColor}
                outlineColor="#ccc"
                left={<TextInput.Icon icon="office-building-outline" />}
              />
              <HelperText type="error" visible={!!fieldErrors.schoolName}>{fieldErrors.schoolName}</HelperText>

              {/* School Location */}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 6, marginTop: 4 }}>School Location</Text>
              <TextInput
                placeholder="City or district (e.g. Kumasi, Ashanti)"
                value={schoolLocation}
                onChangeText={setSchoolLocation}
                mode="outlined"
                style={{ backgroundColor: "#fff", marginBottom: 2 }}
                error={!!fieldErrors.schoolLocation}
                activeOutlineColor={primaryColor}
                outlineColor="#ccc"
                left={<TextInput.Icon icon="map-marker-outline" />}
              />
              <HelperText type="error" visible={!!fieldErrors.schoolLocation}>{fieldErrors.schoolLocation}</HelperText>

              {/* Email */}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 6, marginTop: 4 }}>Email Address</Text>
              <TextInput
                placeholder="school@example.com"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ backgroundColor: "#fff", marginBottom: 2 }}
                error={!!fieldErrors.email}
                activeOutlineColor={primaryColor}
                outlineColor="#ccc"
                left={<TextInput.Icon icon="email-outline" />}
              />
              <HelperText type="error" visible={!!fieldErrors.email}>{fieldErrors.email}</HelperText>

              {/* Password */}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 6, marginTop: 4 }}>Password</Text>
              <TextInput
                placeholder="Minimum 8 characters"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={{ backgroundColor: "#fff", marginBottom: 2 }}
                error={!!fieldErrors.password}
                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((v) => !v)} />}
                activeOutlineColor={primaryColor}
                outlineColor="#ccc"
                left={<TextInput.Icon icon="lock-outline" />}
              />
              <HelperText type="error" visible={!!fieldErrors.password}>{fieldErrors.password}</HelperText>

              {/* Confirm Password */}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 6, marginTop: 4 }}>Confirm Password</Text>
              <TextInput
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={{ backgroundColor: "#fff", marginBottom: 2 }}
                error={!!fieldErrors.confirmPassword}
                right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword((v) => !v)} />}
                activeOutlineColor={primaryColor}
                outlineColor="#ccc"
                left={<TextInput.Icon icon="lock-check-outline" />}
              />
              <HelperText type="error" visible={!!fieldErrors.confirmPassword}>{fieldErrors.confirmPassword}</HelperText>

              {/* Submit */}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={busy}
                disabled={busy}
                style={{ borderRadius: 8, marginTop: 12, marginBottom: 12 }}
                contentStyle={{ paddingVertical: 8 }}
                buttonColor={primaryColor}
              >
                Create Account
              </Button>

              <Button
                mode="outlined"
                onPress={async () => { await dispatch(logoutUser()); navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] }); }}
                style={{ borderRadius: 8, borderColor: "#ccc" }}
                contentStyle={{ paddingVertical: 6 }}
                textColor="#555"
              >
                Already have an account? Sign in
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// ── Teacher Registration (unchanged) ──────────────────────────────────────

function TeacherRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
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
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      if (age < 21) errors.birthday = "You must be at least 21 years old to register";
    }
    if (!gender) errors.gender = "Please select your gender";
    if (!phone.trim()) errors.phone = "Mobile number is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const role: UserRole = "TEACHER";
    const username = `${firstName.trim().toLowerCase()}${lastName.trim().toLowerCase()}`;
    const result = await dispatch(
      registerUser({ email: email.trim().toLowerCase(), password, role, firstName: firstName.trim(), lastName: lastName.trim(), username }),
    );
    if (registerUser.fulfilled.match(result)) {
      setWelcomeVisible(true);
    } else if (registerUser.rejected.match(result)) {
      const msg = result.payload as string;
      if (msg?.toLowerCase().includes("email") && msg?.toLowerCase().includes("already")) {
        setFieldErrors((prev) => ({ ...prev, email: "This email is already registered. Please sign in." }));
      }
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
            <Button mode="contained" onPress={() => { setWelcomeVisible(false); navigation.navigate('TeacherLogin'); }} buttonColor={primaryColor} style={{ borderRadius: 10, width: "100%" }} contentStyle={{ paddingVertical: 6 }}>
              Get Started
            </Button>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={[styles.header, { backgroundColor: primaryColor }]}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Ghana Teacher Recruiting Platform</Text>
          </View>

          <View style={{ alignItems: "center", paddingVertical: 8 }}>
            <View style={{ width: "100%", maxWidth: 500, paddingHorizontal: 24 }}>
              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 8 }}>Name</Text>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 4 }}>
                <View style={{ flex: 1 }}>
                  <TextInput placeholder="First name" value={firstName} onChangeText={setFirstName} mode="outlined" style={{ backgroundColor: "#fff" }} error={!!fieldErrors.firstName} activeOutlineColor={primaryColor} outlineColor="#ccc" />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput placeholder="Last name" value={lastName} onChangeText={setLastName} mode="outlined" style={{ backgroundColor: "#fff" }} error={!!fieldErrors.lastName} activeOutlineColor={primaryColor} outlineColor="#ccc" />
                </View>
              </View>
              <HelperText type="error" visible={!!(fieldErrors.firstName || fieldErrors.lastName)}>
                {fieldErrors.firstName || fieldErrors.lastName}
              </HelperText>

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginTop: 8, marginBottom: 8 }}>
                Birthday{"  "}<Ionicons name="help-circle-outline" size={15} color="#888" />
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 4 }}>
                <View style={{ flex: 2 }}><NativeSelect value={month} onChange={setMonth} options={MONTHS} placeholder="Month" /></View>
                <View style={{ flex: 1 }}><NativeSelect value={day} onChange={setDay} options={DAYS} placeholder="Day" /></View>
                <View style={{ flex: 1.5 }}><NativeSelect value={year} onChange={setYear} options={YEARS} placeholder="Year" /></View>
              </View>
              <HelperText type="error" visible={!!fieldErrors.birthday}>{fieldErrors.birthday}</HelperText>

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginTop: 8, marginBottom: 8 }}>
                Gender{"  "}<Ionicons name="help-circle-outline" size={15} color="#888" />
              </Text>
              <NativeSelect value={gender} onChange={setGender} options={GENDERS} placeholder="Select your gender" />
              <HelperText type="error" visible={!!fieldErrors.gender}>{fieldErrors.gender}</HelperText>

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginTop: 8, marginBottom: 4 }}>Mobile Number</Text>
              <TextInput placeholder="Enter mobile number" value={phone} onChangeText={setPhone} mode="outlined" keyboardType="phone-pad" style={{ backgroundColor: "#fff" }} error={!!fieldErrors.phone} activeOutlineColor={primaryColor} outlineColor="#ccc" left={<TextInput.Icon icon="phone-outline" />} />
              <HelperText type="error" visible={!!fieldErrors.phone}>{fieldErrors.phone}</HelperText>

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginTop: 8, marginBottom: 4 }}>Email</Text>
              <TextInput placeholder="Enter email address" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={{ backgroundColor: "#fff" }} error={!!fieldErrors.email} activeOutlineColor={primaryColor} outlineColor="#ccc" left={<TextInput.Icon icon="email-outline" />} />
              <Text style={{ fontSize: 11, color: "#606770", marginTop: 4 }}>
                You may receive notifications from us.{" "}
                <Text style={{ color: primaryColor }}>Learn why we ask for your contact information</Text>
              </Text>
              <HelperText type="error" visible={!!fieldErrors.email}>{fieldErrors.email}</HelperText>

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginTop: 8, marginBottom: 4 }}>Password</Text>
              <TextInput placeholder="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry={!showPassword} style={{ backgroundColor: "#fff" }} error={!!fieldErrors.password} right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((v) => !v)} />} activeOutlineColor={primaryColor} outlineColor="#ccc" />
              <HelperText type="error" visible={!!fieldErrors.password}>{fieldErrors.password}</HelperText>

              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginTop: 8, marginBottom: 4 }}>Confirm Password</Text>
              <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} mode="outlined" secureTextEntry={!showConfirmPassword} style={{ backgroundColor: "#fff" }} error={!!fieldErrors.confirmPassword} right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword((v) => !v)} />} activeOutlineColor={primaryColor} outlineColor="#ccc" />
              <HelperText type="error" visible={!!fieldErrors.confirmPassword}>{fieldErrors.confirmPassword}</HelperText>

              <Button mode="contained" onPress={handleRegister} loading={loading} disabled={loading} style={[styles.button, { borderRadius: 6 }]} contentStyle={{ paddingVertical: 6 }} buttonColor={primaryColor}>
                Submit
              </Button>
              <Button mode="outlined" onPress={() => navigation.navigate("Onboarding")} style={{ borderRadius: 6, borderColor: "#ccc" }} contentStyle={{ paddingVertical: 6 }} textColor="#1A1A1A">
                I already have an account
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// ── Entry point ────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  return isSchoolApp ? <SchoolRegisterScreen /> : <TeacherRegisterScreen />;
}
