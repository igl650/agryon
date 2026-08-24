import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { ProducerForm } from "@/components/ProducerForm";
import { useProducer, emptyProducer } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { producer, ready } = useProducer();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Passo 1: Criar conta no Supabase Auth
  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setStep(2); // Avança para o perfil
    }
    setLoading(false);
  }

  // Passo 2: Salvar os dados na tabela Profiles
  async function handleSaveProfile(p: typeof emptyProducer) {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { error } = await supabase.from("profiles").insert({
        id: session.user.id,
        nome: p.nome,
        municipio: p.municipio,
        estado: p.estado,
        idade: p.idade,
        tipo_criacao: p.tipoCriacao,
        quantidade_animais: p.quantidadeAnimais,
        finalidade: p.finalidade,
        experiencia: p.experiencia,
      });

      if (!error) {
        navigate({ to: "/feed" });
      } else {
        alert("Erro ao salvar perfil: " + error.message);
      }
    }
    setLoading(false);
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 border-b border-border bg-card px-5 py-5">
          <button onClick={() => router.history.back()} aria-label="Voltar">
            <ArrowLeft className="h-7 w-7 text-brand-green" />
          </button>
          <h1 className="text-3xl font-extrabold text-foreground">Cadastro</h1>
        </header>
        
        <main className="px-5 py-6">
          {step === 1 ? (
            <form onSubmit={handleCreateAccount} className="space-y-5">
              <h2 className="text-xl font-bold text-foreground">Crie sua conta de acesso</h2>
              <p className="text-muted-foreground text-sm">Você usará esse e-mail e senha para entrar no aplicativo depois.</p>
              
              {errorMsg && <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm font-medium">{errorMsg}</div>}
              
              <label className="block">
                <span className="mb-2 block text-lg font-bold text-foreground">E-mail <span className="text-brand-green">*</span></span>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-lg text-foreground outline-none focus:border-brand-green"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-lg font-bold text-foreground">Senha <span className="text-brand-green">*</span></span>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-lg text-foreground outline-none focus:border-brand-green"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-brand-green py-4 text-xl font-bold text-primary-foreground shadow-card transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar Conta"}
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Dados da Propriedade</h2>
              <ProducerForm
                initial={producer}
                submitLabel={loading ? "Salvando..." : "Salvar e Entrar"}
                onSubmit={handleSaveProfile}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}