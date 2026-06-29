import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 40 },
  centeredContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { color: '#7F8C8D', fontSize: 16 },
  errorText: { color: '#E74C3C', fontSize: 16, textAlign: 'center' },
  jobHeader: {
    backgroundColor: '#1B4F72',
    padding: 24,
    paddingTop: 16,
  },
  jobTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  schoolName: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 12, fontWeight: '500' },
  metaRow: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  postedDate: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  expiresDate: { fontSize: 12, color: '#F39C12', marginTop: 2 },
  section: { margin: 16, marginBottom: 0, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 10 },
  bodyText: { fontSize: 14, color: '#555', lineHeight: 22 },
  screeningNote: { fontSize: 13, color: '#7F8C8D', marginBottom: 12, fontStyle: 'italic' },
  questionItem: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  questionNum: { fontSize: 13, fontWeight: 'bold', color: '#1B4F72', minWidth: 24 },
  questionText: { fontSize: 14, color: '#2C3E50', flex: 1, lineHeight: 20 },
  applyBtn: { margin: 24, borderRadius: 12 },
});

export default styles;
