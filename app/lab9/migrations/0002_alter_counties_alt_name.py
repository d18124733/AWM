# Generated by Django 5.1.4 on 2024-12-21 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab9', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='counties',
            name='alt_name',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
