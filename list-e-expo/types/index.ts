export interface ListItem {
  id: string;
  isim: string;
  safIsim: string;
  roomCode: string;
  tarih: Date;
}

export interface FrequentItem {
  id: string;
  puan: number;
  roomCode: string;
  urunIsmi: string;
}
