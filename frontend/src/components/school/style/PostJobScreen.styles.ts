import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 16, paddingBottom: 40 },

  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 10 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D5D8DC', backgroundColor: '#F8F9FA',
  },
  chipSelected: { borderColor: '#1B4F72', backgroundColor: '#EBF5FB' },
  chipText: { fontSize: 13, color: '#626567' },
  chipTextSelected: { color: '#1B4F72', fontWeight: '600' },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  section: { borderRadius: 14, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
  input: { marginBottom: 0 },
  qHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qNote: { fontSize: 13, color: '#7F8C8D', marginBottom: 12, fontStyle: 'italic' },
  questionCard: { borderRadius: 10, marginBottom: 10, backgroundColor: '#F8F9FA' },
  qTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  qNum: { fontSize: 13, fontWeight: '700', color: '#1B4F72' },
  qInput: { marginBottom: 0 },
  qRequiredRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  qRequiredLabel: { fontSize: 14, color: '#2C3E50' },
  noQPlaceholder: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  noQText: { fontSize: 14, color: '#BDC3C7', fontWeight: '500' },
  noQSub: { fontSize: 13, color: '#D5D8DC' },
  submitBtn: { borderRadius: 12, marginTop: 8 },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F5F6FA',
    gap: 12,
  },
  successTitle: { fontSize: 26, fontWeight: 'bold', color: '#2C3E50' },
  successMsg: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', lineHeight: 22 },
  successBtn: { width: '100%', borderRadius: 12 },
});

export default styles;
