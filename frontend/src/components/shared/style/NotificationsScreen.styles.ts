import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  headerBar: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  list: { padding: 16 },
  card: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#1B4F72' },
  cardContent: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrapper: { marginRight: 12, marginTop: 2 },
  textWrapper: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 4 },
  unreadTitle: { color: '#1B4F72' },
  message: { fontSize: 14, color: '#7F8C8D', marginBottom: 6, lineHeight: 20 },
  time: { fontSize: 12, color: '#BDC3C7' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B4F72',
    marginTop: 6,
    marginLeft: 8,
  },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#BDC3C7', marginTop: 16 },
});

export default styles;
