import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp } from "lucide-react";

import { Panel, PageHero, SectionTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Hybrid Weather Intelligence" }] }),
  component: Analytics,
});

const bars = [72, 84, 68, 91, 87, 94, 82, 89, 93, 88, 95, 92];

function Analytics() {
  return <div>
    <PageHero eyebrow="Model performance" title="Analytics" description="A simple view of blended forecast performance, alert verification and system refresh behaviour." />
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric title="Blended accuracy" value="94.2%" note="+2.8% this month" />
        <Metric title="Alerts verified" value="87%" note="31 events reviewed" />
        <Metric title="Forecast latency" value="42 sec" note="Median refresh time" />
      </div>
      <Panel>
        <SectionTitle eyebrow="30 days" title="Forecast accuracy trend" description="Blended model performance across monitored stations." action={<BarChart3 className="size-5 text-primary" />} />
        <div className="mt-8 flex h-64 items-end gap-2 sm:gap-3">{bars.map((value, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className="w-full rounded-t-md bg-primary/75 transition-all group-hover:bg-primary" style={{ height: `${value}%` }} title={`${value}%`} /><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-xs font-semibold group-hover:block">{value}%</span></div>)}</div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>28 Aug</span><span>26 Sep</span></div>
      </Panel>
      <Panel>
        <SectionTitle eyebrow="Operational summary" title="What the system is tracking" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['Model agreement', 'Regional bias', 'Lead-time skill', 'Weather regime'].map((item) => <div key={item} className="rounded-xl border border-border bg-surface-2 p-4"><TrendingUp className="size-4 text-primary" /><p className="mt-3 text-sm font-bold">{item}</p><p className="mt-1 text-xs text-muted-foreground">Available for integration with live verification data.</p></div>)}
        </div>
      </Panel>
    </main>
  </div>;
}

function Metric({ title, value, note }: { title: string; value: string; note: string }) {
  return <Panel><p className="text-sm text-muted-foreground">{title}</p><p className="num mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></Panel>;
}
