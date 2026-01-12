import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import HomeScreen from '@/components/HomeScreen';
import ListScreen from '@/components/ListScreen';

function MainApp() {
  const { roomCode } = useApp();
  
  return roomCode ? <ListScreen /> : <HomeScreen />;
}

export default function Index() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
