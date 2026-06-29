import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B4F72' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  footer: { backgroundColor: '#FFFFFF', paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center' },
  dots: { flexDirection: 'row', marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D5D8DC', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#1B4F72', width: 24 },
  button: { width: '100%', borderRadius: 12, marginBottom: 16 },
  skip: { color: '#7F8C8D', fontSize: 15 },
});

export default styles;
