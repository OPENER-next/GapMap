import { generateLineData } from "./generate-lines.ts";
import { generateStopData } from "./generate-stops.ts";

/**
 * Run via `node osm-gen-run.ts lines|stops`
 */

switch(process.argv[2]) {
  case 'lines': {
    const data = await generateLineData();
    process.stdout.write(JSON.stringify(data));
    break;
  }

  case 'stops': {
    const data = await generateStopData();
    process.stdout.write(JSON.stringify(data));
    break;
  }
}
