import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sprout, Droplets, Stethoscope, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { library, type LibraryItem } from "@/lib/agryon-data";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca Rural — AGRYON" },
      {
        name: "description",
        content: "Manuais práticos de manejo, sanidade, forragem e convivência com a seca.",
      },
      { property: "og:title", content: "Biblioteca Rural — AGRYON" },
      {
        property: "og:description",
        content: "Manuais práticos de manejo, sanidade, forragem e convivência com a seca.",
      },
    ],
  }),
  component: BibliotecaPage,
});

const icons = {
  book: BookOpen,
  sprout: Sprout,
  droplet: Droplets,
  stethoscope: Stethoscope,
};

function BibliotecaPage() {
  const [active, setActive] = useState<LibraryItem | null>(null);

  return (
    <AppShell title="Biblioteca Rural">
      <div className="space-y-4">
        {library.map((item) => {
          const Icon = icons[item.icon];
          return (
            <article key={item.id} className="flex gap-4 rounded-3xl bg-card p-5 shadow-card">
              <div className="grid h-16 w-16 shrink-0 place-items-center self-center rounded-2xl bg-brand-soft">
                <Icon className="h-7 w-7 text-brand-green-deep" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold leading-snug text-foreground">{item.title}</h2>
                <p className="mt-1 text-base leading-snug text-muted-foreground">
                  {item.description}
                </p>
                <button
                  onClick={() => setActive(item)}
                  className="mt-3 rounded-full bg-brand-orange px-5 py-2.5 text-base font-bold text-primary-foreground"
                >
                  Ver conteúdo
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 px-5"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-foreground">{active.title}</h2>
              <button onClick={() => setActive(null)} aria-label="Fechar">
                <X className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-3 text-base text-muted-foreground">{active.description}</p>
            <div className="mt-4 space-y-3 rounded-2xl bg-brand-soft p-4 text-brand-green-deep">
              <p className="font-bold">Conteúdo do material</p>
              <p className="text-sm">1. Introdução e contexto do semiárido</p>
              <p className="text-sm">2. Planejamento e preparo da propriedade</p>
              <p className="text-sm">3. Execução passo a passo no dia a dia</p>
              <p className="text-sm">4. Custos, erros comuns e boas práticas</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Material demonstrativo do MVP. O conteúdo completo será disponibilizado em PDF para
              leitura offline.
            </p>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
