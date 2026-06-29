import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  searchBar: { borderRadius: 10, height: 44 },
  list: { padding: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
  schoolName: { fontSize: 14, color: '#1B4F72', fontWeight: '500', marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: '#7F8C8D' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  posted: { fontSize: 12, color: '#BDC3C7' },
  questionChip: { backgroundColor: '#EBF5FB' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 17, color: '#BDC3C7', fontWeight: '600' },
  emptySub: { fontSize: 14, color: '#D5D8DC' },
  loadMoreBtn: { margin: 16 },
});

export default styles;
