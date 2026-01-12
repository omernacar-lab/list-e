const {onDocumentCreated, onDocumentDeleted} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

// Yeni ürün eklendiğinde bildirim gönder
exports.onProductAdded = onDocumentCreated("alinacaklar/{productId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const newProduct = snapshot.data();
  const roomCode = newProduct.roomCode;
  const productName = newProduct.isim;

  console.log(`Yeni ürün eklendi: ${productName} - Oda: ${roomCode}`);

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
    const messages = [];
    tokensSnapshot.forEach((doc) => {
      const tokenData = doc.data();
      messages.push({
        to: tokenData.token,
        sound: "default",
        title: "🛒 Yeni Ürün Eklendi!",
        body: `${productName} listeye eklendi`,
        data: {roomCode, productName},
        badge: 1,
      });
    });

    console.log(`${messages.length} cihaza bildirim gönderiliyor...`);

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
exports.onProductDeleted = onDocumentDeleted("alinacaklar/{productId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const deletedProduct = snapshot.data();
  const roomCode = deletedProduct.roomCode;
  const productName = deletedProduct.isim;

  console.log(`Ürün silindi: ${productName} - Oda: ${roomCode}`);

  try {
    const tokensSnapshot = await db
        .collection("pushTokens")
        .where("roomCode", "==", roomCode)
        .get();

    if (tokensSnapshot.empty) {
      return null;
    }

    const messages = [];
    tokensSnapshot.forEach((doc) => {
      const tokenData = doc.data();
      messages.push({
        to: tokenData.token,
        sound: "default",
        title: "✅ Ürün Alındı",
        body: `${productName} satın alındı olarak işaretlendi`,
        data: {roomCode, productName},
      });
    });

    console.log(`${messages.length} cihaza bildirim gönderiliyor...`);

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
