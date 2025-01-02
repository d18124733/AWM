from django.contrib import admin

# Register your models here.

from .models import ElectoralDivisions, Counties
from django.contrib.gis import admin

admin.site.register(ElectoralDivisions, admin.GISModelAdmin)
admin.site.register(Counties, admin.GISModelAdmin)