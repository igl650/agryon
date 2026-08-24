import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { events } from "@/lib/agryon-data";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário Rural — AGRYON" },
      {
        name: "description",
        content: "Vacinações, manejo sanitário e datas-chave da produção rural em um só calendário.",
      },
      { property: "og:title", content: "Calendário Rural — AGRYON" },
      {
        property: "og:description",
        content: "Vacinações, manejo sanitário e datas-chave da produção rural em um só calendário.",
      },
    ],
  }),
  component: CalendarioPage,
});

function CalendarioPage() {
  const now = new Date();
  const label = now
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(" de ", " ");

  return (
    <AppShell
      title="Calendário Rural"
      badge={
        <span className="shrink-0 rounded-2xl bg-brand-orange/15 px-4 py-2 text-sm font-bold capitalize text-brand-orange">
          {label}
        </span>
      }
    >
      <div className="space-y-4">
        {events.map((e) => (
          <article
            key={e.id}
            className="flex gap-4 overflow-hidden rounded-3xl bg-card p-4 shadow-card"
          >
            <div className="w-1.5 shrink-0 rounded-full bg-brand-orange" />
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-soft">
              <span className="text-2xl font-extrabold text-brand-green-deep">{e.day}</span>
              <span className="text-xs font-bold text-brand-green-deep/70">{e.month}</span>
            </div>
            <div className="min-w-0 py-1">
              <h2 className="text-lg font-bold leading-snug text-foreground">{e.title}</h2>
              <p className="mt-1 text-base leading-snug text-muted-foreground">{e.description}</p>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
