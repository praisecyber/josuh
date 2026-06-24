import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../../constants/theme';
import { MOCK_BOOKS } from '../../constants/mockData';

export default function LecturerBooksScreen() {
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [showUpload, setShowUpload] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', course: '', price: '' });

  const handleUpload = () => {
    if (!newBook.title || !newBook.course) {
      Alert.alert('Error', 'Please fill in book title and course'); return;
    }
    const book = {
      id: Date.now().toString(),
      title: newBook.title,
      course: newBook.course,
      author: 'You',
      price: parseInt(newBook.price) || 0,
      cover: '📘',
      description: 'Uploaded by lecturer',
      purchased: false,
    };
    setBooks(prev => [book, ...prev]);
    setNewBook({ title: '', course: '', price: '' });
    setShowUpload(false);
    Alert.alert('Success! 📚', 'Book uploaded to the bookstore');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Course Books</Text>
            <Text style={styles.headerSub}>Manage your uploaded materials</Text>
          </View>
          <TouchableOpacity style={styles.uploadBtn} onPress={() => setShowUpload(true)}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, SHADOW.sm]}>
            <Text style={styles.statNum}>{books.length}</Text>
            <Text style={styles.statLbl}>Total Books</Text>
          </View>
          <View style={[styles.statCard, SHADOW.sm]}>
            <Text style={[styles.statNum, { color: COLORS.secondary }]}>{books.filter(b => b.purchased).length}</Text>
            <Text style={styles.statLbl}>Sold</Text>
          </View>
          <View style={[styles.statCard, SHADOW.sm]}>
            <Text style={[styles.statNum, { color: '#FFD700' }]}>
              ₦{books.reduce((s, b) => s + (b.purchased ? b.price : 0), 0).toLocaleString()}
            </Text>
            <Text style={styles.statLbl}>Revenue</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Books</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowUpload(true)}>
            <Ionicons name="add-circle" size={20} color={COLORS.lectGradientEnd} />
            <Text style={styles.addBtnText}>Upload Book</Text>
          </TouchableOpacity>
        </View>

        {books.map(book => (
          <View key={book.id} style={[styles.bookCard, SHADOW.sm]}>
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
                <View style={[styles.soldBadge, { backgroundColor: book.purchased ? '#E8F5E9' : '#F5F5F5' }]}>
                  <Text style={[styles.soldBadgeText, { color: book.purchased ? COLORS.secondary : COLORS.textSecondary }]}>
                    {book.purchased ? '✓ Sold' : 'Available'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => Alert.alert('Remove Book', 'Remove this book from the store?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => setBooks(p => p.filter(b => b.id !== book.id)) }
              ])}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* Upload Modal */}
      <Modal visible={showUpload} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, SHADOW.lg]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Upload Course Book</Text>
            <Text style={styles.modalSub}>Add a new book to the bookstore</Text>

            {[
              { label: 'Book Title', field: 'title', placeholder: 'e.g. Data Structures & Algorithms' },
              { label: 'Course Code', field: 'course', placeholder: 'e.g. CSC 214' },
              { label: 'Price (₦)', field: 'price', placeholder: 'e.g. 2500', keyboard: 'numeric' },
            ].map(({ label, field, placeholder, keyboard }) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textSecondary}
                    value={newBook[field as keyof typeof newBook]}
                    onChangeText={val => setNewBook(p => ({ ...p, [field]: val }))}
                    keyboardType={keyboard as any || 'default'}
                  />
                </View>
              </View>
            ))}

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowUpload(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadModalBtn} onPress={handleUpload}>
                <LinearGradient
                  colors={[COLORS.lectGradientStart, COLORS.lectGradientEnd]}
                  style={styles.uploadModalBtnGradient}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.uploadModalBtnText}>Upload</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  uploadBtn: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xl, fontWeight: '900', color: COLORS.textPrimary },
  statLbl: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  list: { flex: 1, paddingHorizontal: SPACING.md },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.md },
  listTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: FONTS.sizes.sm, color: COLORS.lectGradientEnd, fontWeight: '600' },
  bookCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl,
    flexDirection: 'row', padding: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center',
  },
  bookCover: { width: 64, height: 80, borderRadius: RADIUS.md, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  bookEmoji: { fontSize: 32 },
  bookInfo: { flex: 1 },
  courseTag: { backgroundColor: '#E8F5E920', borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  courseTagText: { fontSize: FONTS.sizes.xs, color: COLORS.lectGradientEnd, fontWeight: '700' },
  bookTitle: { fontSize: FONTS.sizes.sm, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  bookAuthor: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  bookFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookPrice: { fontSize: FONTS.sizes.md, fontWeight: '900', color: COLORS.lectGradientEnd },
  soldBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  soldBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  deleteBtn: { padding: SPACING.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: SPACING.xl },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  modalSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  inputGroup: { marginBottom: SPACING.md },
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, height: 48 },
  input: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  modalBtns: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  cancelBtn: { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center' },
  cancelBtnText: { fontWeight: '700', color: COLORS.textSecondary },
  uploadModalBtn: { flex: 2, borderRadius: RADIUS.md, overflow: 'hidden' },
  uploadModalBtnGradient: { flexDirection: 'row', paddingVertical: SPACING.md, alignItems: 'center', justifyContent: 'center', gap: 8 },
  uploadModalBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FONTS.sizes.md },
});
