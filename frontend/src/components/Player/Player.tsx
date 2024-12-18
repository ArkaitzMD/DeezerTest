import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./Player.css";
import "./AudioPlayer.css";
import { AppContext } from "../../contexts/AppContext";

export function Player() {
  const { currentSong, setCurrentSong } = useContext(AppContext)!;
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        currentSong &&
        playerRef.current &&
        !playerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".song-card") && 
        !(e.target as HTMLElement).closest("form")
      ) {
        setCurrentSong(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentSong, setCurrentSong]);

  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
    }
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <div className="player-container" ref={playerRef}>
      <div className="player-info">
        <img src={currentSong.album.cover} alt={currentSong.title} />
        <div>
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist.name}</p>
        </div>
      </div>

      <AudioPlayer
        src={currentSong.preview}
        autoPlay={isPlaying}
        showSkipControls={false}
        showJumpControls={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        volume={0.5}
      />
    </div>
  );
}
