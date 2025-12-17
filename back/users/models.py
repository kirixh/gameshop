from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f'Профиль {self.user.username}'

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    game = models.ForeignKey('games.Games', on_delete=models.CASCADE, related_name='wishlisted_in')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Желаемая игра'
        verbose_name_plural = 'Желаемые игры'
        unique_together = ('user', 'game')

    def __str__(self):
        return f'{self.user.username} -> {self.game.name}'


class Statistics(models.Model):
    user = models.ForeignKey(User, verbose_name='Игрок', on_delete=models.CASCADE)
    game = models.ForeignKey('games.Games', on_delete=models.PROTECT)
    achievements = models.CharField(max_length=10000, default='')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    spent_hours = models.FloatField(default=0.)

    class Meta:
        verbose_name = 'Статистика'
        verbose_name_plural = 'Статистики'
        ordering = ['user', 'game']


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
