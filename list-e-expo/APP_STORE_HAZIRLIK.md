# 🍎 App Store Yayınlama Rehberi

## 📋 Ön Hazırlık

### 1️⃣ Apple Developer Hesabı
- [ ] Apple Developer Program'a kayıt olun ($99/yıl)
- [ ] App Store Connect hesabını aktif edin
- [ ] Certificates, Identifiers & Profiles bölümünde App ID oluşturun

### 2️⃣ EAS CLI Kurulumu
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 3️⃣ Proje ID Alın
```bash
eas project:init
```
Bu komut çalıştıktan sonra size bir `projectId` verecek. Bu ID'yi `app.json` dosyasındaki `extra.eas.projectId` alanına yazın.

---

## 🏗️ Build Alma

### iOS Build (App Store için)
```bash
# Önce production build alın
eas build --platform ios --profile production

# Build tamamlanınca simulator'da test edin
eas build --platform ios --profile preview
```

### Android Build (Play Store için - ihtiyaç halinde)
```bash
# AAB formatında (Play Store)
eas build --platform android --profile production

# APK formatında (test için)
eas build --platform android --profile preview
```

---

## 📱 App Store Connect Ayarları

### 1. Yeni Uygulama Oluşturun
- App Store Connect → My Apps → + → New App
- **Name:** List-e
- **Primary Language:** Turkish
- **Bundle ID:** com.liste.app
- **SKU:** liste-app-001

### 2. Uygulama Bilgileri
**Kategori:** Productivity (Verimlilik)

**Kısa Açıklama (30 karakter):**
```
Akıllı Alışveriş Listesi
```

**Açıklama (4000 karakter):**
```
List-e, ailenizle birlikte kullanabileceğiniz akıllı bir alışveriş listesi uygulamasıdır.

🎯 ÖZELLİKLER:

✅ Aile Paylaşımı
6 haneli bir kod ile eşiniz veya aile bireyleriniyle aynı listeyi gerçek zamanlı olarak paylaşın.

✅ Akıllı Öneriler
Sık satın aldığınız ürünler otomatik olarak önerilir. Tek tıkla listeye ekleyin!

✅ Gerçek Zamanlı Senkronizasyon
Birisi listeye ürün eklediğinde veya marketten aldığında anında görün.

✅ Basit ve Hızlı
Karmaşık menüler yok. Sadece ürün adı ve tıkla - o kadar!

✅ Miktar Desteği
"2 kg domates" gibi adetli ürünler ekleyebilirsiniz.

📲 NASIL KULLANILIR?

1. "Oda Oluştur" butonuna tıklayın
2. Çıkan 6 haneli kodu eşinize gönderin
3. Eşiniz kodu girerek aynı listeye katılsın
4. Birlikte alışveriş yapın!

🔒 GÜVENLİ
Verileriniz Google Firebase güvenli sunucularında saklanır.

💚 ÜCRETSİZ
Tamamen ücretsiz, reklamsız ve sınırsız kullanım!

---

List-e ile alışveriş artık daha kolay ve eğlenceli! 🛒
```

**Anahtar Kelimeler (100 karakter):**
```
alışveriş,liste,aile,market,ürün,paylaşım,senkronizasyon,akıllı,verimlilik,shopping
```

**Destek URL:** https://yourwebsite.com/support  
**Pazarlama URL:** https://yourwebsite.com  
**Gizlilik Politikası:** https://yourwebsite.com/privacy

### 3. Ekran Görüntüleri Gerekli

**iPhone 6.7" (iPhone 15 Pro Max, 14 Pro Max, 13 Pro Max, 12 Pro Max)**
- 1290 x 2796 piksel
- En az 3 adet, en fazla 10 adet

**iPhone 6.5" (iPhone 11 Pro Max, XS Max)**
- 1284 x 2778 piksel

**iPad Pro 12.9" (opsiyonel)**
- 2048 x 2732 piksel

**Örnek ekran görüntüleri:**
1. Ana ekran (Oda oluşturma/katılma)
2. Liste ekranı (ürünler görünür)
3. Ürün ekleme ekranı
4. Sık bitenler öneri bölümü

---

## 🚀 Yayınlama

### 1. Build Upload
```bash
eas submit --platform ios
```

### 2. TestFlight'a Yükle (Beta Test)
- App Store Connect'te TestFlight sekmesine gidin
- Internal Testing için test kullanıcıları ekleyin
- Build'i onaylatın (Apple review ~24 saat)

### 3. App Store Review İçin Gönder
- App Store Connect → My Apps → List-e
- Version Information doldurun
- Screenshots yükleyin
- "Submit for Review" butonuna tıklayın

### 4. Review Notları (Apple için)
```
Test Hesabı:
Oda Kodu: TEST01 (uygulama açıldığında herhangi bir kod oluşturabilirsiniz)

Nasıl Test Edilir:
1. Uygulamayı açın
2. "Oda Oluştur" butonuna tıklayın
3. 6 haneli kod oluşacak
4. Alternatif olarak "Odaya Katıl" kısmına TEST01 yazabilirsiniz
5. Liste ekranında "Ne bitti?" alanına ürün ekleyin
6. Ürüne tıklayarak satın alındı olarak işaretleyin

Not: Firebase gerçek zamanlı veritabanı kullanıldığı için internet bağlantısı gereklidir.
```

---

## 📊 Versiyon Güncelleme

Yeni versiyon yayınlarken:

1. `app.json` dosyasında version'u artırın:
```json
"version": "1.0.1"
```

2. iOS için buildNumber'ı artırın:
```json
"ios": {
  "buildNumber": "1.0.1"
}
```

3. Android için versionCode'u artırın:
```json
"android": {
  "versionCode": 2
}
```

4. Yeni build alın:
```bash
eas build --platform ios --profile production
```

---

## ⚠️ Önemli Notlar

1. **App Review Süresi:** İlk yayın için 24-48 saat, güncellemeler için 12-24 saat
2. **Reddedilme Nedenleri:** 
   - Eksik metadata
   - Çalışmayan özellikler
   - Gizlilik politikası eksikliği
3. **Firebase Kuralları:** Production'da Firestore güvenlik kurallarını mutlaka aktif edin

---

## 🎯 Checklist

- [ ] Apple Developer hesabı aktif
- [ ] EAS CLI kurulu
- [ ] `eas build` başarılı
- [ ] TestFlight'ta test edildi
- [ ] Ekran görüntüleri hazırlandı
- [ ] Uygulama açıklaması yazıldı
- [ ] Gizlilik politikası URL'si eklendi
- [ ] App icon hazırlandı (1024x1024)
- [ ] Splash screen optimize edildi
- [ ] Firebase production kuralları aktif
- [ ] App Store Connect'te tüm bilgiler dolduruldu

---

**Başarılar! 🚀**

Sorularınız olursa Expo documentation'a bakın:
https://docs.expo.dev/submit/ios/
