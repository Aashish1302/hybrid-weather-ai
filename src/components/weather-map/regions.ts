import type { FeatureCollection, Polygon } from "geojson";

import type { RiskLevel } from "@/lib/weather-data";

/**
 * Coarse GeoJSON regions used as risk overlays. Replace with authoritative
 * district / basin boundaries when connecting real data sources.
 */
export const REGION_GEOJSON: FeatureCollection<
  Polygon,
  { name: string; flood: RiskLevel; cyclone: RiskLevel; heatwave: RiskLevel; extremeRain: RiskLevel }
> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Brahmaputra Valley",
        flood: "extreme",
        cyclone: "moderate",
        heatwave: "low",
        extremeRain: "extreme",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [89.6, 25.6],
            [95.4, 27.2],
            [95.9, 28.2],
            [89.9, 26.7],
            [89.6, 25.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Middle Ganga Basin",
        flood: "high",
        cyclone: "low",
        heatwave: "moderate",
        extremeRain: "high",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [81.2, 24.6],
            [88.2, 24.2],
            [88.4, 26.6],
            [81.4, 27.1],
            [81.2, 24.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "East Coast / Bay of Bengal Landfall Belt",
        flood: "high",
        cyclone: "extreme",
        heatwave: "moderate",
        extremeRain: "high",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.1, 12.6],
            [87.6, 21.4],
            [89.2, 21.8],
            [80.9, 12.2],
            [80.1, 12.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Western Ghats Orographic Belt",
        flood: "high",
        cyclone: "moderate",
        heatwave: "low",
        extremeRain: "extreme",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.2, 9.4],
            [75.4, 9.6],
            [75.1, 20.6],
            [72.6, 19.6],
            [73.2, 9.4],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "North-West Arid Plains",
        flood: "low",
        cyclone: "low",
        heatwave: "extreme",
        extremeRain: "low",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [69.6, 24.4],
            [77.4, 26.2],
            [76.9, 30.2],
            [70.2, 28.4],
            [69.6, 24.4],
          ],
        ],
      },
    },
  ],
};
