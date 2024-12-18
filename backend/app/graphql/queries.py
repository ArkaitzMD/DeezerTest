import logging
import graphene
from .types import SongType
from ..services.deezer_api import DeezerAPI

logger = logging.getLogger('graphql')

class Query(graphene.ObjectType):
    buscar = graphene.List(
        SongType, query=graphene.String(required=False)
    )



    def resolve_buscar(root, info, query="all"):
        return DeezerAPI.search_tracks(query=query)
