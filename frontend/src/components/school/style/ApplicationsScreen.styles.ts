import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4, marginBottom: 12 },
  countsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', gap: 4, alignItems: 'center' },
  countNum: { fontSize: 14, fontWeight: 'bold' },
  countLabel: { fontSize: 11, fontWeight: '600' },
  list: { padding: 16 },
  card: { marginBottom: 10, borderRadius: 14, elevation: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  teacherName: { fontSize: 15, fontWeight: '700', color: '#2C3E50' },
  teacherEmail: { fontSize: 12, color: '#7F8C8D', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#BDC3C7' },
  answersNote: { fontSize: 12, color: '#7F8C8D', fontStyle: 'italic', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#BDC3C7' },
  emptySub: { fontSize: 14, color: '#D5D8DC', textAlign: 'center' },
});

export default styles;
