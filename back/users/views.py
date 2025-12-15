from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from games.serializers import GamesSerializer
from core.permissions import IsOwnerOrReadOnly
from users.models import Statistics
from users.serializers import StatisticsSerializer


class StatisticsViewSet(viewsets.ModelViewSet):
    queryset = Statistics.objects.all()
    serializer_class = StatisticsSerializer
    permission_classes = [IsOwnerOrReadOnly]

    @action(methods=['get'], detail=False)
    def user(self, request):
        statistics = Statistics.objects.filter(user_id=request.user.id)
        return Response({'games': [GamesSerializer(statistic.game).data for statistic in statistics],
                         'statistics': [StatisticsSerializer(statistic).data for statistic in statistics]})

    @action(methods=['get'], detail=True)
    def game(self, request, pk=None):
        try:
            statistic = Statistics.objects.get(user_id=request.user.id, game_id=pk)
        except Statistics.DoesNotExist:
            return Response({"detail": "Statistic for this game_id doesn't exist", "game": None, "statistic":None})
        return Response({'game': [GamesSerializer(statistic.game).data],
                         'statistic': StatisticsSerializer(statistic).data})
