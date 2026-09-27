export interface NavItem {
  to: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/map", label: "Weather Map" },
  { to: "/forecast", label: "Forecast" },
  { to: "/alerts", label: "Disaster Alerts" },
  { to: "/analytics", label: "Analytics" },
];
