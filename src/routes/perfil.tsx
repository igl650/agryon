import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Pencil, Share2, UserPlus, LogIn, LogOut } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ProducerForm } from "@/components/ProducerForm";
import { ProfileView, profileButton } from "@/components/ProfileView";
import { useProducer, useProducerProfile, type Producer, emptyProducer } from "@/lib/profile";
import { usePosts } from "@/lib/posts-store";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
});

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agryon.dark") === "1";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("agryon.dark", next ? "1" : "0");
    document.documentElement.classList.toggle("dark", next);
  }

  return { toggleDark };
}

function PerfilPage() {
  const navigate = useNavigate();
  const { toggleDark } = useDarkMode();
  const { producer, setProducer, ready, user } = useProducer();
  const { data: myProfileStats } = useProducerProfile(user?.id);
  const { data: allPosts = [] } = usePosts();
  
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveEdits(p: Producer) {
    if (!producer?.id) return;
    setSaving(true);
    await supabase.from("profiles").update({
      nome: p.nome,
      municipio: p.municipio,
      estado: p.estado,
      idade: p.idade,
      tipo_criacao: p.tipoCriacao,
      quantidade_animais: p.quantidadeAnimais,
      finalidade: p.finalidade,
      experiencia: p.experiencia,
    }).eq("id", producer.id);

    setProducer({ id: producer.id, ...p });
    setEditing(false);
    setSaving(false);
  }

  async function handleCompleteProfile(p: Producer) {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
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
      setProducer({ id: user.id, ...p });
    } else {
      alert("Erro ao salvar: " + error.message);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background pb-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <main className="mx-auto max-w-md px-5 py-10">
          <div className="rounded-3xl bg-card p-6 text-center shadow-card">
            <h1 className="text-2xl font-extrabold text-foreground">Você é um visitante</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie uma conta gratuita ou faça login para ter seu próprio espaço e participar da comunidade.
            </p>
            <Link to="/cadastro" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90">
              <UserPlus className="h-5 w-5" /> Criar minha conta
            </Link>
            <Link to="/login" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green-deep py-4 text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90">
              <LogIn className="h-5 w-5" /> Acessar minha conta
            </Link>
          </div>
          <button onClick={toggleDark} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-lg font-bold text-foreground">
            <Moon className="h-5 w-5" /> Alternar Modo Escuro
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (user && !producer) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <main className="mx-auto max-w-md px-5 py-8">
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h1 className="mb-2 text-2xl font-extrabold text-foreground">Complete seu Perfil</h1>
            <p className="mb-6 text-sm text-muted-foreground">Só falta preencher os dados da sua propriedade para finalizar o seu cadastro no AGRYON.</p>
            <ProducerForm initial={emptyProducer} submitLabel={saving ? "Concluindo..." : "Concluir Meu Perfil"} onSubmit={handleCompleteProfile} />
          </div>
          <button onClick={handleLogout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 py-4 text-base font-bold text-destructive">
            <LogOut className="h-5 w-5" /> Cancelar / Sair
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const mine = allPosts.filter((p: any) => p.authorId === producer?.id);
  const username = myProfileStats?.username || producer?.nome.toLowerCase().replace(/[^a-z]/g, "") || "produtor";

  return (
    <ProfileView
      isSelf
      userId={producer?.id} // <-- AQUI ENTRA A PASSAGEM DO ID (Permite o clique nos Followers)
      username={username}
      name={producer!.nome}
      bio={`Criador de ${producer!.tipoCriacao || "animais"} • ${producer!.quantidadeAnimais || "0"} cabeças • ${producer!.finalidade || "Misto"}`}
      location={`${producer!.municipio} - ${producer!.estado}`}
      stats={{
        posts: mine.length,
        followers: myProfileStats?.stats.followers || 0,
        following: myProfileStats?.stats.following || 0,
      }}
      posts={mine}
      actions={
        <>
          <button onClick={() => setEditing((v) => !v)} className={`${profileButton} border border-border bg-secondary text-foreground`}>
            <Pencil className="h-4 w-4" /> Editar Perfil
          </button>
          <button onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              void navigator.share({ title: producer!.nome, url: window.location.href });
            }
          }} className={`${profileButton} border border-border bg-secondary text-foreground`}>
            <Share2 className="h-4 w-4" /> Compartilhar
          </button>
        </>
      }
    >
      <div className="px-5 py-4">
        {editing ? (
          <div className="mb-4 rounded-3xl bg-card p-5 shadow-card">
            <h2 className="mb-4 text-xl font-extrabold text-foreground">Editar Dados</h2>
            <ProducerForm initial={producer!} submitLabel={saving ? "Salvando..." : "Salvar Alterações"} onSubmit={saveEdits} />
          </div>
        ) : null}
        
        <button onClick={toggleDark} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-base font-bold text-foreground transition-all active:scale-95">
          <Moon className="h-5 w-5" /> Alternar Modo Escuro
        </button>

        <button onClick={handleLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 py-4 text-base font-bold text-destructive transition-colors hover:bg-destructive hover:text-white">
          <LogOut className="h-5 w-5" /> Sair da Conta
        </button>
      </div>
    </ProfileView>
  );
}