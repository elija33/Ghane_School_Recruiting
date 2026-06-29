import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 },
  list: { padding: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50', marginBottom: 2 },
  schoolName: { fontSize: 13, color: '#1B4F72', fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  statusText: { fontSize: 12, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, color: '#BDC3C7' },
  answersNote: { fontSize: 12, color: '#7F8C8D', marginTop: 6, fontStyle: 'italic' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#BDC3C7' },
  emptySub: { fontSize: 14, color: '#D5D8DC', textAlign: 'center' },
});

export default styles;
