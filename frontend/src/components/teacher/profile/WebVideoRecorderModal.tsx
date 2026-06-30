import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import styles from '../styles/TeacherProfileScreen.styles';

const MAX_VIDEO_MB = 100;
const MAX_RECORD_SECONDS = 60;
const MB = 1024 * 1024;

interface Props {
  visible: boolean;
  onSave: (blob: Blob, name: string) => void;
  onClose: () => void;
}

export default function WebVideoRecorderModal({ visible, onSave, onClose }: Props) {
  const liveRef = useRef<any>(null);
  const playbackRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<any>(null);
  const [stage, setStage] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setError(null); setStage('idle'); setRecordedBlob(null); setRecordedUrl(null); setElapsed(0);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 }, audio: true });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (liveRef.current) { liveRef.current.srcObject = stream; await liveRef.current.play(); }
      } catch (e: any) {
        setError(e?.name === 'NotAllowedError'
          ? 'Camera/microphone permission denied. Please allow access in your browser.'
          : (e?.message ?? 'Could not access camera or microphone.'));
      }
    })();

    return () => {
      cancelled = true;
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
      if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [visible]);

  useEffect(() => {
    return () => { if (recordedUrl) URL.revokeObjectURL(recordedUrl); };
  }, [recordedUrl]);

  const pickMimeType = () => {
    const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    return candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
      setRecordedBlob(blob); setRecordedUrl(URL.createObjectURL(blob)); setStage('recorded');
      if (tickRef.current) clearInterval(tickRef.current);
    };
    recorder.start();
    recorderRef.current = recorder;
    setStage('recording'); setElapsed(0);
    tickRef.current = setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (next >= MAX_RECORD_SECONDS && recorder.state === 'recording') recorder.stop();
        return next;
      });
    }, 1000);
  };

  const stopRecording = () => { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); };

  const reRecord = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null); setRecordedUrl(null); setStage('idle'); setElapsed(0);
  };

  const useThisVideo = () => {
    if (!recordedBlob) return;
    const sizeMB = recordedBlob.size / MB;
    if (sizeMB > MAX_VIDEO_MB) { setError(`Recording is ${sizeMB.toFixed(1)} MB. Please record a shorter clip (under ${MAX_VIDEO_MB} MB).`); return; }
    const ext = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
    onSave(recordedBlob, `intro_video.${ext}`);
  };

  if (!visible) return null;

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const videoStyle = { width: 400, height: 300, borderRadius: 8, background: '#000', objectFit: 'cover' as const };

  return (
    <View style={styles.modalBackdrop}>
      <View style={[styles.modalCard, { maxWidth: 480 }]}>
        <Text style={styles.modalTitle}>Record Intro Video</Text>
        {error ? (
          <Text style={styles.modalError}>{error}</Text>
        ) : stage === 'recorded' && recordedUrl ? (
          React.createElement('video', { ref: playbackRef, src: recordedUrl, controls: true, style: videoStyle })
        ) : (
          React.createElement('video', { ref: liveRef, autoPlay: true, playsInline: true, muted: true, style: videoStyle })
        )}
        {stage === 'recording' && (
          <View style={styles.recIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC {fmt(elapsed)} / {fmt(MAX_RECORD_SECONDS)}</Text>
          </View>
        )}
        {stage === 'idle' && !error && (
          <Text style={styles.modalHint}>Tip: Introduce yourself, your teaching experience, and why you'd be a great fit. Keep it under {MAX_RECORD_SECONDS}s.</Text>
        )}
        <View style={styles.modalActions}>
          {stage === 'idle' && (
            <>
              <Button mode="outlined" onPress={onClose} style={{ flex: 1 }}>Cancel</Button>
              <Button mode="contained" onPress={startRecording} disabled={!!error} buttonColor="#E74C3C" icon="record-rec" style={{ flex: 1 }}>Start Recording</Button>
            </>
          )}
          {stage === 'recording' && (
            <Button mode="contained" onPress={stopRecording} buttonColor="#1B4F72" icon="stop" style={{ flex: 1 }}>Stop Recording</Button>
          )}
          {stage === 'recorded' && (
            <>
              <Button mode="outlined" onPress={reRecord} style={{ flex: 1 }}>Re-record</Button>
              <Button mode="contained" onPress={useThisVideo} buttonColor="#1B4F72" icon="check" style={{ flex: 1 }}>Use This Video</Button>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
