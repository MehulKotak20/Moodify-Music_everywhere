import { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';

export default function ArtistGrid() {
  const artists = [
    { id: 1, name: 'Arijit Singh', image: '/Images/arijit.jpg' },
    { id: 2, name: 'Taylor Swift', image: '/Images/tylor.webp' },
    { id: 3, name: 'Diljit Dosanjh', image: '/Images/diljiit.jpg' },
    { id: 4, name: 'Darshan Raval', image: 'Images/darshan.jpg' },
    { id: 5, name: 'Neha Kakkar', image: 'Images/neha.webp' },
    { id: 6, name: 'Anuv Jain', image: 'Images/anuv.webp' },
    { id: 7, name: 'Pritam', image: 'Images/pritam.jpg' },
    { id: 8, name: 'Atif Aslam', image: 'Images/atif_new.jpg' },
    { id: 9, name: 'Sachin-jigar', image: 'Images/Sachin-jigar.jpg' },
    { id: 10, name: 'KK', image: 'Images/kk.jpg' },
    { id: 11, name: 'Shreya Ghosal', image: 'Images/shreya_ghosal.webp' },
    { id: 13, name: 'Yo Yo Honey Singh', image: 'Images/honey.jpg' },
    { id: 14, name: 'Selena Gomez', image: 'Images/selena.jpg' },
    { id: 15, name: 'Armaan Malik', image: 'Images/arman.jpg' },
    { id: 16, name: 'Harry Styles', image: 'Images/harry_styles.jpg' },
    { id: 17, name: 'Harshdeep Kaur', image: 'Images/harshdeep-kaur.jpg' },
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
    <div className="min-h-screen w-full  m-0 bg-gradient-to-br from-purple-900 via-black to-purple-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-4xl font-bold mb-12 text-center">
        Choose 3 or more artists you like.
      </h1>

      
      <div className="grid grid-cols-4 gap-12  w-full">
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
                <CheckCircle className="absolute top-6 right-6 text-white" size={32} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-lg font-medium">{artist.name}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        className={`mt-16 max-w-xl w-full py-5 rounded-full text-white text-xl font-semibold transition-all
                   ${selected.length >= 3
                     ? 'bg-purple-600 hover:bg-purple-500'
                     : 'bg-gray-600 cursor-not-allowed'}`}
        disabled={selected.length < 3}
      >
        Continue ({selected.length}/3)
      </button>
    </div>
  );
}
