import { ClientOnly } from "@tanstack/react-router";
import { Layers, LocateFixed, Maximize2, Minimize2, Plus, Minus, Satellite, Map as MapIcon } from "lucide-react";
import { Suspense, lazy, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp, useGeolocate } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { LAYERS, nearestLocation, type LayerKey } from "@/lib/weather-data";
import type { MapMarkerSpec } from "./map-impl";

const MapImpl = lazy(() => import("./map-impl"));

export type { MapMarkerSpec };

export interface WeatherMapProps {
  layer: LayerKey;
  onLayerChange: (layer: LayerKey) => void;
  markers: MapMarkerSpec[];
  center: [number, number];
  zoom?: number;
  onMarkerAction?: (id: string) => void;
  onMarkerSelect?: (id: string) => void;
  className?: string;
  heightClass?: string;
  showRegions?: boolean;
  onToggleRegions?: (v: boolean) => void;
}

export function WeatherMap({
  layer,
  onLayerChange,
  markers,
  center,
  zoom = 5,
  onMarkerAction,
  onMarkerSelect,
  className,
  heightClass = "h-[28rem] sm:h-[34rem]",
  showRegions = true,
  onToggleRegions,
}: WeatherMapProps) {
  const [basemap, setBasemap] = useState<"map" | "satellite">("map");
  const [fullscreen, setFullscreen] = useState(false);
  const [userPosition, setUserPosition] = useState<{ lat: number; lon: number } | null>(null);
  const controls = useRef<{ zoomIn: () => void; zoomOut: () => void } | null>(null);
  const { setLocationId } = useApp();
  const geolocate = useGeolocate();

  const registerControls = useCallback((api: { zoomIn: () => void; zoomOut: () => void }) => {
    controls.current = api;
  }, []);

  const activeLayer = LAYERS.find((l) => l.key === layer) ?? LAYERS[0];

  async function locateMe() {
    try {
      const pos = await geolocate();
      setUserPosition(pos);
      const nearest = nearestLocation(pos.lat, pos.lon);
      setLocationId(nearest.id);
      toast.success(`Centred on your location`, {
        description: `Nearest monitored station: ${nearest.name}.`,
      });
    } catch (err) {
      toast.error("Location permission denied", {
        description: err instanceof Error ? err.message : "Keeping the current map view.",
      });
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden panel",
        fullscreen ? "fixed inset-0 z-[60] rounded-none" : heightClass,
        className,
      )}
    >
      <ClientOnly
        fallback={
          <div className="flex size-full flex-col gap-2 p-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="flex-1" />
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="flex size-full flex-col gap-2 p-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="flex-1" />
            </div>
          }
        >
          <MapImpl
            layer={layer}
            basemap={basemap}
            center={center}
            zoom={fullscreen ? Math.max(zoom, 5) : zoom}
            markers={markers}
            userPosition={userPosition}
            showRegions={showRegions}
            onMarkerAction={onMarkerAction}
            onMarkerSelect={onMarkerSelect}
            registerControls={registerControls}
          />
        </Suspense>
      </ClientOnly>

      {/* top-left: zoom */}
      <div className="absolute left-3 top-3 z-[400] flex flex-col gap-1">
        <Button
          size="icon"
          variant="secondary"
          className="size-9 shadow-panel"
          aria-label="Zoom in"
          onClick={() => controls.current?.zoomIn()}
        >
          <Plus className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="size-9 shadow-panel"
          aria-label="Zoom out"
          onClick={() => controls.current?.zoomOut()}
        >
          <Minus className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="size-9 shadow-panel"
          aria-label="Use my location"
          onClick={locateMe}
        >
          <LocateFixed className="size-4" />
        </Button>
      </div>

      {/* top-right: basemap + fullscreen + layers */}
      <div className="absolute right-3 top-3 z-[400] flex items-center gap-1">
        <div className="flex overflow-hidden rounded-lg border border-border bg-surface shadow-panel">
          <button
            type="button"
            onClick={() => setBasemap("map")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold transition-colors",
              basemap === "map" ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            <MapIcon className="size-3.5" /> Map
          </button>
          <button
            type="button"
            onClick={() => setBasemap("satellite")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold transition-colors",
              basemap === "satellite" ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
            )}
          >
            <Satellite className="size-3.5" /> Satellite
          </button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="secondary" className="size-9 shadow-panel" aria-label="Layers">
              <Layers className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="z-[500] w-64">
            <p className="mb-2 text-sm font-semibold">Weather & risk layers</p>
            <div className="grid gap-0.5">
              {LAYERS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => onLayerChange(l.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
                    layer === l.key && "bg-secondary font-semibold",
                  )}
                >
                  <span
                    className="size-3 rounded-sm"
                    style={{ background: l.legend[l.legend.length - 1].hex }}
                  />
                  {l.label}
                </button>
              ))}
            </div>
            {onToggleRegions ? (
              <label className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm">
                <Checkbox
                  checked={showRegions}
                  onCheckedChange={(v) => onToggleRegions(Boolean(v))}
                />
                Region overlays (GeoJSON)
              </label>
            ) : null}
          </PopoverContent>
        </Popover>

        <Button
          size="icon"
          variant="secondary"
          className="size-9 shadow-panel"
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          onClick={() => setFullscreen((f) => !f)}
        >
          {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {/* legend */}
      <div className="absolute bottom-6 left-3 z-[400] max-w-[15rem] rounded-xl border border-border bg-surface/95 p-3 shadow-panel backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wider">
          {activeLayer.label}
          {activeLayer.unit ? ` (${activeLayer.unit})` : ""}
        </p>
        <ul className="mt-2 grid gap-1">
          {activeLayer.legend.map((entry) => (
            <li key={entry.label} className="flex items-center gap-2 text-[11px]">
              <span className="size-3 shrink-0 rounded-sm border border-border" style={{ background: entry.hex }} />
              {entry.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
