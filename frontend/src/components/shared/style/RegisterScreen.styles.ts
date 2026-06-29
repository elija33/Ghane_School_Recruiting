import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F6FA' },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  form: { padding: 24 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  roleLabel: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 12 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleChip: { flex: 1, borderWidth: 2, borderColor: '#D5D8DC' },
  roleChipSelected: { borderColor: '#1B4F72', backgroundColor: '#EBF5FB' },
  roleChipTextSelected: { color: '#1B4F72', fontWeight: '600' },
  input: { marginBottom: 4 },
  button: { borderRadius: 12, marginTop: 8, marginBottom: 24 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  linkText: { fontWeight: '600' },
});

export default styles;
