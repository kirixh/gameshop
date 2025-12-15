from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets

from games.models import Games, Category
from games.serializers import GamesSerializer
from core.permissions import IsAdminOrReadOnly


class GamesViewSet(viewsets.ModelViewSet):
    queryset = Games.objects.all()
    serializer_class = GamesSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(methods=['get'], detail=True)
    def category(self, request, pk=None):
        game = Games.objects.get(pk=pk)
        return Response({'category': game.category.title})

    @action(methods=['get'], detail=False)
    def categories(self, request):
        categories = Category.objects.all()
        return Response({'categories': [category.title for category in categories]})
