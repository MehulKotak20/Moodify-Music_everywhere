import React, { useEffect, useRef, useState, useContext } from "react";
//import  SongContext  from "../context/Song"; 
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
  // const songData = useContext(SongContext);

  // if (!songData) {
  //   console.error("SongContext is undefined");
  //   return <p>Loading song data...</p>;
  // }

  // const { 
  //   song, 
  //   fetchSingleSong, 
  //   selectedSong, 
  //   isPlaying, 
  //   setIsPlaying, 
  //   nextMusic, 
  //   prevMusic 
  // } = songData;

  // useEffect(() => {
  //   if (selectedSong) {
  //     fetchSingleSong();
  //   }
  // }, [selectedSong]);

  // const audioRef = useRef(null);

  // const handlePlayPause = () => {
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  // const [volume, setVolume] = useState(1);
  // const [progress, setProgress] = useState(0);
  // const [duration, setDuration] = useState(0);

  // useEffect(() => {
  //   const audio = audioRef.current;
  //   if (!audio) return;

  //   const handleLoadedMetaData = () => setDuration(audio.duration);
  //   const handleTimeUpdate = () => setProgress(audio.currentTime);

  //   audio.addEventListener("loadedmetadata", handleLoadedMetaData);
  //   audio.addEventListener("timeupdate", handleTimeUpdate);

  //   return () => {
  //     audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
  //     audio.removeEventListener("timeupdate", handleTimeUpdate);
  //   };
  // }, [song]);

  // const handleProgressChange = (e) => {
  //   const newTime = (e.target.value / 100) * duration;
  //   if (audioRef.current) {
  //     audioRef.current.currentTime = newTime;
  //   }
  //   setProgress(newTime);
  // };

  return (
    <div>
      {(
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          <div className="lg:flex items-center gap-4">
            <img
              // src={song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/50"}
              className="w-12"
              alt="Song Thumbnail"
            />
            <div className="hidden md:block">
              {/* <p>{song.title}</p>
              <p>{song.description ? song.description.slice(0, 30) + "..." : ""}</p> */}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 m-auto">
            {/* {song?.audio && (
              <audio ref={audioRef} src={song.audio.url} autoPlay={isPlaying} />
            )} */}

            <div className="w-full flex items-center font-thin text-green-400">
              <input
                type="range"
                min="0"
                max="100"
                className="progress-bar w-[120px] md:w-[300px]"
               // value={duration ? (progress / duration) * 100 : 0}
                //  onChange={handleProgressChange}
              />
            </div>

            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer"//</div> onClick={prevMusic}
              >
                <GrChapterPrevious />
              </span>
              <button
                className="bg-white text-black rounded-full p-2"
               // onClick={handlePlayPause}
              >
                {/* {isPlaying ? <FaPause /> : <FaPlay />} */}
              </button>
              <span className="cursor-pointer"
               //onClick={nextMusic}
               >
                <GrChapterNext />
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="range"
              className="w-16 md:w-32"
              min="0"
              max="1"
              step="0.01"
              //value={volume}
             // onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
