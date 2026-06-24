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

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'StudentSignup'> };

const LEVELS = ['100', '200', '300', '400', '500'];

export default function StudentSignupScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '', email: '', regNumber: '', department: '', level: '', password: '', confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const { fullName, email, regNumber, department, level, password, confirmPassword } = form;
    if (!fullName || !email || !regNumber || !department || !level || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agreed) {
      Alert.alert('Error', 'Please agree to the Terms and Conditions');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    await login({ role: 'student', fullName, email, regNumber, department, level });
    setLoading(false);
  };

  const InputField = ({ label, field, placeholder, secure, toggleSecure, showSecure, keyboardType = 'default' }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || label}
          placeholderTextColor={COLORS.textSecondary}
          value={form[field as keyof typeof form]}
          onChangeText={val => setForm(prev => ({ ...prev, [field]: val }))}
          secureTextEntry={secure && !showSecure}
          keyboardType={keyboardType}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
        />
        {secure && (
          <TouchableOpacity onPress={toggleSecure} style={styles.eyeBtn}>
            <Ionicons name={showSecure ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.layout}>
          {/* Left panel */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.leftPanel}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="library" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.logoText}>SmartAttend</Text>
            </View>
            <Text style={styles.panelEmoji}>👩‍💼</Text>
            <Text style={styles.panelTitle}>Smart Attendance{'\n'}Smarter Education</Text>
            {['Scan QR Code', 'Track Attendance', 'Buy Course Book', 'Stay Organized'].map((item, i) => (
              <View key={i} style={styles.panelBullet}>
                <View style={styles.panelDot} />
                <Text style={styles.panelBulletText}>{item}</Text>
              </View>
            ))}
          </LinearGradient>

          {/* Right form */}
          <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Create Student Account</Text>
            <Text style={styles.formSubtitle}>Fill in your details to create an account</Text>

            <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <InputField label="Full Name" field="fullName" />
              </View>
              <View style={styles.halfInput}>
                <InputField label="Email Address" field="email" keyboardType="email-address" />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <InputField label="Registration Number" field="regNumber" placeholder="REG123456" />
              </View>
              <View style={styles.halfInput}>
                <InputField label="Department" field="department" placeholder="e.g. Computer Science" />
              </View>
            </View>

            {/* Level dropdown */}
            <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Level</Text>
                <TouchableOpacity
                  style={[styles.inputWrapper, styles.dropdown]}
                  onPress={() => setLevelOpen(!levelOpen)}
                >
                  <Text style={[styles.dropdownText, !form.level && { color: COLORS.textSecondary }]}>
                    {form.level ? `${form.level} Level` : 'Select Level'}
                  </Text>
                  <Ionicons name={levelOpen ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
                {levelOpen && (
                  <View style={styles.dropdownMenu}>
                    {LEVELS.map(l => (
                      <TouchableOpacity
                        key={l}
                        style={styles.dropdownItem}
                        onPress={() => { setForm(p => ({ ...p, level: l })); setLevelOpen(false); }}
                      >
                        <Text style={[styles.dropdownItemText, form.level === l && { color: COLORS.primary, fontWeight: '700' }]}>
                          {l} Level
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.halfInput}>
                <InputField label="Password" field="password" secure showSecure={showPassword} toggleSecure={() => setShowPassword(!showPassword)} />
              </View>
            </View>

            <InputField label="Confirm Password" field="confirmPassword" secure showSecure={showConfirmPassword} toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)} />

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> & <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createBtn, loading && { opacity: 0.7 }]}
              onPress={handleCreate}
              disabled={loading}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.createBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                {loading
                  ? <ActivityIndicator color="#FFFFFF" />
                  : <Text style={styles.createBtnText}>Create Account</Text>
                }
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
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
  leftPanel: {
    width: 130,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.md },
  logoIcon: {
    width: 28, height: 28, borderRadius: RADIUS.xs || 4,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 42,
  },
  input: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
  eyeBtn: { padding: 4 },
  dropdown: { justifyContent: 'space-between' },
  dropdownText: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
  dropdownMenu: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 999,
    ...SHADOW.md,
  },
  dropdownItem: { padding: SPACING.sm },
  dropdownItemText: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md, marginTop: SPACING.xs },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, flex: 1 },
  termsLink: { color: COLORS.primary, fontWeight: '600' },
  createBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  createBtnGradient: { paddingVertical: SPACING.md, alignItems: 'center' },
  createBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl },
  loginText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  loginLink: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.sm },
});
