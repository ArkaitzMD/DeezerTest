import { useState } from "react";
import { Song } from "./types/Song";
import { Header,SongList } from "./components/index";
import { Player } from "./components/Player/Player";
import { AppProvider } from "./contexts/AppProvider";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <AppProvider>
        <Header onSearchResults={setSongs} onSearchTermChange={setSearchTerm} setIsLoading={setLoading}/>
        <SongList songs={songs} searchTerm={searchTerm} isLoading={isLoading}/>
        <Player />
      </AppProvider>
    </div>
  );
}

export default App;
