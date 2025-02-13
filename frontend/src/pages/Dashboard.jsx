// import React, { useState } from 'react';

// const Dashboard = () => {
//     return (
//         <div className="flex h-screen w-screen bg-gray-100">
//             <div className="w-64 bg-purple-900 text-white flex flex-col">
//                 <h1 className="text-xl font-bold p-4">🎵 Music Admin</h1>
//                 <div className="flex flex-col gap-2 p-4 ">
//                     <nav className="flex flex-col gap-2 p-4">
//                         <a href="details.jsx" className="py-2 px-4 rounded hover:bg-grey-700">Details</a>
//                         <a href="#" className="py-2 px-4 rounded hover:bg-grey-700">Artists</a>
//                         <a href="#" className="py-2 px-4 rounded hover:bg-grey-700">Playlist</a>
//                         <a href="#" className="py-2 px-4 rounded hover:bg-grey-700">Songs</a>
//                         <a href="#" className="py-2 px-4 rounded hover:bg-grey-700">Settings</a>
//                     </nav>
//                 </div>
//             </div>
            
//             {/* cards */}
//             <div className="p-6 grid grid-cols-3 md:grid-3 gap-6">
//               {/* card1 */}
//               <div className='bg-white p-6 rounded-lg shadow flex flex-col w-40 h-40'>
//                 <h2 className="text-lg font-semibold">Total Users</h2>
//                 <p className="text-3xl font-bold">100</p>
//               </div>
//               {/* card2 */}
//               <div className='bg-white p-6 rounded-lg shadow flex flex-col w-40 h-40'>
//                 <h2 className="text-lg font-semibold">Total Songs</h2>
//                 <p className="text-3xl font-bold">100</p>
//               </div>
//               {/* card3 */}
//               <div className='bg-white p-6 rounded-lg shadow flex flex-col w-40 h-40'>
//                 <h2 className="text-lg font-semibold">Revenue</h2>
//                 <p className="text-3xl font-bold">100</p>
//               </div>

              
//             </div>
//             </div> 
//     );

// };
// export default Dashboard;
import React, { useState } from "react";

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [songs, setSongs] = useState([]); // List of added songs
  const [newSong, setNewSong] = useState({
    name: "",
    artist: "Artist A",
    picture: "",
    genre: "Pop",
    language: "English",
    mood: "Happy",
    weather: "Sunny",
  });

  const artists = ["Artist A", "Artist B", "Artist C"];
  const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];
  const languages = ["English", "Hindi", "Gujrati", "Punjabi"];
  const moods = ["Happy", "Sad", "Energetic", "Romantic"];
  const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Snowy"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSong({ ...newSong, [name]: value });
  };

  // Handle song submission
  const handleAddSong = () => {
    if (newSong.name && newSong.picture) {
      setSongs([...songs, newSong]); // Add song to list
      setNewSong({ name: "", artist: "Artist A", picture: "", genre: "Pop", language: "English", mood: "Happy", weather: "Sunny" }); // Reset form
    }
  };


    return (
        <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-purple-900 text-white flex flex-col">
                <h1 className="text-xl font-bold p-4">🎵 Music Admin</h1>
                <nav className="flex flex-col gap-2 p-4">
                    <button onClick={() => setSelectedSection("details")} className="text-left py-2 px-4 rounded hover:bg-purple-700 h-50 w-50">Details</button>
                    <button onClick={() => setSelectedSection("artists")} className="text-left py-2 px-4 rounded hover:bg-purple-700 h-50 w-50">Artists</button>
                    <button onClick={() => setSelectedSection("playlist")} className="text-left py-2 px-4 rounded hover:bg-purple-700 h-50 w-50">Playlist</button>
                    <button onClick={() => setSelectedSection("songs")} className="text-left py-2 px-4 rounded hover:bg-purple-700 h-50 w-50">Songs</button>
                    <button onClick={() => setSelectedSection("settings")} className="text-left py-2 px-4 rounded hover:bg-purple-700 h-50 w-50">Settings</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Dashboard Section */}
                {selectedSection === "dashboard" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col w-40 h-40">
                            <h2 className="text-lg font-semibold">Total Users</h2>
                            <p className="text-3xl font-bold">100</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col w-40 h-40">
                            <h2 className="text-lg font-semibold">Total Songs</h2>
                            <p className="text-3xl font-bold">100</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col w-40 h-40">
                            <h2 className="text-lg font-semibold">Revenue</h2>
                            <p className="text-3xl font-bold">100</p>
                        </div>
                    </div>
                )}

                {/* Details Section */}
               
                <div className="flex-1 p-6">
        {selectedSection === "details" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Add Song</h2>

            {/* Form to Add Song */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <input type="text" name="name" value={newSong.name} onChange={handleInputChange} placeholder="Song Name" className="border p-2 rounded" required />
              
              {/* Artist Dropdown */}
              <select name="artist" value={newSong.artist} onChange={handleInputChange} className="border p-2 rounded">
                {artists.map((artist, index) => <option key={index} value={artist}>{artist}</option>)}
              </select>

              <input type="text" name="picture" value={newSong.picture} onChange={handleInputChange} placeholder="Picture URL" className="border p-2 rounded" required />

              {/* Genre Dropdown */}
              <select name="genre" value={newSong.genre} onChange={handleInputChange} className="border p-2 rounded">
                {genres.map((genre, index) => <option key={index} value={genre}>{genre}</option>)}
              </select>

              {/* Language Dropdown */}
              <select name="language" value={newSong.language} onChange={handleInputChange} className="border p-2 rounded">
                {languages.map((lang, index) => <option key={index} value={lang}>{lang}</option>)}
              </select>

              {/* Mood Dropdown */}
              <select name="mood" value={newSong.mood} onChange={handleInputChange} className="border p-2 rounded">
                {moods.map((mood, index) => <option key={index} value={mood}>{mood}</option>)}
              </select>

              {/* Weather Dropdown */}
              <select name="weather" value={newSong.weather} onChange={handleInputChange} className="border p-2 rounded">
                {weatherOptions.map((weather, index) => <option key={index} value={weather}>{weather}</option>)}
              </select>
            </div>

            <button onClick={handleAddSong} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">➕ Add Song</button>

            {/* Song List */}
            {songs.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Songs List</h2>
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Picture</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Artist</th>
                      <th className="border p-2">Genre</th>
                      <th className="border p-2">Mood</th>
                      <th className="border p-2">Language</th>
                      <th className="border p-2">Weather</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          {song.picture ? <img src={song.picture} alt="Song" className="w-10 h-10"/> : "N/A"}
                        </td>
                        <td className="border p-2">{song.name}</td>
                        <td className="border p-2">{song.artist}</td>
                        <td className="border p-2">{song.genre}</td>
                        <td className="border p-2">{song.mood}</td>
                        <td className="border p-2">{song.language}</td>
                        <td className="border p-2">{song.weather}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
            </div>
        </div>
    );
};

export default Dashboard;
