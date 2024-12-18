import React, { useEffect, useState } from "react";
import { Song } from "../../types/Song";
import { useSearchSongs } from "../../hooks/useSearchSongs";
import "./Header.css";

interface HeaderProps {
  onSearchResults: (songs: Song[]) => void;
  onSearchTermChange: (term: string) => void;
  setIsLoading:(bool:boolean) => void;
}

function Header({ onSearchResults, onSearchTermChange, setIsLoading}: HeaderProps) {
  const [ searchTerm, setSearchTerm ] = useState<string>("");
  const { songs, fetchSongs } = useSearchSongs();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchResults([]);
    onSearchTermChange(searchTerm.trim());
    setIsLoading(true);
    fetchSongs(searchTerm.trim())
    .catch((error:Error) => {
      console.error("Error fetching songs:", error.message);
    })
    .finally(() => {
      setIsLoading(false);  // Desactiva el estado de loading al finalizar
    });
  };

  useEffect(() => { 
    if(!searchTerm)
      {
        onSearchTermChange(searchTerm.trim());
        setIsLoading(true);
        fetchSongs(searchTerm)
        .catch((error:Error) => {
          console.error("Error fetching songs:", error.message);
        })
        .finally(() => {
          setIsLoading(false);  // Desactiva el estado de loading al finalizar
        });

      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      onSearchResults(songs);
    }
  }, [songs, onSearchResults ]);

  return (
    <header>

      <div className="logo">
        <img src="/deezer.svg" alt="Deezer Logo" />
      </div>

      <form onSubmit={handleSearch}>
        <button type="submit" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </button>
        <input
          className="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search artists"
        />
      </form>

      <nav>
        <a href="#" className="active">
          Home
        </a>
        <a href="#">Discover</a>
        <a href="#">Recents</a>
        <a href="#">Library</a>
        <div className="profile">
          <img src="/user.svg" alt="User Profile" />
        </div>
      </nav>
      
    </header>
  );
}

export default Header;
