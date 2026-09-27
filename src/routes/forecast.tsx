import { createFileRoute } from "@tanstack/react-router";
import { Info, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Panel, PageHero, SectionTitle } from "@/components/ui-bits";
import { useApp } from "@/lib/app-state";
import { computeBlend, PARAMETER_META, type ParameterKey } from "@/lib/weather-data";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Forecast Blender — Hybrid Weather Intelligence" },
      { name: "description", content: "Understand how NWP and AI/ML forecasts are blended into an adaptive weather prediction." },
    ],
  }),
  component: Forecast,
});

type ModelName = "NWP Model A" | "NWP Model B" | "AI/ML Model";

const MODEL_COPY: Record<ModelName, { summary: string; detail: string; data: string; strengths: string; limits: string }> = {
  "NWP Model A": {
    summary: "Physics-led numerical forecast",
    detail: "A Numerical Weather Prediction model uses atmospheric observations and physics-based equations to simulate how the atmosphere evolves over time.",
    data: "Observations, atmospheric state, pressure, temperature, wind, moisture and boundary conditions.",
    strengths: "Strong representation of large-scale weather systems and longer forecast horizons.",
    limits: "Local terrain, urban effects and rapidly developing small-scale events can be harder to resolve.",
  },
  "NWP Model B": {
    summary: "Independent numerical perspective",
    detail: "A second numerical forecast provides an independent physics-based view of the same atmosphere. Comparing it with other models reduces dependence on one forecast source.",
    data: "A separate numerical model configuration and its latest atmospheric initialization.",
    strengths: "Useful model diversity and an additional signal for agreement or disagreement.",
    limits: "Like other NWP systems, local biases and unresolved small-scale processes can affect accuracy.",
  },
  "AI/ML Model": {
    summary: "Location-specific pattern learning",
    detail: "The AI/ML model learns relationships between historical observations, forecast errors and local weather patterns to produce a location-aware prediction.",
    data: "Historical weather observations, model forecasts, local features and verification/error history.",
    strengths: "Fast local correction and useful short-range pattern recognition.",
    limits: "Rare events have less historical training evidence and model behaviour depends on data quality.",
  },
};

function Forecast() {
  const { location } = useApp();
  const [parameter, setParameter] = useState<ParameterKey>("rainfall");
  const [duration, setDuration] = useState("24 hours");
  const [selectedModel, setSelectedModel] = useState<ModelName | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const leadHours = duration === "24 hours" ? 24 : duration === "48 hours" ? 48 : 168;
  const blend = computeBlend(location.id, parameter, leadHours);
  const modelEntries: [ModelName, keyof typeof blend.values][] = [
    ["NWP Model A", "nwpA"],
    ["NWP Model B", "nwpB"],
    ["AI/ML Model", "ai"],
  ];

  const finalValue = `${blend.blended} ${blend.unit}`;

  return (
    <div>
      <PageHero eyebrow="Adaptive forecasting" title="Forecast Blender" description="See how independent models contribute to one location-specific, confidence-scored forecast." />
      <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        <Panel>
          <div className="grid gap-4 sm:grid-cols-3">
            <Control label="Location" value={`${location.name}, ${location.state}`} />
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Weather parameter</span>
              <select value={parameter} onChange={(e) => setParameter(e.target.value as ParameterKey)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                {(Object.keys(PARAMETER_META) as ParameterKey[]).map((key) => <option key={key} value={key}>{PARAMETER_META[key].label}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Forecast duration</span>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                {['24 hours', '48 hours', '7 days'].map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>
        </Panel>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.72fr)]">
          <Panel>
            <SectionTitle eyebrow="Model inputs" title="Tap a model to understand it" description="Each source is selectable. The explanation includes what it does, what it uses and where it is useful." />
            <div className="mt-5 divide-y divide-border border-y border-border">
              {modelEntries.map(([name, key]) => {
                const copy = MODEL_COPY[name];
                const weight = blend.weights[key];
                return (
                  <button key={name} type="button" onClick={() => setSelectedModel(name)} className="group grid w-full grid-cols-[minmax(0,1fr)_auto] gap-4 py-5 text-left transition-colors hover:bg-secondary/60">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{name}</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{weight}% contribution</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{copy.summary}</p>
                    </div>
                    <div className="text-right">
                      <p className="num text-xl font-bold">{blend.values[key]} {blend.unit}</p>
                      <p className="mt-1 text-xs text-muted-foreground group-hover:text-primary">View details →</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adaptive weighting</p>
                <h2 className="mt-1 text-xl font-bold">Why this blend?</h2>
              </div>
              <SlidersHorizontal className="size-5 text-primary" />
            </div>
            <div className="mt-6 space-y-5">
              {modelEntries.map(([name, key]) => (
                <div key={name}>
                  <div className="flex justify-between gap-3 text-sm"><span>{name}</span><strong>{blend.weights[key]}%</strong></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${blend.weights[key]}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-7 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Final blended forecast</p>
              <p className="num mt-2 text-5xl font-bold tracking-tight">{finalValue}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>Confidence <strong className="text-foreground">{blend.confidence}%</strong></span>
                <span>{blend.regime}</span>
              </div>
              <Button className="mt-5 w-full" onClick={() => setShowExplanation(true)}><Info className="size-4" /> View full explanation</Button>
            </div>
          </Panel>
        </section>

        <Panel>
          <SectionTitle eyebrow="How it is calculated" title="Blended forecast contribution" description="The blend changes with location, parameter and forecast lead time rather than relying on one fixed source." />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {modelEntries.map(([name, key]) => (
              <button key={name} type="button" onClick={() => setSelectedModel(name)} className="rounded-xl border border-border bg-surface-2 p-4 text-left transition hover:border-primary/40 hover:bg-secondary/60">
                <p className="text-sm font-bold">{name}</p>
                <p className="num mt-2 text-2xl font-bold">{blend.values[key]} {blend.unit}</p>
                <p className="mt-1 text-xs text-primary">{blend.weights[key]}% weight</p>
              </button>
            ))}
          </div>
        </Panel>
      </main>

      {(selectedModel || showExplanation) && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4" role="presentation" onMouseDown={() => { setSelectedModel(null); setShowExplanation(false); }}>
          <div role="dialog" aria-modal="true" className="max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-7" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Forecast explanation</p><h2 className="mt-1 text-2xl font-bold">{selectedModel ?? "How the blend works"}</h2></div>
              <Button variant="ghost" size="icon" onClick={() => { setSelectedModel(null); setShowExplanation(false); }} aria-label="Close explanation"><X className="size-5" /></Button>
            </div>
            {selectedModel ? <ModelDetails name={selectedModel} weight={blend.weights[modelEntries.find(([n]) => n === selectedModel)![1]]} /> : <BlendDetails blend={blend} />}
          </div>
        </div>
      )}
    </div>
  );
}

function ModelDetails({ name, weight }: { name: ModelName; weight: number }) {
  const copy = MODEL_COPY[name];
  return <div className="mt-6 space-y-5 text-sm leading-6">
    <p className="text-foreground">{copy.detail}</p>
    <div className="grid gap-3 sm:grid-cols-2">
      <InfoBlock title="Data used" text={copy.data} />
      <InfoBlock title="Strengths" text={copy.strengths} />
      <InfoBlock title="Limitations" text={copy.limits} />
      <InfoBlock title="Current role" text={`This model contributes ${weight}% to the current blend. The weight is adaptive and can change with location, weather regime and forecast lead time.`} />
    </div>
  </div>;
}

function BlendDetails({ blend }: { blend: ReturnType<typeof computeBlend> }) {
  return <div className="mt-6 space-y-4 text-sm leading-6">
    <p>The final forecast is calculated by combining the three model outputs using adaptive weights. The weights reflect model behaviour for the selected location, parameter and forecast horizon.</p>
    <div className="divide-y divide-border rounded-xl border border-border">
      {([['NWP Model A', 'nwpA'], ['NWP Model B', 'nwpB'], ['AI/ML Model', 'ai'] ] as const).map(([name, key]) => <div key={name} className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3"><span>{name}</span><span>{blend.values[key]} {blend.unit}</span><strong>{blend.weights[key]}%</strong></div>)}
      <div className="flex justify-between gap-4 px-4 py-4 font-bold"><span>Final blended value</span><span>{blend.blended} {blend.unit} · {blend.confidence}% confidence</span></div>
    </div>
    <p className="text-xs text-muted-foreground">This interface currently demonstrates the blending workflow with deterministic application data. A production deployment can replace the data layer with live NWP/AI model services without changing the UI.</p>
  </div>;
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-border bg-surface-2 p-4"><p className="font-semibold">{title}</p><p className="mt-1 text-muted-foreground">{text}</p></div>;
}

function Control({ label, value }: { label: string; value: string }) {
  return <div><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span><div className="flex h-11 items-center rounded-lg border border-input bg-background px-3 text-sm">{value}</div></div>;
}
