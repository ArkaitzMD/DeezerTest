import React, { useState } from "react";
import { AppContext } from "./AppContext";
import { Song } from "../types/Song";

interface ChildrenProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: ChildrenProps) {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  return (
    <AppContext.Provider value={{ searchResults, setSearchResults, currentSong, setCurrentSong }}>
      {children}
    </AppContext.Provider>
  );
}
