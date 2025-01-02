"""awmproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView

urlpatterns = [
    path('api/admin/', admin.site.urls),
    #path('', include('map.urls')),
    path('', RedirectView.as_view(url='/login/', permanent=False)),  
    path('', include('world.urls')),
    path('', include('pwa.urls')), # lab7 
    #path('', include('webmap.urls')), # lab7 
    #path('', include('lab7.urls')), # lab 7
    path("api/v1/", include('lab7.urls')), # lab 7
    path('', include('lab9.urls')), # lesson 9 lab 9
    #path('frontend/', include('gis_frontend.urls')),
]
