import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_COURSES, MOCK_LECTURER_ATTENDANCE } from '../../constants/mockData';

export default function LecturerDashboardScreen() {
  const { user, logout } = useAuth();
  const lecturer = user as any;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const totalStudents = MOCK_COURSES.reduce((s, c) => s + c.students, 0);
  const totalSessions = MOCK_LECTURER_ATTENDANCE.length;
  const avgRate = Math.round(
    MOCK_LECTURER_ATTENDANCE.reduce((s, a) => s + (a.present / a.total) * 100, 0) / totalSessions
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Welcome back 👨‍🏫</Text>
            <Text style={styles.headerTitle}>{lecturer?.fullName || 'Lecturer'}</Text>
            <Text style={styles.headerSub}>{lecturer?.department || 'Department'} • {lecturer?.staffId || 'Staff'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {[
            { label: 'Courses', value: MOCK_COURSES.length, icon: 'library-outline', color: COLORS.lectGradientEnd },
            { label: 'Students', value: totalStudents, icon: 'people-outline', color: COLORS.primary },
            { label: 'Sessions', value: totalSessions, icon: 'calendar-outline', color: COLORS.warning },
            { label: 'Avg Rate', value: `${avgRate}%`, icon: 'bar-chart-outline', color: COLORS.accent },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, SHADOW.sm]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* My Courses */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Courses</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{MOCK_COURSES.length} active</Text>
            </View>
          </View>
          {MOCK_COURSES.map(course => (
            <View key={course.id} style={[styles.courseCard, SHADOW.sm]}>
              <LinearGradient
                colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
                style={styles.courseCodeBg}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={styles.courseCode}>{course.code}</Text>
              </LinearGradient>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{course.name}</Text>
                <View style={styles.courseDetails}>
                  <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.courseDetail}>{course.students} students</Text>
                  <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.courseDetail}>{course.nextClass}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
            </View>
          ))}
        </Animated.View>

        {/* Recent Attendance Sessions */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
          </View>
          {MOCK_LECTURER_ATTENDANCE.map(session => {
            const rate = Math.round((session.present / session.total) * 100);
            return (
              <View key={session.id} style={[styles.sessionCard, SHADOW.sm]}>
                <View style={styles.sessionLeft}>
                  <Text style={styles.sessionCourse}>{session.course}</Text>
                  <Text style={styles.sessionDate}>{session.date} — {session.time}</Text>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionStats}>{session.present}/{session.total}</Text>
                  <View style={[styles.rateBadge, { backgroundColor: rate >= 80 ? COLORS.secondary : rate >= 60 ? COLORS.warning : COLORS.error }]}>
                    <Text style={styles.rateBadgeText}>{rate}%</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Quick action */}
        <Animated.View style={[{ opacity: fadeAnim, margin: SPACING.md, marginTop: 0, borderRadius: RADIUS.xl, overflow: 'hidden' }, SHADOW.md]}>
          <LinearGradient
            colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
            style={styles.quickAction}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <View>
              <Text style={styles.qaTitle}>Start a Class Session</Text>
              <Text style={styles.qaSub}>Generate QR for attendance</Text>
            </View>
            <View style={styles.qaIcon}>
              <Ionicons name="qr-code" size={34} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm, marginTop: SPACING.md, marginBottom: SPACING.md },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center' },
  statIcon: { width: 36, height: 36, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '900' },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  sectionBadge: { backgroundColor: COLORS.lectGradientEnd + '20', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  sectionBadgeText: { fontSize: FONTS.sizes.xs, color: COLORS.lectGradientEnd, fontWeight: '700' },
  courseCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md,
  },
  courseCodeBg: { width: 52, height: 52, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  courseCode: { fontSize: FONTS.sizes.xs, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  courseInfo: { flex: 1 },
  courseName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  courseDetails: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseDetail: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginRight: SPACING.xs },
  sessionCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  sessionLeft: { flex: 1 },
  sessionCourse: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  sessionDate: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  sessionRight: { alignItems: 'center', gap: 4 },
  sessionStats: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary },
  rateBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  rateBadgeText: { fontSize: FONTS.sizes.xs, color: '#FFFFFF', fontWeight: '700' },
  quickAction: { padding: SPACING.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qaTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  qaSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  qaIcon: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});
