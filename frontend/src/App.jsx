import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeritageExplorer from './components/HeritageExplorer';

export default function App() {
  const [currentView, setView] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar currentView={currentView} setView={setView} />
      <main className="flex-grow">
        {/* Veerasetu App Shell */}
      </main>
    </div>
  );
}
