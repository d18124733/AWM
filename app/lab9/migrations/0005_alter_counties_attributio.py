# Generated by Django 5.1.4 on 2024-12-21 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lab9', '0004_alter_counties_alt_name_alter_counties_alt_name_g'),
    ]

    operations = [
        migrations.AlterField(
            model_name='counties',
            name='attributio',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
