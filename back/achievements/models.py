from django.contrib.auth.models import User
from django.db import models


class Achievements(models.Model):
    game = models.ForeignKey('games.Games', on_delete=models.PROTECT)
    title = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=150, default='')

    class Meta:
        verbose_name = 'Достижение'
        verbose_name_plural = 'Достижения'
        ordering = ['game', 'title']
