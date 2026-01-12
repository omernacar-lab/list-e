import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, limit, setDoc, getDoc, where, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import { ListItem, FrequentItem } from '../types';
import { registerForPushNotificationsAsync, savePushToken, setupNotificationListeners } from '../utils/notifications';

interface AppContextType {
  roomCode: string;
  setRoomCode: (code: string) => void;
  liste: ListItem[];
  sikBitenler: FrequentItem[];
  input: string;
  setInput: (text: string) => void;
  miktar: string;
  setMiktar: (text: string) => void;
  cizilenler: string[];
  odayaGir: (code: string) => Promise<void>;
  cikisYap: () => Promise<void>;
  ekle: (item: string, adet?: string) => Promise<void>;
  satinAlindi: (urun: ListItem) => Promise<void>;
  clearRoomStats: () => Promise<void>;
  cleanupLowFrequencyItems: () => Promise<number>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomCode, setRoomCodeState] = useState('');
  const [input, setInput] = useState('');
  const [miktar, setMiktar] = useState('');
  const [liste, setListe] = useState<ListItem[]>([]);
  const [sikBitenler, setSikBitenler] = useState<FrequentItem[]>([]);
  const [cizilenler, setCizilenler] = useState<string[]>([]);

  // Load room code from AsyncStorage on mount
  useEffect(() => {
    loadRoomCode();
    // Bildirim listener'larını kur
    const cleanup = setupNotificationListeners();
    return cleanup;
  }, []);

  const loadRoomCode = async () => {
    try {
      const savedCode = await AsyncStorage.getItem('list-e-code');
      if (savedCode) {
        setRoomCodeState(savedCode);
      }
    } catch (error) {
      console.error('Error loading room code:', error);
    }
  };

  // Listen to liste changes
  useEffect(() => {
    if (!roomCode) return;
    const q = query(collection(db, 'alinacaklar'), where('roomCode', '==', roomCode));
    const unsub = onSnapshot(q, (snapshot) => {
      setListe(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ListItem)));
    });
    return () => unsub();
  }, [roomCode]);

  // Listen to frequent items
  useEffect(() => {
    if (!roomCode) return;
    const q = query(
      collection(db, 'istatistik'),
      where('roomCode', '==', roomCode),
      where('puan', '>=', 4), // En az 4 kez satın alınmış ürünler
      orderBy('puan', 'desc'),
      limit(5)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setSikBitenler(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FrequentItem)));
    });
    return () => unsub();
  }, [roomCode]);

  const setRoomCode = async (code: string) => {
    setRoomCodeState(code);
    if (code) {
      await AsyncStorage.setItem('list-e-code', code);
      
      // Push token al ve kaydet (optional - hata olursa devam et)
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await savePushToken(code, token);
          console.log('✅ Bildirimler aktif');
        } else {
          console.log('⚠️ Bildirimler devre dışı (Expo Go sınırlaması)');
        }
      } catch (error) {
        console.log('Bildirim kurulumu atlandı:', error);
      }
    }
  };

  const odayaGir = async (code: string) => {
    if (code.trim() !== '') {
      const temizKod = code.toLowerCase().trim();
      await setRoomCode(temizKod);
    }
  };

  const cikisYap = async () => {
    await AsyncStorage.removeItem('list-e-code');
    setRoomCodeState('');
  };

  const ekle = async (item: string, adet: string = '') => {
    if (item.trim() !== '') {
      const urunIsmi = item.toLowerCase().trim();
      const urunIsmiBuyukBasHarf = urunIsmi.charAt(0).toUpperCase() + urunIsmi.slice(1);
      const tamMetin = adet ? `${urunIsmiBuyukBasHarf} (${adet})` : urunIsmiBuyukBasHarf;
      
      await addDoc(collection(db, 'alinacaklar'), {
        isim: tamMetin,
        safIsim: urunIsmi,
        roomCode: roomCode,
        tarih: new Date()
      });
      
      setInput('');
      setMiktar('');
    }
  };

  const satinAlindi = async (urun: ListItem) => {
    // Mark as striked
    setCizilenler(prev => [...prev, urun.id]);

    // Wait for animation
    setTimeout(async () => {
      await deleteDoc(doc(db, 'alinacaklar', urun.id));

      const istatistikID = `${roomCode}_${urun.safIsim}`;
      const istatistikRef = doc(db, 'istatistik', istatistikID);
      const docSnap = await getDoc(istatistikRef);

      if (docSnap.exists()) {
        await setDoc(istatistikRef, { puan: docSnap.data().puan + 1 }, { merge: true });
      } else {
        await setDoc(istatistikRef, { puan: 1, roomCode: roomCode, urunIsmi: urun.safIsim });
      }

      setCizilenler(prev => prev.filter(id => id !== urun.id));
    }, 800);
  };

  const clearRoomStats = async () => {
    if (!roomCode) return;
    
    try {
      const statsQuery = query(
        collection(db, 'istatistik'),
        where('roomCode', '==', roomCode)
      );
      const statsSnapshot = await getDocs(statsQuery);
      
      const deletePromises = statsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`${statsSnapshot.size} istatistik kaydı silindi`);
    } catch (error) {
      console.error('İstatistik temizleme hatası:', error);
      throw error;
    }
  };

  const cleanupLowFrequencyItems = async (): Promise<number> => {
    if (!roomCode) return 0;
    
    try {
      const statsQuery = query(
        collection(db, 'istatistik'),
        where('roomCode', '==', roomCode),
        where('puan', '<', 4)
      );
      const statsSnapshot = await getDocs(statsQuery);
      
      const deletePromises = statsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`${statsSnapshot.size} düşük frekanslı kayıt silindi`);
      return statsSnapshot.size;
    } catch (error) {
      console.error('Düşük frekanslı kayıt temizleme hatası:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        roomCode,
        setRoomCode: setRoomCode,
        liste,
        sikBitenler,
        input,
        setInput,
        miktar,
        setMiktar,
        cizilenler,
        odayaGir,
        cikisYap,
        ekle,
        satinAlindi,
        clearRoomStats,
        cleanupLowFrequencyItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
