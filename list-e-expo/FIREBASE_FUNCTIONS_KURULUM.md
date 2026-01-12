# 🔔 Firebase Cloud Functions ile Bildirim Kurulumu

## 📋 Ön Hazırlık

### 1. Firebase CLI Kurulumu
```bash
npm install -g firebase-tools
firebase login
```

### 2. Functions Klasörü Oluştur
```bash
cd list-e-expo
firebase init functions
```

**Seçenekler:**
- Select a default Firebase project → list-e-8a990
- Language → TypeScript
- ESLint → Yes
- Install dependencies now → Yes

## 📁 Functions Kodu

`functions/src/index.ts` dosyasına şu kodu yapıştır:

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// Yeni ürün eklendiğinde tetiklenir
export const onProductAdded = functions.firestore
  .document("alinacaklar/{productId}")
  .onCreate(async (snapshot, context) => {
    const newProduct = snapshot.data();
    const roomCode = newProduct.roomCode;
    const productName = newProduct.isim;

    try {
      // Bu odadaki tüm push token'ları al
      const tokensSnapshot = await db
        .collection("pushTokens")
        .where("roomCode", "==", roomCode)
        .get();

      if (tokensSnapshot.empty) {
        console.log("Bu odada bildirim alan kimse yok");
        return null;
      }

      // Tüm token'lara bildirim gönder
      const messages = tokensSnapshot.docs.map((doc) => {
        const tokenData = doc.data();
        return {
          to: tokenData.token,
          sound: "default",
          title: "🛒 Yeni Ürün Eklendi!",
          body: `${productName} listeye eklendi`,
          data: { roomCode, productName },
          badge: 1,
        };
      });

      // Expo Push API'ye gönder
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      console.log("Bildirimler gönderildi:", result);

      return result;
    } catch (error) {
      console.error("Bildirim gönderme hatası:", error);
      return null;
    }
  });

// Ürün satın alındığında bildirim (opsiyonel)
export const onProductDeleted = functions.firestore
  .document("alinacaklar/{productId}")
  .onDelete(async (snapshot, context) => {
    const deletedProduct = snapshot.data();
    const roomCode = deletedProduct.roomCode;
    const productName = deletedProduct.isim;

    try {
      const tokensSnapshot = await db
        .collection("pushTokens")
        .where("roomCode", "==", roomCode)
        .get();

      if (tokensSnapshot.empty) {
        return null;
      }

      const messages = tokensSnapshot.docs.map((doc) => {
        const tokenData = doc.data();
        return {
          to: tokenData.token,
          sound: "default",
          title: "✅ Ürün Alındı",
          body: `${productName} satın alındı olarak işaretlendi`,
          data: { roomCode, productName },
        };
      });

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Bildirim gönderme hatası:", error);
      return null;
    }
  });
```

## 🚀 Deploy

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## ✅ Test

1. Bir cihazda odaya gir
2. İkinci cihazda aynı odaya gir
3. Birinden ürün ekle
4. Diğerinde bildirim gelecek! 🎉

## 🔧 Sorun Giderme

### Blaze Plan Gerekli
Firebase Functions **ücretsiz** değil, Blaze (pay-as-you-go) plan gerekiyor.

**Ama endişelenme:**
- İlk 2 milyon çağrı ücretsiz
- Aylık ~$0-5 arası (düşük kullanım)

### Alternatif: Client-Side Bildirim
Cloud Functions istemiyorsan, uygulama içinde manuel bildirim gönderebiliriz ama daha az güvenilir.

---

## 📝 Notlar

- `your-project-id-here` yerine `app.json`daki EAS project ID'yi yaz
- Firebase Console → Firestore → pushTokens collection'ı oluşturulacak otomatik
- Her cihaz odaya girdiğinde token kaydedilir

**Hazırsın!** 🔥
