import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchTeacherProfile } from "../../store/slices/teacherSlice";
import { TeacherStackParamList, VerificationStatus } from "../../types";

type Nav = NativeStackNavigationProp<TeacherStackParamList>;

const PRIMARY = "#1B4F72";
const GREEN = "#27AE60";
const ORANGE = "#F39C12";
const RED = "#E74C3C";

const VERIFICATION_COLOR: Record<VerificationStatus, string> = {
  PENDING: ORANGE,
  IN_REVIEW: "#3498DB",
  VERIFIED: GREEN,
  FAILED: RED,
};

const VERIFICATION_ICON: Record<VerificationStatus, string> = {
  PENDING: "time-outline",
  IN_REVIEW: "eye-outline",
  VERIFIED: "shield-checkmark",
  FAILED: "shield-outline",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(raw: any): string | null {
  if (!raw) return null;
  // Array format [YYYY, M, D] — backend not yet restarted with WRITE_DATES_AS_TIMESTAMPS=false
  if (Array.isArray(raw)) {
    const [y, m, d] = raw as number[];
    return `${d} ${MONTHS[m - 1] ?? m} ${y}`;
  }
  // String format "YYYY-MM-DD"
  if (typeof raw === "string") {
    const parts = raw.split("-");
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1] ?? m} ${y}`;
    }
    return raw;
  }
  return String(raw);
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
      }}
    >
      <Ionicons
        name={icon as any}
        size={18}
        color={PRIMARY}
        style={{ marginTop: 2, marginRight: 12, width: 20 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            color: "#888",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text style={{ fontSize: 15, color: "#1A1A1A" }}>{value}</Text>
      </View>
    </View>
  );
}

function DocRow({
  icon,
  label,
  url,
  emptyLabel,
  onPress,
}: {
  icon: string;
  label: string;
  url: string | null | undefined;
  emptyLabel: string;
  onPress?: () => void;
}) {
  const hasFile = !!url;
  return (
    <TouchableOpacity
      onPress={hasFile ? onPress : undefined}
      activeOpacity={hasFile ? 0.7 : 1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons
          name={icon as any}
          size={20}
          color={hasFile ? PRIMARY : "#ccc"}
        />
        <Text
          style={{
            fontSize: 14,
            color: hasFile ? PRIMARY : "#1A1A1A",
            fontWeight: hasFile ? "600" : "400",
          }}
        >
          {label}
        </Text>
      </View>
      {hasFile ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 12, color: PRIMARY, fontWeight: "600" }}>
            View
          </Text>
          <Ionicons name="chevron-forward" size={16} color={PRIMARY} />
        </View>
      ) : (
        <Text style={{ fontSize: 12, color: "#aaa" }}>{emptyLabel}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function ViewMyProfileScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.teacher);

  // CV drawer
  const slideAnim = useRef(new Animated.Value(-900)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Photo lightbox
  const [photoVisible, setPhotoVisible] = useState(false);

  // Video modal
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchTeacherProfile());
  };

  const openCv = () => {
    setDrawerOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const closeCv = () => {
    Animated.timing(slideAnim, {
      toValue: -900,
      duration: 280,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const verStatus: VerificationStatus =
    profile?.verificationStatus ?? "PENDING";

  return (
    <>
      {/* ── CV / Resume slide drawer ── */}
      {drawerOpen && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
            activeOpacity={1}
            onPress={closeCv}
          />
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "80%",
              backgroundColor: "#fff",
              transform: [{ translateX: slideAnim }],
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 16,
              shadowOffset: { width: 4, height: 0 },
              elevation: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                paddingTop: 52,
                backgroundColor: PRIMARY,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
                CV / Resume
              </Text>
              <TouchableOpacity onPress={closeCv} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {Platform.OS === "web" ? (
                React.createElement("iframe", {
                  src: profile?.resumeUrl ?? "",
                  style: { width: "100%", height: "100%", border: "none" },
                  title: "CV Preview",
                })
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                  }}
                >
                  <Ionicons
                    name="document-attach-outline"
                    size={48}
                    color={PRIMARY}
                  />
                  <Text
                    style={{
                      color: "#2C3E50",
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    PDF preview is not available on this device.
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      )}

      {/* ── Profile Photo lightbox ── */}
      <Modal
        visible={photoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.92)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 52, right: 20, zIndex: 10 }}
            onPress={() => setPhotoVisible(false)}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
          {profile?.photoUrl ? (
            <Image
              source={{ uri: profile.photoUrl }}
              style={{ width: "85%", aspectRatio: 1, borderRadius: 16 }}
              resizeMode="contain"
            />
          ) : null}
          <Text
            style={{
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
              fontSize: 13,
            }}
          >
            Profile Photo
          </Text>
        </View>
      </Modal>

      {/* ── Intro Video modal ── */}
      <Modal
        visible={videoVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVideoVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 52, right: 20, zIndex: 10 }}
            onPress={() => setVideoVisible(false)}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>

          {profile?.videoUrl ? (
            Platform.OS === "web" ? (
              React.createElement("video", {
                src: profile.videoUrl,
                controls: true,
                autoPlay: true,
                style: { width: "90%", maxHeight: "80%", borderRadius: 12 },
              })
            ) : (
              <View style={{ alignItems: "center", padding: 24 }}>
                <Ionicons name="videocam" size={64} color="#fff" />
                <Text
                  style={{ color: "#fff", marginTop: 12, textAlign: "center" }}
                >
                  Video playback is not available on this device.
                </Text>
              </View>
            )
          ) : null}

          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              marginTop: 16,
              fontSize: 13,
            }}
          >
            Intro Video
          </Text>
        </View>
      </Modal>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#F5F8FA" }}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[PRIMARY]}
          />
        }
      >
        {/* Header Banner */}
        <View
          style={{
            backgroundColor: PRIMARY,
            paddingTop: 56,
            paddingBottom: 64,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#fff",
              marginBottom: 4,
            }}
          >
            My Profile
          </Text>
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            View and manage your information
          </Text>
        </View>

        {/* Avatar Card */}
        <View
          style={{
            alignItems: "center",
            marginTop: -48,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={profile?.photoUrl ? 0.8 : 1}
            onPress={
              profile?.photoUrl ? () => setPhotoVisible(true) : undefined
            }
            style={{ position: "relative", marginBottom: 12 }}
          >
            {profile?.photoUrl ? (
              <Image
                source={{ uri: profile.photoUrl }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 3,
                  borderColor: "#fff",
                }}
              />
            ) : (
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: PRIMARY,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 3,
                  borderColor: "#fff",
                }}
              >
                <Ionicons
                  name="person"
                  size={48}
                  color="rgba(255,255,255,0.85)"
                />
              </View>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: VERIFICATION_COLOR[verStatus],
                borderRadius: 12,
                padding: 4,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <Ionicons
                name={VERIFICATION_ICON[verStatus] as any}
                size={12}
                color="#fff"
              />
            </View>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: "#1A1A1A",
              textAlign: "center",
            }}
          >
            {profile?.fullName ?? "Your Name"}
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
            {profile?.email ?? ""}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: VERIFICATION_COLOR[verStatus] + "18",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
              marginTop: 10,
            }}
          >
            <Ionicons
              name={VERIFICATION_ICON[verStatus] as any}
              size={14}
              color={VERIFICATION_COLOR[verStatus]}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: VERIFICATION_COLOR[verStatus],
              }}
            >
              {verStatus.replace("_", " ")}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 16 }}>
          {/* Personal Information */}
          <Card style={{ borderRadius: 12 }} elevation={1}>
            <Card.Content style={{ paddingVertical: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={PRIMARY}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: PRIMARY }}
                >
                  Personal Information
                </Text>
              </View>
              <InfoRow
                icon="call-outline"
                label="Phone Number"
                value={profile?.phoneNumber}
              />
              <InfoRow
                icon="location-outline"
                label="Location / Region"
                value={profile?.location}
              />
              <InfoRow
                icon="calendar-outline"
                label="Date of Birth"
                value={formatDate(profile?.dateOfBirth)}
              />
              <InfoRow
                icon="card-outline"
                label="Ghana Card / ID No."
                value={profile?.idNumber}
              />
              {!profile?.phoneNumber && !profile?.location && (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#aaa",
                    textAlign: "center",
                    paddingVertical: 8,
                  }}
                >
                  No personal details added yet
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Professional Information */}
          <Card style={{ borderRadius: 12 }} elevation={1}>
            <Card.Content style={{ paddingVertical: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Ionicons name="briefcase-outline" size={20} color={PRIMARY} />
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: PRIMARY }}
                >
                  Professional Information
                </Text>
              </View>
              <InfoRow
                icon="book-outline"
                label="Subject Specialization"
                value={profile?.subjectSpecialization}
              />
              <InfoRow
                icon="time-outline"
                label="Years of Experience"
                value={
                  profile?.yearsOfExperience != null
                    ? `${profile.yearsOfExperience} year${profile.yearsOfExperience !== 1 ? "s" : ""}`
                    : null
                }
              />
              <InfoRow
                icon="document-text-outline"
                label="Bio / About Me"
                value={profile?.bio}
              />
              {!profile?.subjectSpecialization && !profile?.bio && (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#aaa",
                    textAlign: "center",
                    paddingVertical: 8,
                  }}
                >
                  No professional details added yet
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Documents & Media */}
          <Card style={{ borderRadius: 12 }} elevation={1}>
            <Card.Content style={{ paddingVertical: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Ionicons name="folder-outline" size={20} color={PRIMARY} />
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: PRIMARY }}
                >
                  Documents & Media
                </Text>
              </View>

              <DocRow
                icon="document-attach-outline"
                label="CV / Resume"
                url={profile?.resumeUrl}
                emptyLabel="Not uploaded"
                onPress={openCv}
              />
              <DocRow
                icon="image-outline"
                label="Profile Photo"
                url={profile?.photoUrl}
                emptyLabel="Not uploaded"
                onPress={() => setPhotoVisible(true)}
              />
              <DocRow
                icon="videocam-outline"
                label="Intro Video"
                url={profile?.videoUrl}
                emptyLabel="Not recorded"
                onPress={() => setVideoVisible(true)}
              />
            </Card.Content>
          </Card>

          {/* Visibility banner */}
          <Card
            style={{
              borderRadius: 12,
              backgroundColor: profile?.isVisibleToSchools
                ? "#EAF7EE"
                : "#FEF9EC",
            }}
            elevation={0}
          >
            <Card.Content
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 14,
              }}
            >
              <Ionicons
                name={profile?.isVisibleToSchools ? "eye" : "eye-off-outline"}
                size={22}
                color={profile?.isVisibleToSchools ? GREEN : ORANGE}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: profile?.isVisibleToSchools ? GREEN : ORANGE,
                  }}
                >
                  {profile?.isVisibleToSchools
                    ? "Visible to Schools"
                    : "Hidden from Schools"}
                </Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  {profile?.isVisibleToSchools
                    ? "Schools can find and contact you."
                    : "Complete your profile to become visible."}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Edit Profile Button */}
          <Button
            mode="contained"
            onPress={() => (navigation.navigate as any)("EditProfile")}
            buttonColor={PRIMARY}
            style={{ borderRadius: 10, marginTop: 4 }}
            contentStyle={{ paddingVertical: 6 }}
            icon="pencil"
          >
            Edit Profile
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
