import React, { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

function WebCameraModal({
  visible,
  onCapture,
  onClose,
}: {
  visible: boolean;
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setError(null);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e: any) {
        setError(
          e?.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in your browser."
            : (e?.message ?? "Could not access camera."),
        );
      }
    })();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [visible]);

  const handleCapture = () => {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    onCapture(canvas.toDataURL("image/jpeg", 0.9));
  };

  if (!visible) return null;

  return (
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Take a Photo</Text>
        {error ? (
          <Text style={styles.modalError}>{error}</Text>
        ) : (
          React.createElement("video", {
            ref: videoRef,
            autoPlay: true,
            playsInline: true,
            muted: true,
            style: {
              width: 320,
              height: 240,
              borderRadius: 8,
              background: "#000",
              objectFit: "cover",
            },
          })
        )}
        <View style={styles.modalActions}>
          <Button mode="outlined" onPress={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleCapture}
            disabled={!!error}
            buttonColor="#1B4F72"
            icon="camera"
            style={{ flex: 1 }}
          >
            Capture
          </Button>
        </View>
      </View>
    </View>
  );
}

const MAX_CV_MB = 10;
const MAX_VIDEO_MB = 100;
const MAX_RECORD_SECONDS = 60;
const MB = 1024 * 1024;

function WebVideoRecorderModal({
  visible,
  onSave,
  onClose,
}: {
  visible: boolean;
  onSave: (blob: Blob, name: string) => void;
  onClose: () => void;
}) {
  const liveRef = useRef<any>(null);
  const playbackRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<any>(null);
  const [stage, setStage] = useState<"idle" | "recording" | "recorded">("idle");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setError(null);
    setStage("idle");
    setRecordedBlob(null);
    setRecordedUrl(null);
    setElapsed(0);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (liveRef.current) {
          liveRef.current.srcObject = stream;
          await liveRef.current.play();
        }
      } catch (e: any) {
        setError(
          e?.name === "NotAllowedError"
            ? "Camera/microphone permission denied. Please allow access in your browser."
            : e?.message ?? "Could not access camera or microphone.",
        );
      }
    })();

    return () => {
      cancelled = true;
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [visible]);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const pickMimeType = () => {
    const candidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];
    return candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType || "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedUrl(url);
      setStage("recorded");
      if (tickRef.current) clearInterval(tickRef.current);
    };
    recorder.start();
    recorderRef.current = recorder;
    setStage("recording");
    setElapsed(0);
    tickRef.current = setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (next >= MAX_RECORD_SECONDS) {
          if (recorder.state === "recording") recorder.stop();
        }
        return next;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const reRecord = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setStage("idle");
    setElapsed(0);
  };

  const useThisVideo = () => {
    if (!recordedBlob) return;
    const sizeMB = recordedBlob.size / MB;
    if (sizeMB > MAX_VIDEO_MB) {
      setError(
        `Recording is ${sizeMB.toFixed(1)} MB. Please record a shorter clip (under ${MAX_VIDEO_MB} MB).`,
      );
      return;
    }
    const ext = recordedBlob.type.includes("mp4") ? "mp4" : "webm";
    onSave(recordedBlob, `intro_video.${ext}`);
  };

  if (!visible) return null;

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const videoStyle = {
    width: 400,
    height: 300,
    borderRadius: 8,
    background: "#000",
    objectFit: "cover" as const,
  };

  return (
    <View style={styles.modalBackdrop}>
      <View style={[styles.modalCard, { maxWidth: 480 }]}>
        <Text style={styles.modalTitle}>Record Intro Video</Text>
        {error ? (
          <Text style={styles.modalError}>{error}</Text>
        ) : stage === "recorded" && recordedUrl ? (
          React.createElement("video", {
            ref: playbackRef,
            src: recordedUrl,
            controls: true,
            style: videoStyle,
          })
        ) : (
          React.createElement("video", {
            ref: liveRef,
            autoPlay: true,
            playsInline: true,
            muted: true,
            style: videoStyle,
          })
        )}
        {stage === "recording" && (
          <View style={styles.recIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>
              REC {fmt(elapsed)} / {fmt(MAX_RECORD_SECONDS)}
            </Text>
          </View>
        )}
        {stage === "idle" && !error && (
          <Text style={styles.modalHint}>
            Tip: Introduce yourself, your teaching experience, and why you'd be
            a great fit. Keep it under {MAX_RECORD_SECONDS}s.
          </Text>
        )}
        <View style={styles.modalActions}>
          {stage === "idle" && (
            <>
              <Button mode="outlined" onPress={onClose} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={startRecording}
                disabled={!!error}
                buttonColor="#E74C3C"
                icon="record-rec"
                style={{ flex: 1 }}
              >
                Start Recording
              </Button>
            </>
          )}
          {stage === "recording" && (
            <Button
              mode="contained"
              onPress={stopRecording}
              buttonColor="#1B4F72"
              icon="stop"
              style={{ flex: 1 }}
            >
              Stop Recording
            </Button>
          )}
          {stage === "recorded" && (
            <>
              <Button mode="outlined" onPress={reRecord} style={{ flex: 1 }}>
                Re-record
              </Button>
              <Button
                mode="contained"
                onPress={useThisVideo}
                buttonColor="#1B4F72"
                icon="check"
                style={{ flex: 1 }}
              >
                Use This Video
              </Button>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const GHANA_REGIONS: { name: string; enabled: boolean }[] = [
  { name: "Greater Accra", enabled: true },
  { name: "Ashanti", enabled: true },
  { name: "Western", enabled: false },
  { name: "Central", enabled: false },
  { name: "Eastern", enabled: false },
  { name: "Northern", enabled: false },
  { name: "Upper East", enabled: false },
  { name: "Upper West", enabled: false },
  { name: "Volta", enabled: false },
  { name: "Brong-Ahafo", enabled: false },
  { name: "Oti", enabled: false },
  { name: "Ahafo", enabled: false },
  { name: "Bono East", enabled: false },
  { name: "North East", enabled: false },
  { name: "Savannah", enabled: false },
  { name: "Western North", enabled: false },
];

const SUBJECTS = [
  "Mathematics",
  "English Language",
  "Science",
  "Social Studies",
  "ICT",
  "French",
  "Physical Education",
  "Music",
  "Art & Design",
  "Religious & Moral Education",
  "History",
  "Geography",
  "Economics",
  "Business Studies",
  "Agriculture",
  "Technical Drawing",
];

interface FormData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  region: string;
  city: string;
  subjects: string[];
  otherSubject: string;
  experience: string;
  bio: string;
  idNumber: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  fullName: "",
  dateOfBirth: "",
  phone: "",
  region: "",
  city: "",
  subjects: [],
  otherSubject: "",
  experience: "",
  bio: "",
  idNumber: "",
};

export default function TeacherProfileScreen() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [webCameraOpen, setWebCameraOpen] = useState(false);
  const [webVideoOpen, setWebVideoOpen] = useState(false);

  const launchCamera = async () => {
    if (Platform.OS === "web") {
      setWebCameraOpen(true);
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow camera access to take a photo.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const launchLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePickPhoto = () => {
    if (Platform.OS === "web") {
      // On web, open the camera directly via getUserMedia
      launchCamera();
    } else if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take a Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) launchCamera();
          if (index === 2) launchLibrary();
        },
      );
    } else {
      // Android
      Alert.alert("Profile Photo", "Choose an option", [
        { text: "Take a Photo", onPress: launchCamera },
        { text: "Choose from Library", onPress: launchLibrary },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handlePickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });
    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const sizeMB = (asset.size ?? 0) / MB;

    if (sizeMB > MAX_CV_MB) {
      Alert.alert(
        "File Too Large",
        `Your file is ${sizeMB.toFixed(1)} MB. Please upload a file under ${MAX_CV_MB} MB.\n\nTip: Use "Save as PDF" with compressed settings, or remove large images from your document.`,
        [{ text: "OK" }],
      );
      return;
    }

    setCvFileName(asset.name);
  };

  const handlePickVideo = async () => {
    if (Platform.OS === "web") {
      setWebVideoOpen(true);
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your media library to upload a video.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // videoQuality only applies on iOS — ignored on Android/web
      videoQuality:
        Platform.OS === "ios"
          ? ImagePicker.UIImagePickerControllerQualityType.Medium
          : undefined,
      allowsEditing: false,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const sizeMB = (asset.fileSize ?? 0) / MB;

    if (sizeMB > MAX_VIDEO_MB) {
      Alert.alert(
        "Video Too Large",
        `Your video is ${sizeMB.toFixed(0)} MB after compression. Please upload a shorter clip (under ${MAX_VIDEO_MB} MB).`,
        [{ text: "OK" }],
      );
      return;
    }

    const name = asset.uri.split("/").pop() ?? "intro_video";
    setVideoFileName(name);
  };

  const set = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleSubject = (s: string) =>
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(s)
        ? f.subjects.filter((x) => x !== s)
        : [...f.subjects, s],
    }));

  const validate = () => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.region) e.region = "Please select your region";
    if (form.subjects.length === 0)
      e.subjects = "Please select at least one subject";
    if (!form.experience) e.experience = "Years of experience is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={20} color="#1B4F72" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <WebCameraModal
        visible={webCameraOpen}
        onClose={() => setWebCameraOpen(false)}
        onCapture={(dataUrl) => {
          setPhotoUri(dataUrl);
          setWebCameraOpen(false);
        }}
      />
      <WebVideoRecorderModal
        visible={webVideoOpen}
        onClose={() => setWebVideoOpen(false)}
        onSave={(_blob, name) => {
          setVideoFileName(name);
          setWebVideoOpen(false);
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePickPhoto}
          >
            <View style={styles.avatar}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons
                  name="person"
                  size={48}
                  color="rgba(255,255,255,0.7)"
                />
              )}
            </View>
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Your Profile</Text>
          <Text style={styles.headerSubtitle}>
            Help schools find the right teacher — that's you!
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          {["Personal", "Professional", "Documents"].map((label, i) => (
            <View key={label} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  i === 0 && styles.progressDotActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressNum,
                    i === 0 && styles.progressNumActive,
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  i === 0 && styles.progressLabelActive,
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        {/* ── Section 1: Personal Info ── */}
        <View style={styles.card}>
          <SectionHeader icon="person-outline" title="Personal Information" />

          <TextInput
            label="Full Name *"
            value={form.fullName}
            onChangeText={set("fullName")}
            mode="outlined"
            style={styles.input}
            error={!!errors.fullName}
            left={<TextInput.Icon icon="account" />}
          />
          <HelperText type="error" visible={!!errors.fullName}>
            {errors.fullName}
          </HelperText>

          <TextInput
            label="Date of Birth"
            value={form.dateOfBirth}
            onChangeText={set("dateOfBirth")}
            mode="outlined"
            placeholder="DD/MM/YYYY"
            style={styles.input}
            left={<TextInput.Icon icon="calendar" />}
          />

          <TextInput
            label="Phone Number *"
            value={form.phone}
            onChangeText={set("phone")}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            error={!!errors.phone}
            left={<TextInput.Icon icon="phone" />}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>

          <Text style={styles.fieldLabel}>Region *</Text>
          <View style={styles.chipGrid}>
            {GHANA_REGIONS.map((r) => (
              <TouchableOpacity
                key={r.name}
                style={[
                  styles.chip,
                  form.region === r.name && styles.chipSelected,
                  !r.enabled && styles.chipDisabled,
                ]}
                onPress={() => r.enabled && set("region")(r.name)}
                disabled={!r.enabled}
              >
                <Text
                  style={[
                    styles.chipText,
                    form.region === r.name && styles.chipTextSelected,
                    !r.enabled && styles.chipTextDisabled,
                  ]}
                >
                  {r.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!errors.region && (
            <Text style={styles.errorText}>{errors.region}</Text>
          )}

          <TextInput
            label="City / Town"
            value={form.city}
            onChangeText={set("city")}
            mode="outlined"
            style={[styles.input, { marginTop: 12 }]}
            left={<TextInput.Icon icon="map-marker" />}
          />
        </View>

        {/* ── Section 2: Professional Info ── */}
        <View style={styles.card}>
          <SectionHeader
            icon="school-outline"
            title="Professional Information"
          />

          <Text style={styles.fieldLabel}>
            Subject Specialization * (select all that apply)
          </Text>
          <View style={styles.chipGrid}>
            {SUBJECTS.map((s) => {
              const selected = form.subjects.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleSubject(s)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {!!errors.subjects && (
            <Text style={styles.errorText}>{errors.subjects}</Text>
          )}

          <TextInput
            label="Other Subject (if not listed)"
            value={form.otherSubject}
            onChangeText={set("otherSubject")}
            mode="outlined"
            style={[styles.input, { marginTop: 12 }]}
          />

          <TextInput
            label="Years of Experience *"
            value={form.experience}
            onChangeText={set("experience")}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.experience}
            left={<TextInput.Icon icon="briefcase" />}
          />
          <HelperText type="error" visible={!!errors.experience}>
            {errors.experience}
          </HelperText>

          <TextInput
            label="About Yourself"
            value={form.bio}
            onChangeText={set("bio")}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Tell schools a bit about yourself, your teaching style and goals..."
          />
        </View>

        {/* ── Section 3: Documents ── */}
        <View style={styles.card}>
          <SectionHeader
            icon="document-text-outline"
            title="Documents & Verification"
          />

          <TextInput
            label="Ghana Card / National ID Number"
            value={form.idNumber}
            onChangeText={set("idNumber")}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="card-account-details" />}
          />

          <View style={styles.uploadRow}>
            <TouchableOpacity
              style={styles.uploadCard}
              onPress={handlePickPhoto}
            >
              <Ionicons name="camera-outline" size={28} color="#2E86C1" />
              <Text style={[styles.uploadLabel, { color: "#2E86C1" }]}>
                Profile Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadCard} onPress={handlePickCV}>
              <Ionicons
                name="document-attach-outline"
                size={28}
                color="#8E44AD"
              />
              <Text style={[styles.uploadLabel, { color: "#8E44AD" }]}>
                {cvFileName ?? "Upload CV"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadCard}
              onPress={handlePickVideo}
            >
              <Ionicons name="videocam-outline" size={28} color="#E67E22" />
              <Text style={[styles.uploadLabel, { color: "#E67E22" }]}>
                {videoFileName ?? "Video About You"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 10 }}
          buttonColor="#1B4F72"
          icon="check-circle"
        >
          Save Profile
        </Button>

        <Text style={styles.hint}>
          * Required fields. Your profile will be visible to schools once
          verified.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F3F8" },
  content: { paddingBottom: 48 },

  // Header
  header: {
    backgroundColor: "#1B4F72",
    paddingTop: 56,
    paddingBottom: 36,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  avatarWrapper: { marginBottom: 16, position: "relative" },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#F39C12",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },

  // Progress
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF0",
  },
  progressItem: { alignItems: "center", gap: 4 },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8ECF0",
    alignItems: "center",
    justifyContent: "center",
  },
  progressDotActive: { backgroundColor: "#1B4F72" },
  progressNum: { fontSize: 14, fontWeight: "700", color: "#95A5A6" },
  progressNumActive: { color: "#fff" },
  progressLabel: { fontSize: 11, color: "#95A5A6" },
  progressLabelActive: { color: "#1B4F72", fontWeight: "600" },

  // Banners
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAFAF1",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  successText: { color: "#27AE60", fontWeight: "600" },

  // Cards
  card: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1B4F72" },

  // Fields
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 10,
  },
  input: { marginBottom: 4, backgroundColor: "#fff" },
  errorText: { color: "#E74C3C", fontSize: 12, marginTop: 4, marginBottom: 8 },

  // Chips
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D5D8DC",
    backgroundColor: "#F8F9FA",
  },
  chipSelected: { borderColor: "#1B4F72", backgroundColor: "#EBF5FB" },
  chipDisabled: {
    borderColor: "#E8ECF0",
    backgroundColor: "#F2F3F4",
    opacity: 0.5,
  },
  chipText: { fontSize: 13, color: "#626567" },
  chipTextSelected: { color: "#1B4F72", fontWeight: "600" },
  chipTextDisabled: { color: "#BDC3C7" },

  // Upload
  uploadRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  uploadCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E8ECF0",
    borderStyle: "dashed",
    backgroundColor: "#FAFBFC",
  },
  uploadLabel: { fontSize: 12, fontWeight: "600", textAlign: "center" },

  // Save
  saveBtn: { marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 16,
    marginHorizontal: 24,
  },

  // Web camera modal
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B4F72",
    marginBottom: 16,
  },
  modalError: {
    color: "#E74C3C",
    marginVertical: 16,
    textAlign: "center",
    maxWidth: 280,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    alignSelf: "stretch",
  },
  modalHint: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 12,
    maxWidth: 360,
  },
  recIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E74C3C",
  },
  recText: { fontWeight: "600", color: "#E74C3C", fontSize: 13 },
});
