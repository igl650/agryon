import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, Coins, Leaf, CircleCheck, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { useFollowing, useToggleFollow } from "@/lib/social";
import { useCommunityProfiles } from "@/lib/profile";
import { filterChips, searchResults, type SearchResult } from "@/lib/agryon-data";

export const Route = createFileRoute("/pesquisar")({
  component: PesquisarPage,
});

function PesquisarPage() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<string | null>(null);
  const [region, setRegion] = useState("Todas as Regiões");
  const [cost, setCost] = useState("Qualquer Custo");
  const [active, setActive] = useState<SearchResult | null>(null);
  const [tab, setTab] = useState<"problemas" | "produtores">("problemas");
  
  // Real Data hooks
  const { data: communityProfiles = [], isLoading: isLoadingProfiles } = useCommunityProfiles();
  const { data: followingList = [] } = useFollowing();
  const { mutate: toggleFollow } = useToggleFollow();

  const people = useMemo(() => {
    const q = query.trim().toLowerCase();
    return communityProfiles.filter(
      (p: any) =>
        !q ||
        p.nome?.toLowerCase().includes(q) ||
        p.username?.toLowerCase().includes(q) ||
        p.municipio?.toLowerCase().includes(q) ||
        p.estado?.toLowerCase().includes(q)
    );
  }, [query, communityProfiles]);

  const results = useMemo(
    () =>
      searchResults.filter((r) => {
        const q = query.trim().toLowerCase();
        const matchQ = !q || r.title.toLowerCase().includes(q) || r.solution.toLowerCase().includes(q);
        const matchChip = !chip || r.category === chip;
        const matchRegion = region === "Todas as Regiões" || r.region === region;
        const matchCost = cost === "Qualquer Custo" || r.cost === cost;
        return matchQ && matchChip && matchRegion && matchCost;
      }),
    [query, chip, region, cost],
  );

  return (
    <AppShell
      title="Pesquisa Inteligente"
      subtitle={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
            {(["problemas", "produtores"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl py-2.5 text-sm font-bold capitalize transition-all ${
                  tab === t
                    ? "bg-brand-green text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "problemas"
                  ? "Pesquisar por verminose, seca, manejo..."
                  : "Pesquisar por nome ou município..."
              }
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className={`-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 ${tab === "produtores" ? "hidden" : ""}`}>
            {filterChips.map((c) => (
              <button
                key={c}
                onClick={() => setChip(chip === c ? null : c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  chip === c
                    ? "border-brand-green bg-brand-green text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={`grid grid-cols-2 gap-3 ${tab === "produtores" ? "hidden" : ""}`}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground outline-none focus:border-brand-green"
            >
              {["Todas as Regiões", "Semiárido", "Sertão", "Agreste"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground outline-none focus:border-brand-green"
            >
              {["Qualquer Custo", "Baixo", "Médio", "Alto"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      {tab === "produtores" ? (
        <div className="space-y-3">
          {isLoadingProfiles ? (
             <div className="flex py-10 justify-center text-muted-foreground">
               <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
             </div>
          ) : people.length === 0 ? (
            <p className="rounded-3xl bg-card p-6 text-center text-muted-foreground shadow-card">
              Nenhum produtor encontrado.
            </p>
          ) : null}
          
          {people.map((p: any) => {
            const isFollowingUser = followingList.includes(p.id);
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card">
                <Link to="/produtor/$id" params={{ id: p.id }} className="shrink-0">
                  <Avatar name={p.nome} size={52} />
                </Link>
                <Link to="/produtor/$id" params={{ id: p.id }} className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-foreground">{p.nome}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{p.username} • {p.municipio ? `${p.municipio} - ${p.estado}` : "Sem Local"}
                  </p>
                </Link>
                <button
                  onClick={() => toggleFollow(p.id)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95 ${
                    isFollowingUser
                      ? "border border-border bg-muted text-foreground"
                      : "bg-brand-orange text-primary-foreground"
                  }`}
                >
                  {isFollowingUser ? "Seguindo" : "Seguir"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
      <div className="space-y-4">
        {results.length === 0 ? (
          <p className="rounded-3xl bg-card p-6 text-center text-muted-foreground shadow-card">
            Nenhuma solução encontrada para esses filtros.
          </p>
        ) : null}

        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r)}
            className="flex w-full gap-3 rounded-3xl bg-card p-5 text-left shadow-card transition-all active:scale-[98%]"
          >
            <div className="w-1.5 shrink-0 rounded-full bg-brand-green" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 text-xl font-extrabold leading-snug text-foreground">
                  {r.title}
                </h2>
                <span className="shrink-0 rounded-xl bg-brand-green-deep px-3 py-2 text-sm font-bold text-primary-foreground">
                  IER {r.score}
                </span>
              </div>
              <p className="mt-2 text-base text-muted-foreground">
                <span className="font-bold text-foreground">Solução: </span>
                {r.solution}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag icon={<Coins className="h-4 w-4" />} label={`Custo: ${r.cost}`} />
                <Tag icon={<Leaf className="h-4 w-4" />} label={`${r.region}`} />
                <Tag icon={<CircleCheck className="h-4 w-4" />} label={r.rating} />
              </div>
            </div>
          </button>
        ))}
      </div>
      )}

      {/* Modal IER Expandido */}
      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-xs"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-xl bg-brand-green-deep px-3 py-2 text-sm font-bold text-primary-foreground">
                Índice IER: {active.score}/100
              </span>
              <button onClick={() => setActive(null)} className="rounded-full p-1 transition-colors hover:bg-muted" aria-label="Fechar">
                <X className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold leading-snug text-foreground">
              {active.title}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              <span className="font-bold text-foreground">Solução: </span>
              {active.solution}
            </p>
            <p className="mt-3 text-base text-muted-foreground">{active.detail}</p>
            <div className="mt-4 space-y-3 rounded-2xl bg-brand-soft p-5 text-brand-green-deep">
              <p>
                <span className="font-bold">Custo estimado:</span> {active.cost}
              </p>
              <p>
                <span className="font-bold">Aplicação:</span> {active.application}
              </p>
              <p>
                <span className="font-bold">Adaptação à {active.region}:</span> {active.adaptation}
              </p>
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              <span className="font-bold text-foreground">Resultados gerais: </span>
              {active.results}
            </p>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
      {icon}
      {label}
    </span>
  );
}