import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  accent = "primary",
  className,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  trend?: string;
  accent?: "primary" | "accent" | "safe" | "warn" | "high" | "severe";
  className?: string;
  children?: ReactNode;
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/12 text-primary",
    accent: "bg-accent/15 text-accent",
    safe: "bg-safe/15 text-safe",
    warn: "bg-warn/20 text-warn",
    high: "bg-high/20 text-high",
    severe: "bg-severe/18 text-severe",
  };

  return (
    <div className={cn("panel panel-hover p-4", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="num mt-1.5 text-2xl font-bold leading-none">{value}</p>
          {sub ? <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p> : null}
        </div>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", accents[accent])}>
          <Icon className="size-4" />
        </span>
      </div>
      {trend ? <p className="mt-3 text-[11px] font-medium text-muted-foreground">{trend}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
