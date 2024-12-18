import { useMutation } from "@apollo/client";
import { INCREMENT_PLAY_COUNT_MUTATION } from "../API/queries";


interface UseIncrementPlayCountReturn {
  incrementPlayCount: (songDeezerId: number, songTitle: string, artistDeezerId: number, artistName: string) => void;
  loading: boolean;
  error: string | null;
}

export function useIncrementPlayCount(): UseIncrementPlayCountReturn {
  const [executeMutation, {loading, error }] =
    useMutation(INCREMENT_PLAY_COUNT_MUTATION);

  const incrementPlayCount = (songDeezerId: number, songTitle: string, artistDeezerId: number, artistName: string) => {
    executeMutation({ variables: { songDeezerId, songTitle, artistDeezerId, artistName } });
  };

  return {
    incrementPlayCount,
    loading,
    error: error?.message || null,
  };
}
