import json
import requests
from turfpy import measurement
from geojson import Point, Feature, FeatureCollection, LineString

endPoint = r"http://overpass-api.de/api/interpreter"
query = '''
[out:json][timeout:25];
relation["type"="route"]["route"="tram"]["network:short"="VMS"];
out body;
node(r)["public_transport"="stop_position"] ->.stops;
.stops out center;
way(bn.stops);
out geom;
'''
data = requests.post(endPoint, data = {'data': query}).json()


############## Transform #############

nodes = []
ways = []
relations = []

# Helper functions
def findFirstWayContainingNodeId(id):
  for way in ways:
    if id in way['nodes']:
      return way

def findRelationsContainingNodeId(id):
  for relation in relations:
    for member in relation['members']:
      if member['type'] == 'node' and member['ref'] == id:
        yield relation

# Sort elements into individual lists
for element in data['elements']:
  if element['type'] == 'node':
    nodes.append(element)
  elif element['type'] == 'way':
    ways.append(element)
  elif element['type'] == 'relation':
    relations.append(element)

stops = []
for node in nodes:
  nodeID = node['id']

  # START - Calculate stop icon bearing based on parent way direction

  way = findFirstWayContainingNodeId(nodeID)
  geom = way['geometry'];
  index = way['nodes'].index(node['id'])
  # Select main point from way
  mainPoint = geom[index]
  mainFeature = Feature(geometry=Point((mainPoint['lon'], mainPoint['lat'])));
  # Select previous or next point from way
  siblingPoint = geom[index + 1] if index + 1 < len(geom) else geom[index - 1]
  siblingFeature = Feature(geometry=Point((siblingPoint['lon'], siblingPoint['lat'])))
  # Calculate bearing based on sibling point from way
  bearing = measurement.bearing(mainFeature, siblingFeature)

  # START - Calculate label position without intersecting neighbor lane

  def findNeighborStop(targetNode):
    for node in nodes:
      if node['tags']['name'] == targetNode['tags']['name'] and node['id'] != targetNode['id']:
        return node

  def bearingToAzimuth(bearing: float) -> float:
      """Convert bearing (-180° to 180°) to azimuth (0° to 360°)"""
      return bearing % 360 if bearing >= 0 else bearing % 360 + 360

  def isInSector(sectorStartAngle: float, sectorAngle: float, angle: float) -> bool:
      sectorStartAngle = sectorStartAngle % 360
      angle = angle % 360
      diff = (angle - sectorStartAngle) % 360
      return diff <= sectorAngle

  anchor = 'right'
  # Find neighbor stop from other lane by name similarity
  neighbor = findNeighborStop(node)
  if neighbor:
    neighborFeature = Feature(geometry=Point((neighbor['lon'], neighbor['lat'])))

    laneAzimuth = bearingToAzimuth(bearing)
    reversedLaneAzimuth = (laneAzimuth + 180) % 360
    # Calculate the angle from main stop to neighbor stop
    neighborAzimuth = bearingToAzimuth(measurement.bearing(mainFeature, neighborFeature))
    # Check which lane azimuth can be reached by moving neighborAzimuth counter clockwise with the least change
    # Original equation for calculating the diff is: [laneAzimuth = neighborAzimuth - X + 360] | mod 360
    diffA = (neighborAzimuth + 360 - laneAzimuth) % 360
    diffB = (neighborAzimuth + 360 - reversedLaneAzimuth) % 360
    sectorStart = laneAzimuth if diffA < diffB else reversedLaneAzimuth
    # Check if the 90° (right) angle is within a 180° sector (semi circle) spanned along the lane in the direction of neighborAzimuth
    if isInSector(sectorStart, 180, 90):
      # align left from line
      anchor = 'right'
    else:
      # align right from line
      anchor = 'left'

  # START - Find route relations this stop belongs to

  relationIds = map(
    lambda r : f'relation/{r['id']}',
    findRelationsContainingNodeId(nodeID)
  )

  feature = Feature(
    id=f'node/{nodeID}',
    geometry=Point((node['lon'], node['lat'])),
    properties={
      **node['tags'],
      '_bearing': bearing,
      '_relation_ids': list(relationIds),
      '_id': f'node/{nodeID}',
      '_anchor': anchor,
    },
  )
  stops.append(feature)


with open("stops.geojson", "w") as f:
  json.dump(FeatureCollection(stops), f)
