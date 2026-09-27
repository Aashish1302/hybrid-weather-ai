import { useState } from "react";
import { MapPin, LocateFixed, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp, useGeolocate } from "@/lib/app-state";
import { nearestLocation, searchLocations, CONDITION_LABELS } from "@/lib/weather-data";
import { RiskBadge } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

export function LocationPicker({
  onDone,
  className,
  placeholder = "Search city, district or region...",
  showGeolocate = true,
}: {
  onDone?: () => void;
  className?: string;
  placeholder?: string;
  showGeolocate?: boolean;
}) {
  const { setLocationId, locationId } = useApp();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const geolocate = useGeolocate();
  const results = searchLocations(query);

  async function useMyLocation() {
    setBusy(true);
    try {
      const { lat, lon } = await geolocate();
      const match = nearestLocation(lat, lon);
      setLocationId(match.id);
      toast.success(`Location set to ${match.name}`, {
        description: `Nearest monitored station to your position (${lat.toFixed(2)}, ${lon.toFixed(2)}).`,
      });
      onDone?.();
    } catch (err) {
      toast.error("Could not use your location", {
        description:
          err instanceof Error ? err.message : "Keeping your current location selection.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          aria-label="Search location"
        />
      </div>

      {showGeolocate ? (
        <Button variant="secondary" className="w-full justify-start" disabled={busy} onClick={useMyLocation}>
          <LocateFixed className={cn("size-4", busy && "animate-spin")} />
          {busy ? "Locating..." : "Use My Location"}
        </Button>
      ) : null}

      <ul className="max-h-72 space-y-1 overflow-y-auto">
        {results.length === 0 ? (
          <li className="px-2 py-6 text-center text-sm text-muted-foreground">
            No monitored location matches “{query}”.
          </li>
        ) : null}
        {results.map((loc) => (
          <li key={loc.id}>
            <button
              type="button"
              onClick={() => {
                setLocationId(loc.id);
                toast.success(`Location set to ${loc.name}`);
                onDone?.();
              }}
              className={cn(
                "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary",
                loc.id === locationId && "bg-secondary",
              )}
            >
              <span className="min-w-0">
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="size-3.5 shrink-0 text-primary" />
                  <span className="truncate text-sm font-semibold">{loc.name}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {loc.state} · {CONDITION_LABELS[loc.condition]} · {loc.temperature}°C
                </span>
              </span>
              <RiskBadge level={loc.risk} className="shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
