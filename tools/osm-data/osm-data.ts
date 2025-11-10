import type { Plugin } from 'vite'
import { generateData } from "./extract-data";

export default function OSMData(): Plugin {
  const namespace = 'virtual:osm-data';
  const virtualModuleIdData = `${namespace}/data`;
  const resolvedVirtualModuleIdData = '\0' + virtualModuleIdData;

  return {
    name: 'osm-data',
    enforce: 'pre',

    resolveId(id: string) {
      if (id === virtualModuleIdData) {
        return resolvedVirtualModuleIdData;
      }
    },

    async load(id: string) {
      if (id === resolvedVirtualModuleIdData) {
        const {lines, stops} = await generateData();
        return `
          export const geoJSONLineData = ${JSON.stringify(lines)};
          export const geoJSONStopData = ${JSON.stringify(stops)};
        `;
      }
    }
  }
}
