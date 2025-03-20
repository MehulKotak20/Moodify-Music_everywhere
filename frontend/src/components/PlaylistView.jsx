// PlaylistView.js
import React, { useEffect, useState } from "react";

export const PlaylistView = ({ playlist, songs, playSong, goBack }) => {
  const [playlistThumbnail, setPlaylistThumbnail] = useState(
    "default-playlist.png"
  );

  useEffect(() => {
    const generatePlaylistThumbnail = () => {
      const songThumbnails = playlist.songs
        .map((song) => song?.songId?.thumbnail)
        .filter(Boolean); // remove empty/null thumbnails

      if (songThumbnails.length === 0) {
        setPlaylistThumbnail("default-playlist.png");
        return;
      }

      if (songThumbnails.length < 4) {
        // Less than 4 songs? Just use the first song's thumbnail.
        setPlaylistThumbnail(songThumbnails[0]);
        return;
      }

      // 4+ songs? Time to generate a collage.
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 100; // Each image is 100x100
      canvas.width = 200;
      canvas.height = 200;

      const images = [];
      let loadedCount = 0;

      const checkAndDrawCollage = () => {
        if (loadedCount === 4) {
          images.forEach((img, idx) => {
            const x = (idx % 2) * size;
            const y = Math.floor(idx / 2) * size;
            ctx.drawImage(img, x, y, size, size);
          });

          const collageUrl = canvas.toDataURL("image/jpeg");
          setPlaylistThumbnail(collageUrl);
        }
      };

      // Load 4 images
      songThumbnails.slice(0, 4).forEach((src, index) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // In case images are hosted elsewhere
        img.src = src;

        img.onload = () => {
          images[index] = img;
          loadedCount++;
          checkAndDrawCollage();
        };

        img.onerror = () => {
          console.error(`Failed to load thumbnail: ${src}`);
          images[index] = new Image(); // Just use an empty image if one fails
          loadedCount++;
          checkAndDrawCollage();
        };
      });
    };

    generatePlaylistThumbnail();
  }, [playlist]);

  return (
    <div
      className="p-6 rounded-lg"
      style={{ background: "linear-gradient(to bottom,rgb(130, 34, 185), #121212)" }}
    >
      {/* Playlist Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={playlistThumbnail}
          alt={playlist.name}
          className="w-24 h-24 rounded-lg object-cover"
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
                <td className="p-2">
                  <img
                    src={song.thumbnail || "default-song.png"}
                    alt={song.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2">{song.title}</td>
                <td className="p-2 text-gray-400">
                  {song.singer || "Unknown Singer"}
                </td>
                <td className="p-2 text-gray-400">{song.duration || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
