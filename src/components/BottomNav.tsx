import { Link } from "@tanstack/react-router";
import { Newspaper, Search, BookOpen, CalendarDays, User } from "lucide-react";

const tabs = [
  { to: "/feed", label: "Feed", Icon: Newspaper },
  { to: "/pesquisar", label: "Pesquisar", Icon: Search },
  { to: "/biblioteca", label: "Biblioteca", Icon: BookOpen },
  { to: "/calendario", label: "Calendário", Icon: CalendarDays },
  { to: "/perfil", label: "Perfil", Icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex flex-col items-center gap-1 py-2 text-muted-foreground transition-colors"
              activeProps={{ className: "!text-brand-green" }}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
