from decimal import Decimal
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from games.serializers import GamesSerializer
from games.models import Games
from core.permissions import IsOwnerOrReadOnly
from users.models import Statistics, UserProfile, Wishlist
from users.serializers import StatisticsSerializer, UserProfileSerializer, WishlistSerializer


class StatisticsViewSet(viewsets.ModelViewSet):
    queryset = Statistics.objects.all()
    serializer_class = StatisticsSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return Statistics.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        game = serializer.validated_data['game']
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        price = game.price or Decimal('0.00')

        if profile.balance < price:
            raise ValidationError({'detail': 'Недостаточно средств для покупки.'})

        with transaction.atomic():
            profile.balance -= price
            profile.save(update_fields=['balance'])
            serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False)
    def user(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        statistics = Statistics.objects.filter(user_id=request.user.id)
        wishlist = Wishlist.objects.filter(user=request.user)
        return Response({
            'balance': profile.balance,
            'games': [GamesSerializer(statistic.game).data for statistic in statistics],
            'statistics': [StatisticsSerializer(statistic).data for statistic in statistics],
            'wishlist': [{'id': item.id, 'game': GamesSerializer(item.game).data} for item in wishlist]
        })

    @action(methods=['get'], detail=True)
    def game(self, request, pk=None):
        try:
            statistic = Statistics.objects.get(user_id=request.user.id, game_id=pk)
        except Statistics.DoesNotExist:
            return Response({"detail": "Statistic for this game_id doesn't exist", "game": None, "statistic": None})
        return Response({'game': [GamesSerializer(statistic.game).data],
                         'statistic': StatisticsSerializer(statistic).data})


class UserProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        wishlist = Wishlist.objects.filter(user=request.user)
        return Response({
            'balance': profile.balance,
            'wishlist': [{'id': item.id, 'game': GamesSerializer(item.game).data} for item in wishlist]
        })

    @action(methods=['post'], detail=False)
    def deposit(self, request):
        amount = request.data.get('amount')
        try:
            value = Decimal(str(amount))
        except Exception:
            raise ValidationError({'amount': 'Некорректная сумма'})
        if value <= 0:
            raise ValidationError({'amount': 'Сумма должна быть больше нуля'})
        profile = request.user.profile
        profile.balance += value
        profile.save(update_fields=['balance'])
        return Response({'balance': profile.balance})


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['delete'], detail=False, url_path=r'by-game/(?P<game_id>[^/.]+)')
    def delete_by_game(self, request, game_id=None):
        try:
            game = Games.objects.get(pk=game_id)
        except Games.DoesNotExist:
            return Response({'detail': 'Игра не найдена'}, status=status.HTTP_404_NOT_FOUND)

        deleted, _ = Wishlist.objects.filter(user=request.user, game=game).delete()
        if deleted == 0:
            return Response({'detail': 'В списке желаемого нет этой игры'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
