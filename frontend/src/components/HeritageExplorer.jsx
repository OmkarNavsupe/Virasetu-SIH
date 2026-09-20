import React, { useState } from 'react';

export default function HeritageExplorer({ selectedSite, onAnalyze, onChat, chatMessages, onStartQuiz }) {
  const [question, setQuestion] = useState('');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-serif">AI Heritage Explorer</h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base">Upload a photo of a heritage site and discover its story.</p>
      </div>

      <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 mb-10 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900 mb-4">📷 Upload Heritage Photo</h3>
        <div className="border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center bg-amber-50/40">
          <p className="font-semibold text-stone-800">Drag & drop monument photograph or select from presets</p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={onAnalyze} className="px-8 py-3 rounded-xl bg-amber-800 text-white font-semibold shadow-md hover:bg-amber-900 transition">
            ⚡ Analyze with AI
          </button>
        </div>
      </div>

      {selectedSite && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold font-serif">{selectedSite.name}</h2>
            <p className="text-sm text-stone-600">Location: {selectedSite.location}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-50 p-4 rounded-xl">
              <h4 className="font-bold mb-1">📜 History</h4>
              <p className="text-xs sm:text-sm text-stone-700">{selectedSite.history}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl">
              <h4 className="font-bold mb-1">🏛 Architecture</h4>
              <p className="text-xs sm:text-sm text-stone-700">{selectedSite.architecture}</p>
            </div>
          </div>
          <div className="pt-4 border-t flex justify-end">
            <button onClick={() => onStartQuiz(selectedSite.id)} className="px-5 py-2.5 bg-amber-800 text-white rounded-xl text-xs font-semibold">
              Test Your Knowledge (Quiz)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
