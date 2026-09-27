# Hybrid WeatherAI — Final UI Merge

This build combines the two supplied projects with **Pixel Perfect as the primary UI/interaction base** and the stronger Forecast Blender workflow from Fast Forge.

## Included
- Pixel Perfect header, mobile navigation, location picker, theme controls and visual design system.
- Pixel Perfect Leaflet weather map with OpenStreetMap/Satellite basemaps, weather/risk layers, region overlays, zoom, geolocation, fullscreen and marker popups.
- Pixel Perfect-style Home and Dashboard.
- Horizontal, swipeable hourly forecast with weather icons and selected-hour state.
- Forecast Blender with clickable NWP Model A, NWP Model B and AI/ML Model explanations.
- Forecast explanation modal showing model values, weights and blended result.
- Disaster Alerts page with working acknowledge/share interactions and Leaflet alert map.
- Analytics page.
- Responsive mobile layout with no intentional fixed-width dashboard grids.
- Navigation was cleaned so every primary navigation destination exists in this build.

## Important runtime note
The source was checked for TypeScript/JSX parse errors with the available global TypeScript compiler. A full Vite production build could not be executed in the build environment because the project's npm dependencies were not available locally and `npm install` timed out. Run `npm install` (or `bun install` if using Bun) before running the app.

## Run
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```
