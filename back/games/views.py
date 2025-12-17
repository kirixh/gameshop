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

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.request.query_params.get('category_id')
        category_title = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category_id:
            try:
                qs = qs.filter(category_id=int(category_id))
            except (TypeError, ValueError):
                qs = qs.none()
        elif category_title:
            qs = qs.filter(category__title__iexact=category_title)

        if search:
            qs = qs.filter(name__icontains=search)

        return qs

    @action(methods=['get'], detail=True)
    def category(self, request, pk=None):
        game = Games.objects.get(pk=pk)
        return Response({'category': game.category.title})

    @action(methods=['get'], detail=False)
    def categories(self, request):
        categories = Category.objects.all().order_by('title')
        return Response({'categories': [{'id': category.id, 'title': category.title} for category in categories]})
