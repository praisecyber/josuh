import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { COLORS, SPACING, RADIUS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { MOCK_STUDENTS, MOCK_LECTURERS } from '../../constants/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    if (role === 'student') {
      const found = MOCK_STUDENTS.find(s => s.email === email && s.password === password);
      if (found) {
        const { password: _, ...userData } = found;
        await login(userData);
      } else {
        // demo login
        await login({ role: 'student', fullName: 'John Ric', email, regNumber: 'REG1BB82C', department: 'Computer Science', level: '200' });
      }
    } else {
      const found = MOCK_LECTURERS.find(l => l.email === email && l.password === password);
      if (found) {
        const { password: _, ...userData } = found;
        await login(userData);
      } else {
        await login({ role: 'lecturer', fullName: 'Dr. Sarah Johnson', email, staffId: 'STAFF001', department: 'Computer Science', courses: ['CSC 214 - Data Structures', 'CSC 312 - Algorithms'] });
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <LinearGradient
            colors={role === 'student' ? [COLORS.primary, COLORS.primaryLight] : [COLORS.lectGradientStart, COLORS.lectGradientEnd]}
            style={styles.header}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="library" size={22} color={role === 'student' ? COLORS.primary : COLORS.secondary} />
              </View>
              <Text style={styles.logoText}>Smart<Text style={{ color: '#FFD700' }}>Attend</Text></Text>
            </View>
            <Text style={styles.headerTitle}>Welcome Back! 👋</Text>
            <Text style={styles.headerSub}>Sign in to continue</Text>
          </LinearGradient>

          {/* Card */}
          <View style={styles.card}>
            {/* Role toggle */}
            <View style={styles.roleToggle}>
              {(['student', 'lecturer'] as const).map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && (r === 'student' ? styles.roleBtnActiveStudent : styles.roleBtnActiveLecturer)]}
                  onPress={() => setRole(r)}
                >
                  <Ionicons
                    name={r === 'student' ? 'school-outline' : 'person-outline'}
                    size={16}
                    color={role === r ? '#FFFFFF' : COLORS.textSecondary}
                  />
                  <Text style={[styles.roleBtnText, role === r && { color: '#FFFFFF' }]}>
                    {r === 'student' ? 'Student' : 'Lecturer'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: role === 'student' ? COLORS.primary : COLORS.secondary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.loginBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
              <LinearGradient
                colors={role === 'student' ? [COLORS.primary, COLORS.primaryLight] : [COLORS.lectGradientStart, COLORS.lectGradientEnd]}
                style={styles.loginBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.loginBtnText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Demo hint */}
            <View style={styles.demoHint}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.demoText}>Demo: Enter any email/password to log in</Text>
            </View>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('RoleSelect')}>
                <Text style={[styles.signupLink, { color: role === 'student' ? COLORS.primary : COLORS.secondary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1 },
  header: { padding: SPACING.xl, paddingTop: SPACING.lg, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { marginBottom: SPACING.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  logoIcon: { width: 40, height: 40, borderRadius: RADIUS.sm, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF' },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.8)' },
  card: { backgroundColor: COLORS.card, margin: SPACING.md, borderRadius: RADIUS.xl, padding: SPACING.xl, marginTop: -SPACING.xl },
  roleToggle: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.full, padding: 4, marginBottom: SPACING.xl },
  roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  roleBtnActiveStudent: { backgroundColor: COLORS.primary },
  roleBtnActiveLecturer: { backgroundColor: COLORS.secondary },
  roleBtnText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  label: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, height: 52, marginBottom: SPACING.md,
  },
  input: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.lg },
  forgotText: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  loginBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  loginBtnGradient: { height: 52, justifyContent: 'center', alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
  demoHint: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.background, padding: SPACING.sm, borderRadius: RADIUS.sm, marginBottom: SPACING.md },
  demoText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  signupLink: { fontWeight: '700', fontSize: FONTS.sizes.sm },
});
