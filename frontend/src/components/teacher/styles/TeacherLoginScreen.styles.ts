import { StyleSheet } from 'react-native';

const PRIMARY = '#1B4F72';

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F8FA' },
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 80,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  form: { padding: 24, paddingTop: 32 },
  errorBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: { color: '#C0392B', fontSize: 13, flex: 1 },
  input: { marginBottom: 4, backgroundColor: '#fff' },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 28, marginTop: 4 },
  linkText: { color: PRIMARY, fontWeight: '600', fontSize: 13 },
  button: { borderRadius: 12, marginBottom: 24 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#D5D8DC' },
  dividerText: { color: '#95A5A6', fontSize: 12 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  registerText: { color: '#7F8C8D', fontSize: 13 },
});

export default styles;
