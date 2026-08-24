import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { ProfileView, profileButton } from "@/components/ProfileView";
import { useProducerProfile } from "@/lib/profile";
import { usePosts } from "@/lib/posts-store";
import { useFollowing, useToggleFollow } from "@/lib/social";

export const Route = createFileRoute("/produtor/$id")({
  component: ProducerProfile,
});

function ProducerProfile() {
  const { id } = Route.useParams();
  const { data: producer, isLoading } = useProducerProfile(id);
  const { data: allPosts = [] } = usePosts();
  
  const { data: followingList = [] } = useFollowing();
  const { mutate: toggleFollow } = useToggleFollow();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background pb-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (!producer) return <ProducerNotFound />;

  const mine = allPosts.filter((p: any) => p.authorId === producer.id);
  const isUserFollowing = followingList.includes(producer.id);

  return (
    <ProfileView
      userId={producer.id} // <-- AQUI ENTRA A PASSAGEM DO ID PARA O OUTRO PRODUTOR
      username={producer.username}
      name={producer.nome}
      bio={`Criador de ${producer.tipo_criacao || "animais"} • ${producer.quantidade_animais || "0"} cabeças • ${producer.finalidade || "Misto"}`}
      location={`${producer.municipio} - ${producer.estado}`}
      stats={{
        posts: mine.length,
        followers: producer.stats.followers,
        following: producer.stats.following,
      }}
      posts={mine}
      actions={
        <>
          <button
            onClick={() => toggleFollow(producer.id)}
            className={`${profileButton} transition-all active:scale-95 ${
              isUserFollowing
                ? "border border-border bg-secondary text-foreground"
                : "bg-brand-orange text-primary-foreground"
            }`}
          >
            {isUserFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isUserFollowing ? "Seguindo" : "Seguir"}
          </button>
          <button className={`${profileButton} border border-border bg-secondary text-foreground`}>
            <MessageSquare className="h-4 w-4" /> Mensagem
          </button>
        </>
      }
    />
  );
}

function ProducerNotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Produtor não encontrado</h1>
        <Link to="/pesquisar" className="mt-4 inline-block font-bold text-brand-green">
          Voltar para a comunidade
        </Link>
      </div>
    </div>
  );
}