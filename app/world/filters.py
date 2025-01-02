from rest_framework_gis.filterset import GeoFilterSet
from rest_framework_gis.filters import GeometryFilter
from django_filters import filters
from .models import Place

# django rest framework filter

class PlaceFilter(GeoFilterSet):
    amenity = filters.CharFilter(method='filter_by_amenities')  
    within_area = GeometryFilter(field_name='geom', lookup_expr='within') 

    class Meta:
        model = Place
        fields = ['amenity', 'within_area', 'name']

    # for querying ?amenity
    def filter_by_amenities(self, queryset, name, value):
        amenities = self.request.GET.getlist('amenity') 
        if amenities:
            return queryset.filter(amenity__in=amenities)  
        return queryset

    def filter_by_names(self, queryset, name, value):
        names = self.request.GET.getlist('name')  
        if names:
            return queryset.filter(name__in=names)  
        return queryset
    