import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCATION_ID,
  NOTIFICATIONS,
  getLocation,
  type LocationRecord,
  type WeatherCondition,
} from "./weather-data";

export type ThemeMode = "auto" | "light" | "dark";
export type TempUnit = "c" | "f";
export type WindUnit = "kmh" | "mph";
export type RainUnit = "mm" | "in";

export interface NotificationPrefs {
  extreme: boolean;
  rainfall: boolean;
  flood: boolean;
  cyclone: boolean;
  heatwave: boolean;
  temperature: boolean;
}

interface AppState {
  locationId: string;
  location: LocationRecord;
  setLocationId: (id: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  resolvedDark: boolean;
  weatherTheme: WeatherCondition;
  previewWeather: (c: WeatherCondition | null) => void;
  units: { temp: TempUnit; wind: WindUnit; rain: RainUnit };
  setUnit: <K extends keyof AppState["units"]>(key: K, value: AppState["units"][K]) => void;
  readIds: string[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  unreadCount: number;
  acknowledged: string[];
  acknowledge: (id: string) => void;
  notificationPrefs: NotificationPrefs;
  setNotificationPref: (k: keyof NotificationPrefs, v: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

const STORAGE_KEY = "hwi-preferences-v1";

interface Persisted {
  locationId?: string;
  themeMode?: ThemeMode;
  units?: { temp: TempUnit; wind: WindUnit; rain: RainUnit };
  readIds?: string[];
  acknowledged?: string[];
  notificationPrefs?: NotificationPrefs;
}

const DEFAULT_PREFS: NotificationPrefs = {
  extreme: true,
  rainfall: true,
  flood: true,
  cyclone: true,
  heatwave: false,
  temperature: false,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [locationId, setLocationId] = useState(DEFAULT_LOCATION_ID);
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [units, setUnits] = useState({
    temp: "c" as TempUnit,
    wind: "kmh" as WindUnit,
    rain: "mm" as RainUnit,
  });
  const [readIds, setReadIds] = useState<string[]>([]);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState(DEFAULT_PREFS);
  const [preview, setPreview] = useState<WeatherCondition | null>(null);
  const [systemDark, setSystemDark] = useState(false);

  // hydrate from storage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        if (p.locationId) setLocationId(p.locationId);
        if (p.themeMode) setThemeMode(p.themeMode);
        if (p.units) setUnits(p.units);
        if (p.readIds) setReadIds(p.readIds);
        if (p.acknowledged) setAcknowledged(p.acknowledged);
        if (p.notificationPrefs) setNotificationPrefs(p.notificationPrefs);
      }
    } catch {
      /* ignore corrupt storage */
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          locationId,
          themeMode,
          units,
          readIds,
          acknowledged,
          notificationPrefs,
        } satisfies Persisted),
      );
    } catch {
      /* storage unavailable */
    }
  }, [locationId, themeMode, units, readIds, acknowledged, notificationPrefs]);

  const location = getLocation(locationId);
  const weatherTheme = preview ?? location.condition;

  const darkWeather = weatherTheme === "storm" || weatherTheme === "rain";
  const resolvedDark =
    themeMode === "dark" ? true : themeMode === "light" ? false : systemDark || darkWeather;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedDark);
    root.dataset.weather = weatherTheme;
    root.style.colorScheme = resolvedDark ? "dark" : "light";
  }, [resolvedDark, weatherTheme]);

  const value = useMemo<AppState>(
    () => ({
      locationId,
      location,
      setLocationId,
      themeMode,
      setThemeMode,
      resolvedDark,
      weatherTheme,
      previewWeather: setPreview,
      units,
      setUnit: (key, val) => setUnits((u) => ({ ...u, [key]: val })),
      readIds,
      markAllRead: () => setReadIds(NOTIFICATIONS.map((n) => n.id)),
      markRead: (id: string) => setReadIds((r) => (r.includes(id) ? r : [...r, id])),
      unreadCount: NOTIFICATIONS.filter((n) => !readIds.includes(n.id)).length,
      acknowledged,
      acknowledge: (id: string) => setAcknowledged((a) => (a.includes(id) ? a : [...a, id])),
      notificationPrefs,
      setNotificationPref: (k, v) => setNotificationPrefs((p) => ({ ...p, [k]: v })),
    }),
    [locationId, location, themeMode, resolvedDark, weatherTheme, units, readIds, acknowledged, notificationPrefs],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}

export function useGeolocate() {
  return useCallback(
    () =>
      new Promise<{ lat: number; lon: number }>((resolve, reject) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
          reject(new Error("Geolocation is not available in this browser."));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          (err) => reject(new Error(err.message || "Location permission denied.")),
          { timeout: 8000 },
        );
      }),
    [],
  );
}
