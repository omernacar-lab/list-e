import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LogOut, ShoppingBasket, Plus } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { ListItem, FrequentItem } from '../types';

export default function ListScreen() {
  const {
    roomCode,
    liste,
    sikBitenler,
    input,
    setInput,
    miktar,
    setMiktar,
    cizilenler,
    cikisYap,
    ekle,
    satinAlindi,
  } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Odadan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış', onPress: cikisYap, style: 'destructive' },
      ]
    );
  };

  const handleAddItem = () => {
    ekle(input, miktar);
  };

  const handleCopyRoomCode = async () => {
    await Clipboard.setStringAsync(roomCode);
    Alert.alert('✅ Kopyalandı', `Oda kodu "${roomCode}" kopyalandı!`);
  };

  const renderListItem = ({ item }: { item: ListItem }) => {
    const isCizili = cizilenler.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.item, isCizili && styles.ciziliItem]}
        onPress={() => satinAlindi(item)}
      >
        <Text style={[styles.itemText, isCizili && styles.ciziliText]}>
          {item.isim}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFrequentItem = ({ item }: { item: FrequentItem }) => (
    <TouchableOpacity
      style={styles.frequentBtn}
      onPress={() => ekle(item.urunIsmi)}
    >
      <Text style={styles.frequentBtnText}>{item.urunIsmi} +</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={Colors.textLight} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ShoppingBasket size={30} color={Colors.primaryDark} />
          <Text style={styles.title}>List-e</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <TouchableOpacity style={styles.roomInfo} onPress={handleCopyRoomCode}>
        <Text style={styles.roomText}>Oda: <Text style={styles.roomCode}>{roomCode}</Text></Text>
        <Text style={styles.copyHint}>📋 Kopyalamak için tıkla</Text>
      </TouchableOpacity>

      {/* Input Group */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.productInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ne bitti?"
          placeholderTextColor={Colors.textLight}
        />
        <TextInput
          style={styles.quantityInput}
          value={miktar}
          onChangeText={setMiktar}
          placeholder="Adet"
          placeholderTextColor={Colors.textLight}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ALINACAKLAR</Text>
        {liste.length === 0 ? (
          <Text style={styles.emptyText}>Liste şu an boş.</Text>
        ) : (
          <FlatList
            data={liste}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        )}
      </View>

      {/* Frequent Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SIK BİTENLER</Text>
        <FlatList
          data={sikBitenler}
          renderItem={renderFrequentItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.frequentList}
          contentContainerStyle={styles.frequentListContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logoutBtn: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
    borderRadius: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  roomInfo: {
    alignSelf: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  roomText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  roomCode: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  copyHint: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 6,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.border,
    marginHorizontal: 20,
    marginBottom: 25,
    alignItems: 'center',
  },
  productInput: {
    flex: 3,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  quantityInput: {
    width: 60,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.text,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 15,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    backgroundColor: Colors.cardBackground,
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  ciziliItem: {
    opacity: 0.5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  ciziliText: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  emptyText: {
    textAlign: 'center',
    color: '#bdc3c7',
    fontStyle: 'italic',
    marginTop: 40,
  },
  frequentList: {
    maxHeight: 50,
  },
  frequentListContent: {
    gap: 8,
  },
  frequentBtn: {
    backgroundColor: Colors.lightGreen,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  frequentBtnText: {
    color: Colors.primaryDark,
    fontWeight: '600',
    fontSize: 14,
  },
});
