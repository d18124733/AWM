from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'ElectoralDivisions', views.ElectoralDistrictsViewSet, basename="electoral-divisions")
router.register(r'Counties', views.CountiesViewSet, basename="counties")

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/v1/', include(router.urls)),
]