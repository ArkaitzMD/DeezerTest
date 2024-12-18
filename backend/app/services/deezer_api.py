from django.conf import settings
import requests
import logging

logger = logging.getLogger("deezer_api")

class DeezerAPI:
    BASE_URL = settings.ENV("RAPIDAPI_URL")

    def search_tracks(query, max_results=20):

        url = f"{DeezerAPI.BASE_URL}/search"
        headers = {
            "x-rapidapi-key": settings.ENV("RAPIDAPI_KEY"),
            "x-rapidapi-host": settings.ENV("RAPIDAPI_HOST"),
        }

        # en caso de que query venga vacío, para no que no se quede vacía la página, porque la api de deezer no acepta pasar el parámetro vacío
        # pasamos "a" y no lo comparamos con el nombre del artista, para que de la sensación de variedad, 
        # ya que la API coge tanto nombres de canciones como artistas.
        if query == "":
            params = {"q": "a"}
        else:
            params = {"q": query}

        final_results = []
        seen_ids = set()

        try:
            while url and len(final_results) < max_results:
                response = requests.get(url, headers=headers, params=params)

                if response.status_code != 200:
                    logger.error(f"Error en la API de Deezer: {response.status_code} ")
                    break

                data = response.json()
                current_page_results = data.get("data", [])

                for item in current_page_results:
                    if item.get("type") == "track":
                        artist_name = item.get("artist", {}).get("name", "").lower()
                        if query != "" and artist_name != query.lower():
                            continue
                        song_id = item.get("id")
                        if song_id and song_id not in seen_ids:
                            seen_ids.add(song_id)
                            final_results.append({
                                "id": song_id,
                                "title": item.get("title"),
                                "preview": item.get("preview"),
                                "artist": {
                                    "id": item.get("artist", {}).get("id"),
                                    "name": item.get("artist", {}).get("name"),
                                },
                                "album": {
                                    "title": item.get("album", {}).get("title"),
                                    "cover": item.get("album", {}).get("cover"),
                                },
                            })

                        if len(final_results) >= max_results:
                            break

                url = data.get("next")

        except Exception as e:
            logger.error(f"Error al conectar con la API de Deezer: {str(e)}")

        return final_results
