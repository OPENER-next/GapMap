import { generateData } from "./extract-data.ts";

/**
 * Run via `node osm-gen-run.ts lines|stops`
 */
const data = await generateData();
switch(process.argv[2]) {
  case 'lines': {
    process.stdout.write(JSON.stringify(data.lines));
    break;
  }

  case 'stops': {
    process.stdout.write(JSON.stringify(data.stops));
    break;
  }
}
