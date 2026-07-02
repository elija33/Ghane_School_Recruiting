import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  avatarWrapper: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  form: { paddingHorizontal: 24, paddingTop: 8 },
  fieldLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: '#fff', marginBottom: 2 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: { color: '#C0392B', fontSize: 13, flex: 1 },
  loginBtn: { borderRadius: 6, marginTop: 24, marginBottom: 12 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  rememberText: { fontSize: 14, color: '#333' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  registerText: { fontSize: 14, color: '#555' },
  forgotText: { fontSize: 14, color: '#1B4F72', fontWeight: '700' },
});

export default styles;
