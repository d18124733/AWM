#Sample code

from rest_framework_gis.filterset import GeoFilterSet
from rest_framework_gis.filters import GeometryFilter
from django_filters import filters
from .models import ElectoralDivisions, Counties

class CountyElectoralFilter(GeoFilterSet):
    constituency = filters.CharFilter(method='get_electorals_by_county')

    class Meta:
        model = Counties
        exclude = ['geom']


    def get_electorals_by_county(self, queryset, name, value):
        query_ = ElectoralDivisions.objects.filter(pk=value)
        if query_:
            obj = query_.first()
            return queryset.filter(geom__within=obj.geom)
        return queryset
    

class ElectoralDivisionsFilter(GeoFilterSet):
    county_name = filters.CharFilter(method='filter_by_county')

    class Meta:
        model = ElectoralDivisions
        fields = ['county_name']

    def filter_by_county(self, queryset, name, value):
        # Find the county by name
        county = Counties.objects.filter(name_tag__iexact=value).first()
        if county:
            # Filter ElectoralDivisions within the county geometry
            return queryset.filter(geom__within=county.geom)
        return queryset.none()