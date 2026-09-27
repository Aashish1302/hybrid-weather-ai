import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudFog,
  Snowflake,
  Sun,
  Droplets,
  Eye,
  Gauge,
  LocateFixed,
  ShieldAlert,
  Thermometer,
  Wind,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { MetricCard } from "@/components/metric-card";
import { LocationPicker } from "@/components/location-picker";
import { Panel, PageHero, RiskBadge, SectionTitle, StatRow, TokenBadge } from "@/components/ui-bits";
import { WeatherFx } from "@/components/weather-fx";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp, useGeolocate } from "@/lib/app-state";
import { aqiBand, formatRain, formatTemp, formatWind } from "@/lib/format";
import {
  ALERTS,
  CONDITION_LABELS,
  RANGE_META,
  buildDaily,
  buildHourly,
  buildTimeline,
  computeBlend,
  nearestLocation,
  type RangeKey,
} from "@/lib/weather-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Live Weather Intelligence Dashboard — Hybrid Weather Intelligence" },
      {
        name: "description",
        content:
          "Operational control centre with current conditions, rainfall, temperature, wind, humidity, air quality and blended-forecast risk for every monitored location.",
      },
      { property: "og:title", content: "Live Weather Intelligence Dashboard" },
      {
        property: "og:description",
        content:
          "Current conditions, metric cards and blended forecast charts that update with the selected location.",
      },
    ],
  }),
  component: Dashboard,
});

const RANGES: RangeKey[] = ["24h", "7d", "30d"];

function Dashboard() {
  const { location, units, weatherTheme, setLocationId } = useApp();
  const [range, setRange] = useState<RangeKey>("24h");
  const [mode, setMode] = useState<"now" | RangeKey>("now");
  const [selectedHour, setSelectedHour] = useState(0);
  const geolocate = useGeolocate();

  const hourly = buildHourly(location.id);
  const daily = buildDaily(location.id);
  const rainSeries = buildTimeline(location.id, "rainfall", range);
  const tempSeries = buildTimeline(location.id, "temperature", range);
  const blend = computeBlend(location.id, "rainfall", range === "24h" ? 24 : range === "7d" ? 168 : 720);
  const aq = aqiBand(location.aqi);
  const locationAlerts = ALERTS.filter((a) => a.locationId === location.id);

  async function useMyLocation() {
    try {
      const pos = await geolocate();
      const nearest = nearestLocation(pos.lat, pos.lon);
      setLocationId(nearest.id);
      toast.success(`Dashboard switched to ${nearest.name}`);
    } catch (err) {
      toast.error("Location unavailable", {
        description: err instanceof Error ? err.message : "Keeping your current location.",
      });
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Operations"
        title="Live Weather Intelligence"
        description="A single control surface for current conditions, blended forecasts and risk escalation. Select a location to refresh every panel below."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Search city, district or region...</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <LocationPicker />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={useMyLocation}>
            <LocateFixed className="size-4" /> Use My Location
          </Button>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {(["now", ...RANGES] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  if (key !== "now") setRange(key);
                }}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  mode === key ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
              >
                {key === "now" ? "Now" : RANGE_META[key].label}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Current conditions */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <Panel className="relative overflow-hidden">
            <WeatherFx condition={weatherTheme} className="opacity-40" />
            <div className="relative">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">
                    {location.name}, {location.state}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {CONDITION_LABELS[location.condition]} · {location.region}
                  </p>
                </div>
                <RiskBadge level={location.risk} className="shrink-0" pulse />
              </div>
              <p className="num mt-6 text-6xl font-bold leading-none">
                {formatTemp(location.temperature, units.temp)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Feels like {formatTemp(location.feelsLike, units.temp)} · risk score {location.riskScore}
                /100
              </p>
              <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">
                <StatRow label="Feels Like" value={formatTemp(location.feelsLike, units.temp)} />
                <StatRow label="Humidity" value={`${location.humidity}%`} />
                <StatRow label="Wind" value={`${formatWind(location.wind, units.wind)} ${location.windDirection}`} />
                <StatRow label="Pressure" value={`${location.pressure} hPa`} />
                <StatRow label="Visibility" value={`${location.visibility} km`} />
                <StatRow
                  label="AQI"
                  value={
                    <TokenBadge token={aq.token}>
                      {location.aqi} · {aq.label}
                    </TokenBadge>
                  }
                />
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/forecast">
                    Detailed forecast <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/map">View on map</Link>
                </Button>
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              icon={CloudRain}
              label="Rainfall (24h)"
              value={formatRain(location.rainfall, units.rain)}
              sub={`Blended ${blend.blended} ${blend.unit} · confidence ${blend.confidence}%`}
              accent="primary"
            />
            <MetricCard
              icon={Thermometer}
              label="Temperature"
              value={formatTemp(location.temperature, units.temp)}
              sub={`Range ${formatTemp(daily[0].min, units.temp)} – ${formatTemp(daily[0].max, units.temp)}`}
              accent="high"
            />
            <MetricCard
              icon={Wind}
              label="Wind"
              value={formatWind(location.wind, units.wind)}
              sub={`Direction ${location.windDirection} · gusts ${formatWind(location.wind * 1.4, units.wind)}`}
              accent="accent"
            />
            <MetricCard
              icon={Droplets}
              label="Humidity"
              value={`${location.humidity}%`}
              sub={`Cloud cover ${location.cloudCover}%`}
              accent="primary"
            />
            <MetricCard
              icon={Eye}
              label="Air Quality"
              value={String(location.aqi)}
              sub={`${aq.label} · visibility ${location.visibility} km`}
              accent={aq.token}
            />
            <MetricCard
              icon={ShieldAlert}
              label="Risk Level"
              value={location.risk.toUpperCase()}
              sub={`Flood ${location.floodRisk} · cyclone ${location.cycloneRisk}`}
              accent={
                location.risk === "extreme"
                  ? "severe"
                  : location.risk === "high"
                    ? "high"
                    : location.risk === "moderate"
                      ? "warn"
                      : "safe"
              }
            />
          </div>
        </div>

        {/* Charts */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <SectionTitle
              eyebrow={RANGE_META[range].label}
              title="Blended rainfall outlook"
              description="Blended model output against the individual contributing models."
            />
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rainSeries}>
                  <defs>
                    <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" unit=" mm" width={52} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="blended"
                    name="Blended"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#rainFill)"
                  />
                  <Line type="monotone" dataKey="nwpA" name="NWP A" stroke="var(--color-chart-3)" dot={false} strokeDasharray="4 3" />
                  <Line type="monotone" dataKey="nwpB" name="NWP B" stroke="var(--color-chart-4)" dot={false} strokeDasharray="4 3" />
                  <Line type="monotone" dataKey="ai" name="AI/ML" stroke="var(--color-chart-2)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <SectionTitle
              eyebrow={RANGE_META[range].label}
              title="Temperature trend"
              description="Blended temperature with observed values where verification is available."
            />
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" unit="°" width={44} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="blended" name="Blended" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="actual" name="Observed" stroke="var(--color-chart-5)" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>

        {/* Hourly + daily */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Panel>
            <SectionTitle eyebrow="Next 24 hours" title="Hourly outlook" description="Swipe horizontally to explore the forecast hour by hour." />
            <div className="mt-4 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-1">
                {hourly.map((h, index) => {
                  const Icon = h.condition === "rain" ? CloudRain : h.condition === "storm" ? CloudLightning : h.condition === "snow" ? Snowflake : h.condition === "fog" ? CloudFog : h.condition === "cloudy" ? Cloud : Sun;
                  return (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => setSelectedHour(index)}
                      className={`min-w-[5.6rem] snap-start border-b-2 px-3 py-3 text-center transition-colors ${selectedHour === index ? "border-primary bg-primary/8" : "border-transparent hover:bg-secondary"}`}
                    >
                      <p className="num text-[11px] font-semibold text-muted-foreground">{h.label}</p>
                      <Icon className="mx-auto my-2.5 size-5 text-primary" />
                      <p className="num text-base font-bold">{formatTemp(h.temperature, units.temp)}</p>
                      <p className="mt-1 text-[11px] text-primary">{h.precipProbability}% rain</p>
                      <p className="num mt-0.5 text-[11px] text-muted-foreground">{formatRain(h.rainfall, units.rain)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Selected: {hourly[selectedHour]?.label}</span>
              <span>{hourly[selectedHour]?.wind} km/h · {hourly[selectedHour]?.humidity}% humidity</span>
            </div>
            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" width={38} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="rainfall" name="Rainfall (mm)" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="7 days" title="Daily outlook" />
            <ul className="mt-4 space-y-1">
              {daily.map((d) => (
                <li
                  key={d.day}
                  className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary"
                >
                  <span className="text-sm font-semibold">{d.day}</span>
                  <span className="min-w-0">
                    <span className="num block text-sm">
                      {formatTemp(d.min, units.temp)} / {formatTemp(d.max, units.temp)}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatRain(d.rainfall, units.rain)} · {d.precipProbability}% chance
                    </span>
                  </span>
                  <RiskBadge level={d.risk} className="shrink-0" />
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        {/* Location alerts */}
        <section>
          <SectionTitle
            eyebrow="Escalation"
            title={`Alerts for ${location.name}`}
            description={
              locationAlerts.length
                ? "Threshold breaches detected by the blended forecast for this location."
                : "No active threshold breaches for this location. Routine monitoring continues."
            }
            action={
              <Button asChild variant="secondary">
                <Link to="/alerts">
                  All alerts <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {locationAlerts.length === 0 ? (
              <Panel className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-safe/15 text-safe">
                    <Activity className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">All clear</p>
                    <p className="text-xs text-muted-foreground">
                      Blended forecast stays below every warning threshold for the next 72 hours.
                    </p>
                  </div>
                </div>
              </Panel>
            ) : (
              locationAlerts.map((a) => (
                <Panel key={a.id} hover>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{a.headline}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.kind} · {a.window}
                      </p>
                    </div>
                    <RiskBadge level={a.severity} className="shrink-0" pulse />
                  </div>
                  <p className="num mt-3 text-lg font-bold">{a.expected}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{a.advisory}</p>
                </Panel>
              ))
            )}
          </div>
        </section>

        <Panel className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-sm font-bold">Want to see how this forecast was built?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Inspect the adaptive weights, the contributing models and the factors behind the blend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/forecast">
                <Gauge className="size-4" /> Forecast blender
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/forecast">Explainable AI</Link>
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
