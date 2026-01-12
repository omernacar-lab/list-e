import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Bildirim davranışını ayarla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token = null;

  try {
    if (!Device.isDevice) {
      console.log('Bildirimler sadece fiziksel cihazlarda çalışır');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Bildirim izni verilmedi');
      return null;
    }
    
    // projectId olmadan token al (Expo Go için)
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token alındı:', token);
  } catch (error) {
    console.log('Bildirim hatası (optional özellik):', error);
    return null;
  }

  if (Platform.OS === 'android') {
    try {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2ecc71',
      });
    } catch (error) {
      console.log('Android notification channel hatası:', error);
    }
  }

  return token;
}

export async function savePushToken(roomCode: string, token: string) {
  if (!token) return;
  
  try {
    // Token'ı Firestore'da sakla
    const tokenRef = doc(db, 'pushTokens', `${roomCode}_${token.substring(token.length - 10)}`);
    await setDoc(tokenRef, {
      token,
      roomCode,
      createdAt: new Date(),
      platform: Platform.OS,
    });
  } catch (error) {
    console.error('Token kaydetme hatası:', error);
  }
}

export function setupNotificationListeners() {
  try {
    // Bildirim geldiğinde
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Bildirim alındı:', notification);
    });

    // Bildirime tıklandığında
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Bildirime tıklandı:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  } catch (error) {
    console.log('Bildirim listener hatası (optional):', error);
    return () => {}; // Empty cleanup function
  }
}
