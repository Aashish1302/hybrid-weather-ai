import { createFileRoute } from "@tanstack/react-router";
import { Check, MapPin, Share2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { WeatherMap } from "@/components/weather-map";
import { Button } from "@/components/ui/button";
import { Panel, PageHero, RiskBadge, SectionTitle } from "@/components/ui-bits";
import { ALERTS, LOCATIONS, LAYERS, RISK_META } from "@/lib/weather-data";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Disaster Alerts — Hybrid Weather Intelligence" }] }),
  component: Alerts,
});

function Alerts() {
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [layer, setLayer] = useState<"rainfall" | "flood" | "cyclone" | "heatwave" | "extremeRain">("rainfall");

  return <div>
    <PageHero eyebrow="Early warning system" title="Disaster Alerts" description="Review active weather risks, acknowledge events and inspect their locations on the live map." />
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,1.1fr)]">
        <Panel>
          <SectionTitle eyebrow="Active monitoring" title="Current alerts" description="Alerts shown here are application demonstration data and are designed to be replaceable with a live warning feed." />
          <div className="mt-4 divide-y divide-border">
            {ALERTS.length ? ALERTS.map((alert) => {
              const done = acknowledged.includes(alert.id);
              const loc = LOCATIONS.find((item) => item.id === alert.locationId);
              return <article key={alert.id} className="py-5 first:pt-2 last:pb-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><RiskBadge level={alert.severity} /><span className="text-xs text-muted-foreground">{alert.window}</span></div><h2 className="mt-2 text-lg font-bold">{alert.headline}</h2><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {loc?.name}, {loc?.state}</p></div>
                  <TriangleAlert className="size-5 shrink-0 text-high" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{alert.advisory}</p>
                <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => { setAcknowledged((items) => items.includes(alert.id) ? items : [...items, alert.id]); toast.success(done ? "Alert already acknowledged" : "Alert acknowledged"); }}>{done ? <><Check className="size-4" /> Acknowledged</> : "Acknowledge"}</Button><Button size="sm" variant="secondary" onClick={async () => { try { await navigator.clipboard?.writeText(`${alert.headline} — ${loc?.name ?? "Unknown location"}`); toast.success("Alert details copied"); } catch { toast.error("Could not copy alert details"); } }}><Share2 className="size-4" /> Share</Button></div>
              </article>;
            }) : <p className="py-8 text-sm text-muted-foreground">No active alerts.</p>}
          </div>
        </Panel>

        <Panel className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-4"><SectionTitle eyebrow="Spatial view" title="Alert map" description="Select a risk layer to inspect the affected regions." /></div>
          <WeatherMap layer={layer} onLayerChange={setLayer} markers={[]} center={[22.8, 79.2]} zoom={5} heightClass="h-[28rem] lg:h-[38rem]" />
        </Panel>
      </div>
    </main>
  </div>;
}
