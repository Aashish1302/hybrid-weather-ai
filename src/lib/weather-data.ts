/**
 * Mock weather / forecast data layer.
 *
 * Everything the UI renders flows through these helpers so the mock source can
 * later be swapped for real providers (weather APIs, NWP GRIB pipelines,
 * AI/ML model servers, satellite feeds, historical datasets) without touching
 * components. Keep model series separate per source:
 * nwpA | nwpB | ai | blended | actual.
 */

export type WeatherCondition = "sunny" | "cloudy" | "rain" | "storm" | "snow" | "fog";
export type RiskLevel = "low" | "moderate" | "high" | "extreme";
export type ModelKey = "nwpA" | "nwpB" | "ai" | "blended" | "actual";
export type ParameterKey = "rainfall" | "temperature" | "wind" | "humidity";

export interface LocationRecord {
  id: string;
  name: string;
  region: string;
  state: string;
  lat: number;
  lon: number;
  condition: WeatherCondition;
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  aqi: number;
  rainfall: number;
  cloudCover: number;
  risk: RiskLevel;
  floodRisk: RiskLevel;
  cycloneRisk: RiskLevel;
  heatwaveRisk: RiskLevel;
  extremeRainRisk: RiskLevel;
  riskScore: number;
}

export const MODEL_LABELS: Record<ModelKey, string> = {
  nwpA: "NWP Model A",
  nwpB: "NWP Model B",
  ai: "AI/ML Model",
  blended: "Blended Forecast",
  actual: "Actual Observation",
};

export const PARAMETER_META: Record<
  ParameterKey,
  { label: string; unit: string; base: number; spread: number }
> = {
  rainfall: { label: "Rainfall", unit: "mm", base: 22, spread: 18 },
  temperature: { label: "Temperature", unit: "°C", base: 30, spread: 7 },
  wind: { label: "Wind", unit: "km/h", base: 17, spread: 9 },
  humidity: { label: "Humidity", unit: "%", base: 64, spread: 16 },
};

export const RISK_META: Record<
  RiskLevel,
  { label: string; token: "safe" | "warn" | "high" | "severe"; hex: string }
> = {
  low: { label: "Low", token: "safe", hex: "#16a34a" },
  moderate: { label: "Moderate", token: "warn", hex: "#eab308" },
  high: { label: "High", token: "high", hex: "#f97316" },
  extreme: { label: "Extreme", token: "severe", hex: "#dc2626" },
};

export const CONDITION_LABELS: Record<WeatherCondition, string> = {
  sunny: "Clear / Sunny",
  cloudy: "Partly Cloudy",
  rain: "Rain",
  storm: "Thunderstorm",
  snow: "Snow",
  fog: "Fog / Haze",
};

export const LOCATIONS: LocationRecord[] = [
  {
    id: "delhi",
    name: "Delhi",
    region: "North India",
    state: "Delhi NCR",
    lat: 28.6139,
    lon: 77.209,
    condition: "cloudy",
    temperature: 32,
    feelsLike: 36,
    humidity: 62,
    wind: 18,
    windDirection: "NW",
    pressure: 1004,
    visibility: 6.2,
    aqi: 168,
    rainfall: 24,
    cloudCover: 58,
    risk: "moderate",
    floodRisk: "moderate",
    cycloneRisk: "low",
    heatwaveRisk: "high",
    extremeRainRisk: "moderate",
    riskScore: 54,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    region: "West India",
    state: "Maharashtra",
    lat: 19.076,
    lon: 72.8777,
    condition: "rain",
    temperature: 29,
    feelsLike: 34,
    humidity: 84,
    wind: 26,
    windDirection: "SW",
    pressure: 999,
    visibility: 3.4,
    aqi: 92,
    rainfall: 96,
    cloudCover: 88,
    risk: "high",
    floodRisk: "high",
    cycloneRisk: "moderate",
    heatwaveRisk: "low",
    extremeRainRisk: "high",
    riskScore: 78,
  },
  {
    id: "kolkata",
    name: "Kolkata",
    region: "East India",
    state: "West Bengal",
    lat: 22.5726,
    lon: 88.3639,
    condition: "storm",
    temperature: 31,
    feelsLike: 38,
    humidity: 79,
    wind: 34,
    windDirection: "S",
    pressure: 996,
    visibility: 4.1,
    aqi: 121,
    rainfall: 118,
    cloudCover: 92,
    risk: "extreme",
    floodRisk: "high",
    cycloneRisk: "extreme",
    heatwaveRisk: "low",
    extremeRainRisk: "extreme",
    riskScore: 88,
  },
  {
    id: "chennai",
    name: "Chennai",
    region: "South India",
    state: "Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    condition: "cloudy",
    temperature: 33,
    feelsLike: 39,
    humidity: 74,
    wind: 21,
    windDirection: "NE",
    pressure: 1001,
    visibility: 7.8,
    aqi: 84,
    rainfall: 38,
    cloudCover: 64,
    risk: "high",
    floodRisk: "high",
    cycloneRisk: "high",
    heatwaveRisk: "moderate",
    extremeRainRisk: "moderate",
    riskScore: 71,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    region: "South India",
    state: "Karnataka",
    lat: 12.9716,
    lon: 77.5946,
    condition: "cloudy",
    temperature: 25,
    feelsLike: 26,
    humidity: 68,
    wind: 14,
    windDirection: "W",
    pressure: 1010,
    visibility: 9.1,
    aqi: 61,
    rainfall: 12,
    cloudCover: 52,
    risk: "low",
    floodRisk: "moderate",
    cycloneRisk: "low",
    heatwaveRisk: "low",
    extremeRainRisk: "low",
    riskScore: 28,
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    region: "South India",
    state: "Telangana",
    lat: 17.385,
    lon: 78.4867,
    condition: "sunny",
    temperature: 34,
    feelsLike: 37,
    humidity: 48,
    wind: 16,
    windDirection: "NW",
    pressure: 1007,
    visibility: 10,
    aqi: 74,
    rainfall: 6,
    cloudCover: 22,
    risk: "moderate",
    floodRisk: "low",
    cycloneRisk: "low",
    heatwaveRisk: "high",
    extremeRainRisk: "low",
    riskScore: 42,
  },
  {
    id: "guwahati",
    name: "Guwahati",
    region: "North East India",
    state: "Assam",
    lat: 26.1445,
    lon: 91.7362,
    condition: "rain",
    temperature: 28,
    feelsLike: 33,
    humidity: 89,
    wind: 19,
    windDirection: "SE",
    pressure: 998,
    visibility: 2.9,
    aqi: 66,
    rainfall: 166,
    cloudCover: 95,
    risk: "extreme",
    floodRisk: "extreme",
    cycloneRisk: "moderate",
    heatwaveRisk: "low",
    extremeRainRisk: "extreme",
    riskScore: 92,
  },
  {
    id: "patna",
    name: "Patna",
    region: "East India",
    state: "Bihar",
    lat: 25.5941,
    lon: 85.1376,
    condition: "rain",
    temperature: 30,
    feelsLike: 35,
    humidity: 81,
    wind: 22,
    windDirection: "E",
    pressure: 1000,
    visibility: 4.6,
    aqi: 138,
    rainfall: 84,
    cloudCover: 86,
    risk: "high",
    floodRisk: "extreme",
    cycloneRisk: "low",
    heatwaveRisk: "moderate",
    extremeRainRisk: "high",
    riskScore: 80,
  },
  {
    id: "lucknow",
    name: "Lucknow",
    region: "North India",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lon: 80.9462,
    condition: "fog",
    temperature: 27,
    feelsLike: 29,
    humidity: 72,
    wind: 11,
    windDirection: "N",
    pressure: 1008,
    visibility: 1.8,
    aqi: 152,
    rainfall: 18,
    cloudCover: 70,
    risk: "moderate",
    floodRisk: "moderate",
    cycloneRisk: "low",
    heatwaveRisk: "moderate",
    extremeRainRisk: "moderate",
    riskScore: 47,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    region: "North West India",
    state: "Rajasthan",
    lat: 26.9124,
    lon: 75.7873,
    condition: "sunny",
    temperature: 38,
    feelsLike: 42,
    humidity: 31,
    wind: 20,
    windDirection: "W",
    pressure: 1005,
    visibility: 9.6,
    aqi: 118,
    rainfall: 2,
    cloudCover: 12,
    risk: "high",
    floodRisk: "low",
    cycloneRisk: "low",
    heatwaveRisk: "extreme",
    extremeRainRisk: "low",
    riskScore: 68,
  },
  {
    id: "shimla",
    name: "Shimla",
    region: "North India",
    state: "Himachal Pradesh",
    lat: 31.1048,
    lon: 77.1734,
    condition: "snow",
    temperature: 4,
    feelsLike: 1,
    humidity: 77,
    wind: 12,
    windDirection: "NE",
    pressure: 1014,
    visibility: 3.2,
    aqi: 38,
    rainfall: 9,
    cloudCover: 74,
    risk: "moderate",
    floodRisk: "low",
    cycloneRisk: "low",
    heatwaveRisk: "low",
    extremeRainRisk: "low",
    riskScore: 36,
  },
  {
    id: "kochi",
    name: "Kochi",
    region: "South India",
    state: "Kerala",
    lat: 9.9312,
    lon: 76.2673,
    condition: "rain",
    temperature: 29,
    feelsLike: 34,
    humidity: 87,
    wind: 24,
    windDirection: "SW",
    pressure: 1001,
    visibility: 4.4,
    aqi: 44,
    rainfall: 132,
    cloudCover: 91,
    risk: "high",
    floodRisk: "high",
    cycloneRisk: "moderate",
    heatwaveRisk: "low",
    extremeRainRisk: "high",
    riskScore: 74,
  },
];

export const DEFAULT_LOCATION_ID = "delhi";

export function getLocation(id: string): LocationRecord {
  return LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0];
}

export function searchLocations(query: string): LocationRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return LOCATIONS.slice(0, 6);
  return LOCATIONS.filter((l) =>
    [l.name, l.state, l.region].some((v) => v.toLowerCase().includes(q)),
  ).slice(0, 8);
}

export function nearestLocation(lat: number, lon: number): LocationRecord {
  return [...LOCATIONS].sort(
    (a, b) =>
      (a.lat - lat) ** 2 + (a.lon - lon) ** 2 - ((b.lat - lat) ** 2 + (b.lon - lon) ** 2),
  )[0];
}

/* ---------- deterministic pseudo-random so SSR and client agree ---------- */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967295;
  };
}

function round(v: number, d = 1) {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}

export interface TimelinePoint {
  label: string;
  hour: number;
  nwpA: number;
  nwpB: number;
  ai: number;
  blended: number;
  actual: number | null;
  confidence: number;
}

export type RangeKey = "6h" | "24h" | "48h" | "72h" | "7d" | "30d";

export const RANGE_META: Record<RangeKey, { label: string; points: number; stepHours: number }> = {
  "6h": { label: "6 Hours", points: 6, stepHours: 1 },
  "24h": { label: "24 Hours", points: 12, stepHours: 2 },
  "48h": { label: "48 Hours", points: 16, stepHours: 3 },
  "72h": { label: "72 Hours", points: 18, stepHours: 4 },
  "7d": { label: "7 Days", points: 7, stepHours: 24 },
  "30d": { label: "30 Days", points: 15, stepHours: 48 },
};

export function buildTimeline(
  locationId: string,
  parameter: ParameterKey,
  range: RangeKey,
): TimelinePoint[] {
  const loc = getLocation(locationId);
  const meta = PARAMETER_META[parameter];
  const { points, stepHours } = RANGE_META[range];
  const rand = seeded(`${locationId}-${parameter}-${range}`);
  const anchor =
    parameter === "rainfall"
      ? loc.rainfall
      : parameter === "temperature"
        ? loc.temperature
        : parameter === "wind"
          ? loc.wind
          : loc.humidity;

  return Array.from({ length: points }, (_, i) => {
    const hour = i * stepHours;
    const wave = Math.sin((i / points) * Math.PI * 2) * meta.spread * 0.4;
    const base = anchor + wave;
    const nwpA = Math.max(0, round(base + (rand() - 0.5) * meta.spread * 0.7));
    const nwpB = Math.max(0, round(base + (rand() - 0.45) * meta.spread * 0.8));
    const ai = Math.max(0, round(base + (rand() - 0.5) * meta.spread * 0.45));
    const blended = round(nwpA * 0.25 + nwpB * 0.35 + ai * 0.4);
    const observed = i < points / 3 ? round(blended + (rand() - 0.5) * meta.spread * 0.25) : null;
    const label =
      stepHours >= 24
        ? `Day ${i + 1}`
        : `${String((new Date().getUTCHours() + hour) % 24).padStart(2, "0")}:00`;
    return {
      label,
      hour,
      nwpA,
      nwpB,
      ai,
      blended,
      actual: observed,
      confidence: Math.round(94 - i * (18 / points) - rand() * 4),
    };
  });
}

export interface HourlyPoint {
  label: string;
  temperature: number;
  rainfall: number;
  wind: number;
  humidity: number;
  precipProbability: number;
  condition: WeatherCondition;
}

export function buildHourly(locationId: string): HourlyPoint[] {
  const loc = getLocation(locationId);
  const rand = seeded(`${locationId}-hourly`);
  return Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin((i / 12) * Math.PI * 2);
    return {
      label: `${String((new Date().getUTCHours() + i * 2) % 24).padStart(2, "0")}:00`,
      temperature: round(loc.temperature + wave * 3 + (rand() - 0.5) * 1.5),
      rainfall: Math.max(0, round(loc.rainfall / 8 + wave * 2 + (rand() - 0.4) * 3)),
      wind: Math.max(2, round(loc.wind + wave * 4 + (rand() - 0.5) * 3)),
      humidity: Math.min(100, Math.round(loc.humidity + wave * 6 + (rand() - 0.5) * 5)),
      precipProbability: Math.min(99, Math.round(loc.cloudCover * 0.8 + wave * 12)),
      condition: loc.condition,
    };
  });
}

export interface DailyPoint {
  day: string;
  min: number;
  max: number;
  rainfall: number;
  precipProbability: number;
  wind: number;
  condition: WeatherCondition;
  risk: RiskLevel;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CONDITION_CYCLE: WeatherCondition[] = ["cloudy", "rain", "storm", "sunny", "cloudy", "rain", "fog"];
const RISK_CYCLE: RiskLevel[] = ["moderate", "high", "extreme", "low", "moderate", "high", "moderate"];

export function buildDaily(locationId: string): DailyPoint[] {
  const loc = getLocation(locationId);
  const rand = seeded(`${locationId}-daily`);
  const today = new Date().getUTCDay();
  return Array.from({ length: 7 }, (_, i) => {
    const drift = (rand() - 0.5) * 4;
    return {
      day: DAYS[(today + i) % 7],
      min: round(loc.temperature - 6 + drift),
      max: round(loc.temperature + 3 + drift),
      rainfall: Math.max(0, round(loc.rainfall * (0.4 + rand()))),
      precipProbability: Math.round(35 + rand() * 60),
      wind: round(loc.wind + (rand() - 0.5) * 8),
      condition: CONDITION_CYCLE[(i + loc.name.length) % 7],
      risk: RISK_CYCLE[(i + loc.name.length) % 7],
    };
  });
}

/* ---------- Adaptive blending ---------- */
export interface BlendWeights {
  nwpA: number;
  nwpB: number;
  ai: number;
}

export interface BlendResult {
  weights: BlendWeights;
  values: BlendWeights;
  blended: number;
  confidence: number;
  unit: string;
  factors: { name: string; share: number; note: string }[];
  regime: string;
  season: string;
}

export function computeBlend(
  locationId: string,
  parameter: ParameterKey,
  leadHours: number,
): BlendResult {
  const loc = getLocation(locationId);
  const meta = PARAMETER_META[parameter];
  const rand = seeded(`${locationId}-${parameter}-${leadHours}-blend`);
  const anchor =
    parameter === "rainfall"
      ? loc.rainfall
      : parameter === "temperature"
        ? loc.temperature
        : parameter === "wind"
          ? loc.wind
          : loc.humidity;

  const values = {
    nwpA: round(Math.max(0, anchor - meta.spread * 0.3 + (rand() - 0.5) * meta.spread * 0.4)),
    nwpB: round(Math.max(0, anchor + meta.spread * 0.25 + (rand() - 0.5) * meta.spread * 0.4)),
    ai: round(Math.max(0, anchor + (rand() - 0.5) * meta.spread * 0.3)),
  };

  // AI trusts itself less at long lead times, more in convective regimes.
  const leadPenalty = Math.min(0.14, leadHours / 720);
  const wAi = 0.4 - leadPenalty + (loc.condition === "storm" || loc.condition === "rain" ? 0.04 : 0);
  const wB = 0.35 + leadPenalty * 0.6;
  const wA = 1 - wAi - wB;
  const weights = {
    nwpA: Math.round(wA * 100),
    nwpB: Math.round(wB * 100),
    ai: Math.round(wAi * 100),
  };
  const blended = round(
    (values.nwpA * weights.nwpA + values.nwpB * weights.nwpB + values.ai * weights.ai) / 100,
  );

  return {
    weights,
    values,
    blended,
    unit: meta.unit,
    confidence: Math.max(62, Math.round(93 - leadHours / 12 - rand() * 4)),
    regime:
      loc.condition === "storm"
        ? "Convective / Thunderstorm"
        : loc.condition === "rain"
          ? "Heavy Rainfall"
          : loc.condition === "snow"
            ? "Cold Wave / Snow"
            : loc.condition === "fog"
              ? "Stable / Fog"
              : loc.heatwaveRisk === "extreme" || loc.heatwaveRisk === "high"
                ? "Dry / Heat Build-up"
                : "Mixed / Transitional",
    season:
      loc.condition === "snow"
        ? "Winter"
        : loc.condition === "rain" || loc.condition === "storm"
          ? "Monsoon"
          : "Pre-Monsoon",
    factors: [
      {
        name: "Historical Accuracy",
        share: 35,
        note: "Long-run skill of each model for this parameter and region.",
      },
      {
        name: "Weather Regime",
        share: 25,
        note: "Current atmospheric regime — convective regimes favour AI nowcasting.",
      },
      {
        name: "Regional Performance",
        share: 20,
        note: "Per-region bias correction from the verification archive.",
      },
      {
        name: "Lead Time",
        share: 12,
        note: "NWP dominates at longer lead times; AI dominates short range.",
      },
      { name: "Season", share: 8, note: "Seasonal skill patterns, e.g. monsoon onset behaviour." },
    ],
  };
}

/* ---------- Model performance ---------- */
export interface ModelScore {
  model: ModelKey;
  mae: number;
  rmse: number;
  accuracy: number;
  bias: number;
}

export function modelScores(locationId: string, parameter: ParameterKey): ModelScore[] {
  const rand = seeded(`${locationId}-${parameter}-scores`);
  const base = PARAMETER_META[parameter].spread;
  const rows: { model: ModelKey; factor: number }[] = [
    { model: "nwpA", factor: 1 },
    { model: "nwpB", factor: 0.86 },
    { model: "ai", factor: 0.74 },
    { model: "blended", factor: 0.58 },
  ];
  return rows.map(({ model, factor }) => {
    const mae = round(base * 0.35 * factor + rand() * 0.8, 2);
    return {
      model,
      mae,
      rmse: round(mae * 1.42 + rand() * 0.5, 2),
      accuracy: round(100 - mae * 4.2 - rand() * 2, 1),
      bias: round((rand() - 0.5) * base * 0.3 * factor, 2),
    };
  });
}

export interface HistoryPoint {
  period: string;
  actual: number;
  forecast: number;
  mae: number;
  rmse: number;
  bias: number;
  accuracy: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildHistory(
  locationId: string,
  parameter: ParameterKey,
  months = 12,
): HistoryPoint[] {
  const rand = seeded(`${locationId}-${parameter}-history`);
  const meta = PARAMETER_META[parameter];
  const loc = getLocation(locationId);
  const anchor =
    parameter === "rainfall"
      ? loc.rainfall
      : parameter === "temperature"
        ? loc.temperature
        : parameter === "wind"
          ? loc.wind
          : loc.humidity;
  return Array.from({ length: months }, (_, i) => {
    const seasonal = Math.sin(((i + 4) / 12) * Math.PI * 2) * meta.spread * 0.8;
    const actual = Math.max(0, round(anchor + seasonal + (rand() - 0.5) * meta.spread * 0.3));
    const forecast = Math.max(0, round(actual + (rand() - 0.5) * meta.spread * 0.4));
    const mae = round(Math.abs(actual - forecast), 2);
    return {
      period: MONTHS[i % 12],
      actual,
      forecast,
      mae,
      rmse: round(mae * 1.4, 2),
      bias: round(forecast - actual, 2),
      accuracy: round(100 - mae * 3.4, 1),
    };
  });
}

/* ---------- Alerts ---------- */
export type AlertKind =
  | "Extreme Rainfall"
  | "Flood"
  | "Cyclone"
  | "Heatwave"
  | "Thunderstorm"
  | "Cold Wave";

export interface WeatherAlert {
  id: string;
  kind: AlertKind;
  headline: string;
  locationId: string;
  locationName: string;
  severity: RiskLevel;
  expected: string;
  window: string;
  confidence: number;
  issued: string;
  advisory: string;
}

export const ALERTS: WeatherAlert[] = [
  {
    id: "alert-assam-rain",
    kind: "Extreme Rainfall",
    headline: "High Rainfall Alert",
    locationId: "guwahati",
    locationName: "Guwahati, Assam",
    severity: "extreme",
    expected: "166 mm / 24h",
    window: "Next 24 hours",
    confidence: 89,
    issued: "2 min ago",
    advisory:
      "Blended forecast exceeds the extreme-rainfall threshold for the Brahmaputra valley. Pre-position response teams and issue district-level warnings.",
  },
  {
    id: "alert-assam-flood",
    kind: "Flood",
    headline: "River Flood Warning",
    locationId: "patna",
    locationName: "Patna, Bihar",
    severity: "extreme",
    expected: "Ganga +1.8 m above danger",
    window: "12–48 hours",
    confidence: 84,
    issued: "18 min ago",
    advisory:
      "Upstream accumulation plus saturated soil raises inundation risk for low-lying wards. Evacuation advisories recommended.",
  },
  {
    id: "alert-cyclone-bob",
    kind: "Cyclone",
    headline: "Cyclonic Circulation — Bay of Bengal",
    locationId: "kolkata",
    locationName: "Kolkata, West Bengal",
    severity: "high",
    expected: "Gusts 95–110 km/h",
    window: "36–72 hours",
    confidence: 76,
    issued: "1 h ago",
    advisory:
      "Ensemble spread remains wide; AI weighting reduced for track forecast. Coastal districts should prepare shelters.",
  },
  {
    id: "alert-mumbai-rain",
    kind: "Extreme Rainfall",
    headline: "Urban Flooding Likely",
    locationId: "mumbai",
    locationName: "Mumbai, Maharashtra",
    severity: "high",
    expected: "96 mm / 12h",
    window: "Next 12 hours",
    confidence: 81,
    issued: "2 h ago",
    advisory:
      "High tide overlaps peak rainfall window. Expect waterlogging on low-lying arterial roads.",
  },
  {
    id: "alert-jaipur-heat",
    kind: "Heatwave",
    headline: "Severe Heat Advisory",
    locationId: "jaipur",
    locationName: "Jaipur, Rajasthan",
    severity: "high",
    expected: "42–44 °C apparent",
    window: "Next 48 hours",
    confidence: 88,
    issued: "3 h ago",
    advisory: "Heat index above safe thresholds between 12:00 and 16:00 IST. Advise outdoor work rescheduling.",
  },
  {
    id: "alert-chennai-storm",
    kind: "Thunderstorm",
    headline: "Thunderstorm & Lightning",
    locationId: "chennai",
    locationName: "Chennai, Tamil Nadu",
    severity: "moderate",
    expected: "Lightning density 7/km²",
    window: "Next 6 hours",
    confidence: 72,
    issued: "4 h ago",
    advisory: "Short-lived convective cells moving inland. Local disruption to flights possible.",
  },
  {
    id: "alert-shimla-cold",
    kind: "Cold Wave",
    headline: "Snowfall & Cold Wave",
    locationId: "shimla",
    locationName: "Shimla, Himachal Pradesh",
    severity: "moderate",
    expected: "12–18 cm snow",
    window: "24–48 hours",
    confidence: 79,
    issued: "6 h ago",
    advisory: "Highway closures likely above 2,200 m. Keep clearing equipment on standby.",
  },
  {
    id: "alert-bengaluru-ok",
    kind: "Thunderstorm",
    headline: "Isolated Showers",
    locationId: "bengaluru",
    locationName: "Bengaluru, Karnataka",
    severity: "low",
    expected: "12 mm / 24h",
    window: "Next 24 hours",
    confidence: 68,
    issued: "8 h ago",
    advisory: "No significant impact expected. Routine monitoring only.",
  },
];

export const NATIONAL_RISK = [
  { label: "Flood Risk", level: "high" as RiskLevel, detail: "Brahmaputra & Ganga basins" },
  { label: "Cyclone Risk", level: "moderate" as RiskLevel, detail: "Bay of Bengal circulation" },
  { label: "Heatwave Risk", level: "low" as RiskLevel, detail: "North-west plains easing" },
  { label: "Extreme Rainfall", level: "high" as RiskLevel, detail: "Western Ghats & NE India" },
];

/* ---------- Layer legends ---------- */
export type LayerKey =
  | "rainfall"
  | "temperature"
  | "wind"
  | "humidity"
  | "cloud"
  | "flood"
  | "cyclone"
  | "heatwave"
  | "extremeRain";

export interface LayerDef {
  key: LayerKey;
  label: string;
  unit: string;
  legend: { label: string; hex: string }[];
}

export const LAYERS: LayerDef[] = [
  {
    key: "rainfall",
    label: "Rainfall",
    unit: "mm",
    legend: [
      { label: "0–5 mm", hex: "#dbeafe" },
      { label: "5–25 mm", hex: "#93c5fd" },
      { label: "25–50 mm", hex: "#3b82f6" },
      { label: "50–100 mm", hex: "#1d4ed8" },
      { label: "100–200 mm", hex: "#7c3aed" },
      { label: "200+ mm", hex: "#be123c" },
    ],
  },
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    legend: [
      { label: "<10 °C", hex: "#60a5fa" },
      { label: "10–20 °C", hex: "#22d3ee" },
      { label: "20–30 °C", hex: "#4ade80" },
      { label: "30–40 °C", hex: "#f59e0b" },
      { label: "40 °C+", hex: "#dc2626" },
    ],
  },
  {
    key: "wind",
    label: "Wind",
    unit: "km/h",
    legend: [
      { label: "0–10", hex: "#bae6fd" },
      { label: "10–25", hex: "#38bdf8" },
      { label: "25–45", hex: "#6366f1" },
      { label: "45+", hex: "#a21caf" },
    ],
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: "%",
    legend: [
      { label: "0–40 %", hex: "#fde68a" },
      { label: "40–65 %", hex: "#86efac" },
      { label: "65–85 %", hex: "#2dd4bf" },
      { label: "85–100 %", hex: "#0e7490" },
    ],
  },
  {
    key: "cloud",
    label: "Cloud Cover",
    unit: "%",
    legend: [
      { label: "0–25 %", hex: "#f1f5f9" },
      { label: "25–50 %", hex: "#cbd5e1" },
      { label: "50–75 %", hex: "#94a3b8" },
      { label: "75–100 %", hex: "#475569" },
    ],
  },
  {
    key: "flood",
    label: "Flood Risk",
    unit: "",
    legend: [
      { label: "Low", hex: "#16a34a" },
      { label: "Moderate", hex: "#eab308" },
      { label: "High", hex: "#f97316" },
      { label: "Extreme", hex: "#dc2626" },
    ],
  },
  {
    key: "cyclone",
    label: "Cyclone Risk",
    unit: "",
    legend: [
      { label: "Low", hex: "#16a34a" },
      { label: "Moderate", hex: "#eab308" },
      { label: "High", hex: "#f97316" },
      { label: "Extreme", hex: "#dc2626" },
    ],
  },
  {
    key: "heatwave",
    label: "Heatwave Risk",
    unit: "",
    legend: [
      { label: "Low", hex: "#16a34a" },
      { label: "Moderate", hex: "#eab308" },
      { label: "High", hex: "#f97316" },
      { label: "Extreme", hex: "#dc2626" },
    ],
  },
  {
    key: "extremeRain",
    label: "Extreme Rainfall",
    unit: "",
    legend: [
      { label: "Low", hex: "#16a34a" },
      { label: "Moderate", hex: "#eab308" },
      { label: "High", hex: "#f97316" },
      { label: "Extreme", hex: "#dc2626" },
    ],
  },
];

export function layerValue(loc: LocationRecord, layer: LayerKey): { value: number; text: string; hex: string } {
  const pick = (levels: RiskLevel) => RISK_META[levels];
  switch (layer) {
    case "rainfall": {
      const v = loc.rainfall;
      const hex =
        v > 200 ? "#be123c" : v > 100 ? "#7c3aed" : v > 50 ? "#1d4ed8" : v > 25 ? "#3b82f6" : v > 5 ? "#93c5fd" : "#dbeafe";
      return { value: v, text: `${v} mm`, hex };
    }
    case "temperature": {
      const v = loc.temperature;
      const hex = v > 40 ? "#dc2626" : v > 30 ? "#f59e0b" : v > 20 ? "#4ade80" : v > 10 ? "#22d3ee" : "#60a5fa";
      return { value: v, text: `${v} °C`, hex };
    }
    case "wind": {
      const v = loc.wind;
      const hex = v > 45 ? "#a21caf" : v > 25 ? "#6366f1" : v > 10 ? "#38bdf8" : "#bae6fd";
      return { value: v, text: `${v} km/h`, hex };
    }
    case "humidity": {
      const v = loc.humidity;
      const hex = v > 85 ? "#0e7490" : v > 65 ? "#2dd4bf" : v > 40 ? "#86efac" : "#fde68a";
      return { value: v, text: `${v} %`, hex };
    }
    case "cloud": {
      const v = loc.cloudCover;
      const hex = v > 75 ? "#475569" : v > 50 ? "#94a3b8" : v > 25 ? "#cbd5e1" : "#f1f5f9";
      return { value: v, text: `${v} %`, hex };
    }
    case "flood":
      return { value: loc.riskScore, text: pick(loc.floodRisk).label, hex: pick(loc.floodRisk).hex };
    case "cyclone":
      return { value: loc.riskScore, text: pick(loc.cycloneRisk).label, hex: pick(loc.cycloneRisk).hex };
    case "heatwave":
      return { value: loc.riskScore, text: pick(loc.heatwaveRisk).label, hex: pick(loc.heatwaveRisk).hex };
    case "extremeRain":
      return {
        value: loc.riskScore,
        text: pick(loc.extremeRainRisk).label,
        hex: pick(loc.extremeRainRisk).hex,
      };
  }
}

/* ---------- Notifications ---------- */
export type NotificationCategory =
  | "Weather Updates"
  | "Forecast Changes"
  | "Disaster Alerts"
  | "Model Updates"
  | "System";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  time: string;
  urgent: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    category: "Disaster Alerts",
    title: "Extreme rainfall — Guwahati",
    body: "166 mm/24h expected. Confidence 89%.",
    time: "2 min",
    urgent: true,
  },
  {
    id: "n2",
    category: "Disaster Alerts",
    title: "Flood warning — Patna",
    body: "Ganga projected 1.8 m above danger level.",
    time: "18 min",
    urgent: true,
  },
  {
    id: "n3",
    category: "Forecast Changes",
    title: "Blended rainfall revised upward",
    body: "Mumbai 12h total revised 78 mm → 96 mm.",
    time: "45 min",
    urgent: false,
  },
  {
    id: "n4",
    category: "Model Updates",
    title: "AI weighting recalibrated",
    body: "Monsoon regime weights refreshed for East India.",
    time: "1 h",
    urgent: false,
  },
  {
    id: "n5",
    category: "Weather Updates",
    title: "Delhi turning cloudy",
    body: "Cloud cover up to 58%, AQI 168 (poor).",
    time: "2 h",
    urgent: false,
  },
  {
    id: "n6",
    category: "System",
    title: "NWP Model B cycle ingested",
    body: "06Z cycle assimilated successfully in 4m 12s.",
    time: "3 h",
    urgent: false,
  },
];
