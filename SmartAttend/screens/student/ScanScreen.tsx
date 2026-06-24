import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';

type ScanState = 'idle' | 'scanning' | 'success';

export default function ScanScreen() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(0.8)).current;

  // Animate scan line
  useEffect(() => {
    if (scanState === 'scanning') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
      Animated.spring(cornerAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
    }
  }, [scanState]);

  const handleStartScan = () => {
    setScanState('scanning');
    // Simulate QR scan after 3s
    setTimeout(() => {
      setScanState('success');
      setShowSuccess(true);
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
    }, 3000);
  };

  const handleReset = () => {
    setScanState('idle');
    setShowSuccess(false);
    scaleAnim.setValue(0);
    scanLineAnim.setValue(0);
    cornerAnim.setValue(0.8);
  };

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <Text style={styles.headerSub}>Position the QR Code within the frame</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Camera preview / Scanner frame */}
        <View style={[styles.scannerCard, SHADOW.lg]}>
          <View style={styles.scannerFrame}>
            {/* Background */}
            <View style={styles.scannerBg}>
              {scanState === 'idle' && (
                <View style={styles.idleContent}>
                  <Ionicons name="qr-code-outline" size={80} color={COLORS.border} />
                  <Text style={styles.idleText}>Tap "Start Scanning" to begin</Text>
                </View>
              )}

              {scanState === 'scanning' && (
                <>
                  {/* Mock QR code */}
                  <View style={styles.mockQR}>
                    <View style={styles.qrGrid}>
                      {Array.from({ length: 49 }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.qrCell,
                            { backgroundColor: Math.random() > 0.5 ? COLORS.primary : 'transparent' }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  {/* Scan line */}
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLineY }] }
                    ]}
                  />
                </>
              )}

              {scanState === 'success' && (
                <View style={styles.successPreview}>
                  <Ionicons name="checkmark-circle" size={60} color={COLORS.secondary} />
                  <Text style={styles.successPreviewText}>Scanned!</Text>
                </View>
              )}
            </View>

            {/* Corner brackets */}
            <Animated.View style={[styles.corners, { transform: [{ scale: cornerAnim }] }]}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </Animated.View>
          </View>

          {scanState === 'idle' && (
            <Text style={styles.hintText}>First time scanning?{'\n'}Please enter your details</Text>
          )}
          {scanState === 'scanning' && (
            <View style={styles.scanningIndicator}>
              <View style={styles.scanningDot} />
              <Text style={styles.scanningText}>Scanning...</Text>
            </View>
          )}

          {scanState === 'idle' && (
            <TouchableOpacity style={styles.startBtn} onPress={handleStartScan}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.startBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
                <Text style={styles.startBtnText}>Start Scanning</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          {[
            { icon: 'camera-outline', text: 'Point camera at the QR code' },
            { icon: 'wifi-outline', text: 'Ensure you have internet connection' },
            { icon: 'time-outline', text: 'QR codes expire after class ends' },
          ].map((item, i) => (
            <View key={i} style={styles.instructionItem}>
              <View style={styles.instructionIcon}>
                <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.instructionText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, SHADOW.lg, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={['#E8F5E9', '#FFFFFF']}
              style={styles.modalGradient}
            >
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>Attendance Recorded</Text>
              <Text style={styles.successSubtitle}>Successfully!</Text>

              <View style={styles.successDetails}>
                <Text style={styles.successCourse}>CSC 214 — DATA STRUCTURE</Text>
                <Text style={styles.successDate}>27 May 2025 — 1:03 pm</Text>
              </View>

              <TouchableOpacity style={styles.okBtn} onPress={handleReset}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.okBtnGradient}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.okBtnText}>OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  content: { flex: 1, padding: SPACING.md, alignItems: 'center' },
  scannerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  scannerFrame: {
    width: 240,
    height: 240,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  scannerBg: {
    width: 240,
    height: 240,
    backgroundColor: '#F8F9FF',
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  idleContent: { alignItems: 'center', gap: SPACING.sm },
  idleText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center' },
  mockQR: { padding: SPACING.md },
  qrGrid: { width: 140, height: 140, flexDirection: 'row', flexWrap: 'wrap' },
  qrCell: { width: 20, height: 20 },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  successPreview: { alignItems: 'center', gap: SPACING.sm },
  successPreviewText: { color: COLORS.secondary, fontWeight: '700', fontSize: FONTS.sizes.md },
  corners: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  hintText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md },
  scanningIndicator: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  scanningDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  scanningText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  startBtn: { width: '100%', borderRadius: RADIUS.md, overflow: 'hidden' },
  startBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: SPACING.md },
  startBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
  instructions: { width: '100%', gap: SPACING.sm },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md },
  instructionIcon: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  instructionText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: 280, borderRadius: RADIUS.xl, overflow: 'hidden' },
  modalGradient: { padding: SPACING.xl, alignItems: 'center' },
  successCircle: {
    width: 80, height: 80, borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  successTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  successSubtitle: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.secondary, marginBottom: SPACING.md },
  successDetails: { backgroundColor: '#F5F5F5', borderRadius: RADIUS.md, padding: SPACING.md, width: '100%', marginBottom: SPACING.lg, alignItems: 'center' },
  successCourse: { fontSize: FONTS.sizes.sm, fontWeight: '800', color: COLORS.textPrimary },
  successDate: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4 },
  okBtn: { width: '100%', borderRadius: RADIUS.md, overflow: 'hidden' },
  okBtnGradient: { paddingVertical: SPACING.md, alignItems: 'center' },
  okBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
});
