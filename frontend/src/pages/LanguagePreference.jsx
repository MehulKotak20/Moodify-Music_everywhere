import React, { useState } from 'react';
import { Music2, Headphones, Heart } from 'lucide-react';

const LanguagePreference = () => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  const languages = [
    { id: 1, name: 'Hindi', nativeName: 'हिंदी', image: 'Images/hindi.jpg' },
    { id: 2, name: 'English', nativeName: 'English', image: 'Images/english.jpg' },
    { id: 3, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', image: '/Images/punjabi.jpg' },
    { id: 4, name: 'Tamil', nativeName: 'தமிழ்', image: '/Images/tamil.jpg' },
    { id: 5, name: 'Telugu', nativeName: 'తెలుగు',image: '/Images/telugu.jpg' },
    { id: 6, name: 'Malayalam', nativeName: 'മലയാളം',  image: '/Images/malyalam.jpg' },
    { id: 7, name: 'Bengali', nativeName: 'বাংলা', image: '/Images/bengali.jpg' },
    { id: 8, name: 'Marathi', nativeName: 'मराठी' ,  image: '/Images/marathi.jpg'},
    { id: 9, name: 'Gujarati', nativeName: 'ગુજરાતી', image: '/Images/gujrati.jpg' },
    // { id: 10, name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
  ];

  const toggleLanguage = (langId) => {
    setSelectedLanguages(prev => 
      prev.includes(langId) 
        ? prev.filter(id => id !== langId)
        : [...prev, langId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-purple-50 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 bg-gray-900">
        {/* Animated circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/95"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/5"></div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-purple-400/20 rounded-full filter blur-md"></div>
              <Headphones className="h-16 w-16 text-purple-400 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-purple-100 mb-3">
            Your Musical Universe
          </h1>
          <p className="text-purple-300 text-lg">
            Select languages that move your soul
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => toggleLanguage(lang.id)}
              className={`relative p-6 rounded-xl transition-all duration-300
                ${selectedLanguages.includes(lang.id)
                  ? 'bg-purple-900/60 border-2 border-purple-400 shadow-lg shadow-purple-500/20 '
                  : 'bg-gray-800/40 backdrop-blur-lg border-2 border-gray-700 hover:border-purple-500 hover:bg-gray-800/60'
                }
                group overflow-hidden`}
            >
              <img
                src={lang.image}
                alt={lang.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-xl group-hover:opacity-30 transition-opacity duration-300"
              />
              <div className="relative z-10">
                <div className="flex justify-end items-start mb-3">
                  <Music2 className={`h-6 w-6 ${
                    selectedLanguages.includes(lang.id) ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-purple-50 mb-1">{lang.name}</div>
                  <div className="text-purple-300 font-medium">{lang.nativeName}</div>
                </div>
              </div>
              
              {/* Card hover effect */}
              <div className={`absolute inset-0 transition-opacity duration-300 opacity-0
                ${selectedLanguages.includes(lang.id) ? 'opacity-10' : 'group-hover:opacity-5'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800" ></div>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button 
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 group
            relative overflow-hidden ${selectedLanguages.length > 0
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-800/60 backdrop-blur-sm text-gray-500 cursor-not-allowed'
            }`}
          disabled={selectedLanguages.length === 0}
        >
          <span className="relative z-10 flex items-center justify-center">
            Start Your Journey
            <Heart className={`ml-2 h-5 w-5 transition-transform duration-300 
              ${selectedLanguages.length > 0 ? 'group-hover:scale-125' : ''}`} />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Selected Languages Counter */}
        <div className="text-center mt-4 text-purple-400">
          {selectedLanguages.length > 0 ? (
            `${selectedLanguages.length} ${selectedLanguages.length === 1 ? 'language' : 'languages'} selected`
          ) : (
            'Choose your preferred languages'
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white\/5 {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default LanguagePreference;