import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, limit, setDoc, getDoc, where } from "firebase/firestore"; 
import { ShoppingBasket, Plus, LogOut, ShoppingCart } from 'lucide-react';

const ListEHome = ({ onJoinRoom }) => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');

  // 6 Haneli Kod Üretici
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Okunması zor harfleri (0, I, O) çıkardım
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = () => {
    const code = generateRoomCode();
    setGeneratedCode(code);
    // 2 saniye sonra otomatik odaya yönlendir veya kullanıcı kodun üstüne tıklasın
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Kod kopyalandı! Eşine WhatsApp'tan gönder gelsin. 🚀");
  };

  return (
    <div className="app-container">
      {/* ÜST BÖLÜM: LOGO VE İSİM */}
      <header className="app-header">
        <div className="logo-wrapper">
          <ShoppingCart size={48} color="#4CAF50" strokeWidth={2.5} />
        </div>
        <h1 className="brand-name">List-e</h1>
        <p className="tagline">Aileniz için akıllı alışveriş listesi</p>
      </header>

      {/* ORTA BÖLÜM: AKSİYONLAR */}
      <main className="action-area">
        
        {/* ODA OLUŞTURMA KARTI */}
        <div className="card create-card">
          <h2>Yeni Liste Başlat</h2>
          <button className="primary-btn" onClick={handleCreate}>Oda Oluştur</button>
          
          {generatedCode && (
            <div className="code-box" onClick={() => copyToClipboard(generatedCode)}>
              <span className="code-text">{generatedCode}</span>
              <p className="code-hint">Kopyalamak için tıkla</p>
            </div>
          )}
        </div>

        {/* ODAYA KATILMA KARTI */}
        <div className="card join-card">
          <h2>Mevcut Listeye Gir</h2>
          <input 
            type="text" 
            placeholder="6 Haneli Kodu Yaz" 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="code-input"
          />
          <button 
            className="secondary-btn" 
            onClick={() => onJoinRoom(inputCode)}
            disabled={inputCode.length < 6}
          >
            Odaya Katıl
          </button>
        </div>
      </main>
    </div>
  );
};

function App() {
  const [roomCode, setRoomCode] = useState(localStorage.getItem("list-e-code") || ""); // Kod hafızadan alınır
  const [input, setInput] = useState(""); 
  const [miktar, setMiktar] = useState("");
  const [liste, setListe] = useState([]); 
  const [sikBitenler, setSikBitenler] = useState([]); 

  // Odaya Giriş Yap
  const odayaGir = (code) => {
    if(code.trim() !== "") {
      const temizKod = code.toLowerCase().trim();
      localStorage.setItem("list-e-code", temizKod);
      setRoomCode(temizKod);
    }
  };

  // Çıkış Yap (Odayı Değiştir)
  const cikisYap = () => {
    localStorage.removeItem("list-e-code");
    setRoomCode("");
  };

  // 1. CANLI LİSTE: Sadece bu odaya (roomCode) ait verileri çek
  useEffect(() => {
    if (!roomCode) return;
    const q = query(collection(db, "alinacaklar"), where("roomCode", "==", roomCode));
    const unsub = onSnapshot(q, (snapshot) => {
      setListe(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [roomCode]);

  // 2. AKILLI LİSTE: Sadece bu odaya özel istatistikleri çek
  useEffect(() => {
    if (!roomCode) return;
    const q = query(collection(db, "istatistik"), where("roomCode", "==", roomCode), orderBy("puan", "desc"), limit(5));
    const unsub = onSnapshot(q, (snapshot) => {
      setSikBitenler(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [roomCode]);

  // EKLEME FONKSİYONU (roomCode ile)
  const ekle = async (item, adet = "") => {
    if(item.trim() !== "") {
      const urunIsmi = item.toLowerCase().trim();
      // Baş harfi büyük yap
      const urunIsmiBuyukBasHarf = urunIsmi.charAt(0).toUpperCase() + urunIsmi.slice(1);
      const tamMetin = adet ? `${urunIsmiBuyukBasHarf} (${adet})` : urunIsmiBuyukBasHarf;
      await addDoc(collection(db, "alinacaklar"), { 
        isim: tamMetin, 
        safIsim: urunIsmi, 
        roomCode: roomCode, // Veriyi odaya mühürle
        tarih: new Date() 
      });
      setInput(""); setMiktar("");
    }
  };

  // SATIN ALINDI (Odaya özel puanlama)
// App.js içinde satinAlindi fonksiyonunu güncelle
const [cizilenler, setCizilenler] = useState([]); // Üstü çizilenleri takip etmek için

const satinAlindi = async (urun) => {
  // Görsel olarak üstünü çiz
  setCizilenler(prev => [...prev, urun.id]);

  // 1 saniye bekle ki kullanıcı o "çizilme" keyfini yaşasın
  setTimeout(async () => {
    await deleteDoc(doc(db, "alinacaklar", urun.id));
    
    const istatistikID = `${roomCode}_${urun.safIsim}`;
    const istatistikRef = doc(db, "istatistik", istatistikID);
    const docSnap = await getDoc(istatistikRef);

    if (docSnap.exists()) {
      await setDoc(istatistikRef, { puan: docSnap.data().puan + 1 }, { merge: true });
    } else {
      await setDoc(istatistikRef, { puan: 1, roomCode: roomCode, urunIsmi: urun.safIsim });
    }
    // Çizilenler listesinden temizle
    setCizilenler(prev => prev.filter(id => id !== urun.id));
  }, 800);
};

  // --- GİRİŞ EKRANI ---
  if (!roomCode) {
    return <ListEHome onJoinRoom={odayaGir} />;
  }

  // --- ANA UYGULAMA EKRANI ---
// --- ANA UYGULAMA EKRANI ---
return (
  <div className="App">
    <div className="ust-bar">
      <button className="cikis-btn" onClick={cikisYap}>
        <LogOut size={20} />
      </button>
      <h1 className="ana-baslik">
        <ShoppingBasket size={30} /> List-e
      </h1>
      <div style={{ width: 20 }}></div> {/* Logoyu ortalamak için dengeleyici boşluk */}
    </div>
    
    <p className="room-info">Oda: <b>{roomCode}</b></p>
    
    {/* Geri kalan her şey aynı kalıyor... */}
      
      <div className="input-grubu">
        <input className="urun-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ne bitti?" />
        <input className="miktar-input" value={miktar} onChange={(e) => setMiktar(e.target.value)} placeholder="Adet" />
        <button className="ekle-buton" onClick={() => ekle(input, miktar)}><Plus color="white" /></button>
      </div>

      <div className="section">
        <h3>Alınacaklar</h3>
        <div className="liste-alani">
          {liste.map((urun) => (
            <div 
              key={urun.id} 
              className={`item ${cizilenler.includes(urun.id) ? 'cizili' : ''}`} 
              onClick={() => satinAlindi(urun)}
            >
              <div className="urun-metin">
                <span className="urun-isim">{urun.isim}</span>
              </div>
            </div>
          ))}
        </div>
        {liste.length === 0 && <p className="bos-uyari">Liste şu an boş.</p>}
      </div>

      <div className="section">
        <h3>Sık Bitenler</h3>
        <div className="quick-adds">
          {sikBitenler.map(sb => (
            <button key={sb.id} onClick={() => ekle(sb.urunIsmi)}>{sb.urunIsmi} +</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;