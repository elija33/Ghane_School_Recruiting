import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import styles from '../styles/TeacherProfileScreen.styles';

interface Props {
  visible: boolean;
  title?: string;
  maxWidth?: number;
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export default function WebCameraModal({ visible, title = 'Take a Photo', maxWidth = 800, onCapture, onClose }: Props) {
  const videoRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setError(null);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      } catch (e: any) {
        setError(e?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser.'
          : (e?.message ?? 'Could not access camera.'));
      }
    })();

    return () => {
      cancelled = true;
      if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    };
  }, [visible]);

  const handleCapture = () => {
    const v = videoRef.current;
    if (!v) return;
    const scale = v.videoWidth > maxWidth ? maxWidth / v.videoWidth : 1;
    const w = Math.round(v.videoWidth * scale);
    const h = Math.round(v.videoHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    onCapture(canvas.toDataURL('image/jpeg', 0.5));
  };

  if (!visible) return null;

  return (
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>{title}</Text>
        {error ? (
          <Text style={styles.modalError}>{error}</Text>
        ) : (
          React.createElement('video', {
            ref: videoRef, autoPlay: true, playsInline: true, muted: true,
            style: { width: 320, height: 240, borderRadius: 8, background: '#000', objectFit: 'cover' },
          })
        )}
        <View style={styles.modalActions}>
          <Button mode="outlined" onPress={onClose} style={{ flex: 1 }}>Cancel</Button>
          <Button mode="contained" onPress={handleCapture} disabled={!!error} buttonColor="#1B4F72" icon="camera" style={{ flex: 1 }}>
            Capture
          </Button>
        </View>
      </View>
    </View>
  );
}
