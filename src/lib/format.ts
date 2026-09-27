import type { RainUnit, TempUnit, WindUnit } from "./app-state";

export function formatTemp(celsius: number, unit: TempUnit, digits = 0) {
  const v = unit === "f" ? celsius * 1.8 + 32 : celsius;
  return `${v.toFixed(digits)}°${unit === "f" ? "F" : "C"}`;
}

export function formatWind(kmh: number, unit: WindUnit, digits = 0) {
  const v = unit === "mph" ? kmh * 0.621371 : kmh;
  return `${v.toFixed(digits)} ${unit === "mph" ? "mph" : "km/h"}`;
}

export function formatRain(mm: number, unit: RainUnit) {
  if (unit === "in") return `${(mm / 25.4).toFixed(2)} in`;
  return `${mm.toFixed(mm < 10 ? 1 : 0)} mm`;
}

export function aqiBand(aqi: number): { label: string; token: "safe" | "warn" | "high" | "severe" } {
  if (aqi <= 50) return { label: "Good", token: "safe" };
  if (aqi <= 100) return { label: "Moderate", token: "warn" };
  if (aqi <= 200) return { label: "Poor", token: "high" };
  return { label: "Severe", token: "severe" };
}
