import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Info, ExternalLink, FileText, Shield, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const appVersion = '1.0.0';
  const { roomCode, clearRoomStats } = useApp();

  const openLink = async (url: string, title: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Hata', `${title} açılamadı`);
    }
  };

  const showAbout = () => {
    Alert.alert(
      'List-e Hakkında',
      'List-e, ailenizle birlikte kullanabileceğiniz akıllı bir alışveriş listesi uygulamasıdır.\n\n' +
      '✨ Özellikler:\n' +
      '• 6 haneli kod ile liste paylaşımı\n' +
      '• Gerçek zamanlı senkronizasyon\n' +
      '• Akıllı ürün önerileri\n' +
      '• Tamamen ücretsiz\n\n' +
      '© 2026 List-e',
      [{ text: 'Tamam' }]
    );
  };

  const handleClearStats = () => {
    if (!roomCode) {
      Alert.alert('Uyarı', 'Önce bir odaya giriş yapmalısınız.');
      return;
    }

    Alert.alert(
      'İstatistikleri Temizle',
      `"${roomCode}" odasının tüm "Sık Bitenler" istatistikleri silinecek. Emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearRoomStats();
              Alert.alert('✅ Başarılı', 'Sık Bitenler istatistikleri temizlendi!');
            } catch (error) {
              Alert.alert('❌ Hata', 'İstatistikler temizlenirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
        <Text style={styles.subtitle}>v{appVersion}</Text>
      </View>

      {/* Clear Stats */}
      {roomCode && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.card, styles.dangerCard]} 
            onPress={handleClearStats}
          >
            <View style={styles.cardHeader}>
              <Trash2 size={24} color={Colors.error} />
              <Text style={[styles.cardTitle, styles.dangerText]}>Tüm İstatistikleri Sil</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.warningText}>
            ⚠️ Bu işlem geri alınamaz. Odanın tüm ürün istatistikleri silinecektir.
          </Text>
        </View>
      )}

      {/* About */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={showAbout}>
          <View style={styles.cardHeader}>
            <FileText size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Hakkında</Text>
          </View>
          <ExternalLink size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Privacy Policy */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => openLink('https://omernacar-lab.github.io/list-e/', 'Gizlilik Politikası')}
        >
          <View style={styles.cardHeader}>
            <Shield size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Gizlilik Politikası</Text>
          </View>
          <ExternalLink size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => openLink('mailto:omer_nacar@hotmail.com?subject=List-e Destek Talebi', 'Destek')}
        >
          <View style={styles.cardHeader}>
            <Info size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Destek & İletişim</Text>
          </View>
          <ExternalLink size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>List-e ile alışveriş artık daha kolay! 🛒</Text>
        <Text style={styles.footerSubtext}>Made with ❤️ for families</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  section: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: '#fff5f5',
  },
  dangerText: {
    color: Colors.error,
  },
  warningText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 5,
    textAlign: 'center',
  },
});
