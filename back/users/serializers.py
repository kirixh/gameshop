from rest_framework import serializers

from users.models import Statistics


class StatisticsSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Statistics
        fields = "__all__"
