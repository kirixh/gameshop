from django.urls import path, include
from rest_framework import routers

from games.views import GamesViewSet

router = routers.DefaultRouter()
router.register(r'games', GamesViewSet)

urlpatterns = [
    path('', include(router.urls))
]
