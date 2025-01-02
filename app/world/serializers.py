from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import Place
from django.contrib.gis.geos import Point

# serilizer for rest framework filtering
class PlaceSerializer(GeoFeatureModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ['id', 'name', 'amenity', 'latitude', 'longitude', 'geom'] 
        geo_field = 'geom' 

    def get_latitude(self, obj):
        return obj.geom.y 

    def get_longitude(self, obj):
        return obj.geom.x 
    
    def create(self, validated_data):
        geom_data = validated_data.pop('geom')
        point = Point(geom_data['coordinates'][0], geom_data['coordinates'][1])
        validated_data['geom'] = point

        return super().create(validated_data)

