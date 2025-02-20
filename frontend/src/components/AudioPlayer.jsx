import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const CustomAudioPlayer = ({ src, thumbnail, title, singer }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Handle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update Progress
  const handleTimeUpdate = () => {
    const progress =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  // Seek to Position
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Volume Control
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === "0");
  };

  // Mute / Unmute
  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className=" text-black p-0  rounded-xl  flex items-center gap-4">
      {/* Thumbnail */}
      <img src={thumbnail} alt="Thumbnail" className="w-16 h-16 rounded-lg" />

      {/* Song Info */}
      <div className="flex-1">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-gray-400">{singer}</p>

        {/* Progress Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Controls */}
      <button onClick={togglePlay} className="text-black text-2xl">
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {/* Volume */}
      <button onClick={toggleMute} className="text-black">
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />

      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} />
    </div>
  );
};

export default CustomAudioPlayer;
