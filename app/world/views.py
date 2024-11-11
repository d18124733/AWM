from django.shortcuts import render
from .models import Place

# Create your views here.
# View that reads the locations from world borders and passes on to maps

from django.shortcuts import render, redirect
from .models import WorldBorder, Profile as UserProfile

# authentication
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .forms import SignUpForm

from django.contrib.gis.geos.point import Point
from django.http import JsonResponse
import json

def map_view(request):
    if request.user.is_authenticated:
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        location = user_profile.location
        return render(request, 'map2.html', {'user': request.user, 'location': location})
    else:
        return render(request, 'login.html')


#login & logout views
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('login')


def update_location(request):   
    if request.method == 'POST':
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.location = Point(float(longitude), float(latitude))
        user_profile.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})


def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            UserProfile.objects.create(user=user)
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('index')  
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


def amenities_view(request):
    places = Place.objects.all()
    amenities = [
        {
            'latitude': place.geom.y,
            'longitude': place.geom.x,
            'name': place.name,
            'amenity': place.amenity
        }
        for place in places
    ]
    #print(amenities)
    return render(request, 'map.html', {'amenities': json.dumps(amenities)})


