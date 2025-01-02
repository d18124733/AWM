from django.db import models

# Create your models here.

# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models

class ElectoralDivisions(models.Model):
    objectid_1 = models.IntegerField()
    ed_id = models.CharField(max_length=255)
    ed_english = models.CharField(max_length=255)
    ed_gaeilge = models.CharField(max_length=255)
    county = models.CharField(max_length=255)
    contae = models.CharField(max_length=255)
    province = models.CharField(max_length=255)
    centroid_x = models.CharField(max_length=255)
    centroid_y = models.CharField(max_length=255)
    guid_field = models.CharField(max_length=255)
    csoed_3409 = models.CharField(max_length=255)
    osied_3441 = models.CharField(max_length=255)
    csoed_34_1 = models.CharField(max_length=255)
    geom = models.GeometryField(srid=4326)


class Counties(models.Model):
    osm_id = models.FloatField()
    name_tag = models.CharField(max_length=255, null=True)
    name_ga = models.CharField(max_length=255, null =True)
    name_en = models.CharField(max_length=255, null=True)
    alt_name = models.CharField(max_length=255, null=True)
    alt_name_g = models.CharField(max_length=255, null=True)
    logainm_re = models.CharField(max_length=255, null=True)
    osm_user = models.CharField(max_length=100, null=True)
    osm_timest = models.CharField(max_length=38, null=True)
    attributio = models.CharField(max_length=255, null=True)
    t_ie_url = models.CharField(max_length=35, null=True)
    area = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    epoch_tstm = models.FloatField()
    geom = models.MultiPolygonField(srid=4326)

