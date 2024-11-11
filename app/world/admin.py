from django.contrib.gis import admin
from .models import WorldBorder
from .models import Place

admin.site.register(WorldBorder, admin.GISModelAdmin)
admin.site.register(Place, admin.GISModelAdmin)