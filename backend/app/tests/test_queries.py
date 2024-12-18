import pytest
import requests_mock
from graphene.test import Client
from app.graphql import schema
from django.conf import settings

@pytest.mark.django_db
def test_query_buscar():
    deezer_URL = settings.ENV('RAPIDAPI_URL')

    mock_response = {
        "data": [
            {
                "id": 12345,
                "title": "Test Song",
                "duration": 300,
                "preview": "http://example.com/preview",
                "artist": {"id": 54321, "name": "Test Artist"},
                "album": {"title": "Test Album", "cover": "http://example.com/cover"},
                "type": "track"
            }
        ],
        "next": None
    }

    with requests_mock.Mocker() as m:
        m.get(
            deezer_URL + "/search",
            json=mock_response
        )

        client = Client(schema)

        executed = client.execute("""
            query {
                buscar(query: "Test Artist") {
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
        """)

        assert "errors" not in executed
        assert len(executed["data"]["buscar"]) == 1

        song = executed["data"]["buscar"][0]
        assert song["id"] == 12345
        assert song["title"] == "Test Song"
        assert song["preview"] == "http://example.com/preview"
        assert song["artist"]["id"] == 54321
        assert song["artist"]["name"] == "Test Artist"
        assert song["album"]["title"] == "Test Album"
        assert song["album"]["cover"] == "http://example.com/cover"

@pytest.mark.django_db
def test_query_buscar_sin_resultados():
    deezer_URL = settings.ENV('RAPIDAPI_URL')
    mock_response = {"data": [], "next": None}

    with requests_mock.Mocker() as m:
        m.get(
            deezer_URL + "/search",
            json=mock_response
        )

        client = Client(schema)

        executed = client.execute("""
            query {
                buscar(query: "NoExistente") {
                    id
                    title
                }
            }
        """)

        assert "errors" not in executed
        assert executed["data"]["buscar"] == []

@pytest.mark.django_db
def test_query_buscar_api_error():
    deezer_URL = settings.ENV('RAPIDAPI_URL')
    with requests_mock.Mocker() as m:
        m.get(
            deezer_URL + "/search",
            status_code=500,
            text="Internal Server Error"
        )

        client = Client(schema)

        executed = client.execute("""
            query {
                buscar(query: "ErrorTest") {
                    id
                    title
                }
            }
        """)

        assert "errors" not in executed
        assert executed["data"]["buscar"] == []


