from django.urls import path, include
from rest_framework import routers

from achievements.views import AchievementsViewSet

router = routers.DefaultRouter()
router.register(r'achievements', AchievementsViewSet)

urlpatterns = [
    path('', include(router.urls))
]
