# Generated by Django 5.1.4 on 2024-12-21 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab9', '0002_alter_counties_alt_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='counties',
            name='alt_name',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AlterField(
            model_name='counties',
            name='alt_name_g',
            field=models.CharField(default='Unknown', max_length=255),
        ),
    ]