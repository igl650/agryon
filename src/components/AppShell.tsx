import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  action,
  badge,
  children,
  subtitle,
  centered,
}: {
  title: string;
  action?: ReactNode;
  badge?: ReactNode;
  subtitle?: ReactNode;
  centered?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 border-b border-border bg-card px-5 py-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h1
              className={`min-w-0 text-2xl font-extrabold tracking-tight text-foreground ${
                centered ? "text-center" : ""
              }`}
            >
              {title}
            </h1>
            {badge ?? action ?? null}
          </div>
          {subtitle ? <div className="mt-2">{subtitle}</div> : null}
        </header>
        <main className="px-4 py-5">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
