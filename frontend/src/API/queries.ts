import { gql } from "@apollo/client";

// Query para buscar canciones por filtro, "all" para obtener todas
export const SEARCH_SONGS_QUERY = gql`
  query SearchSongs($query: String!) {
    buscar(query: $query) {
      id
      title
      preview
      artist {
        id
        name
      }
      album {
        title
        cover
      }
    }
  }
`;

// Mutation para sumar una reproducción
export const INCREMENT_PLAY_COUNT_MUTATION = gql`
  mutation IncrementPlayCount(
    $songDeezerId: BigInt!,
    $songTitle: String!,
    $artistDeezerId: BigInt!,
    $artistName: String!
  ) 
    {
    incrementarReproducciones(
      songDeezerId: $songDeezerId, 
      songTitle: $songTitle, 
      artistDeezerId: $artistDeezerId, 
      artistName: $artistName
    )
  }
`;
