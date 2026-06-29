import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  faceGuide: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  flipBtn: { padding: 12 },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  hint: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: 13, paddingBottom: 16 },
  preview: { flex: 1 },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  previewBtn: { flex: 1, borderRadius: 10 },
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  permissionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 12 },
  permissionSub: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  permBtn: { width: '100%', borderRadius: 10 },
  errorBox: { position: 'absolute', top: 56, left: 16, right: 16, backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12 },
  errorText: { color: '#C0392B', fontSize: 14 },
});

export default styles;
