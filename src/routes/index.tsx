import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CloudRain,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  Scale,
  ShieldAlert,
  Siren,
  Thermometer,
  Wind,
  Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, RiskBadge, SectionTitle } from "@/components/ui-bits";
import { WeatherFx } from "@/components/weather-fx";
import { useApp } from "@/lib/app-state";
import { formatRain, formatTemp, formatWind } from "@/lib/format";
import { ALERTS, CONDITION_LABELS, NATIONAL_RISK, computeBlend } from "@/lib/weather-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hybrid Weather Intelligence — AI-Powered Forecast Blending" },
      {
        name: "description",
        content:
          "Blend NWP, AI/ML and ensemble forecasts into adaptive, location-specific predictions with early disaster warnings and explainable model weighting.",
      },
      { property: "og:title", content: "Hybrid Weather Intelligence" },
      {
        property: "og:description",
        content:
          "AI-powered weather intelligence for a safer tomorrow: adaptive multi-model forecast blending, risk detection and early warning.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    icon: CloudRain,
    title: "Rainfall",
    body: "Real-time and future rainfall prediction across districts and river basins.",
    accent: "bg-primary/12 text-primary",
  },
  {
    icon: Thermometer,
    title: "Temperature",
    body: "High-resolution temperature forecasting with heat-stress detection.",
    accent: "bg-high/18 text-high",
  },
  {
    icon: Wind,
    title: "Wind",
    body: "Wind speed and direction forecasting, including gust envelopes.",
    accent: "bg-accent/18 text-accent",
  },
  {
    icon: Siren,
    title: "Extreme Weather",
    body: "AI-powered extreme weather detection with confidence-scored warnings.",
    accent: "bg-severe/15 text-severe",
  },
];

const WHY = [
  { label: "Region", body: "Orography, coastlines and urban heat change model skill sharply." },
  { label: "Season", body: "Monsoon onset, withdrawal and winter regimes reward different models." },
  { label: "Forecast lead time", body: "AI leads nowcasting; NWP holds skill beyond 72 hours." },
  { label: "Weather regime", body: "Convective, stable and cyclonic regimes behave differently." },
  { label: "Historical performance", body: "Verification archives expose persistent model bias." },
];

const PIPELINE = [
  { label: "Multiple Forecast Models", icon: Layers3 },
  { label: "AI Feature Analysis", icon: BrainCircuit },
  { label: "Adaptive Weighting", icon: Scale },
  { label: "Blended Forecast", icon: Gauge },
  { label: "Extreme Weather Detection", icon: ShieldAlert },
  { label: "Early Warning", icon: Siren },
];

function Home() {
  const { location, weatherTheme, units } = useApp();
  const blend = computeBlend(location.id, "rainfall", 24);
  const topAlerts = ALERTS.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 hero-atmos opacity-[0.92]" aria-hidden />
        <div className="absolute inset-0 grid-overlay opacity-60" aria-hidden />
        <WeatherFx condition={weatherTheme} />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
            <div className="min-w-0 text-primary-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                Hybrid AI–NWP Forecast Blending System
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                AI-Powered Weather Intelligence
                <br />
                for a Safer Tomorrow
              </h1>
              <p className="mt-5 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">
                Combine NWP, AI/ML and ensemble forecasts to generate adaptive, location-specific
                predictions and early disaster warnings.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/forecast">
                    Explore Forecast <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-4" /> Open Live Dashboard
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  <Link to="/map">
                    <MapIcon className="size-4" /> View Weather Map
                  </Link>
                </Button>
              </div>
            </div>

            {/* Live snapshot card */}
            <Panel className="min-w-0 bg-surface/90 backdrop-blur">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Live snapshot
                  </p>
                  <p className="truncate font-display text-lg font-bold">
                    {location.name}, {location.state}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CONDITION_LABELS[location.condition]}
                  </p>
                </div>
                <RiskBadge level={location.risk} className="shrink-0" pulse />
              </div>
              <p className="num mt-4 text-5xl font-bold">
                {formatTemp(location.temperature, units.temp)}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  ["Rainfall (24h)", formatRain(location.rainfall, units.rain)],
                  ["Wind", formatWind(location.wind, units.wind)],
                  ["Humidity", `${location.humidity}%`],
                  ["AQI", String(location.aqi)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 border-b border-border/60 py-1">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="num text-xs font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 rounded-xl border border-primary/25 bg-primary/8 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Blended 24h rainfall
                </p>
                <p className="num mt-1 text-2xl font-bold">
                  {blend.blended} {blend.unit}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Confidence {blend.confidence}% · weights {blend.weights.nwpA}/{blend.weights.nwpB}/
                  {blend.weights.ai}
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body, accent }) => (
            <Panel key={title} hover>
              <span className={`grid size-10 place-items-center rounded-xl ${accent}`}>
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* National risk strip */}
      <section className="border-y border-border/70 bg-surface/60">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {NATIONAL_RISK.map((r) => (
            <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.label}</p>
                <p className="truncate text-xs text-muted-foreground">{r.detail}</p>
              </div>
              <RiskBadge level={r.level} className="shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Why hybrid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="The problem"
          title="Why Hybrid Forecasting?"
          description="No single forecasting system wins everywhere. Skill shifts with geography, calendar, lead time and the atmosphere's current behaviour — so the blend has to shift too."
          action={
            <Button asChild variant="secondary">
              <Link to="/forecast">
                Compare model skill <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item, i) => (
            <Panel key={item.label} hover className="min-w-0">
              <span className="num text-xs font-bold text-primary">0{i + 1}</span>
              <h3 className="mt-2 text-base font-bold">{item.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/70 bg-surface/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Architecture"
            title="How It Works"
            description="Every forecast cycle runs the same deterministic pipeline, from raw model output to an issued warning."
          />
          <ol className="mt-8 grid gap-3 lg:grid-cols-6">
            {PIPELINE.map(({ label, icon: Icon }, i) => (
              <li key={label} className="relative">
                <div className="panel panel-hover h-full p-4">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <p className="num mt-3 text-[11px] font-bold text-muted-foreground">
                    STEP {i + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug">{label}</p>
                </div>
                {i < PIPELINE.length - 1 ? (
                  <ArrowRight className="absolute -bottom-3 left-1/2 size-4 -translate-x-1/2 rotate-90 text-muted-foreground lg:-right-3 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:rotate-0" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Alerts preview */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Early warning"
          title="Live Disaster Alerts"
          description="Threshold breaches detected in the blended forecast are escalated with location, expected value, time window and confidence."
          action={
            <Button asChild>
              <Link to="/alerts">
                Open alert centre <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {topAlerts.map((a) => (
            <Panel key={a.id} hover className="min-w-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{a.headline}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.locationName}</p>
                </div>
                <RiskBadge level={a.severity} className="shrink-0" pulse />
              </div>
              <p className="num mt-4 text-xl font-bold">{a.expected}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.window} · confidence {a.confidence}%
              </p>
              <Button asChild variant="link" className="mt-3 h-auto p-0">
                <Link to="/alerts">
                  View alert details <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </Panel>
          ))}
        </div>
      </section>
    </div>
  );
}
