from django.urls import path, include
from rest_framework import routers

from users.views import StatisticsViewSet

router = routers.DefaultRouter()
router.register(r'statistics', StatisticsViewSet, basename='statistics')

urlpatterns = [
    path('', include(router.urls))
]
