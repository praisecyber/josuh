import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_ATTENDANCE } from '../../constants/mockData';

type Filter = 'All' | 'PRESENT' | 'ABSENT';

export default function AttendanceScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const filtered = filter === 'All' ? MOCK_ATTENDANCE : MOCK_ATTENDANCE.filter(a => a.status === filter);
  const presentCount = MOCK_ATTENDANCE.filter(a => a.status === 'PRESENT').length;
  const absentCount = MOCK_ATTENDANCE.filter(a => a.status === 'ABSENT').length;
  const rate = Math.round((presentCount / MOCK_ATTENDANCE.length) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Attendance History</Text>
        <Text style={styles.headerSub}>Your full attendance record</Text>

        {/* Rate card */}
        <View style={[styles.rateCard, SHADOW.md]}>
          <View style={styles.rateSection}>
            <Text style={styles.rateNumber}>{rate}%</Text>
            <Text style={styles.rateLabel}>Attendance Rate</Text>
          </View>
          <View style={styles.rateDivider} />
          <View style={styles.rateSection}>
            <Text style={[styles.rateNumber, { color: COLORS.secondary }]}>{presentCount}</Text>
            <Text style={styles.rateLabel}>Present</Text>
          </View>
          <View style={styles.rateDivider} />
          <View style={styles.rateSection}>
            <Text style={[styles.rateNumber, { color: COLORS.error }]}>{absentCount}</Text>
            <Text style={styles.rateLabel}>Absent</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['All', 'PRESENT', 'ABSENT'] as Filter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'All' ? 'All' : f === 'PRESENT' ? '✓ Present' : '✗ Absent'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No records found</Text>
          </View>
        ) : (
          filtered.map((item, index) => (
            <View key={item.id} style={[styles.item, SHADOW.sm]}>
              <View style={styles.itemIndex}>
                <Text style={styles.itemIndexText}>{index + 1}</Text>
              </View>
              <View style={[styles.itemIconBg, { backgroundColor: item.status === 'PRESENT' ? '#E8F5E9' : '#FFEBEE' }]}>
                <Ionicons
                  name={item.status === 'PRESENT' ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={item.status === 'PRESENT' ? COLORS.secondary : COLORS.error}
                />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemCourse}>{item.course}</Text>
                <Text style={styles.itemTime}>{item.date} — {item.time}</Text>
              </View>
              <View style={[
                styles.badge,
                { backgroundColor: item.status === 'PRESENT' ? COLORS.secondary : COLORS.error }
              ]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
          ))
        )}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl + SPACING.md,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.lg },
  rateCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rateSection: { alignItems: 'center' },
  rateNumber: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary },
  rateLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  rateDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  filterRow: {
    flexDirection: 'row',
    margin: SPACING.md,
    marginTop: -SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    padding: 4,
    ...SHADOW.sm,
  },
  filterTab: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, alignItems: 'center' },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterTabText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  filterTabTextActive: { color: '#FFFFFF' },
  list: { flex: 1, paddingHorizontal: SPACING.md },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl, gap: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  itemIndex: {
    width: 28, height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center', alignItems: 'center',
  },
  itemIndexText: { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.primary },
  itemIconBg: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemCourse: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  itemTime: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  badgeText: { fontSize: FONTS.sizes.xs, color: '#FFFFFF', fontWeight: '700' },
});
