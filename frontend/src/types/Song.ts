export interface Song {
    id: number;
    title: string;
    preview: string;
    artist: {
      id: number;
      name: string;
    };
    album: {
      title: string;
      cover: string;
    };
  }
  
  export interface SearchSongsResponse {
    buscar: Song[];
  }
  

  