import * as turf from '@turf/turf';
import type { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { queryOverpassData }from './utils.ts';

const query = `
[out:json][timeout:25];
relation["type"="route"]["route"="tram"]["network:short"="VMS"];
out body;
node(r)["public_transport"="stop_position"] ->.stops;
.stops out center;
way(bn.stops);
out geom;
`;

interface Node {
  id: number;
  lon: number;
  lat: number;
  tags: { [key: string]: string };
}

interface Way {
  id: number;
  nodes: number[];
  geometry: { lon: number; lat: number }[];
}

interface Relation {
  id: number;
  members: { type: string; ref: number }[];
}

export async function generateStopData(): Promise<FeatureCollection<Point, GeoJsonProperties>> {
  const data = await queryOverpassData(query);

  const nodes: Node[] = [];
  const ways: Way[] = [];
  const relations: Relation[] = [];
  // Sort elements into individual lists
  for (const element of data.elements) {
    if (element.type === 'node') {
      nodes.push(element);
    } else if (element.type === 'way') {
      ways.push(element);
    } else if (element.type === 'relation') {
      relations.push(element);
    }
  }

  const stops: Feature<Point>[] = [];


  for (const node of nodes) {
    const nodeID = node.id;

    // START - Calculate stop icon bearing based on parent way direction

    const way = findFirstWayContainingNodeId(nodeID, ways)!;
    const index = way.nodes.indexOf(node.id);
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
    const neighbor = findNeighborStop(node, nodes);
    if (neighbor) {
      const neighborFeature = turf.point([neighbor.lon, neighbor.lat]);
      const laneAzimuth = bearingToAzimuth(_bearing);
      const reversedLaneAzimuth = (laneAzimuth + 180) % 360;
      // Calculate the angle from main stop to neighbor stop
      const neighborAzimuth = bearingToAzimuth(turf.bearing(mainFeature, neighborFeature));
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
    const _relation_ids = findRelationsContainingNodeId(nodeID, relations)
      .map(r => `relation/${r.id}`)
      .toArray();

    const id = `node/${nodeID}`;

    const feature: Feature<Point> = {
      type: 'Feature',
      id,
      geometry: {
        type: 'Point',
        coordinates: [node.lon, node.lat],
      },
      properties: {
        ...node.tags,
        _id: id,
        _bearing,
        _relation_ids,
        _anchor,
      },
    };

    stops.push(feature);
  }

  return {
    type: 'FeatureCollection',
    features: stops,
  };
}


function findFirstWayContainingNodeId(id: number, ways: Way[]): Way | undefined {
  return ways.find(way => way.nodes.includes(id));
}

function* findRelationsContainingNodeId(id: number, relations: Relation[]): Generator<Relation> {
  for (const relation of relations) {
    for (const member of relation.members) {
      if (member.type === 'node' && member.ref === id) {
        yield relation;
      }
    }
  }
}

function bearingToAzimuth(bearing: number): number {
  return bearing >= 0 ? bearing % 360 : bearing % 360 + 360;
}

function isInSector(sectorStartAngle: number, sectorAngle: number, angle: number): boolean {
  sectorStartAngle = sectorStartAngle % 360;
  angle = angle % 360;
  const diff = (angle - sectorStartAngle) % 360;
  return diff <= sectorAngle;
}

function findNeighborStop(targetNode: Node, nodes: Node[]): Node | undefined {
  return nodes.find(node => node.tags['name'] === targetNode.tags['name'] && node.id !== targetNode.id);
}
