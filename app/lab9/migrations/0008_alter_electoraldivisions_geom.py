# Generated by Django 5.1.4 on 2024-12-21 19:18

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lab9', '0007_electoraldivisions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='electoraldivisions',
            name='geom',
            field=django.contrib.gis.db.models.fields.GeometryField(srid=4326),
        ),
    ]
