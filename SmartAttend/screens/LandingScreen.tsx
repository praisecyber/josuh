import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Landing'>;
};

const FEATURES = [
  { icon: 'qr-code-outline', label: 'QR Code Attendance', color: '#6C63FF' },
  { icon: 'person-outline', label: 'Course Based Lecturer', color: '#4CAF50' },
  { icon: 'book-outline', label: 'Book Distribution & Purchase', color: '#FF9800' },
  { icon: 'pulse-outline', label: 'Real-time Attendance & Tracking', color: '#F44336' },
];

export default function LandingScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(heroAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="library" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.logoText}>Smart<Text style={{ color: '#FFD700' }}>Attend</Text></Text>
          </View>
          <View style={styles.navLinks}>
            <Text style={styles.navLink}>Home</Text>
            <Text style={styles.navLink}>Features</Text>
            <Text style={styles.navLink}>About</Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.heroTitle}>
            Web-Based Automated{'\n'}Attendance Management{'\n'}System Using QR Code
          </Text>
          <Text style={styles.heroSub}>
            Smart Attend is a smart and efficient Web-Based Automated Attendance Management System using QR Code Technology designed to simplify attendance tracking.
          </Text>

          {/* Feature bullets */}
          <View style={styles.featureBullets}>
            {FEATURES.slice(0, 2).map((f, i) => (
              <View key={i} style={styles.bullet}>
                <View style={[styles.dot, { backgroundColor: '#FFD700' }]} />
                <Text style={styles.bulletText}>{f.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.featureBullets}>
            {FEATURES.slice(2).map((f, i) => (
              <View key={i} style={styles.bullet}>
                <View style={[styles.dot, { backgroundColor: '#FFD700' }]} />
                <Text style={styles.bulletText}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Hero illustration */}
          <Animated.View style={[styles.illustration, { transform: [{ scale: heroAnim }] }]}>
            <Text style={styles.illustrationEmoji}>👩‍🎓</Text>
            <View style={styles.floatBadge1}>
              <Ionicons name="qr-code" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.floatBadge2}>
              <Text style={styles.floatBadgeText}>✓</Text>
            </View>
          </Animated.View>

          {/* CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => navigation.navigate('RoleSelect')}
            >
              <Text style={styles.primaryCtaText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCta}>
              <Text style={styles.secondaryCtaText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Features section */}
      <ScrollView style={styles.featuresSection} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Why Smart Attend?</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureCard,
                SHADOW.sm,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={[styles.featureIconBg, { backgroundColor: feature.color + '15' }]}>
                <Ionicons name={feature.icon as any} size={28} color={feature.color} />
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.bottomCtaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bottomCtaTitle}>Ready to get started?</Text>
            <Text style={styles.bottomCtaSub}>Join thousands of students and lecturers</Text>
            <TouchableOpacity
              style={styles.bottomCtaBtn}
              onPress={() => navigation.navigate('RoleSelect')}
            >
              <Text style={styles.bottomCtaBtnText}>Get Started Free</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  logoText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  navLink: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  loginBtn: {
    marginLeft: 'auto',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  loginBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  heroSection: { marginTop: SPACING.lg },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: SPACING.md,
  },
  heroSub: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  featureBullets: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xs,
  },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  bulletText: { color: '#FFFFFF', fontSize: FONTS.sizes.xs, fontWeight: '500' },
  illustration: {
    alignSelf: 'flex-end',
    marginTop: -80,
    marginRight: SPACING.md,
  },
  illustrationEmoji: { fontSize: 80 },
  floatBadge1: {
    position: 'absolute',
    top: -10,
    left: -20,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 8,
    ...SHADOW.sm,
  },
  floatBadge2: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  ctaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  primaryCta: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    ...SHADOW.sm,
  },
  primaryCtaText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
  },
  secondaryCta: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
  },
  secondaryCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
  },
  featuresSection: { flex: 1, paddingTop: SPACING.xl },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    width: (width - SPACING.md * 2 - SPACING.md) / 2,
  },
  featureIconBg: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  bottomCta: {
    margin: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  bottomCtaGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  bottomCtaTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  bottomCtaSub: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.lg,
  },
  bottomCtaBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  bottomCtaBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
  },
});
