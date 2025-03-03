// PlaylistView.js
import React from "react";
import SongGrid from "./SongGrid";

export const PlaylistView = ({ playlist, songs, playSong, goBack }) => {
  return (
    <div
      className="p-6 rounded-lg"
      style={{ background: "linear-gradient(to bottom, #a83279, #121212)" }}
    >
      {/* Playlist Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={playlist.thumbnail || "default-playlist.png"}
          className="w-32 h-32 rounded-lg"
          alt="Playlist Cover"
        />
        <div>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-gray-300">{songs.length} songs</p>
          <p className="text-gray-400 text-sm">Created by You</p>
          <button
            className="mt-2 text-sm text-gray-300 hover:underline"
            onClick={goBack}
          >
            Back to All Songs
          </button>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button className="bg-green-500 p-4 rounded-full hover:bg-green-600">
          ▶
        </button>
        <button className="text-gray-300 hover:text-white">•••</button>
      </div>

      {/* Songs List */}
      <div className="bg-[#181818] p-4 rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600 text-gray-400">
              <th className="p-2">#</th>
              <th className="p-2"> </th>
              <th className="p-2">Title</th>
              <th className="p-2">Artist</th>
              <th className="p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
  {songs.map((song, index) => (
    <tr
      key={song._id}
      className="hover:bg-gray-800 cursor-pointer"
      onClick={() => playSong(song)}
    >
      <td className="p-2 text-gray-400">{index + 1}</td>
      <img src={song.thumbnail || song.title}  className="w-12 h-12 " />
      <td className="p-2">{song.title}</td>
      <td className="p-2 text-gray-400">{song.singer || "Unknown Singer"}</td>
      <td className="p-2 text-gray-400">{song.duration || "--"}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};


