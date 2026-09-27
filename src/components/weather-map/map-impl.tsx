import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { Circle, GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import {
  LAYERS,
  LOCATIONS,
  RISK_META,
  layerValue,
  type LayerKey,
  type LocationRecord,
} from "@/lib/weather-data";
import { REGION_GEOJSON } from "./regions";

export interface MapMarkerSpec {
  id: string;
  lat: number;
  lon: number;
  title: string;
  subtitle?: string;
  colorHex: string;
  badgeText: string;
  rows: { label: string; value: string }[];
  actionLabel?: string;
}

export interface MapImplProps {
  layer: LayerKey;
  basemap: "map" | "satellite";
  center: [number, number];
  zoom: number;
  markers: MapMarkerSpec[];
  userPosition?: { lat: number; lon: number } | null;
  showRegions: boolean;
  onMarkerAction?: (id: string) => void;
  onMarkerSelect?: (id: string) => void;
  registerControls?: (api: { zoomIn: () => void; zoomOut: () => void }) => void;
}

const TILES = {
  map: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
  },
};

function pinIcon(colorHex: string, badgeText: string) {
  return L.divIcon({
    className: "",
    html: `<div class="hwi-marker" style="background:${colorHex};width:38px;height:38px">${badgeText}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -18],
  });
}

function MapSync({
  center,
  zoom,
  registerControls,
}: {
  center: [number, number];
  zoom: number;
  registerControls?: (api: { zoomIn: () => void; zoomOut: () => void }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.9 });
  }, [map, center, zoom]);

  useEffect(() => {
    registerControls?.({ zoomIn: () => map.zoomIn(), zoomOut: () => map.zoomOut() });
    const t = setTimeout(() => map.invalidateSize(), 240);
    return () => clearTimeout(t);
  }, [map, registerControls]);

  return null;
}

function overlayRadius(layer: LayerKey, loc: LocationRecord) {
  const { value } = layerValue(loc, layer);
  if (layer === "rainfall") return 28000 + value * 900;
  if (layer === "temperature") return 30000 + value * 1400;
  if (layer === "wind") return 30000 + value * 2200;
  return 32000 + value * 900;
}

export default function MapImpl({
  layer,
  basemap,
  center,
  zoom,
  markers,
  userPosition,
  showRegions,
  onMarkerAction,
  onMarkerSelect,
  registerControls,
}: MapImplProps) {
  const layerDef = LAYERS.find((l) => l.key === layer) ?? LAYERS[0];
  const isRiskLayer = ["flood", "cyclone", "heatwave", "extremeRain"].includes(layer);

  const regionStyle = useMemo(
    () => (feature?: GeoJSON.Feature) => {
      const props = feature?.properties as
        | Record<"flood" | "cyclone" | "heatwave" | "extremeRain", keyof typeof RISK_META>
        | undefined;
      const level = props && isRiskLayer ? props[layer as "flood"] : "moderate";
      const hex = RISK_META[level ?? "moderate"].hex;
      return {
        color: hex,
        weight: 1.5,
        fillColor: hex,
        fillOpacity: isRiskLayer ? 0.24 : 0.08,
        dashArray: isRiskLayer ? undefined : "4 4",
      };
    },
    [layer, isRiskLayer],
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom
      className="size-full"
      worldCopyJump
    >
      <TileLayer
        key={basemap}
        url={TILES[basemap].url}
        attribution={TILES[basemap].attribution}
        maxZoom={18}
      />

      <MapSync center={center} zoom={zoom} registerControls={registerControls} />

      {showRegions ? (
        <GeoJSON
          key={`regions-${layer}`}
          data={REGION_GEOJSON}
          style={regionStyle}
          onEachFeature={(feature, lyr) => {
            const p = feature.properties as { name: string } & Record<string, string>;
            lyr.bindTooltip(
              `<strong>${p.name}</strong><br/>${layerDef.label}: ${
                isRiskLayer ? RISK_META[p[layer] as "low"].label : "regional envelope"
              }`,
              { sticky: true },
            );
          }}
        />
      ) : null}

      {LOCATIONS.map((loc) => {
        const { hex } = layerValue(loc, layer);
        return (
          <Circle
            key={`${loc.id}-${layer}`}
            center={[loc.lat, loc.lon]}
            radius={overlayRadius(layer, loc)}
            pathOptions={{ color: hex, fillColor: hex, fillOpacity: 0.3, weight: 1 }}
          />
        );
      })}

      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lon]}
          icon={pinIcon(m.colorHex, m.badgeText)}
          eventHandlers={{ click: () => onMarkerSelect?.(m.id) }}
        >
          <Popup>
            <div className="space-y-2">
              <div>
                <p className="font-display text-sm font-bold">{m.title}</p>
                {m.subtitle ? <p className="text-xs text-muted-foreground">{m.subtitle}</p> : null}
              </div>
              <dl className="space-y-1">
                {m.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-4">
                    <dt className="text-xs text-muted-foreground">{r.label}</dt>
                    <dd className="num text-xs font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>
              {m.actionLabel ? (
                <button
                  type="button"
                  onClick={() => onMarkerAction?.(m.id)}
                  className="w-full rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {m.actionLabel}
                </button>
              ) : null}
            </div>
          </Popup>
        </Marker>
      ))}

      {userPosition ? (
        <Circle
          center={[userPosition.lat, userPosition.lon]}
          radius={18000}
          pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.5, weight: 2 }}
        />
      ) : null}
    </MapContainer>
  );
}
