import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: '#1B4F72',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  verificationCard: { margin: 16, borderRadius: 12 },
  verificationContent: { flexDirection: 'row', alignItems: 'center' },
  verificationTitle: { fontSize: 13, color: '#7F8C8D' },
  verificationStatus: { fontSize: 16, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 },
  statCard: { flex: 1, margin: 4, borderRadius: 10 },
  statContent: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  statValue: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#7F8C8D', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#2C3E50', marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  actionCard: { width: '30%', margin: '1.5%', borderRadius: 12 },
  actionContent: { alignItems: 'center', paddingVertical: 16 },
  actionLabel: { fontSize: 11, color: '#2C3E50', marginTop: 8, textAlign: 'center', fontWeight: '500' },
  appCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 12 },
  appJobTitle: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 4 },
  appSchool: { fontSize: 13, color: '#7F8C8D', marginBottom: 8 },
  statusChip: { alignSelf: 'flex-start' },
});

export default styles;
