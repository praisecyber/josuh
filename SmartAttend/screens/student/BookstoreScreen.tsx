import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_BOOKS } from '../../constants/mockData';

export default function BookstoreScreen() {
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [selectedBook, setSelectedBook] = useState<typeof MOCK_BOOKS[0] | null>(null);
  const [cart, setCart] = useState<string[]>([]);

  const handleBuy = (bookId: string) => {
    Alert.alert(
      'Purchase Book',
      'Confirm purchase for ₦' + (MOCK_BOOKS.find(b => b.id === bookId)?.price?.toLocaleString() || 0),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy Now',
          onPress: () => {
            setBooks(prev => prev.map(b => b.id === bookId ? { ...b, purchased: true } : b));
            setSelectedBook(null);
            Alert.alert('Success! 🎉', 'Book added to your library');
          }
        }
      ]
    );
  };

  const purchasedCount = books.filter(b => b.purchased).length;

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
            <Text style={styles.headerTitle}>Bookstore</Text>
            <Text style={styles.headerSub}>Browse and buy course materials</Text>
          </View>
          <View style={styles.cartBadge}>
            <Ionicons name="book" size={22} color="#FFFFFF" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{purchasedCount}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, SHADOW.sm]}>
            <Text style={styles.statNum}>{books.length}</Text>
            <Text style={styles.statLbl}>Total Books</Text>
          </View>
          <View style={[styles.statCard, SHADOW.sm]}>
            <Text style={[styles.statNum, { color: COLORS.secondary }]}>{purchasedCount}</Text>
            <Text style={styles.statLbl}>Purchased</Text>
          </View>
          <View style={[styles.statCard, SHADOW.sm]}>
            <Text style={[styles.statNum, { color: COLORS.warning }]}>{books.length - purchasedCount}</Text>
            <Text style={styles.statLbl}>Available</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Course Books</Text>
        {books.map(book => (
          <TouchableOpacity
            key={book.id}
            style={[styles.bookCard, SHADOW.sm]}
            onPress={() => setSelectedBook(book)}
            activeOpacity={0.85}
          >
            <View style={styles.bookCover}>
              <Text style={styles.bookEmoji}>{book.cover}</Text>
            </View>
            <View style={styles.bookInfo}>
              <View style={styles.courseTag}>
                <Text style={styles.courseTagText}>{book.course}</Text>
              </View>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>by {book.author}</Text>
              <View style={styles.bookFooter}>
                <Text style={styles.bookPrice}>₦{book.price.toLocaleString()}</Text>
                {book.purchased ? (
                  <View style={styles.ownedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.secondary} />
                    <Text style={styles.ownedText}>Owned</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy(book.id)}>
                    <Text style={styles.buyBtnText}>Buy</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* Book detail modal */}
      <Modal visible={!!selectedBook} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, SHADOW.lg]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalCover}>{selectedBook?.cover}</Text>
            <View style={styles.courseTagModal}>
              <Text style={styles.courseTagText}>{selectedBook?.course}</Text>
            </View>
            <Text style={styles.modalTitle}>{selectedBook?.title}</Text>
            <Text style={styles.modalAuthor}>by {selectedBook?.author}</Text>
            <Text style={styles.modalDesc}>{selectedBook?.description}</Text>
            <Text style={styles.modalPrice}>₦{selectedBook?.price?.toLocaleString()}</Text>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBook(null)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
              {selectedBook && !selectedBook.purchased ? (
                <TouchableOpacity style={styles.modalBuyBtn} onPress={() => handleBuy(selectedBook.id)}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    style={styles.modalBuyBtnGradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.modalBuyBtnText}>Purchase Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={[styles.modalBuyBtn, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.modalBuyBtnText, { color: COLORS.secondary }]}>✓ Already Owned</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  cartBadge: { position: 'relative' },
  badge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#FFD700', borderRadius: RADIUS.full,
    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary },
  statLbl: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  list: { flex: 1, paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary, marginVertical: SPACING.md },
  bookCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl,
    flexDirection: 'row', padding: SPACING.md, marginBottom: SPACING.md,
  },
  bookCover: {
    width: 72, height: 92, borderRadius: RADIUS.md,
    backgroundColor: '#EEF0FF', justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.md,
  },
  bookEmoji: { fontSize: 36 },
  bookInfo: { flex: 1 },
  courseTag: {
    backgroundColor: COLORS.overlay, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: SPACING.xs,
  },
  courseTagText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '700' },
  bookTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  bookAuthor: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  bookFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookPrice: { fontSize: FONTS.sizes.lg, fontWeight: '900', color: COLORS.primary },
  ownedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  ownedText: { fontSize: FONTS.sizes.xs, color: COLORS.secondary, fontWeight: '700' },
  buyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  buyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.card, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: SPACING.xl, alignItems: 'center',
  },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: SPACING.lg },
  modalCover: { fontSize: 64, marginBottom: SPACING.md },
  courseTagModal: {
    backgroundColor: COLORS.overlay, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: 4, marginBottom: SPACING.sm,
  },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 4 },
  modalAuthor: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  modalDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.md },
  modalPrice: { fontSize: FONTS.sizes.xxl, fontWeight: '900', color: COLORS.primary, marginBottom: SPACING.lg },
  modalBtns: { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  closeBtn: { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center' },
  closeBtnText: { fontWeight: '700', color: COLORS.textSecondary },
  modalBuyBtn: { flex: 2, borderRadius: RADIUS.md, overflow: 'hidden' },
  modalBuyBtnGradient: { paddingVertical: SPACING.md, alignItems: 'center' },
  modalBuyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
});
