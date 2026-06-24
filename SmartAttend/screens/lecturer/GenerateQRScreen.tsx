import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_COURSES } from '../../constants/mockData';

type GenerateState = 'idle' | 'generating' | 'active' | 'expired';

export default function GenerateQRScreen() {
  const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0]);
  const [duration, setDuration] = useState(15);
  const [state, setState] = useState<GenerateState>('idle');
  const [timer, setTimer] = useState(0);
  const [showExpired, setShowExpired] = useState(false);
  const qrAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (state === 'active') {
      Animated.spring(qrAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      setTimer(duration * 60);
      timerRef.current = setInterval(() => {
        setTimer((prev: number) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setState('expired');
            setShowExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  const handleGenerate = () => {
    setState('generating');
    setTimeout(() => setState('active'), 1500);
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    setState('idle');
    qrAnim.setValue(0);
    setTimer(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerPercent = timer / (duration * 60);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Generate QR Code</Text>
        <Text style={styles.headerSub}>Create a timed QR code for attendance</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Course selector */}
        <View style={[styles.card, SHADOW.sm]}>
          <Text style={styles.cardTitle}>Select Course</Text>
          {MOCK_COURSES.map(course => (
            <TouchableOpacity
              key={course.id}
              style={[styles.courseOption, selectedCourse.id === course.id && styles.courseOptionActive]}
              onPress={() => setSelectedCourse(course)}
            >
              <LinearGradient
                colors={selectedCourse.id === course.id ? [COLORS.lectGradientStart, COLORS.lectGradientEnd] : ['#F5F5F5', '#F5F5F5']}
                style={styles.courseOptionDot}
              >
                <Text style={[styles.courseOptionCode, { color: selectedCourse.id === course.id ? '#FFFFFF' : COLORS.textSecondary }]}>
                  {course.code.split(' ')[0]}
                </Text>
              </LinearGradient>
              <View style={styles.courseOptionInfo}>
                <Text style={[styles.courseOptionName, selectedCourse.id === course.id && { color: COLORS.lectGradientEnd }]}>
                  {course.code} — {course.name}
                </Text>
                <Text style={styles.courseOptionStudents}>{course.students} students enrolled</Text>
              </View>
              {selectedCourse.id === course.id && (
                <Ionicons name="checkmark-circle" size={22} color={COLORS.lectGradientEnd} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <View style={[styles.card, SHADOW.sm]}>
          <Text style={styles.cardTitle}>QR Duration (minutes)</Text>
          <View style={styles.durationRow}>
            {[5, 10, 15, 20, 30].map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.durationBtn, duration === d && styles.durationBtnActive]}
                onPress={() => setDuration(d)}
              >
                <Text style={[styles.durationText, duration === d && styles.durationTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* QR Display */}
        {(state === 'active' || state === 'generating') && (
          <Animated.View style={[styles.qrCard, SHADOW.lg, { transform: [{ scale: qrAnim }] }]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.qrCodeContainer}>
                {/* Mock QR code grid */}
                <View style={styles.qrGrid}>
                  {Array.from({ length: 81 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.qrCell,
                        {
                          backgroundColor:
                            (i < 9 && i % 9 < 3) || (i >= 54 && i < 63 && i % 9 < 3) ||
                            (i % 9 >= 6 && i < 27) ? COLORS.lectGradientStart :
                            Math.random() > 0.55 ? COLORS.lectGradientStart : 'transparent'
                        }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </Animated.View>

            <Text style={styles.qrCourse}>{selectedCourse.code} — {selectedCourse.name}</Text>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <View style={styles.timerTrack}>
                <View style={[styles.timerFill, { width: `${timerPercent * 100}%`, backgroundColor: timerPercent > 0.3 ? COLORS.lectGradientEnd : COLORS.error }]} />
              </View>
              <Text style={[styles.timerText, { color: timerPercent > 0.3 ? COLORS.lectGradientEnd : COLORS.error }]}>
                {formatTime(timer)} remaining
              </Text>
            </View>

            <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
              <Text style={styles.stopBtnText}>Stop QR</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Generate button */}
        {state === 'idle' && (
          <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
            <LinearGradient
              colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
              style={styles.generateBtnGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
              <Text style={styles.generateBtnText}>Generate QR Code</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* Expired modal */}
      <Modal visible={showExpired} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, SHADOW.lg]}>
            <Ionicons name="time" size={48} color={COLORS.warning} />
            <Text style={styles.modalTitle}>QR Code Expired</Text>
            <Text style={styles.modalSub}>The attendance window has closed</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => { setShowExpired(false); setState('idle'); qrAnim.setValue(0); }}
            >
              <LinearGradient
                colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
                style={styles.modalBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalBtnText}>Generate New QR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24, alignItems: 'center',
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  scroll: { flex: 1, padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.md },
  courseOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  courseOptionActive: { borderColor: COLORS.lectGradientEnd, backgroundColor: '#E8F5E9' },
  courseOptionDot: { width: 44, height: 44, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  courseOptionCode: { fontSize: 10, fontWeight: '800' },
  courseOptionInfo: { flex: 1 },
  courseOptionName: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  courseOptionStudents: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  durationRow: { flexDirection: 'row', gap: SPACING.sm },
  durationBtn: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, backgroundColor: COLORS.background, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  durationBtnActive: { backgroundColor: COLORS.lectGradientEnd, borderColor: COLORS.lectGradientEnd },
  durationText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textSecondary },
  durationTextActive: { color: '#FFFFFF' },
  qrCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginBottom: SPACING.md, alignItems: 'center',
  },
  qrCodeContainer: {
    width: 200, height: 200,
    borderRadius: RADIUS.md, backgroundColor: '#FFFFFF',
    padding: SPACING.sm, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.lectGradientEnd,
    ...SHADOW.sm,
  },
  qrGrid: { width: 180, height: 180, flexDirection: 'row', flexWrap: 'wrap' },
  qrCell: { width: 20, height: 20 },
  qrCourse: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary, marginTop: SPACING.md, textAlign: 'center' },
  timerContainer: { width: '100%', marginTop: SPACING.md },
  timerTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: SPACING.xs },
  timerFill: { height: '100%', borderRadius: RADIUS.full },
  timerText: { fontSize: FONTS.sizes.md, fontWeight: '800', textAlign: 'center' },
  stopBtn: { marginTop: SPACING.md, backgroundColor: COLORS.error + '15', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  stopBtnText: { color: COLORS.error, fontWeight: '700', fontSize: FONTS.sizes.sm },
  generateBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  generateBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md + 4 },
  generateBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', width: '80%', gap: SPACING.sm },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary },
  modalSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  modalBtn: { width: '100%', borderRadius: RADIUS.md, overflow: 'hidden' },
  modalBtnGradient: { paddingVertical: SPACING.md, alignItems: 'center' },
  modalBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
});
