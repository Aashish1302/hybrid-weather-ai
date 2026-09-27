import { Link } from "@tanstack/react-router";
import { Home, LayoutDashboard, Map, TriangleAlert, CloudSun } from "lucide-react";

import { useApp } from "@/lib/app-state";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: false },
  { to: "/map", label: "Map", icon: Map, exact: false },
  { to: "/forecast", label: "Forecast", icon: CloudSun, exact: false },
  { to: "/alerts", label: "Alerts", icon: TriangleAlert, exact: false },
];

export function MobileNav() {
  const { unreadCount } = useApp();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="relative flex flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="size-[18px]" />
              {label}
              {to === "/alerts" && unreadCount > 0 ? (
                <span className="absolute right-[22%] top-1 size-2 rounded-full bg-severe" />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
