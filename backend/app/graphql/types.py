import graphene

class ArtistType(graphene.ObjectType):
    id = graphene.BigInt()
    name = graphene.String()

class AlbumType(graphene.ObjectType):
    title = graphene.String()
    cover = graphene.String()

class SongType(graphene.ObjectType):
    id = graphene.BigInt()
    title = graphene.String()
    preview = graphene.String()
    artist = graphene.Field(ArtistType)
    album = graphene.Field(AlbumType)