from django.db import models

class Artist(models.Model):
    deezer_id = models.CharField(max_length=255, unique=True, blank=False, null=False, verbose_name="ID de Deezer")
    name = models.CharField(max_length=255, unique=True, verbose_name="Nombre del Artista")

    def __str__(self):
        return self.name