import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import CustomAudioPlayer from "../components/AudioPlayer";
import Sidebar from "../components/Sidebar";
import SongForm from "../components/SongForm";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("details");
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null); // Track song being edited
  const [deletingSong, setDeletingSong] = useState(null); // Track song being deleted
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
          <SongForm fetchSongs={fetchSongs} /> // Add song form when not editing
        )}

        {selectedSection === "songs" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🎶 All Songs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="bg-gray-200 p-4 rounded-lg shadow"
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {editingSong === song._id ? (
                    <div className="mt-2">
                      <SongForm
                        fetchSongs={fetchSongs}
                        initialData={song} // Pass song data to populate the form
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
                      <h3 className="text-lg font-semibold mt-2">
                        {song.title}
                      </h3>
                      <p className="text-sm text-gray-600">{song.singer}</p>

                      <CustomAudioPlayer
                        src={song.audio}
                        thumbnail={song.thumbnail}
                        title={song.title}
                        singer={song.singer}
                      />

                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => setEditingSong(song._id)} // Start editing song
                          className="bg-yellow-500 text-white py-1 px-3 rounded"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeletingSong(song._id)} // Start delete song
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
              initialData={songs.find((song) => song._id === editingSong)} // Find the song to edit
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
                  setDeletingSong(null); // Close modal after deletion
                }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeletingSong(null)} // Cancel delete
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
