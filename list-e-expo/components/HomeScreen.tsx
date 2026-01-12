import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ShoppingCart } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  const { odayaGir } = useApp();
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = () => {
    const code = generateRoomCode();
    setGeneratedCode(code);
  };

  const copyToClipboard = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert('✅ Başarılı', "Kod kopyalandı! Eşine WhatsApp'tan gönder gelsin. 🚀");
  };

  const handleJoin = () => {
    if (inputCode.length === 6) {
      odayaGir(inputCode);
    }
  };

  const handleCreateAndJoin = () => {
    if (generatedCode) {
      odayaGir(generatedCode);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <ShoppingCart size={48} color={Colors.primary} strokeWidth={2.5} />
        </View>
        <Text style={styles.brandName}>List-e</Text>
        <Text style={styles.tagline}>Aileniz için akıllı alışveriş listesi</Text>
      </View>

      {/* Create Room Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Yeni Liste Başlat</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate}>
          <Text style={styles.primaryBtnText}>Oda Oluştur</Text>
        </TouchableOpacity>

        {generatedCode && (
          <>
            <TouchableOpacity
              style={styles.codeBox}
              onPress={() => copyToClipboard(generatedCode)}
            >
              <Text style={styles.codeText}>{generatedCode}</Text>
              <Text style={styles.codeHint}>Kopyalamak için tıkla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.joinCreatedBtn}
              onPress={handleCreateAndJoin}
            >
              <Text style={styles.joinCreatedBtnText}>Bu Odaya Gir</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Join Room Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mevcut Listeye Gir</Text>
        <TextInput
          style={styles.codeInput}
          placeholder="6 Haneli Kodu Yaz"
          value={inputCode}
          onChangeText={(text) => setInputCode(text.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
          placeholderTextColor={Colors.textLight}
        />
        <TouchableOpacity
          style={[styles.secondaryBtn, inputCode.length < 6 && styles.disabledBtn]}
          onPress={handleJoin}
          disabled={inputCode.length < 6}
        >
          <Text style={styles.secondaryBtnText}>Odaya Katıl</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    marginBottom: 10,
  },
  brandName: {
    fontSize: 48,
    color: Colors.primaryDark,
    fontWeight: '800',
    marginTop: 10,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 5,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    padding: 25,
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.text,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  codeBox: {
    marginTop: 15,
    backgroundColor: Colors.paleGreen,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: '#1b5e20',
  },
  codeHint: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 5,
  },
  joinCreatedBtn: {
    marginTop: 10,
    backgroundColor: Colors.primaryDark,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinCreatedBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: Colors.text,
  },
  secondaryBtn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledBtn: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
});
