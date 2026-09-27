import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/lib/app-state";
import { NOTIFICATIONS, type NotificationCategory } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

const CATEGORIES: NotificationCategory[] = [
  "Disaster Alerts",
  "Weather Updates",
  "Forecast Changes",
  "Model Updates",
  "System",
];

export function NotificationCenter() {
  const { readIds, markAllRead, markRead, unreadCount } = useApp();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-severe text-[10px] font-bold text-severe-foreground">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Notification Center</p>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </div>
          <Button variant="ghost" size="sm" onClick={markAllRead} className="shrink-0">
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {CATEGORIES.map((category) => {
              const items = NOTIFICATIONS.filter((n) => n.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-2">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </p>
                  {items.map((n) => {
                    const unread = !readIds.includes(n.id);
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "grid w-full grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-lg p-2 text-left transition-colors hover:bg-secondary",
                          n.urgent && "bg-severe/8",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1.5 size-2 shrink-0 rounded-full",
                            n.urgent ? "bg-severe" : unread ? "bg-primary" : "bg-border",
                          )}
                        />
                        <span className="min-w-0">
                          <span className="flex items-baseline justify-between gap-2">
                            <span
                              className={cn(
                                "truncate text-sm",
                                unread ? "font-semibold" : "font-medium text-muted-foreground",
                              )}
                            >
                              {n.title}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="border-t border-border p-2">
          <Button asChild variant="secondary" size="sm" className="w-full">
            <Link to="/alerts">View all alerts</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
