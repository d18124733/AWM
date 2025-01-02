 #on gis_frontend/views.py
from django.shortcuts import render
from django.http import HttpResponse
import requests

def index(request):
    #Hint: Check your correct URL of your rest api
    response = requests.get('http://127.0.0.1:8000/api/v1/Counties')
    counties = response.json()
    return render(request, 'index.html',{'counties': counties})


def users(request):
    #pull data from third party rest api
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    #convert reponse data into json
    users = response.json()
    print(users)
    return render(request, 'users.html', {'users': users})