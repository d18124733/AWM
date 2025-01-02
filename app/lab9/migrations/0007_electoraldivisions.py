# Generated by Django 5.1.4 on 2024-12-21 19:10

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab9', '0006_alter_counties_logainm_re_alter_counties_name_en_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ElectoralDivisions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('objectid_1', models.IntegerField()),
                ('ed_id', models.CharField(max_length=255)),
                ('ed_english', models.CharField(max_length=255)),
                ('ed_gaeilge', models.CharField(max_length=255)),
                ('county', models.CharField(max_length=255)),
                ('contae', models.CharField(max_length=255)),
                ('province', models.CharField(max_length=255)),
                ('centroid_x', models.CharField(max_length=255)),
                ('centroid_y', models.CharField(max_length=255)),
                ('guid_field', models.CharField(max_length=255)),
                ('csoed_3409', models.CharField(max_length=255)),
                ('osied_3441', models.CharField(max_length=255)),
                ('csoed_34_1', models.CharField(max_length=255)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
    ]
