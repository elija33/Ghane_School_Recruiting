import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },
  jobCard: { borderRadius: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#1B4F72' },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
  jobSchool: { fontSize: 14, color: '#1B4F72', marginTop: 4 },
  errorBox: { backgroundColor: '#FDEDEC', borderRadius: 8, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#E74C3C' },
  errorText: { color: '#C0392B', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
  questionCard: { borderRadius: 12, marginBottom: 12 },
  questionLabel: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 10 },
  required: { color: '#E74C3C' },
  answerInput: { marginBottom: 0 },
  submitBtn: { borderRadius: 12, marginTop: 8 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 12 },
  successMsg: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  doneBtn: { width: '100%', borderRadius: 12 },
  noQCard: { borderRadius: 12, marginBottom: 16 },
  noQContent: { alignItems: 'center', padding: 20, gap: 12 },
  noQText: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', lineHeight: 20 },
});

export default styles;
