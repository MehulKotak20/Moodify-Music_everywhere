import React from "react";
import { FaPlay } from "react-icons/fa";

const SongGrid = ({ songs, playSong }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">All Songs</h2>

      {songs.length === 0 ? (
        <p className="text-gray-400">No songs found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {songs.map((song) => (
            <div
              key={song._id}
              className="bg-[#181818] p-4 rounded-lg cursor-pointer hover:bg-[#1f1f1f] transition relative"
              onClick={() => playSong(song)}
            >
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="mt-3">
                <h3 className="text-sm font-semibold truncate">{song.title}</h3>
                <p className="text-xs text-gray-400">{song.singer}</p>
                <p className="text-xs text-gray-500">{song.genre}</p>
                <p className="text-xs text-gray-500">
                  {song.mood ? `Mood: ${song.mood}` : ""}
                </p>
                <p className="text-xs text-gray-500">
                  {song.weather ? `Weather: ${song.weather}` : ""}
                </p>
              </div>
              <button className="absolute bottom-3 right-3 bg-green-500 p-2 rounded-full">
                <FaPlay size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongGrid;
