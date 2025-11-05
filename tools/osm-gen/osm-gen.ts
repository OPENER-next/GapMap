import type { Plugin } from 'vite'
import { generateLineData } from "./generate-lines";
import { generateStopData } from "./generate-stops";

export default function OSMGen(): Plugin {
  const namespace = 'virtual:osm-gen';
  const virtualModuleIdLines = `${namespace}/lines`;
  const resolvedVirtualModuleIdLines = '\0' + virtualModuleIdLines;
  const virtualModuleIdStops = `${namespace}/stops`;
  const resolvedVirtualModuleIdStops = '\0' + virtualModuleIdStops;

  return {
    name: 'osm-gen',
    enforce: 'pre',

    resolveId(id: string) {
      switch (id) {
        case virtualModuleIdLines:
          return resolvedVirtualModuleIdLines;
        case virtualModuleIdStops:
          return resolvedVirtualModuleIdStops;
      }
    },

    async load(id: string) {
      switch (id) {
        case resolvedVirtualModuleIdLines: {
          const data = await generateLineData();
          return `export default ${JSON.stringify(data)}`;
        }

        case resolvedVirtualModuleIdStops: {
          const data = await generateStopData();
          return `export default ${JSON.stringify(data)}`;
        }
      }
    }
  }
}
