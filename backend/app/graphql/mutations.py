import graphene
from ..services.song_service import SongService


class IncrementarReproducciones(graphene.Mutation):
    class Arguments:
        songDeezerId = graphene.BigInt(required=True)
        songTitle = graphene.String(required=True)
        artistDeezerId = graphene.BigInt(required=True)
        artistName = graphene.String(required=True)

    Output = graphene.Boolean

    def mutate(self, info, songDeezerId, songTitle, artistDeezerId, artistName):
        return SongService.incrementar_reproducciones(
            song_deezer_id=songDeezerId,
            song_title=songTitle,
            artist_deezer_id=artistDeezerId,
            artist_name=artistName
        )


class Mutation(graphene.ObjectType):
    incrementarReproducciones = IncrementarReproducciones.Field()