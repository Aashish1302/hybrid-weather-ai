import { cn } from "@/lib/utils";
import { RISK_META, type RiskLevel } from "@/lib/weather-data";
import type { ReactNode } from "react";

const TOKEN_CLASSES: Record<"safe" | "warn" | "high" | "severe", string> = {
  safe: "bg-safe/15 text-safe border-safe/35",
  warn: "bg-warn/20 text-warn border-warn/40",
  high: "bg-high/20 text-high border-high/40",
  severe: "bg-severe/18 text-severe border-severe/45",
};

export function RiskBadge({
  level,
  label,
  className,
  pulse,
}: {
  level: RiskLevel;
  label?: string;
  className?: string;
  pulse?: boolean;
}) {
  const meta = RISK_META[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        TOKEN_CLASSES[meta.token],
        pulse && level === "extreme" && "alert-pulse",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label ?? meta.label}
    </span>
  );
}

export function TokenBadge({
  token,
  children,
  className,
}: {
  token: "safe" | "warn" | "high" | "severe";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        TOKEN_CLASSES[token],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("panel p-5", hover && "panel-hover", className)}>{children}</div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border/70 bg-surface/60 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  );
}

export function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="num text-sm font-semibold">{value}</span>
    </div>
  );
}
