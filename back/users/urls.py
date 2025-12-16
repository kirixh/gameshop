from django.urls import path, include
from rest_framework import routers

from users.views import StatisticsViewSet, UserProfileViewSet, WishlistViewSet

router = routers.DefaultRouter()
router.register(r'statistics', StatisticsViewSet, basename='statistics')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls))
]
