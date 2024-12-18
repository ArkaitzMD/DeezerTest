import { createContext } from "react";
import { Song } from "../types/Song";

export interface AppContextProps {
  searchResults: Song[];
  setSearchResults: (results: Song[]) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);
