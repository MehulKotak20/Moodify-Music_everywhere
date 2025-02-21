import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { BsMusicNoteBeamed } from "react-icons/bs";

const Player = ({ song, setSong, playNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [history, setHistory] = useState([]); // Stack to track previously played songs
  const audioRef = useRef(new Audio());

  // Load new song when `song` changes
  useEffect(() => {
    if (song) {
      if (audioRef.current.src !== song.audio) {
        audioRef.current.src = song.audio;
        audioRef.current.load();
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Error playing song:", error));
      }

      setCurrentTime(0);
    }
  }, [song]);

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleNext);
    };
  }, []);

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!song) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek functionality
  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

 const handleNext = () => {
   if (song) {
     setHistory((prev) => [...prev, song]); // Store current song in history
   }
   setIsPlaying(false);
   playNext(); // Move to the next song in the queue
 };


 const handlePrevious = () => {
  if (history.length > 0) {
    const previousSong = history[history.length - 1]; // Get last played song
    setHistory((prev) => prev.slice(0, prev.length - 1)); // Remove last song from history
    setSong(previousSong); // Play the previous song
  }
};


  // Format time (mm:ss)
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    song && (
      <div className="fixed bottom-0 left-0 w-full bg-[#181818] text-white p-4 flex items-center justify-between shadow-lg">
        {/* Song Details */}
        <div className="flex items-center">
          <BsMusicNoteBeamed size={30} className="text-green-400 mr-3" />
          <div>
            <p className="text-lg font-semibold">{song.title}</p>
            <p className="text-sm text-gray-400">
              {song.singer} • {song.genre}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={handlePrevious}
            className="text-gray-400 hover:text-white"
            disabled={history.length === 0}
          >
            <FaStepBackward size={22} />
          </button>
          <button
            onClick={togglePlayPause}
            className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition"
          >
            {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
          </button>
          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-white"
          >
            <FaStepForward size={22} />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center space-x-2 w-[30%]">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full cursor-pointer"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>
    )
  );
};

export default Player;
