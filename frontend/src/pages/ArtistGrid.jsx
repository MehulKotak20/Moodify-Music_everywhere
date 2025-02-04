import { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';

export default function ArtistGrid() {
  const artists = [
    { id: 1, name: 'Eminem', image: '/api/placeholder/200/200' },
    { id: 2, name: 'Drake', image: '/api/placeholder/200/200' },
    { id: 3, name: 'Kanye West', image: '/api/placeholder/200/200' },
    { id: 4, name: 'Post Malone', image: '/api/placeholder/200/200' },
    { id: 5, name: 'Travis Scott', image: '/api/placeholder/200/200' },
    { id: 6, name: 'More for you', image: '/api/placeholder/200/200' },
    { id: 7, name: 'Kendrick Lamar', image: '/api/placeholder/200/200' },
    { id: 8, name: 'Mac Miller', image: '/api/placeholder/200/200' },
    { id: 9, name: 'J. Cole', image: '/api/placeholder/200/200' }
  ];

  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-xl font-bold mb-4">Choose 3 or more artists you like.</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
          <input
            type="text"
            placeholder="Search artists..."
            className="w-full bg-white/10 text-white py-3 pl-12 pr-4 rounded-full backdrop-blur-sm 
                     focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {artists.map(artist => (
            <button
              key={artist.id}
              onClick={() => toggleSelect(artist.id)}
              className="group relative aspect-square overflow-hidden rounded-full bg-purple-800/20 
                       transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="h-full w-full object-cover brightness-90 group-hover:brightness-100"
              />
              {selected.includes(artist.id) && (
                <div className="absolute inset-0 bg-purple-500/30 backdrop-blur-sm rounded-full">
                  <CheckCircle className="absolute top-4 right-4 text-white" size={24} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-medium">{artist.name}</p>
              </div>
            </button>
          ))}
        </div>

        <button 
          className={`mt-8 w-full py-4 rounded-full text-white font-semibold transition-all
                     ${selected.length >= 3 
                       ? 'bg-purple-600 hover:bg-purple-500' 
                       : 'bg-gray-600 cursor-not-allowed'}`}
          disabled={selected.length < 3}
        >
          Continue ({selected.length}/3)
        </button>
      </div>
    </div>
  );
}