import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, Compass, Search, LogIn } from "lucide-react";
import goatLogo from "@/assets/goat-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGRYON — Conhecimento que fortalece o campo" },
      {
        name: "description",
        content:
          "Comunidade, biblioteca e ferramentas de manejo para produtores rurais do semiárido.",
      },
      { property: "og:title", content: "AGRYON — Conhecimento que fortalece o campo" },
      {
        property: "og:description",
        content:
          "Comunidade, biblioteca e ferramentas de manejo para produtores rurais do semiárido.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-brand-green text-primary-foreground">
      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <img src={goatLogo} alt="Mascote bode AGRYON" className="h-24 w-24 object-contain" />
          <h1 className="mt-6 text-5xl font-extrabold tracking-widest">AGRYON</h1>
          <p className="mt-4 text-center text-base italic opacity-90">
            “Conectando conhecimento, fortalecendo o campo.”
          </p>
          <div className="mt-10 h-1.5 w-44 overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full w-1/3 animate-[slide_1.6s_ease-in-out_infinite] rounded-full bg-brand-orange" />
          </div>
          <style>{`@keyframes slide{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12">
          <img src={goatLogo} alt="Mascote bode AGRYON" className="h-16 w-16 object-contain" />
          <h1 className="mt-4 text-5xl font-extrabold tracking-widest">AGRYON</h1>
          <p className="mt-4 text-center text-lg italic opacity-95">
            “Conectando conhecimento, fortalecendo o campo.”
          </p>

          <div className="mt-10 w-full space-y-4">
            <Link
              to="/cadastro"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange px-6 py-4 text-lg font-bold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
            >
              <UserPlus className="h-5 w-5" />
              Criar minha conta grátis
            </Link>

            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-green-deep px-6 py-4 text-lg font-bold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
            >
              <LogIn className="h-5 w-5" />
              Acessar minha conta
            </Link>

            <Link
              to="/feed"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-primary-foreground/80 px-6 py-4 text-lg font-bold transition-colors hover:bg-primary-foreground/10"
            >
              <Compass className="h-5 w-5" />
              Explorar sem conta
            </Link>
          </div>

          <Link
            to="/pesquisar"
            className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-primary-foreground/20 px-5 py-5 text-primary-foreground/90"
          >
            <Search className="h-5 w-5 shrink-0" />
            <span className="min-w-0 truncate">Pesquisar problemas, verminose, seca...</span>
          </Link>
        </div>
      )}
    </div>
  );
}