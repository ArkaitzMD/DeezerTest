import { Song } from "../../types/Song";
import SongCard from "../SongCard/SongCard";
import "../SongList/SongList.css";


interface SongListProps {
  songs: Song[];
  searchTerm: string;
  isLoading: boolean;
}

function SongList({ songs, searchTerm, isLoading}: SongListProps) {

  if (songs.length === 0 && !isLoading) {
    return (
      <div className="no-songs-container">
        <h2>No Results Found</h2>
        <p>We couldn't find any songs for "{searchTerm}".</p>
        <div className="no-results-icon">🎵</div>
      </div>
    );
  }

  if (isLoading && searchTerm) {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading...</h2>
          <p>Fetching songs for <strong>"{searchTerm}"</strong></p>
        </div>
      </>
    );
  }
  else if(isLoading)
  {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading...</h2>
          <p>Fetching songs</p>
        </div>
      </>
    );
  }

  return (
    <section className="list-container">
      {searchTerm && (
        <h2 className="search-title">
          Search results for: <span>{searchTerm}</span>
        </h2>
      )}

      <div className="list-grid">
        {songs.map((song) => (
          <SongCard key={song.id} {...song} />
        ))}
      </div>
    </section>
  );
}

export default SongList;
