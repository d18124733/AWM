# Generated by Django 4.1.7 on 2024-12-19 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('world', '0003_place'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='amenity',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='place',
            name='name',
            field=models.CharField(max_length=255),
        ),
    ]
