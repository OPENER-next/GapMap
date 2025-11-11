# GapMap

A simple web app to demonstrate how combining public transport infrastructure data from OpenStreetMap (OSM) with vehicle data can provide insights into the accessibility of individual stops.

The tram network of Karlsruhe is taken as an example because a lot of the platforms mapped in OSM contain height information. To change the network alter the Overpass query at the top of the `tools/osm-data/extract-data.ts` file.

## Developing

The app is developed using the [Svelte framework](https://svelte.dev/) and compiled into a static site. Therefore this project requires nodejs and npm to run.

Install dependencies by running:
```sh
npm i
```

Start a development server by running:
```sh
npm run dev -- --open
```

Build the app by running:
```sh
npm run build
```

## Know Problems

The OSM data is queried once at compile time via [Overpass API](https://overpass-api.de/). Overpass sometimes throws a 504 error when the server is overloaded. Try running/building the app again after a short period of time.
