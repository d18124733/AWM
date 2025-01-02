from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import Place
from django.contrib.gis.geos import Point
import geopandas as gpd

CA1data = '/app/world/data/export.geojson'

CA2data = '/app/world/data/bars_and_fast_food.geojson'

complete_dataset = '/app/world/data/complete_dataset.geojson'

data = gpd.read_file(complete_dataset)
data = data.dropna(subset=['name'])

#this was too slow
#def run(): 
#    for _, row in data.iterrows():
#        Place.objects.create(
#            amenity=row.get('amenity'),
#            name=row.get('name'),
#            geom=Point(row.geometry.x, row.geometry.y)  
#        )

#this batch loads faster (but freezes on azure)
def run():
    batch_size = 1000 
    rows_to_create = []

    for _, row in data.iterrows():
        rows_to_create.append(
            Place(
                amenity=row.get('amenity'),
                name=row.get('name'),
                geom=Point(row.geometry.x, row.geometry.y)
            )
        )
        
        if len(rows_to_create) >= batch_size:
            Place.objects.bulk_create(rows_to_create)
            rows_to_create = []  

    if rows_to_create:
        Place.objects.bulk_create(rows_to_create)