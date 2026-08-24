import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("E-mail ou senha incorretos.");
    } else {
      navigate({ to: "/feed" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 border-b border-border bg-card px-5 py-5">
          <button onClick={() => router.history.back()} aria-label="Voltar">
            <ArrowLeft className="h-7 w-7 text-brand-green" />
          </button>
          <h1 className="text-3xl font-extrabold text-foreground">Entrar</h1>
        </header>
        
        <main className="px-5 py-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm font-medium">{errorMsg}</div>}
            
            <label className="block">
              <span className="mb-2 block text-lg font-bold text-foreground">E-mail</span>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-lg text-foreground outline-none focus:border-brand-green"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-bold text-foreground">Senha</span>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-lg text-foreground outline-none focus:border-brand-green"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-brand-green py-4 text-xl font-bold text-primary-foreground shadow-card transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}