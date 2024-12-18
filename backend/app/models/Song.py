from django.db import models
from .Artist import Artist

class Song(models.Model):
    deezer_id = models.BigIntegerField(unique=True, blank=False, null=False, verbose_name="ID de Deezer")
    title = models.CharField(max_length=255, null=False, verbose_name="Título de la Canción")
    artist = models.ForeignKey(Artist, null=False, on_delete=models.CASCADE, related_name="canciones", verbose_name="Artista")
    numPlays = models.IntegerField(default=1, null=False, verbose_name="Número de Reproducciones")

    def __str__(self):
        return f"{self.title} - {self.artist_id.name}"
    
    def incrementar_num_plays(self):
        self.numPlays += 1
        self.save()