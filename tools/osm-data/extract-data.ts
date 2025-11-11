import * as turf from '@turf/turf';
import type { Feature, FeatureCollection, GeoJsonProperties, LineString, Point } from 'geojson';
import { arrayEquals, overpassToGeoJSONBounds, overpassToGeoJSONCoords, queryOverpassData }from './utils.ts';

const query = `
[out:json][timeout:50];
relation["type"="route"]["route"="tram"]["network:short"="KVV"] -> .relations;

(
  node(r.relations:"stop");
  node(r.relations:"stop_entry_only");
  node(r.relations:"stop_exit_only");
) ->.stops;

nwr(r.relations:"platform") ->.platforms;

way(r.relations) -> .relationWays;
way(bn.stops) -> .waysContainingStopNode;
// intersection of ways in the route relations and those containing a stop
way.relationWays.waysContainingStopNode -> .stopLineSegments;

.relations out geom;
.stops out center;
.platforms out body;
.stopLineSegments out geom;
`;

interface Element {
  id: number;
  tags: Record<string, string>;
}

interface Coordinate { lon: number; lat: number }

interface Node extends Element, Coordinate {}

interface Way extends Element {
  nodes: Array<number>;
  geometry: Array<Coordinate>;
}

interface Relation extends Element {
  bounds: {
    minlon: number;
    minlat: number;
    maxlon: number;
    maxlat: number;
  };
  members: Array<Member>;
}

interface Member {
  type: string;
  role: string;
  geometry: Array<Coordinate>;
  ref: number;
}


export async function generateData(): Promise<{
  lines: FeatureCollection<LineString, GeoJsonProperties>,
  stops: FeatureCollection<Point, GeoJsonProperties>
}> {
  const data = await queryOverpassData(query);

  const nodes: Map<number, Node> = new Map();
  const ways: Map<number, Way> = new Map();
  const relations: Map<number, Relation> = new Map();

  // sort elements into individual maps for easy and fast access
  for (const element of data.elements) {
    if (element.type === 'node') {
      nodes.set(element.id, element);
    }
    else if (element.type === 'way') {
      ways.set(element.id, element);
    }
    else if (element.type === 'relation') {
      relations.set(element.id, element);
    }
  }

  // group based on relation roles instead of element tags to reduce errors if someone is e.g. not mapping with ptv2
  const routes: Set<Relation> = new Set(
    relations.values().filter(r => r.tags.type === 'route')
  );
  const stops: Set<Node> = new Set();
  const platforms: Set<Node | Way | Relation> = new Set();
  const routeSegments: Set<Way> = new Set();

  for (const route of routes.values()) {
    for (const member of route.members) {
      if (member.type === 'node' && ['stop', 'stop_entry_only', 'stop_exit_only'].includes(member.role)) {
        stops.add(nodes.get(member.ref)!);
      }
      else if (member.role === 'platform') {
        switch (member.type) {
          case 'node':
            platforms.add(nodes.get(member.ref)!);
          break;
          case 'way':
            platforms.add(ways.get(member.ref)!);
          break;
          case 'relation':
            platforms.add(relations.get(member.ref)!);
          break;
        }
      }
      else if (member.type === 'way' && member.role === '') {
        const waySegment = ways.get(member.ref);
        // query only includes relevant way segments
        if (waySegment) routeSegments.add(waySegment);
      }
    }
  }

  const lineFeatures = routes.values().map(extractLineFeature).toArray();
  const stopFeatures: Array<Feature<Point>> = [];

  for (const stop of stops) {
    let route: Relation | undefined;
    let platform: Node | Way | Relation | undefined;
    // find first relation that contains this stop
    const it = findRoutesContainingNodeId(stop.id, routes).next();
    if (it.value !== undefined) {
      route = it.value[0];
      const memberIndex = it.value[1];
      // find related platform by looking at the next element in the relation member list
      const nextMember = route!.members[memberIndex + 1];
      if (nextMember && nextMember.role === 'platform') {
        platform = platforms.values().find(p => p.id === nextMember.ref)
      }
    }
    else {
      throw Error(`No route relation found for the given stop node: ${stop.id}`);
    }

    stopFeatures.push(extractStopFeature(stop, stops, routeSegments, routes, platform));
  }

  return {
    lines: {
      type: 'FeatureCollection',
      features: lineFeatures,
    },
    stops: {
      type: 'FeatureCollection',
      features: stopFeatures,
    }
  }
}

function extractLineFeature(relation: Relation): Feature<LineString, GeoJsonProperties> {
  const coordinates: Array<[number, number]> = [];
  const stops: string[] = [];

  for (const [index, member] of relation.members.entries()) {
    if (member.type === 'way' && member.role === '') {
      const newPoints = Array.from(overpassToGeoJSONCoords(member.geometry));
      // Drop overlapping coordinates and swap/align coordinates
      if (coordinates.length === 0) {
        // The first way (line segment) might be reversed so look ahead and reverse if needed
        const nextMember = relation.members[index + 1];
        if (nextMember) {
          const nextPoints = Array.from(overpassToGeoJSONCoords(nextMember.geometry));
          if (arrayEquals(newPoints[0], nextPoints[0])) {
            newPoints.reverse();
          }
        }
        coordinates.push(...newPoints);
      }
      else if (arrayEquals(coordinates[coordinates.length - 1], newPoints[0])) {
        newPoints.shift();
        coordinates.push(...newPoints);
      }
      else if (arrayEquals(coordinates[coordinates.length - 1], newPoints[newPoints.length - 1])) {
        newPoints.pop();
        newPoints.reverse();
        coordinates.push(...newPoints);
      }
    }
    else if (member.type === 'node' && ['stop', 'stop_entry_only', 'stop_exit_only'].includes(member.role)) {
      stops.push(`node/${member.ref}`);
    }
  }

  const id = `relation/${relation.id}`;

  return {
    type: 'Feature',
    id,
    bbox: overpassToGeoJSONBounds(relation.bounds),
    geometry: {
      type: 'LineString',
      coordinates: coordinates,
    },
    properties: {
      ...relation.tags,
      _id: id,
      _stops: stops,
    },
  };
}

function extractStopFeature(stop: Node, stops: Set<Node>, ways: Set<Way>, routes: Set<Relation>, platform?: Node | Way | Relation): Feature<Point, GeoJsonProperties> {
  const nodeID = stop.id;

  // START - Calculate stop icon bearing based on parent way direction

  const way = ways.values().find(way => way.nodes.includes(nodeID));
  if (!way) {
    throw Error(`No way (rail segment) found that contains the given stop node: ${stop.id}`);
  }
  const index = way.nodes.indexOf(nodeID);
  // Select main point from way
  const mainPoint = way.geometry[index];
  const mainFeature = turf.point([mainPoint.lon, mainPoint.lat]);
  // Select previous or next point from way
  const siblingPoint = index + 1 < way.geometry.length
    ? way.geometry[index + 1]
    : way.geometry[index - 1];
  const siblingFeature = turf.point([siblingPoint.lon, siblingPoint.lat]);
  // Calculate bearing based on sibling point from way
  const _bearing = turf.bearing(mainFeature, siblingFeature);

  // START - Calculate label position without intersecting neighbor lane

  let _anchor = 'right';
  // Find neighbor stop from other lane by name similarity
  const neighbor = findNeighborStop(stop, stops);
  if (neighbor) {
    const neighborFeature = turf.point([neighbor.lon, neighbor.lat]);
    const laneAzimuth = turf.bearingToAzimuth(_bearing);
    const reversedLaneAzimuth = (laneAzimuth + 180) % 360;
    // Calculate the angle from main stop to neighbor stop
    const neighborAzimuth = turf.bearingToAzimuth(turf.bearing(mainFeature, neighborFeature));
    // Check which lane azimuth can be reached by moving neighborAzimuth counter clockwise with the least change
    // Original equation for calculating the diff is: [laneAzimuth = neighborAzimuth - X + 360] | mod 360
    const diffA = (neighborAzimuth + 360 - laneAzimuth) % 360;
    const diffB = (neighborAzimuth + 360 - reversedLaneAzimuth) % 360;
    const sectorStart = diffA < diffB ? laneAzimuth : reversedLaneAzimuth;
    // Check if the 90° (right) angle is within a 180° sector (semi circle) spanned along the lane in the direction of neighborAzimuth
    if (isInSector(sectorStart, 180, 90)) {
      // align left from line
      _anchor = 'right';
    } else {
      // align right from line
      _anchor = 'left';
    }
  }

  // START - Find route relations this stop belongs to

  const _relation_ids = findRoutesContainingNodeId(nodeID, routes)
    .map(r => `relation/${r[0].id}`)
    .toArray();

  const id = `node/${nodeID}`;

  return {
    type: 'Feature',
    id,
    geometry: {
      type: 'Point',
      coordinates: [stop.lon, stop.lat],
    },
    properties: {
      ...stop.tags,
      // merge platform tags if existing
      ...platform?.tags,
      _id: id,
      _bearing,
      _relation_ids,
      _anchor,
    },
  };
}

function* findRoutesContainingNodeId(id: number, relations: Set<Relation>): Generator<[Relation, number]> {
  for (const relation of relations) {
    for (const [memberIndex, member] of relation.members.entries()) {
      if (member.type === 'node' && member.ref === id) {
        yield [relation, memberIndex];
      }
    }
  }
}

function isInSector(sectorStartAngle: number, sectorAngle: number, angle: number): boolean {
  sectorStartAngle = sectorStartAngle % 360;
  angle = angle % 360;
  const diff = (angle - sectorStartAngle) % 360;
  return diff <= sectorAngle;
}

function findNeighborStop(targetNode: Node, nodes: Set<Node>): Node | undefined {
  return nodes.values().find(node => node.tags['name'] === targetNode.tags['name'] && node.id !== targetNode.id);
}
