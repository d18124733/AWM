# Generated by Django 5.1.4 on 2024-12-21 18:20

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Counties',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('osm_id', models.FloatField()),
                ('name_tag', models.CharField(max_length=255)),
                ('name_ga', models.CharField(max_length=255)),
                ('name_en', models.CharField(max_length=255)),
                ('alt_name', models.CharField(max_length=255)),
                ('alt_name_g', models.CharField(max_length=255)),
                ('logainm_re', models.CharField(max_length=255)),
                ('osm_user', models.CharField(max_length=100)),
                ('osm_timest', models.CharField(max_length=38)),
                ('attributio', models.CharField(max_length=255)),
                ('t_ie_url', models.CharField(max_length=35)),
                ('area', models.FloatField()),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('epoch_tstm', models.FloatField()),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
    ]
