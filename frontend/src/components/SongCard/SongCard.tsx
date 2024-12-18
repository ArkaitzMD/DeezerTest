import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useIncrementPlayCount } from "../../hooks/useIncrementPlayCount";
import { Song } from "../../types/Song";
import "./SongCard.css";

function SongCard({ id, title, preview, artist, album}: Song) {
  const { incrementPlayCount } = useIncrementPlayCount();
  const { setCurrentSong } = useContext(AppContext)!;

  const handlePlay = () => {  
    incrementPlayCount(id, title, artist.id, artist.name);
    handleSongClick();
  };

  const handleSongClick = ()  => {
    setCurrentSong({
      id,
      title,
      artist,
      album,
      preview,
    });
  };

  return (
    <div className="song-card" onClick={handlePlay}>
      <div className="song-card-image">
        <img src={album.cover} alt={title} />
        <div className="play-icon">
          <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
          </svg>
          </span>
        </div>
      </div>
      <div className="song-card-info">
        <h4>{title}</h4>
        <p>{artist.name}</p>
        <p>{album.title}</p>
      </div>
    </div>
  );
}

export default SongCard;
