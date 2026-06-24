import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');
type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'RoleSelect'> };

export default function RoleSelectScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim1 = useRef(new Animated.Value(60)).current;
  const cardAnim2 = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(cardAnim1, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.spring(cardAnim2, { toValue: 0, tension: 60, friction: 8, delay: 120, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top logo */}
      <Animated.View style={[styles.logoArea, { opacity: fadeAnim }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="library" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.logoText}>Smart<Text style={{ color: COLORS.primaryLight }}>Attend</Text></Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join Smart Attend And Get Started</Text>

        {/* Student card */}
        <Animated.View style={{ transform: [{ translateY: cardAnim1 }] }}>
          <TouchableOpacity
            style={[styles.roleCard, styles.studentCard, SHADOW.md]}
            onPress={() => navigation.navigate('StudentSignup')}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconBg, { backgroundColor: '#EEF0FF' }]}>
              <Text style={styles.roleEmoji}>🎓</Text>
            </View>
            <Text style={styles.roleTitle}>I am a student</Text>
            <Text style={styles.roleDesc}>
              Attend your classes, Scan QR codes for attendance, and buy books.
            </Text>
            <TouchableOpacity
              style={styles.studentBtn}
              onPress={() => navigation.navigate('StudentSignup')}
            >
              <Text style={styles.studentBtnText}>Sign up as a Student</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>

        {/* Lecturer card */}
        <Animated.View style={{ transform: [{ translateY: cardAnim2 }] }}>
          <TouchableOpacity
            style={[styles.roleCard, styles.lecturerCard, SHADOW.md]}
            onPress={() => navigation.navigate('LecturerSignup')}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconBg, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.roleEmoji}>👨‍🏫</Text>
            </View>
            <Text style={styles.roleTitle}>I am a lecturer</Text>
            <Text style={styles.roleDesc}>
              Manage your courses, take attendance, upload books and track records.
            </Text>
            <TouchableOpacity
              style={styles.lecturerBtn}
              onPress={() => navigation.navigate('LecturerSignup')}
            >
              <Text style={styles.lecturerBtnText}>Sign up as a Lecturer</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  logoArea: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  content: { flex: 1, paddingHorizontal: SPACING.lg, alignItems: 'center' },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.xl, textAlign: 'center' },
  roleCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: width - SPACING.lg * 2,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  studentCard: { borderTopWidth: 3, borderTopColor: COLORS.primary },
  lecturerCard: { borderTopWidth: 3, borderTopColor: COLORS.secondary },
  roleIconBg: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  roleEmoji: { fontSize: 36 },
  roleTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  roleDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: SPACING.md },
  studentBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
  },
  studentBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.sm },
  lecturerBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
  },
  lecturerBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.sm },
  loginRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.lg },
  loginText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  loginLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md },
});
