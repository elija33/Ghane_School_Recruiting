import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  body: { flex: 1, padding: 24 },
  errorBox: { backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#E74C3C' },
  errorText: { color: '#C0392B', fontSize: 14 },
  dropZone: { borderRadius: 16, borderWidth: 2, borderColor: '#D5D8DC', borderStyle: 'dashed', marginBottom: 24 },
  centeredContent: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  dropText: { fontSize: 17, fontWeight: '600', color: '#7F8C8D' },
  dropSub: { fontSize: 13, color: '#BDC3C7' },
  fileName: { fontSize: 16, fontWeight: '600', color: '#1B4F72', textAlign: 'center' },
  fileSize: { fontSize: 13, color: '#7F8C8D' },
  progressContainer: { marginBottom: 24 },
  progressLabel: { fontSize: 14, color: '#7F8C8D', marginBottom: 8, textAlign: 'center' },
  progressBar: { height: 8, borderRadius: 4 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, borderRadius: 10 },
  successCard: { borderRadius: 16, borderWidth: 2, borderColor: '#27AE60' },
  successText: { fontSize: 16, fontWeight: '600', color: '#27AE60', textAlign: 'center' },
});

export default styles;
