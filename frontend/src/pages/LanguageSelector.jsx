import React from 'react';
import { Music, Headphones } from 'lucide-react';

const LanguageSelector = () => {
  const languages = [
    { id: 'hindi', name: 'Hindi', color: 'bg-purple-600' },
    { id: 'english', name: 'English', color: 'bg-emerald-500' },
    { id: 'punjabi', name: 'Punjabi', color: 'bg-purple-500' },
    { id: 'tamil', name: 'Tamil', color: 'bg-emerald-600' },
    { id: 'telugu', name: 'Telugu', color: 'bg-purple-400' },
    { id: 'malayalam', name: 'Malayalam', color: 'bg-emerald-400' },
    { id: 'marathi', name: 'Marathi', color: 'bg-purple-300' },
    { id: 'gujarati', name: 'Gujarati', color: 'bg-emerald-300' },
    { id: 'bengali', name: 'Bengali', color: 'bg-purple-200' },
    { id: 'kannada', name: 'Kannada', color: 'bg-emerald-200' },
  ];

  const handleLanguageSelect = (languageId) => {
    console.log(`Selected language: ${languageId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Music size={32} className="text-purple-400" />
            <span>Choose Your Vibe</span>
          </h1>
          <Headphones size={32} className="text-emerald-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageSelect(language.id)}
              className={`${language.color} hover:opacity-90 transition-all duration-300 
                         rounded-xl p-6 text-left group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {language.name}
                </h2>
                <div className="w-12 h-1 bg-white/50 rounded-full" />
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Music size={24} className="text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;