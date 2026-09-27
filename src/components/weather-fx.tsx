import { cn } from "@/lib/utils";
import type { WeatherCondition } from "@/lib/weather-data";

const FX: Record<WeatherCondition, string> = {
  sunny: "fx-sun",
  cloudy: "",
  rain: "fx-rain",
  storm: "fx-storm",
  snow: "fx-snow",
  fog: "fx-fog",
};

/** Subtle weather ambience layer. Purely decorative, never blocks pointer events. */
export function WeatherFx({
  condition,
  className,
}: {
  condition: WeatherCondition;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", FX[condition], className)}
    />
  );
}
