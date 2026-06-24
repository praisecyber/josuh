import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_COURSES, MOCK_LECTURER_ATTENDANCE } from '../../constants/mockData';

export default function LecturerRecordsScreen() {
  const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0].id);
  const filtered = MOCK_LECTURER_ATTENDANCE.filter(a => {
    const course = MOCK_COURSES.find(c => c.id === selectedCourse);
    return a.course.includes(course?.code || '');
  });

  const totalPresent = filtered.reduce((s, a) => s + a.present, 0);
  const totalStudents = filtered.reduce((s, a) => s + a.total, 0);
  const avgRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Attendance Records</Text>
        <Text style={styles.headerSub}>Track student attendance per course</Text>

        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Sessions', value: filtered.length, icon: 'calendar-outline' },
            { label: 'Avg Rate', value: `${avgRate}%`, icon: 'bar-chart-outline' },
            { label: 'Present', value: totalPresent, icon: 'checkmark-circle-outline' },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryCard, SHADOW.sm]}>
              <Ionicons name={s.icon as any} size={18} color={COLORS.lectGradientEnd} />
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Course tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.courseTabs}
        contentContainerStyle={styles.courseTabsContent}
      >
        {MOCK_COURSES.map(course => (
          <TouchableOpacity
            key={course.id}
            style={[styles.courseTab, selectedCourse === course.id && styles.courseTabActive]}
            onPress={() => setSelectedCourse(course.id)}
          >
            <Text style={[styles.courseTabText, selectedCourse === course.id && styles.courseTabTextActive]}>
              {course.code}
            </Text>
            <Text style={[styles.courseTabSub, selectedCourse === course.id && { color: '#FFFFFF99' }]}>
              {course.students} students
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No records for this course</Text>
          </View>
        ) : (
          filtered.map((session, index) => {
            const rate = Math.round((session.present / session.total) * 100);
            const rateColor = rate >= 80 ? COLORS.secondary : rate >= 60 ? COLORS.warning : COLORS.error;
            return (
              <View key={session.id} style={[styles.sessionCard, SHADOW.sm]}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionNum}>
                    <Text style={styles.sessionNumText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionCourse}>{session.course}</Text>
                    <Text style={styles.sessionDate}>{session.date} — {session.time}</Text>
                  </View>
                  <View style={[styles.rateBadge, { backgroundColor: rateColor }]}>
                    <Text style={styles.rateBadgeText}>{rate}%</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${rate}%`, backgroundColor: rateColor }]} />
                  </View>
                  <Text style={styles.progressLabel}>{session.present} / {session.total} students present</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.lg },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm },
  summaryCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: 4 },
  summaryValue: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.textPrimary },
  summaryLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  courseTabs: { maxHeight: 80 },
  courseTabsContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: SPACING.sm },
  courseTab: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
  },
  courseTabActive: { backgroundColor: COLORS.lectGradientEnd, borderColor: COLORS.lectGradientEnd },
  courseTabText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  courseTabTextActive: { color: '#FFFFFF' },
  courseTabSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  list: { flex: 1, paddingHorizontal: SPACING.md },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl, gap: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  sessionCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sessionNum: { width: 32, height: 32, borderRadius: RADIUS.full, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  sessionNumText: { fontSize: FONTS.sizes.xs, fontWeight: '800', color: COLORS.lectGradientEnd },
  sessionInfo: { flex: 1 },
  sessionCourse: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  sessionDate: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  rateBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  rateBadgeText: { fontSize: FONTS.sizes.xs, color: '#FFFFFF', fontWeight: '800' },
  progressContainer: {},
  progressTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: RADIUS.full },
  progressLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
});
