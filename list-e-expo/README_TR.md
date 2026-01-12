# List-e Expo - React Native Versiyonu

Web uygulamasından React Native'e tam aktarım tamamlandı! 🎉

## ✨ Özellikler

- ✅ **6 Haneli Oda Kodu Sistemi** - Aile bireyleriyle liste paylaşımı
- ✅ **Gerçek Zamanlı Senkronizasyon** - Firebase Firestore ile anlık güncelleme
- ✅ **Sık Bitenler Öneri Sistemi** - Akıllı ürün önerileri
- ✅ **Miktar Desteği** - Ürün adedi ekleyebilme
- ✅ **Çizme Animasyonu** - Satın alınan ürünlerin üzeri çizilir
- ✅ **AsyncStorage** - Oda kodu otomatik kaydedilir

## 🚀 Kurulum

```bash
cd list-e-expo
npm install
npm start
```

## 📱 Çalıştırma

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Web Tarayıcı
```bash
npm run web
```

## 📂 Proje Yapısı

```
list-e-expo/
├── app/
│   └── (tabs)/
│       ├── index.tsx        # Ana sayfa (Liste/Home screen router)
│       ├── settings.tsx     # Ayarlar sekmesi
│       └── _layout.tsx      # Tab navigator yapısı
├── components/
│   ├── HomeScreen.tsx       # Oda oluşturma/katılma ekranı
│   └── ListScreen.tsx       # Alışveriş listesi ekranı
├── config/
│   └── firebase.ts          # Firebase yapılandırması
├── context/
│   └── AppContext.tsx       # Global state yönetimi
├── constants/
│   └── colors.ts            # Renk paleti
└── types/
    └── index.ts             # TypeScript tipleri
```

## 🔧 Kullanılan Teknolojiler

- **Expo SDK 54** - React Native framework
- **Firebase** - Gerçek zamanlı veritabanı
- **AsyncStorage** - Yerel veri depolama
- **Lucide React Native** - İkonlar
- **TypeScript** - Tip güvenliği
- **Context API** - State management

## 🆚 Web Versiyonundan Farklar

| Özellik | Web (list-e) | Expo (list-e-expo) |
|---------|--------------|-------------------|
| Framework | React.js + Capacitor | React Native + Expo |
| Depolama | localStorage | AsyncStorage |
| İkonlar | lucide-react | lucide-react-native |
| Stil | CSS | StyleSheet API |
| Clipboard | navigator.clipboard | expo-clipboard |
| Build | Capacitor (Android) | EAS Build (iOS/Android) |

## 📝 Notlar

- Mevcut **list-e** klasöründeki web uygulamasına hiç dokunulmadı
- Her iki proje bağımsız olarak çalışabilir
- Aynı Firebase veritabanını paylaşıyorlar (odalar uyumlu)
- Web'den oluşturulan bir odaya mobil'den katılabilirsiniz ve tam tersi!

## 🎯 Gelecek Özellikler

- [ ] Bildirimler (push notifications)
- [ ] Ürün kategorileri
- [ ] Fotoğraf ekleme
- [ ] Çoklu liste desteği
- [ ] Karanlık tema
- [ ] Dil seçenekleri (EN/TR)

---

**Geliştirici:** List-e Ekibi  
**Tarih:** Ocak 2026
