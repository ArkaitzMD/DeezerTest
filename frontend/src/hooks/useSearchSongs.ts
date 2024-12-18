import { useLazyQuery } from "@apollo/client";
import { SEARCH_SONGS_QUERY } from "../API/queries";
import { SearchSongsResponse } from "../types/Song";

interface UseSearchSongsReturn {
  fetchSongs: (query: string) => Promise<void>;
  songs: SearchSongsResponse["buscar"];
  loading: boolean;
  error: string | null;
}

export function useSearchSongs(): UseSearchSongsReturn {
  const [executeQuery, { data, loading, error }] = useLazyQuery<SearchSongsResponse>(
    SEARCH_SONGS_QUERY
  );

  const fetchSongs = async (query: string) => {
    await executeQuery({ variables: { query } });
  };

  return {
    fetchSongs,
    songs: data?.buscar || [], // Garantizamos siempre un array vacío como fallback
    loading,
    error: error?.message || null,
  };
}
