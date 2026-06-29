import React, { useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../store";
import { teacherService } from "../../services/teacherService";
import { fetchTeacherProfile } from "../../store/slices/teacherSlice";
import { extractErrorMessage } from "../../services/api";
import styles from "./styles/TakePhotoScreen.styles";

export default function TakePhotoScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const cameraRef = useRef<Camera | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("front" as CameraType);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) setCapturedUri(photo.uri);
  };

  const uploadPhoto = async () => {
    if (!capturedUri) return;
    setUploading(true);
    setError("");
    try {
      const fileName = `photo_${Date.now()}.jpg`;
      await teacherService.uploadPhoto(capturedUri, "image/jpeg", fileName);
      dispatch(fetchTeacherProfile());
      navigation.goBack();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#1B4F72" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSub}>
          We need camera access to take your profile photo.
        </Text>
        <Button
          mode="contained"
          onPress={requestPermission}
          buttonColor="#1B4F72"
          style={styles.permBtn}
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  if (capturedUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: capturedUri }}
          style={styles.preview}
          resizeMode="cover"
        />
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <View style={styles.previewActions}>
          <Button
            mode="outlined"
            onPress={() => setCapturedUri(null)}
            disabled={uploading}
            style={styles.previewBtn}
          >
            Retake
          </Button>
          <Button
            mode="contained"
            onPress={uploadPhoto}
            loading={uploading}
            disabled={uploading}
            buttonColor="#1B4F72"
            style={styles.previewBtn}
          >
            Use This Photo
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={facing}>
        <View style={styles.overlay}>
          <View style={styles.faceGuide} />
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setFacing(prevFacing => (prevFacing === "back" ? "front" : "back") as CameraType)}
            style={styles.flipBtn}
          >
            <Ionicons name="camera-reverse-outline" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureBtn}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.flipBtn}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Centre your face in the circle</Text>
      </Camera>
    </View>
  );
}
function useCameraPermissions(): [any, () => Promise<void>] {
  const [permission, setPermission] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const getPermission = async () => {
      const status = await Camera.getCameraPermissionsAsync();
      if (mounted) setPermission(status);
    };

    getPermission();

    return () => {
      mounted = false;
    };
  }, []);

  const requestPermission = async () => {
    const status = await Camera.requestCameraPermissionsAsync();
    setPermission(status);
  };

  return [permission, requestPermission];
}

