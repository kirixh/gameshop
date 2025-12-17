from rest_framework import viewsets

from achievements.models import Achievements
from achievements.serializers import AchievementsSerializer


class AchievementsViewSet(viewsets.ModelViewSet):
    queryset = Achievements.objects.all()
    serializer_class = AchievementsSerializer
