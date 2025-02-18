import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import CustomAudioPlayer from "../components/AudioPlayer";
import Sidebar from "../components/Sidebar";
import SongForm from "../components/SongForm";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("details");
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [deletingSong, setDeletingSong] = useState(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/song/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleUpdateSong = async (songId, updatedDetails) => {
    try {
      await axios.put(
        `http://localhost:5000/api/song/update/${songId}`,
        updatedDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Song updated successfully!");
      setEditingSong(null);
      fetchSongs();
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await axios.delete(`http://localhost:5000/api/song/${songId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Song deleted successfully!");
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <Sidebar setSelectedSection={setSelectedSection} logout={logout} />

      <div className="flex-1 p-6">
        {selectedSection === "details" && !editingSong && (
          <SongForm fetchSongs={fetchSongs} />
        )}

        {selectedSection === "songs" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🎶 All Songs</h2>
            <div className="space-y-2">
              {songs.map((song, index) => (
                <div
                  key={song._id}
                  className="flex items-center hover:bg-gray-100 p-2 rounded-lg transition-colors group"
                >
                  <div className="w-12 text-gray-400">{index + 1}</div>
                  <div className="w-12 h-12 mr-4">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  {editingSong === song._id ? (
                    <div className="flex-1">
                      <SongForm
                        fetchSongs={fetchSongs}
                        initialData={song}
                        onSubmit={(updatedDetails) =>
                          handleUpdateSong(song._id, updatedDetails)
                        }
                      />
                      <button
                        onClick={() => setEditingSong(null)}
                        className="bg-red-500 text-white py-1 px-4 rounded mt-2 ml-2"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">{song.title}</h3>
                        <p className="text-sm text-gray-600">{song.singer}</p>
                      </div>

                      <div className="flex-1">
                        <CustomAudioPlayer
                          src={song.audio}
                          thumbnail={song.thumbnail}
                          title={song.title}
                          singer={song.singer}
                        />
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 mr-4">
                        <button
                          onClick={() => setEditingSong(song._id)}
                          className="bg-yellow-500 text-white py-1 px-3 rounded"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeletingSong(song._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Song Modal */}
      {editingSong && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2">
            <h2 className="text-xl font-semibold">Edit Song</h2>
            <SongForm
              fetchSongs={fetchSongs}
              initialData={songs.find((song) => song._id === editingSong)}
              onSubmit={(updatedDetails) =>
                handleUpdateSong(editingSong, updatedDetails)
              }
            />
            <button
              onClick={() => setEditingSong(null)}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Song Modal */}
      {deletingSong && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2">
            <h2 className="text-xl font-semibold">Are you sure?</h2>
            <p className="text-sm text-gray-600 mt-2">
              You are about to delete this song.
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  handleDeleteSong(deletingSong);
                  setDeletingSong(null);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeletingSong(null)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;