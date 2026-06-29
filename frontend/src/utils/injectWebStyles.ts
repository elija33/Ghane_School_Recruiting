if (typeof document !== 'undefined') {
  const el = document.getElementById('__rn_css_injection__');
  if (!el) {
    const style = document.createElement('style');
    style.id = '__rn_css_injection__';
    style.textContent = `.container {
  flex: 1;
  background-color: #f5f6fa;
}
.content {
  padding-bottom: 32px;
}
.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 28px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.greeting {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.title {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  margin-top: 2px;
}
.logoutBtn {
  padding: 8px;
}
.alertBanner {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #fdedec;
  padding: 14px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
  border-radius: 10px;
  border: 1px solid #e74c3c;
  gap: 8px;
}
.alertText {
  flex: 1;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 600;
}
.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 20px;
  margin-bottom: 12px;
}
.loadingPlaceholder {
  display: flex;
  align-items: center;
  padding: 32px;
}
.loadingText {
  color: #bdc3c7;
  font-size: 15px;
}
.statsGrid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 12px;
  padding-right: 12px;
  gap: 8px;
}
.statCard {
  width: 47%;
  border-radius: 14px;
}
.statContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
  padding-bottom: 18px;
  gap: 6px;
}
.statValue {
  font-size: 26px;
  font-weight: bold;
}
.statLabel {
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
}
.actionsRow {
  display: flex;
  flex-direction: row;
  padding-left: 16px;
  padding-right: 16px;
  gap: 12px;
}
.actionCard {
  flex: 1;
  background-color: #ffffff;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.actionIcon {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.actionLabel {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.container {
  flex: 1;
  background-color: #f5f6fa;
}
.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  gap: 12px;
}
.headerTitle {
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
}
.headerStats {
  display: flex;
  flex-direction: row;
  gap: 24px;
}
.headerStat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.headerStatNum {
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
}
.headerStatLabel {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}
.searchBar {
  border-radius: 10px;
  height: 44px;
}
.errorBox {
  background-color: #fdedec;
  padding: 12px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 12px;
  border-radius: 8px;
}
.errorText {
  color: #c0392b;
  font-size: 13px;
}
.list {
  padding: 16px;
  padding-bottom: 40px;
}
.card {
  margin-bottom: 12px;
  border-radius: 14px;
}
.cardHeader {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #ebf5fb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  flex: 1;
}
.schoolName {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}
.locationRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}
.locationText {
  font-size: 13px;
  color: #7f8c8d;
}
.contactText {
  font-size: 12px;
  color: #7f8c8d;
}
.tierText {
  font-size: 11px;
  color: #1b4f72;
  font-weight: 600;
}
.subRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}
.subText {
  font-size: 12px;
  color: #7f8c8d;
}
.joinedText {
  font-size: 12px;
  color: #bdc3c7;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  gap: 8px;
}
.emptyText {
  font-size: 16px;
  color: #bdc3c7;
  font-weight: 500;
}
.loadMore {
  margin: 16px;
}

.container {
  flex: 1;
  background-color: #f5f6fa;
}
.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 12px;
  padding-left: 16px;
  padding-right: 16px;
  gap: 8px;
}
.headerTitle {
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 4px;
}
.searchBar {
  border-radius: 10px;
  height: 44px;
}
.filtersRow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
}
.filterChip {
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.15);
}
.filterChipActive {
  background-color: #ffffff;
}
.filterText {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
}
.filterTextActive {
  color: #1b4f72;
  font-weight: 700;
}
.errorBox {
  background-color: #fdedec;
  padding: 12px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 12px;
  border-radius: 8px;
}
.errorText {
  color: #c0392b;
  font-size: 13px;
}
.list {
  padding: 16px;
  padding-bottom: 40px;
}
.card {
  margin-bottom: 12px;
  border-radius: 14px;
}
.cardHeader {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ebf5fb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  flex: 1;
}
.name {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
}
.email {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 1px;
}
.subject {
  font-size: 12px;
  color: #1b4f72;
  margin-top: 2px;
  font-weight: 500;
}
.docsRow {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 10px;
}
.docBadge {
  background-color: #f8f9fa;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 6px;
}
.docText {
  font-size: 11px;
  color: #7f8c8d;
}
.actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.actionBtn {
  flex: 1;
  border-radius: 8px;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  gap: 8px;
}
.emptyText {
  font-size: 16px;
  color: #bdc3c7;
  font-weight: 500;
}
.loadMore {
  margin: 16px;
}

.container {
  flex: 1;
  background-color: #f5f6fa;
}
.content {
  padding: 16px;
  padding-bottom: 40px;
}
.center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.loadingText {
  color: #7f8c8d;
  font-size: 16px;
}
.errorBox {
  background-color: #fdedec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left: 4px solid #e74c3c;
}
.errorText {
  color: #c0392b;
  font-size: 14px;
}
.section {
  border-radius: 14px;
  margin-bottom: 16px;
}
.teacherRow {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: #ebf5fb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.teacherName {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
}
.teacherEmail {
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 2px;
}
.teacherSubject {
  font-size: 13px;
  color: #1b4f72;
  margin-top: 2px;
  font-weight: 500;
}
.verBadge {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 12px;
}
.verBadgeText {
  font-size: 12px;
  font-weight: 700;
}
.docsRow {
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
}
.docItem {
  font-size: 13px;
  color: #2c3e50;
}
.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}
.sectionNote {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 12px;
  font-style: italic;
}
.triggerRow {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.triggerBtn {
  flex: 1;
  border-radius: 10px;
}
.noVerifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 8px;
}
.noVerText {
  font-size: 14px;
  color: #bdc3c7;
}
.divider {
  margin-top: 12px;
  margin-bottom: 12px;
}
.verRow {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}
.verType {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}
.verMeta {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}
.statusDot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
.verStatus {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}
.verDate {
  font-size: 12px;
  color: #bdc3c7;
}
.verNotes {
  font-size: 12px;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 4px;
}
.resultBadge {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 10px;
}
.resultText {
  font-size: 11px;
  font-weight: 700;
}
.manualOverride {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
  margin-top: 8px;
  gap: 8px;
}
.overrideLabel {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
}
.resultOptions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.notesInput {
  margin-top: 4px;
}
.submitOverrideBtn {
  border-radius: 8px;
  margin-top: 4px;
}
.adminActions {
  gap: 10px;
}
.adminBtn {
  border-radius: 10px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.content {
  padding: 16px;
  padding-bottom: 40px;
}

.center {
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.errorText {
  color: #E74C3C;
  font-size: 15px;
  text-align: center;
}

.section {
  border-radius: 14px;
  margin-bottom: 16px;
  elevation: 2;
}

.jobTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 12px;
}

.teacherRow {
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #EBF5FB;
  align-items: center;
  justify-content: center;
}

.teacherName {
  font-size: 15px;
  font-weight: 700;
  color: #2C3E50;
}

.teacherEmail {
  font-size: 13px;
  color: #7F8C8D;
  margin-top: 2px;
}

.dateRow {
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.dateText {
  font-size: 12px;
  color: #BDC3C7;
}

.sectionTitle {
  font-size: 15px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 12px;
}

.errorBox {
  background-color: #FDEDEC;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
  border-left-width: 3px;
  border-left-color: #E74C3C;
}

.errorMsg {
  color: #C0392B;
  font-size: 13px;
}

.statusRow {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.currentStatus {
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 14px;
}

.currentStatusText {
  font-size: 14px;
  font-weight: 700;
}

.statusNote {
  font-size: 12px;
  color: #7F8C8D;
  font-style: italic;
  margin-top: 4px;
}

.divider {
  margin-top: 12px;
  margin-bottom: 12px;
}

.questionText {
  font-size: 14px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 8px;
}

.answerBox {
  background-color: #F8F9FA;
  border-radius: 8px;
  padding: 12px;
  border-left-width: 3px;
  border-left-color: #1B4F72;
}

.answerText {
  font-size: 14px;
  color: #555;
  line-height: 20px;
}

.profileBtn {
  border-radius: 12px;
  margin-top: 4px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.header {
  background-color: #1B4F72;
  padding-top: 56px;
  padding-bottom: 20px;
  padding-left: 16px;
  padding-right: 16px;
}

.headerTitle {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
}

.headerSub {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 12px;
}

.countsRow {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}

.countBadge {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 12px;
  flex-direction: row;
  gap: 4px;
  align-items: center;
}

.countNum {
  font-size: 14px;
  font-weight: bold;
}

.countLabel {
  font-size: 11px;
  font-weight: 600;
}

.list {
  padding: 16px;
}

.card {
  margin-bottom: 10px;
  border-radius: 14px;
  elevation: 2;
}

.cardRow {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.avatarCircle {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #EBF5FB;
  align-items: center;
  justify-content: center;
}

.info {
  flex: 1;
}

.teacherName {
  font-size: 15px;
  font-weight: 700;
  color: #2C3E50;
}

.teacherEmail {
  font-size: 12px;
  color: #7F8C8D;
  margin-bottom: 4px;
}

.metaRow {
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.metaText {
  font-size: 12px;
  color: #BDC3C7;
}

.answersNote {
  font-size: 12px;
  color: #7F8C8D;
  font-style: italic;
  margin-top: 2px;
}

.empty {
  align-items: center;
  padding-top: 80px;
  gap: 8px;
}

.emptyTitle {
  font-size: 18px;
  font-weight: 600;
  color: #BDC3C7;
}

.emptySub {
  font-size: 14px;
  color: #D5D8DC;
  text-align: center;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.header {
  background-color: #1B4F72;
  padding-top: 56px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  gap: 8px;
}

.headerTitle {
  color: #FFFFFF;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 4px;
}

.searchBar {
  border-radius: 10px;
  height: 44px;
}

.list {
  padding: 16px;
}

.card {
  margin-bottom: 10px;
  border-radius: 14px;
  elevation: 2;
}

.cardContent {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.avatarContainer {
  position: relative;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #F0F3F4;
  align-items: center;
  justify-content: center;
}

.verDot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  border-width: 2px;
  border-color: #FFFFFF;
}

.info {
  flex: 1;
}

.nameRow {
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.name {
  font-size: 15px;
  font-weight: 700;
  color: #2C3E50;
  flex: 1;
}

.subjects {
  font-size: 13px;
  color: #1B4F72;
  font-weight: 500;
  margin-bottom: 4px;
}

.locationRow {
  flex-direction: row;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
}

.locationText {
  font-size: 12px;
  color: #BDC3C7;
}

.badgeRow {
  flex-direction: row;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  background-color: #EBF5FB;
}

.empty {
  align-items: center;
  padding-top: 80px;
  gap: 8px;
}

.emptyText {
  font-size: 17px;
  color: #BDC3C7;
  font-weight: 600;
}

.emptySub {
  font-size: 14px;
  color: #D5D8DC;
}

.loadMore {
  margin: 16px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.header {
  background-color: #1B4F72;
  padding-top: 56px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
}

.headerTitle {
  color: #FFFFFF;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}

.filters {
  flex-direction: row;
  gap: 8px;
}

.filterChip {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.15);
}

.filterChipActive {
  background-color: #FFFFFF;
}

.filterText {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 500;
}

.filterTextActive {
  color: #1B4F72;
  font-weight: 700;
}

.list {
  padding: 16px;
  padding-bottom: 80px;
}

.card {
  margin-bottom: 12px;
  border-radius: 14px;
  elevation: 2;
}

.cardHeader {
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
}

.jobTitle {
  font-size: 15px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 2px;
}

.jobMeta {
  font-size: 13px;
  color: #7F8C8D;
}

.statusChip {
  margin-top: 2px;
}

.metaRow {
  flex-direction: row;
  gap: 16px;
  margin-bottom: 8px;
}

.metaItem {
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.metaText {
  font-size: 12px;
  color: #BDC3C7;
}

.questionsNote {
  font-size: 12px;
  color: #7F8C8D;
  font-style: italic;
  margin-bottom: 10px;
}

.actions {
  flex-direction: row;
  gap: 10px;
  margin-top: 4px;
}

.actionBtn {
  border-radius: 8px;
  flex: 1;
}

.empty {
  align-items: center;
  padding-top: 80px;
  gap: 8px;
}

.emptyTitle {
  font-size: 18px;
  font-weight: 600;
  color: #BDC3C7;
}

.emptySub {
  font-size: 14px;
  color: #D5D8DC;
  text-align: center;
}

.fab {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #1B4F72;
  align-items: center;
  justify-content: center;
  elevation: 6;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.3);
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.content {
  padding: 16px;
  padding-bottom: 40px;
}

.errorBox {
  background-color: #FDEDEC;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: #E74C3C;
}

.errorText {
  color: #C0392B;
  font-size: 14px;
}

.section {
  border-radius: 14px;
  margin-bottom: 16px;
  elevation: 2;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 12px;
}

.input {
  margin-bottom: 0;
}

.qHeader {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.qNote {
  font-size: 13px;
  color: #7F8C8D;
  margin-bottom: 12px;
  font-style: italic;
}

.questionCard {
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: #F8F9FA;
}

.qTopRow {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.qNum {
  font-size: 13px;
  font-weight: 700;
  color: #1B4F72;
}

.qInput {
  margin-bottom: 0;
}

.qRequiredRow {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.qRequiredLabel {
  font-size: 14px;
  color: #2C3E50;
}

.noQPlaceholder {
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 6px;
}

.noQText {
  font-size: 14px;
  color: #BDC3C7;
  font-weight: 500;
}

.noQSub {
  font-size: 13px;
  color: #D5D8DC;
}

.submitBtn {
  border-radius: 12px;
  margin-top: 8px;
}

.successContainer {
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #F5F6FA;
  gap: 12px;
}

.successTitle {
  font-size: 26px;
  font-weight: bold;
  color: #2C3E50;
}

.successMsg {
  font-size: 15px;
  color: #7F8C8D;
  text-align: center;
  line-height: 22px;
}

.successBtn {
  width: 100%;
  border-radius: 12px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.content {
  padding-bottom: 32px;
}

.header {
  background-color: #1B4F72;
  padding-top: 56px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  flex-direction: row;
  align-items: center;
}

.greeting {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
}

.schoolName {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
  margin-top: 2px;
}

.logoutBtn {
  padding: 8px;
}

.subBanner {
  flex-direction: row;
  align-items: center;
  background-color: #FEF9E7;
  padding: 14px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #F39C12;
  gap: 8px;
}

.subBannerText {
  flex: 1;
  font-size: 13px;
  color: #E67E22;
  font-weight: 500;
}

.statsGrid {
  flex-direction: row;
  flex-wrap: wrap;
  padding: 12px;
  gap: 8px;
}

.statCard {
  width: 47%;
  border-radius: 12px;
  elevation: 2;
}

.statContent {
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  gap: 6px;
}

.statValue {
  font-size: 20px;
  font-weight: bold;
}

.statLabel {
  font-size: 12px;
  color: #7F8C8D;
  text-align: center;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2C3E50;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 8px;
  margin-bottom: 12px;
}

.actionsGrid {
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 12px;
  padding-right: 12px;
  gap: 12px;
}

.actionCard {
  width: 46%;
  background-color: #FFFFFF;
  border-radius: 14px;
  padding: 16px;
  align-items: center;
  gap: 8px;
  elevation: 2;
}

.actionIcon {
  width: 54px;
  height: 54px;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
}

.actionLabel {
  font-size: 13px;
  font-weight: 600;
  color: #2C3E50;
  text-align: center;
}

.jobCard {
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
}

.jobContent {
  flex-direction: row;
  align-items: center;
}

.jobTitle {
  font-size: 14px;
  font-weight: 600;
  color: #2C3E50;
}

.jobMeta {
  font-size: 12px;
  color: #7F8C8D;
  margin-top: 2px;
}

.statusDot {
  width: 10px;
  height: 10px;
  border-radius: 5px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.content {
  padding: 16px;
  padding-bottom: 40px;
}

.headerCard {
  border-radius: 16px;
  margin-bottom: 16px;
  elevation: 3;
}

.headerContent {
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
}

.avatarCircle {
  width: 88px;
  height: 88px;
  border-radius: 44px;
  background-color: #1B4F72;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.schoolNameText {
  font-size: 20px;
  font-weight: bold;
  color: #2C3E50;
  margin-bottom: 4px;
}

.locationText {
  font-size: 14px;
  color: #7F8C8D;
  margin-bottom: 8px;
}

.tierBadge {
  background-color: rgba(27, 79, 114, 0.094);
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 12px;
  margin-bottom: 4px;
}

.tierText {
  color: #1B4F72;
  font-weight: 600;
  font-size: 13px;
}

.expiryText {
  font-size: 12px;
  color: #7F8C8D;
  margin-top: 2px;
}

.errorBox {
  background-color: #FDEDEC;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: #E74C3C;
}

.errorText {
  color: #C0392B;
  font-size: 14px;
}

.successBox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: #EAFAF1;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: #27AE60;
}

.successText {
  color: #1E8449;
  font-size: 14px;
}

.formCard {
  border-radius: 16px;
  elevation: 2;
}

.formContent {
  padding-top: 8px;
  padding-bottom: 8px;
}

.formHeader {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2C3E50;
}

.input {
  margin-bottom: 12px;
}

.actionRow {
  flex-direction: row;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  border-radius: 10px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.content {
  padding: 16px;
  padding-bottom: 40px;
}

.statusCard {
  border-radius: 16px;
  margin-bottom: 16px;
  elevation: 3;
}

.statusContent {
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 10px;
}

.statusTitle {
  font-size: 20px;
  font-weight: bold;
  color: #2C3E50;
}

.planChip {
  background-color: #EBF5FB;
}

.expiryText {
  font-size: 13px;
  color: #7F8C8D;
}

.statusSub {
  font-size: 14px;
  color: #7F8C8D;
  text-align: center;
  line-height: 20px;
}

.errorBox {
  background-color: #FDEDEC;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: #E74C3C;
}

.errorText {
  color: #C0392B;
  font-size: 14px;
}

.verifyCard {
  border-radius: 14px;
  margin-bottom: 16px;
  border-width: 2px;
  border-color: #F39C12;
}

.verifyContent {
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.verifyTitle {
  font-size: 17px;
  font-weight: bold;
  color: #2C3E50;
}

.verifySub {
  font-size: 14px;
  color: #7F8C8D;
  text-align: center;
  line-height: 20px;
}

.verifyBtn {
  width: 100%;
  border-radius: 10px;
}

.sectionTitle {
  font-size: 17px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 12px;
}

.planCard {
  border-radius: 16px;
  margin-bottom: 16px;
  elevation: 2;
}

.recommendedCard {
  border-width: 2px;
  border-color: #1B4F72;
}

.recommendedBadge {
  background-color: #1B4F72;
  align-self: flex-start;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: -1px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.recommendedText {
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
}

.planContent {
  padding-top: 16px;
}

.planHeader {
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.planName {
  font-size: 18px;
  font-weight: 700;
  color: #2C3E50;
}

.priceRow {
  flex-direction: row;
  align-items: baseline;
  gap: 2px;
}

.planPrice {
  font-size: 22px;
  font-weight: bold;
  color: #1B4F72;
}

.planPeriod {
  font-size: 13px;
  color: #7F8C8D;
}

.divider {
  margin-bottom: 12px;
}

.featureRow {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.featureText {
  font-size: 14px;
  color: #555;
  flex: 1;
}

.planBtn {
  border-radius: 10px;
  margin-top: 12px;
}

.disclaimer {
  font-size: 12px;
  color: #BDC3C7;
  text-align: center;
  line-height: 18px;
  margin-top: 8px;
}

.container {
  flex: 1;
  background-color: #F5F6FA;
}

.content {
  padding-bottom: 40px;
}

.center {
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.loadingText {
  color: #7F8C8D;
  font-size: 16px;
}

.errorText {
  color: #E74C3C;
  font-size: 15px;
  text-align: center;
  margin-top: 12px;
}

.profileHeader {
  background-color: #1B4F72;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 32px;
  padding-left: 24px;
  padding-right: 24px;
  gap: 8px;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.name {
  font-size: 22px;
  font-weight: bold;
  color: #FFFFFF;
}

.subject {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
}

.verBadge {
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 14px;
}

.verLabel {
  font-size: 13px;
  font-weight: 600;
}

.statsRow {
  flex-direction: row;
  padding: 12px;
  gap: 8px;
}

.statCard {
  flex: 1;
  border-radius: 12px;
  elevation: 2;
}

.statContent {
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  gap: 4px;
}

.statValue {
  font-size: 13px;
  font-weight: 700;
  color: #2C3E50;
  text-align: center;
}

.statLabel {
  font-size: 11px;
  color: #7F8C8D;
}

.section {
  margin: 16px;
  margin-bottom: 0;
  border-radius: 14px;
  elevation: 2;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 12px;
}

.bodyText {
  font-size: 14px;
  color: #555;
  line-height: 22px;
}

.detailRow {
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.detailLabel {
  font-size: 12px;
  color: #7F8C8D;
  margin-bottom: 2px;
}

.detailValue {
  font-size: 14px;
  color: #2C3E50;
  font-weight: 500;
}

.docsRow {
  flex-direction: row;
  gap: 8px;
}

.docBtn {
  flex: 1;
  border-radius: 8px;
}

.container {
  flex: 1;
  background-color: #f5f6fa;
}
.backButton {
  padding: 16px;
  padding-top: 56px;
}
.content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon {
  margin-bottom: 24px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 12px;
}
.subtitle {
  font-size: 15px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 32px;
  line-height: 22px;
}
.input {
  width: 100%;
  margin-bottom: 4px;
}
.button {
  width: 100%;
  border-radius: 12px;
  margin-top: 8px;
}
.successContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f5f6fa;
}
.successTitle {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 24px;
  margin-bottom: 16px;
}
.successMessage {
  font-size: 15px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 32px;
  line-height: 22px;
}

.container {
  flex-grow: 1;
  background-color: #f5f6fa;
}
.header {
  padding-top: 80px;
  padding-bottom: 40px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logoText {
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
}
.title {
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
}
.form {
  padding: 24px;
  flex: 1;
}
.errorBox {
  background-color: #fdedec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #e74c3c;
}
.errorText {
  color: #c0392b;
  font-size: 14px;
}
.input {
  margin-bottom: 4px;
}
.forgotLink {
  align-self: flex-end;
  margin-bottom: 24px;
  margin-top: 4px;
}
.button {
  border-radius: 12px;
  margin-bottom: 24px;
}
.registerRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 8px;
}
.linkText {
  font-weight: 600;
}

.container {
  flex: 1;
  background-color: #f5f6fa;
}
.headerBar {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
}
.headerTitle {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}
.list {
  padding: 16px;
}
.card {
  margin-bottom: 12px;
  border-radius: 12px;
}
.unreadCard {
  border-left: 4px solid #1b4f72;
}
.cardContent {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.iconWrapper {
  margin-right: 12px;
  margin-top: 2px;
}
.textWrapper {
  flex: 1;
}
.notifTitle {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}
.unreadTitle {
  color: #1b4f72;
}
.message {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 6px;
  line-height: 20px;
}
.time {
  font-size: 12px;
  color: #bdc3c7;
}
.unreadDot {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #1b4f72;
  margin-top: 6px;
  margin-left: 8px;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
}
.emptyText {
  font-size: 16px;
  color: #bdc3c7;
  margin-top: 16px;
}

.container {
  flex: 1;
  background-color: #1b4f72;
}
.slide {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.iconContainer {
  width: 180px;
  height: 180px;
  border-radius: 90px;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}
.title {
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 16px;
}
.description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  line-height: 24px;
}
.footer {
  background-color: #ffffff;
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dots {
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #d5d8dc;
  margin-left: 4px;
  margin-right: 4px;
}
.dotActive {
  background-color: #1b4f72;
  width: 24px;
}
.button {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 16px;
}
.skip {
  color: #7f8c8d;
  font-size: 15px;
}

.container {
  flex-grow: 1;
  background-color: #f5f6fa;
}
.header {
  padding-top: 80px;
  padding-bottom: 40px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}
.form {
  padding: 24px;
}
.errorBox {
  background-color: #fdedec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #e74c3c;
}
.errorText {
  color: #c0392b;
  font-size: 14px;
}
.input {
  margin-bottom: 4px;
}
.button {
  border-radius: 12px;
  margin-top: 8px;
  margin-bottom: 24px;
}
.loginRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.linkText {
  font-weight: 600;
}

.container {
  flex: 1;
  background-color: #1b4f72;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logoContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logoCircle {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 3px solid rgba(255, 255, 255, 0.5);
}
.logoText {
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
}
.appName {
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}
.tagline {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
}

/* Converted from React Native StyleSheet */
.container {
  min-height: 100vh;
  background-color: #f5f6fa;
}
.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
}
.headerTitle {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
}
.headerSub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  margin-top: 4px;
}
.list {
  padding: 16px;
}
.card {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
.cardHeader {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
}
.jobTitle {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2px;
}
.schoolName {
  font-size: 13px;
  color: #1b4f72;
  font-weight: 500;
}
.statusBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 16px;
}
.statusText {
  font-size: 12px;
  font-weight: 600;
}
.statusBadge.status-SUBMITTED { background-color: #3498DB18; }
.statusText.status-SUBMITTED { color: #3498DB; }
.statusBadge.status-UNDER_REVIEW { background-color: #F39C1218; }
.statusText.status-UNDER_REVIEW { color: #F39C12; }
.statusBadge.status-SHORTLISTED { background-color: #8E44AD18; }
.statusText.status-SHORTLISTED { color: #8E44AD; }
.statusBadge.status-INTERVIEW_REQUESTED { background-color: #1ABC9C18; }
.statusText.status-INTERVIEW_REQUESTED { color: #1ABC9C; }
.statusBadge.status-REJECTED { background-color: #E74C3C18; }
.statusText.status-REJECTED { color: #E74C3C; }
.statusBadge.status-HIRED { background-color: #27AE6018; }
.statusText.status-HIRED { color: #27AE60; }

.flex1 { flex: 1; }
.dateRow {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dateText {
  font-size: 12px;
  color: #bdc3c7;
}
.answersNote {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 6px;
  font-style: italic;
}
.empty {
  display: flex;
  align-items: center;
  padding-top: 80px;
  gap: 12px;
  flex-direction: column;
}
.emptyTitle {
  font-size: 18px;
  font-weight: 600;
  color: #bdc3c7;
}
.emptySub {
  font-size: 14px;
  color: #d5d8dc;
  text-align: center;
}

.container {
  min-height: 100vh;
  background-color: #f5f6fa;
}
.content {
  padding: 16px 16px 40px 16px;
}
.jobCard {
  border-radius: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #1b4f72;
}
.jobTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
}
.jobSchool {
  font-size: 14px;
  color: #1b4f72;
  margin-top: 4px;
}
.errorBox {
  background-color: #fdedec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #e74c3c;
}
.errorText {
  color: #c0392b;
  font-size: 14px;
}
.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}
.questionCard {
  border-radius: 12px;
  margin-bottom: 12px;
}
.questionLabel {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}
.required {
  color: #e74c3c;
}
.successContainer {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f5f6fa;
}
.successTitle {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 12px;
}
.successMsg {
  font-size: 15px;
  color: #7f8c8d;
  text-align: center;
  line-height: 22px;
  margin-bottom: 32px;
}
.noQCard {
  border-radius: 12px;
  margin-bottom: 16px;
}
.noQContent {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 12px;
}
.noQText {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  line-height: 20px;
}

.container {
  min-height: 100vh;
  background-color: #f5f6fa;
}
.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  gap: 8px;
}
.headerTitle {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}
.searchBar {
  border-radius: 10px;
  height: 44px;
}
.list {
  padding: 16px;
}
.card {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
.jobTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}
.schoolName {
  font-size: 14px;
  color: #1b4f72;
  font-weight: 500;
  margin-bottom: 10px;
}
.metaRow {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 10px;
}
.metaItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}
.metaText {
  font-size: 13px;
  color: #7f8c8d;
}
.footerRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.posted {
  font-size: 12px;
  color: #bdc3c7;
}
.questionChip {
  background-color: #ebf5fb;
}
.empty {
  align-items: center;
  padding-top: 80px;
  gap: 8px;
  display: flex;
  flex-direction: column;
}
.emptyText {
  font-size: 17px;
  color: #bdc3c7;
  font-weight: 600;
}
.emptySub {
  font-size: 14px;
  color: #d5d8dc;
}
.loadMoreBtn {
  margin: 16px;
}

.container {
  min-height: 100vh;
  background-color: #f5f6fa;
}
.content {
  padding-bottom: 40px;
}
.centeredContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.loadingText {
  color: #7f8c8d;
  font-size: 16px;
}
.errorText {
  color: #e74c3c;
  font-size: 16px;
  text-align: center;
}
.jobHeader {
  background-color: #1b4f72;
  padding: 24px 24px 16px 24px;
}
.jobTitle {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}
.schoolName {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 12px;
  font-weight: 500;
}
.metaRow {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-bottom: 12px;
}
.metaItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}
.metaText {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}
.postedDate {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
.expiresDate {
  font-size: 12px;
  color: #f39c12;
  margin-top: 2px;
}
.section {
  margin: 16px;
  margin-bottom: 0;
  border-radius: 12px;
}
.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}
.bodyText {
  font-size: 14px;
  color: #555;
  line-height: 22px;
}
.screeningNote {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 12px;
  font-style: italic;
}
.questionItem {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  gap: 8px;
}
.questionNum {
  font-size: 13px;
  font-weight: 700;
  color: #1b4f72;
  min-width: 24px;
}
.questionText {
  font-size: 14px;
  color: #2c3e50;
  flex: 1;
  line-height: 20px;
}
.applyBtn {
  margin: 24px;
  border-radius: 12px;
}

.container {
  flex: 1;
  background-color: #000;
}
.camera {
  flex: 1;
}
.timerRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  margin-top: 56px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  gap: 6px;
}
.recDot {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #e74c3c;
}
.timer {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
}
.maxLabel {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}
.progressBar {
  height: 4px;
  margin: 16px;
  border-radius: 2px;
}
.tipsBox {
  background-color: rgba(0, 0, 0, 0.6);
  margin: 20px;
  padding: 16px;
  border-radius: 12px;
}
.tipsTitle {
  color: #f39c12;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
}
.tip {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 22px;
}
.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 40px;
}
.sideBtn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recordBtn {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 4px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stopBtn {
  border-color: #e74c3c;
}
.recordIcon {
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: #e74c3c;
}
.stopIcon {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: #e74c3c;
}
.postRecord {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 24px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  gap: 12px;
}
.recordedLabel {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}
.errorText {
  color: #e74c3c;
  text-align: center;
}
.uploadingLabel {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
}
.uploadBar {
  height: 6px;
  border-radius: 3px;
}
.postActions {
  display: flex;
  flex-direction: row;
  gap: 12px;
}
.permissionContainer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f5f6fa;
}
.permTitle {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 12px;
}
.permSub {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 32px;
  line-height: 22px;
}
.permBtn {
  width: 100%;
  border-radius: 10px;
}

.container {
  min-height: 100vh;
  background-color: #000;
}
.camera {
  flex: 1;
}
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}
.faceGuide {
  width: 220px;
  height: 220px;
  border-radius: 110px;
  border-width: 3px;
  border-color: rgba(255, 255, 255, 0.6);
  border-style: solid;
}
.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
}
.flipBtn {
  padding: 12px;
}
.captureBtn {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ffffff;
}
.captureInner {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #ffffff;
}
.hint {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 13px;
  padding-bottom: 16px;
}
.preview {
  width: 100%;
  height: auto;
}
.previewActions {
  position: absolute;
  bottom: 40px;
  left: 24px;
  right: 24px;
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.previewBtn {
  flex: 1;
  border-radius: 10px;
}
.permissionContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f5f6fa;
}
.permissionTitle {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 12px;
}
.permissionSub {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 32px;
  line-height: 22px;
}
.permBtn {
  width: 100%;
  border-radius: 10px;
}
.errorBox {
  position: absolute;
  top: 56px;
  left: 16px;
  right: 16px;
  background-color: #fdedec;
  border-radius: 8px;
  padding: 12px;
}
.errorText {
  color: #c0392b;
  font-size: 14px;
}

.container {
  min-height: 100vh;
  background-color: #f5f6fa;
}
.content {
  padding-bottom: 32px;
}
.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.greeting {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
}
.name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}
.verificationCard {
  margin: 16px;
  border-radius: 12px;
}
.verificationContent {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.verificationTitle {
  font-size: 13px;
  color: #7f8c8d;
}
.verificationStatus {
  font-size: 16px;
  font-weight: 700;
}
.statsRow {
  display: flex;
  flex-direction: row;
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 8px;
}
.statCard {
  flex: 1;
  margin: 4px;
  border-radius: 10px;
}
.statContent {
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.statValue {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
}
.statLabel {
  font-size: 11px;
  color: #7f8c8d;
  margin-top: 2px;
}
.sectionTitle {
  font-size: 17px;
  font-weight: 700;
  color: #2c3e50;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 20px;
  margin-bottom: 12px;
}
.actionsGrid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 12px;
  padding-right: 12px;
}
.actionCard {
  width: 30%;
  margin: 1.5%;
  border-radius: 12px;
}
.actionContent {
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.actionLabel {
  font-size: 11px;
  color: #2c3e50;
  margin-top: 8px;
  text-align: center;
  font-weight: 500;
}
.appCard {
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 10px;
  border-radius: 12px;
}
.appJobTitle {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}
.appSchool {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 8px;
}
.statusChip {
  align-self: flex-start;
}

.container {
  min-height: 100vh;
  background-color: #f0f3f8;
}
.content {
  padding-bottom: 48px;
}

.header {
  background-color: #1b4f72;
  padding-top: 56px;
  padding-bottom: 36px;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  align-items: center;
}
.avatarWrapper {
  margin-bottom: 16px;
  position: relative;
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 48px;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.avatarImage {
  width: 96px;
  height: 96px;
  border-radius: 48px;
}
.cameraBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #f39c12;
  border-radius: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.headerTitle {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}
.headerSubtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
}

.progressRow {
  display: flex;
  justify-content: center;
  gap: 32px;
  background-color: #fff;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8ecf0;
}
.progressItem {
  display: flex;
  align-items: center;
  gap: 4px;
}
.progressDot {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #e8ecf0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progressDotActive {
  background-color: #1b4f72;
}
.progressNum {
  font-size: 14px;
  font-weight: 700;
  color: #95a5a6;
}
.progressNumActive {
  color: #fff;
}
.progressLabel {
  font-size: 11px;
  color: #95a5a6;
}
.progressLabelActive {
  color: #1b4f72;
  font-weight: 600;
}

.successBanner {
  display: flex;
  align-items: center;
  background-color: #eafaf1;
  margin: 16px;
  padding: 12px;
  border-radius: 10px;
  gap: 8px;
}
.successText {
  color: #27ae60;
  font-weight: 600;
}

.card {
  background-color: #fff;
  margin: 16px;
  margin-bottom: 8px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}
.sectionHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2f7;
}
.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  color: #1b4f72;
}

.fieldLabel {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}
.input {
  margin-bottom: 4px;
  background-color: #fff;
}
.errorText {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 8px;
}

.chipGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1.5px solid #d5d8dc;
  background-color: #f8f9fa;
}
.chipSelected {
  border-color: #1b4f72;
  background-color: #ebf5fb;
}
.chipDisabled {
  border-color: #e8ecf0;
  background-color: #f2f3f4;
  opacity: 0.5;
}
.chipText {
  font-size: 13px;
  color: #626567;
}
.chipTextSelected {
  color: #1b4f72;
  font-weight: 600;
}
.chipTextDisabled {
  color: #bdc3c7;
}

.uploadRow {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.uploadCard {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px dashed #e8ecf0;
  background-color: #fafbfc;
}
.uploadLabel {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.saveBtn {
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
  border-radius: 12px;
}
.hint {
  text-align: center;
  font-size: 12px;
  color: #95a5a6;
  margin-top: 16px;
  margin-left: 24px;
  margin-right: 24px;
}

.modalBackdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modalCard {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  max-width: 400px;
}
.modalTitle {
  font-size: 18px;
  font-weight: 700;
  color: #1b4f72;
  margin-bottom: 16px;
}
.modalError {
  color: #e74c3c;
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: center;
  max-width: 280px;
}
.modalActions {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
  align-self: stretch;
}
.modalHint {
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 12px;
  max-width: 360px;
}
.recIndicator {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
}
.recDot {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #e74c3c;
}
.recText {
  font-weight: 600;
  color: #e74c3c;
  font-size: 13px;
}
.idCardCapture {
  margin-top: 12px;
  border-radius: 12px;
  border: 1.5px dashed #1b4f72;
  background-color: #f4f8fb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 16px;
  padding-right: 16px;
  min-height: 140px;
  overflow: hidden;
  position: relative;
}
.idCardThumbWrap {
  position: relative;
  width: 240px;
  height: 150px;
}
.idCardImage {
  width: 240px;
  height: 150px;
  border-radius: 8px;
}
.idCardCaptureTitle {
  font-size: 14px;
  font-weight: 700;
  color: #1b4f72;
  margin-top: 8px;
}
.idCardCaptureHint {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
  text-align: center;
}
.idCardRetakeBadge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background-color: rgba(27, 79, 114, 0.85);
  padding: 6px 10px;
  border-radius: 16px;
}
.idCardRetakeText {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}
.uploadCardError {
  border-color: #e74c3c;
  background-color: #fdedec;
}

.choiceBtn {
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
}

.container {
  min-height: 100vh;
  background-color: #f5f6fa;
}
.header {
  background-color: #1b4f72;
  padding-top: 32px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.headerTitle {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
}
.headerSub {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
}
.body {
  flex: 1;
  padding: 24px;
}
.errorBox {
  background-color: #fdedec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #e74c3c;
}
.errorText {
  color: #c0392b;
  font-size: 14px;
}
.dropZone {
  border-radius: 16px;
  border: 2px dashed #d5d8dc;
  margin-bottom: 24px;
}
.centeredContent {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 40px;
  padding-bottom: 40px;
  gap: 12px;
}
.dropText {
  font-size: 17px;
  font-weight: 600;
  color: #7f8c8d;
}
.dropSub {
  font-size: 13px;
  color: #bdc3c7;
}
.fileName {
  font-size: 16px;
  font-weight: 600;
  color: #1b4f72;
  text-align: center;
}
.fileSize {
  font-size: 13px;
  color: #7f8c8d;
}
.progressContainer {
  margin-bottom: 24px;
}
.progressLabel {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
  text-align: center;
}
.buttonRow {
  display: flex;
  gap: 12px;
}
.successCard {
  border-radius: 16px;
  border: 2px solid #27ae60;
}
.successText {
  font-size: 16px;
  font-weight: 600;
  color: #27ae60;
  text-align: center;
}

`;
    document.head.appendChild(style);
  }
}
export {};
