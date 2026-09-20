import React from 'react';

export default function Navbar({ currentView, setView }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 p-1 flex items-center justify-center">
              <img src="/static/images/veerasetu_logo.svg" alt="Veerasetu Logo" className="w-full h-full" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-serif tracking-wider text-stone-900">
                VEERASETU
              </span>
              <span className="block text-[9px] tracking-widest uppercase font-semibold text-amber-900/80 -mt-1">
                Heritage & Arts Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {['home', 'explorer', 'arts', 'teachers', 'map', 'passport', 'about'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`capitalize py-1 transition ${
                  currentView === v
                    ? 'text-amber-800 font-bold border-b-2 border-amber-700'
                    : 'text-stone-600 hover:text-amber-800'
                }`}
              >
                {v === 'passport' ? '🛂 Passport' : v === 'explorer' ? 'Heritage Explorer' : v === 'arts' ? 'Traditional Arts' : v === 'teachers' ? 'Find a Teacher' : v === 'map' ? 'Heritage Map' : v}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setView('explorer')}
            className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm shadow-sm transition"
          >
            Explore Heritage
          </button>
        </div>
      </div>
    </header>
  );
}
