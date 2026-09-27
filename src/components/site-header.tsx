import { Link, useRouterState } from "@tanstack/react-router";
import {
  CloudLightning,
  Menu,
  MapPin,
  Search,
  Sun,
  Moon,
  SunMoon,
  User,
  Palette,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LocationPicker } from "@/components/location-picker";
import { NotificationCenter } from "@/components/notification-center";
import { NAV_ITEMS } from "@/lib/nav";
import { useApp, type ThemeMode } from "@/lib/app-state";
import { CONDITION_LABELS, type WeatherCondition } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

const WEATHER_OPTIONS: WeatherCondition[] = ["sunny", "cloudy", "rain", "storm", "snow", "fog"];

export function SiteHeader() {
  const { location, themeMode, setThemeMode, weatherTheme, previewWeather } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[110rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl hero-atmos text-primary-foreground shadow-panel">
            <CloudLightning className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold leading-tight sm:text-base">
              Hybrid Weather Intelligence
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              AI–NWP Multi-Model Forecast Blending
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-0.5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          <NotificationCenter />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex">
                <MapPin className="size-4 text-primary" />
                <span className="max-w-24 truncate">{location.name}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <p className="mb-3 text-sm font-semibold">Select location</p>
              <LocationPicker />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Theme selector">
                {themeMode === "auto" ? (
                  <SunMoon className="size-4" />
                ) : themeMode === "dark" ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Theme mode</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={themeMode}
                onValueChange={(v) => setThemeMode(v as ThemeMode)}
              >
                <DropdownMenuRadioItem value="auto">Auto / Weather based</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">Day / Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Night / Dark</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2">
                <Palette className="size-3.5" /> Preview atmosphere
              </DropdownMenuLabel>
              <div className="grid grid-cols-3 gap-1 p-1">
                {WEATHER_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => previewWeather(c)}
                    className={cn(
                      "rounded-md border border-border px-1.5 py-1 text-[11px] font-medium capitalize transition-colors hover:bg-secondary",
                      weatherTheme === c && "border-primary/60 bg-secondary",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <DropdownMenuItem onSelect={() => previewWeather(null)}>
                Follow live weather ({CONDITION_LABELS[location.condition]})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-sm font-semibold">Duty Forecaster</span>
                <span className="block text-xs font-normal text-muted-foreground">
                  National Operations Desk
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/alerts">Active alerts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/analytics">System analytics</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[17rem] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 grid gap-1 px-4 pb-8">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search locations</DialogTitle>
          </DialogHeader>
          <LocationPicker onDone={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
