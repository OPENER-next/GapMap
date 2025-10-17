import json
import requests
from turfpy import measurement
from geojson import Point, LineString, Feature, FeatureCollection

endPoint = r"http://overpass-api.de/api/interpreter"
query = '''
[out:json][timeout:25];
relation["type"="route"]["route"="tram"]["network:short"="VMS"];
out geom;
'''
data = requests.post(endPoint, data = {'data': query}).json()

############## Transform #############

def overpassToGeoJSONCoords(coordinates):
  for coord in coordinates:
    yield (coord['lon'], coord['lat'])

def overpassToGeoJSONBounds(bounds):
  return [ bounds['minlon'], bounds['minlat'], bounds['maxlon'], bounds['maxlat'] ]

lines = []
for relation in data['elements']:
  coordinates = []
  for member in relation['members']:
    if member['type'] == 'way' and member['role'] == "":
      newPoints = member['geometry'];
      # Drop overlapping coordinates and swap/align coordinates
      if len(coordinates) == 0:
        coordinates.extend(newPoints)
      elif coordinates[-1] == newPoints[0]:
        newPoints.pop(0)
        coordinates.extend(newPoints)
      elif coordinates[-1] == newPoints[-1]:
        newPoints.reverse()
        newPoints.pop(0)
        coordinates.extend(newPoints)

  bbox = overpassToGeoJSONBounds(relation['bounds']);

  feature = Feature(
    id=f'relation/{relation['id']}',
    geometry=LineString(overpassToGeoJSONCoords(coordinates)),
    properties={
      **relation['tags'],
      '_id': f'relation/{relation['id']}',
      '_bbox': bbox,
    },
    bbox=bbox
  )
  lines.append(feature)

with open("lines.geojson", "w") as f:
  json.dump(FeatureCollection(lines), f)
