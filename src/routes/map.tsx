import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPinned } from "lucide-react";

import { WeatherMap, type MapMarkerSpec } from "@/components/weather-map";
import { PageHero, Panel, SectionTitle } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { formatTemp, formatWind } from "@/lib/format";
import { LAYERS, LOCATIONS, layerValue, type LayerKey } from "@/lib/weather-data";
import { toast } from "sonner";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Weather Map — Hybrid Weather Intelligence" },
      { name: "description", content: "Interactive Leaflet weather and risk map with rainfall, temperature, wind and hazard layers." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { location, setLocationId } = useApp();
  const [layer, setLayer] = useState<LayerKey>("rainfall");
  const [showRegions, setShowRegions] = useState(true);

  const markers = useMemo<MapMarkerSpec[]>(() => LOCATIONS.map((loc) => {
    const value = layerValue(loc, layer);
    return {
      id: loc.id,
      lat: loc.lat,
      lon: loc.lon,
      title: `${loc.name}, ${loc.state}`,
      subtitle: loc.region,
      colorHex: value.hex,
      badgeText: value.text.split(" ")[0] ?? "•",
      rows: [
        { label: "Temperature", value: formatTemp(loc.temperature, "c") },
        { label: "Wind", value: `${formatWind(loc.wind, "kmh")} ${loc.windDirection}` },
        { label: "Humidity", value: `${loc.humidity}%` },
        { label: LAYERS.find((l) => l.key === layer)?.label ?? "Layer", value: value.text },
      ],
      actionLabel: "Use this location",
    };
  }), [layer]);

  return (
    <div>
      <PageHero
        eyebrow="Live regional view"
        title="Weather Map"
        description="Explore weather conditions and risk layers across monitored locations with an interactive Leaflet map."
      >
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-2 text-xs font-semibold">
            <MapPinned className="size-4 text-primary" /> {location.name}, {location.state}
          </span>
        </div>
      </PageHero>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Panel className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <SectionTitle eyebrow="Interactive" title="India weather & risk map" description="Tap a marker for local conditions and use the layer controls to change the map view." />
            </div>
            <div className="flex max-w-full gap-1 overflow-x-auto pb-1 sm:shrink-0">
              {LAYERS.slice(0, 5).map((item) => (
                <Button key={item.key} size="sm" variant={layer === item.key ? "default" : "secondary"} className="shrink-0" onClick={() => setLayer(item.key)}>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <WeatherMap
            layer={layer}
            onLayerChange={setLayer}
            markers={markers}
            center={[22.8, 79.2]}
            zoom={5}
            heightClass="h-[28rem] sm:h-[36rem] lg:h-[42rem]"
            showRegions={showRegions}
            onToggleRegions={setShowRegions}
            onMarkerAction={(id) => {
              setLocationId(id);
              const selected = LOCATIONS.find((item) => item.id === id);
              if (selected) toast.success(`Selected ${selected.name}`, { description: "Dashboard data will now use this location." });
            }}
          />
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.slice(0, 4).map((item) => (
            <button key={item.key} type="button" onClick={() => setLayer(item.key)} className={`text-left transition-transform hover:-translate-y-0.5 ${layer === item.key ? "ring-2 ring-primary/30" : ""}`}>
              <Panel className="h-full">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.unit || "Risk assessment"}</p>
              </Panel>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
