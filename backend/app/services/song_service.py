from ..models.Artist import Artist
from ..models.Song import Song
import logging

logger = logging.getLogger("song_service")

class SongService:
    
    def incrementar_reproducciones(song_deezer_id, song_title, artist_deezer_id, artist_name):
        try:
            song, created = Song.objects.get_or_create(
                deezer_id=song_deezer_id,
                defaults={
                    "title": song_title,
                    "artist": Artist.objects.get_or_create(
                        deezer_id=artist_deezer_id,
                        defaults={"name": artist_name}
                    )[0],
                    "numPlays": 1
                }
            )

            if not created:
                song.incrementar_num_plays()
            return True

        except Exception as e:
            logger.error(f"Error al actualizar el número de repeticiones o crear la canción: {str(e)}")
            return False
