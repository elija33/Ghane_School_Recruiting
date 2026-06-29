import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  backButton: { padding: 16, paddingTop: 56 },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  icon: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  input: { width: '100%', marginBottom: 4 },
  button: { width: '100%', borderRadius: 12, marginTop: 8 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F6FA' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 24, marginBottom: 16 },
  successMessage: { fontSize: 15, color: '#7F8C8D', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
});

export default styles;
