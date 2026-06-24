import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'LecturerSignup'> };

export default function LecturerSignupScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '', email: '', staffId: '', department: '', courses: '', password: '', confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const { fullName, email, staffId, department, password, confirmPassword } = form;
    if (!fullName || !email || !staffId || !department || !password) {
      Alert.alert('Error', 'Please fill in all fields'); return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); return;
    }
    if (!agreed) {
      Alert.alert('Error', 'Please agree to Terms and Conditions'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    await login({
      role: 'lecturer', fullName, email, staffId, department,
      courses: form.courses ? form.courses.split(',').map(c => c.trim()) : [],
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.layout}>
          {/* Left panel */}
          <LinearGradient
            colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
            style={styles.leftPanel}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="library" size={18} color={COLORS.secondary} />
              </View>
              <Text style={styles.logoText}>SmartAttend</Text>
            </View>
            <Text style={styles.panelEmoji}>👨‍🏫</Text>
            <Text style={styles.panelTitle}>Smarter Teaching{'\n'}Better Results</Text>
            {['Generate QR Codes', 'Track Attendance', 'Upload Books', 'View Records'].map((item, i) => (
              <View key={i} style={styles.panelBullet}>
                <View style={styles.panelDot} />
                <Text style={styles.panelBulletText}>{item}</Text>
              </View>
            ))}
          </LinearGradient>

          {/* Right form */}
          <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={COLORS.secondary} />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Create Lecturer Account</Text>
            <Text style={styles.formSubtitle}>Fill in your details to create an account</Text>

            {[
              { label: 'Full Name', field: 'fullName' },
              { label: 'Email Address', field: 'email', keyboard: 'email-address' },
              { label: 'Staff ID', field: 'staffId', placeholder: 'e.g. STAFF001' },
              { label: 'Department', field: 'department', placeholder: 'e.g. Computer Science' },
              { label: 'Courses (comma separated)', field: 'courses', placeholder: 'CSC 214, MTH 212' },
            ].map(({ label, field, keyboard, placeholder }) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder || label}
                    placeholderTextColor={COLORS.textSecondary}
                    value={form[field as keyof typeof form]}
                    onChangeText={val => setForm(prev => ({ ...prev, [field]: val }))}
                    keyboardType={keyboard as any || 'default'}
                    autoCapitalize={field === 'email' ? 'none' : 'words'}
                  />
                </View>
              </View>
            ))}

            <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.textSecondary}
                    value={form.password}
                    onChangeText={val => setForm(p => ({ ...p, password: val }))}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm"
                    placeholderTextColor={COLORS.textSecondary}
                    value={form.confirmPassword}
                    onChangeText={val => setForm(p => ({ ...p, confirmPassword: val }))}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> & <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.createBtn, loading && { opacity: 0.7 }]} onPress={handleCreate} disabled={loading}>
              <LinearGradient
                colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
                style={styles.createBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.createBtnText}>Create Account</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: COLORS.secondary }]}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  layout: { flex: 1, flexDirection: 'row' },
  leftPanel: { width: 130, padding: SPACING.md, justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.md },
  logoIcon: { width: 28, height: 28, borderRadius: 4, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  panelEmoji: { fontSize: 50, textAlign: 'center', marginBottom: SPACING.sm },
  panelTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: SPACING.md, lineHeight: 18 },
  panelBullet: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  panelDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFD700' },
  panelBulletText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
  rightPanel: { flex: 1, padding: SPACING.md },
  backBtn: { marginBottom: SPACING.sm },
  formTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  formSubtitle: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: SPACING.md },
  formRow: { flexDirection: 'row', gap: SPACING.sm },
  halfInput: { flex: 1 },
  inputGroup: { marginBottom: SPACING.sm },
  inputLabel: { fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: RADIUS.sm,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm, height: 42,
  },
  input: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md, marginTop: SPACING.xs },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  termsText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, flex: 1 },
  termsLink: { color: COLORS.secondary, fontWeight: '600' },
  createBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  createBtnGradient: { paddingVertical: SPACING.md, alignItems: 'center' },
  createBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl },
  loginText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  loginLink: { fontWeight: '700', fontSize: FONTS.sizes.sm },
});
