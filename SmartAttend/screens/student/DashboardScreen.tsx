import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_ATTENDANCE, MOCK_BOOKS } from '../../constants/mockData';

const { width } = Dimensions.get('window');

export default function StudentDashboardScreen() {
  const { user, logout } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const student = user as any;
  const recentAttendance = MOCK_ATTENDANCE.slice(0, 3);
  const purchasedBooks = MOCK_BOOKS.filter(b => b.purchased);
  const totalPresent = MOCK_ATTENDANCE.filter(a => a.status === 'PRESENT').length;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.headerTitle}>Student Dashboard</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <Animated.View style={[styles.profileCard, SHADOW.md, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.avatarContainer}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.avatar}>
              <Text style={styles.avatarText}>{student?.fullName?.[0] || 'J'}</Text>
            </LinearGradient>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{student?.fullName || 'Student'}</Text>
            <Text style={styles.profileDetail}>{student?.regNumber || 'REG001'}</Text>
            <Text style={styles.profileDetail}>Level: {student?.level || '200'}</Text>
            <Text style={styles.profileDetail}>Dept: {student?.department || 'Computer Science'}</Text>
          </View>
          <View style={styles.totalClasses}>
            <Text style={styles.totalLabel}>Total classes{'\n'}attended</Text>
            <Text style={styles.totalNumber}>{totalPresent}</Text>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
          </View>
        </Animated.View>

        {/* Stats row */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          <View style={[styles.statCard, SHADOW.sm]}>
            <View style={[styles.statIcon, { backgroundColor: '#EEF0FF' }]}>
              <Ionicons name="book" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{purchasedBooks.length}</Text>
            <Text style={styles.statLabel}>Books{'\n'}Purchased</Text>
          </View>
          <View style={[styles.statCard, SHADOW.sm]}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-circle" size={22} color={COLORS.secondary} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.secondary }]}>{totalPresent}</Text>
            <Text style={styles.statLabel}>Present{'\n'}Sessions</Text>
          </View>
          <View style={[styles.statCard, SHADOW.sm]}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="time" size={22} color={COLORS.warning} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>{MOCK_ATTENDANCE.length - totalPresent}</Text>
            <Text style={styles.statLabel}>Absent{'\n'}Sessions</Text>
          </View>
        </Animated.View>

        {/* Recent Attendance */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Attendance</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentAttendance.map(item => (
            <View key={item.id} style={[styles.attendanceItem, SHADOW.sm]}>
              <View style={[styles.attendanceIcon, { backgroundColor: item.status === 'PRESENT' ? '#E8F5E9' : '#FFEBEE' }]}>
                <Ionicons
                  name={item.status === 'PRESENT' ? 'checkmark-circle' : 'close-circle'}
                  size={22}
                  color={item.status === 'PRESENT' ? COLORS.secondary : COLORS.error}
                />
              </View>
              <View style={styles.attendanceInfo}>
                <Text style={styles.attendanceCourse}>{item.course}</Text>
                <Text style={styles.attendanceTime}>{item.date} — {item.time}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'PRESENT' ? COLORS.secondary : COLORS.error }
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Quick scan banner */}
        <Animated.View style={[{ opacity: fadeAnim, margin: SPACING.md, marginTop: 0, borderRadius: RADIUS.xl, overflow: 'hidden' }, SHADOW.md]}>
          <LinearGradient
            colors={['#6C63FF', COLORS.primary]}
            style={styles.scanBanner}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <View>
              <Text style={styles.scanBannerTitle}>Scan QR Code</Text>
              <Text style={styles.scanBannerSub}>Mark your attendance quickly</Text>
            </View>
            <View style={styles.scanBannerIcon}>
              <Ionicons name="qr-code" size={36} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl + SPACING.md, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: '#FFFFFF' },
  logoutBtn: { width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  profileCard: {
    backgroundColor: COLORS.card,
    margin: SPACING.md,
    marginTop: -SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: { marginRight: SPACING.md },
  avatar: { width: 56, height: 56, borderRadius: RADIUS.full, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  profileDetail: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: 1 },
  totalClasses: { alignItems: 'center' },
  totalLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 4 },
  totalNumber: { fontSize: FONTS.sizes.xxxl, fontWeight: '900', color: COLORS.primary },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.md },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  statIcon: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  statNumber: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  viewAll: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  attendanceItem: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  attendanceIcon: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  attendanceInfo: { flex: 1 },
  attendanceCourse: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  attendanceTime: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: FONTS.sizes.xs, color: '#FFFFFF', fontWeight: '700' },
  scanBanner: { padding: SPACING.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scanBannerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  scanBannerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  scanBannerIcon: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});
