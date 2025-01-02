from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import Counties, ElectoralDivisions

# Auto-generated `LayerMapping` dictionary for ElectoralDivisions model
electoraldivisions_mapping = {
    'objectid_1': 'OBJECTID_1',
    'ed_id': 'ED_ID',
    'ed_english': 'ED_ENGLISH',
    'ed_gaeilge': 'ED_GAEILGE',
    'county': 'COUNTY',
    'contae': 'CONTAE',
    'province': 'PROVINCE',
    'centroid_x': 'CENTROID_X',
    'centroid_y': 'CENTROID_Y',
    'guid_field': 'GUID_',
    'csoed_3409': 'CSOED_3409',
    'osied_3441': 'OSIED_3441',
    'csoed_34_1': 'CSOED_34_1',
    'geom': 'UNKNOWN',
}

# Auto-generated `LayerMapping` dictionary for counties model
counties_mapping = {
    'osm_id': 'OSM_ID',
    'name_tag': 'NAME_TAG',
    'name_ga': 'NAME_GA',
    'name_en': 'NAME_EN',
    'alt_name': 'ALT_NAME',
    'alt_name_g': 'ALT_NAME_G',
    'logainm_re': 'LOGAINM_RE',
    'osm_user': 'OSM_USER',
    'osm_timest': 'OSM_TIMEST',
    'attributio': 'ATTRIBUTIO',
    't_ie_url': 'T_IE_URL',
    'area': 'AREA',
    'latitude': 'LATITUDE',
    'longitude': 'LONGITUDE',
    'epoch_tstm': 'EPOCH_TSTM',
    'geom': 'MULTIPOLYGON',
}
 
eds = Path(__file__).resolve().parent / 'data' / 'Electoral_Divisions.geojson'
counties_shp = Path(__file__).resolve().parent / 'data' / 'counties.shp'

def run(verbose=True):

    lm = LayerMapping(ElectoralDivisions, eds, electoraldivisions_mapping, transform=True)
    lm1 = LayerMapping(Counties, counties_shp, counties_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)
    lm1.save(strict=True, verbose=verbose)