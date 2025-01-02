##Sample serializer
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import ElectoralDivisions,Counties

class ElectoralDistrictsSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = ElectoralDivisions
        fields = '__all__'
        geo_field = 'geom'


class CountiesSerializer(GeoFeatureModelSerializer):
    #distance = serializers.CharField()
    class Meta:
        model = Counties
        fields = '__all__'
        geo_field = 'geom'


class CountiesMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counties
        fields = ['name_tag', 'area', 'latitude', 'longitude']