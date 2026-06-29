import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F6FA' },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  form: { padding: 24, flex: 1 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  input: { marginBottom: 4 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 4 },
  button: { borderRadius: 12, marginBottom: 24 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  linkText: { fontWeight: '600' },
});

export default styles;
