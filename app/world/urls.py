from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'places', views.PlaceViewSet, basename='amenities')

# urls prefixed with api are for React, otherwise for Django
urlpatterns = [
    path('map/', views.amenities_view, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('api/update_location/', views.update_location, name='update_location'),
    path('map2/', views.map_view, name='map2'),
    path('', include(router.urls)),
    path('api/api-auth/', include('rest_framework.urls', namespace='rest_framework')), 
    path('api/amenities/', include(router.urls)),
    path('api/login/', views.login_api, name='loginapi'),
    path('api/signup/', views.signup_api, name='signupapi'),
    path('api/logout/', views.logout_api, name='logoutapi'),
    path('api/csrf/', views.csrf, name='csrf'),
    path('', include('pwa.urls')), 
]