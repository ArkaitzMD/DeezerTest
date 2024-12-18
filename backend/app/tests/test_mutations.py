import pytest
from graphene.test import Client
from unittest.mock import patch
from app.models import Artist
from app.models import Song
from app.graphql import schema

@pytest.mark.django_db
def test_mutation_incrementar_reproducciones_cancion_existente():

    artist = Artist.objects.create(deezer_id=54321, name="Test Artist")
    song = Song.objects.create(deezer_id=12345, title="Test Song", artist=artist, numPlays=5)

    client = Client(schema)

    executed = client.execute("""
        mutation {
            incrementarReproducciones(
                songDeezerId: 12345
                songTitle: "Test Song"
                artistDeezerId: 54321
                artistName: "Test Artist"
            )
        }
    """)

    assert "errors" not in executed
    assert executed["data"]["incrementarReproducciones"] is True

    song.refresh_from_db()
    assert song.numPlays == 6

@pytest.mark.django_db
def test_mutation_incrementar_reproducciones_cancion_nueva():
    client = Client(schema)

    executed = client.execute("""
        mutation {
            incrementarReproducciones(
                songDeezerId: 67890
                songTitle: "New Song"
                artistDeezerId: 12345
                artistName: "New Artist"
            )
        }
    """)

    assert "errors" not in executed
    assert executed["data"]["incrementarReproducciones"] is True

    song = Song.objects.get(deezer_id=67890)
    artist = Artist.objects.get(deezer_id=12345)

    assert song.title == "New Song"
    assert song.numPlays == 1
    assert artist.name == "New Artist"

@pytest.mark.django_db
def test_mutation_incrementar_reproducciones_error():
    with patch.object(Song, "save", side_effect=Exception("DB error")):
        client = Client(schema)

        executed = client.execute("""
            mutation {
                incrementarReproducciones(
                    songDeezerId: 12345
                    songTitle: "Fail Song"
                    artistDeezerId: 54321
                    artistName: "Fail Artist"
                )
            }
        """)

        assert "errors" not in executed
        assert executed["data"]["incrementarReproducciones"] is False
