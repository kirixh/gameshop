from django.contrib.auth.models import User
from django.db import models


class Statistics(models.Model):
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE)
    game = models.ForeignKey('games.Games', on_delete=models.PROTECT)
    achievements = models.CharField(max_length=10000, default='')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    spent_hours = models.FloatField(default=0.)

    class Meta:
        verbose_name = 'Статистика'
        verbose_name_plural = 'Статистики'
        ordering = ['user', 'game']
