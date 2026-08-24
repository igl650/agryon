import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Grid3x3, X, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Avatar } from "@/components/Avatar";
import { useFollowList, useFollowing, useToggleFollow } from "@/lib/social";
import type { Post } from "@/lib/agryon-data";

export function ProfileView({
  userId,
  username,
  name,
  bio,
  location,
  stats,
  isSelf,
  actions,
  posts,
  children,
}: {
  userId?: string;
  username: string;
  name: string;
  bio: string;
  location: string;
  stats: { posts: number; followers: number; following: number };
  isSelf?: boolean;
  actions: ReactNode;
  posts: Post[];
  children?: ReactNode;
}) {
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  // Hook da lista de usuários que abre na Modal
  const { data: listData = [], isLoading: isListLoading } = useFollowList(userId, modalType);
  
  // Hooks para os botões de "Seguir" dentro da modal
  const { data: myFollowing = [] } = useFollowing();
  const { mutate: toggleFollow } = useToggleFollow();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-md">
        <header className="sticky top-0 z-30 border-b border-border bg-card px-5 py-4">
          <h1 className="text-center text-lg font-extrabold text-foreground">@{username}</h1>
        </header>

        <section className="bg-card px-5 pb-5 pt-5">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <Avatar name={name} size={84} />
              {isSelf ? (
                <button
                  aria-label="Alterar foto de perfil"
                  className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-brand-orange text-primary-foreground"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </button>
              ) : null}
            </div>

            <div className="grid flex-1 grid-cols-3 text-center">
              <Stat value={stats.posts} label="Publicações" />
              {/* Números Interativos */}
              <Stat 
                value={stats.followers} 
                label="Seguidores" 
                onClick={() => userId && setModalType("followers")} 
              />
              <Stat 
                value={stats.following} 
                label="Seguindo" 
                onClick={() => userId && setModalType("following")} 
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-base font-bold text-foreground">{name}</p>
            <p className="text-base text-foreground">{bio}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>

          <div className="mt-4 flex gap-3">{actions}</div>
        </section>

        {children}

        {/* Galeria */}
        <section className="mt-3">
          <div className="flex items-center justify-center gap-2 border-y border-border bg-card py-2 text-muted-foreground">
            <Grid3x3 className="h-5 w-5" />
            <span className="text-sm font-semibold">Publicações</span>
          </div>
          {posts.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground">
              Nenhuma publicação ainda.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-0.5">
              {posts.map((p) => (
                <div key={p.id} className="aspect-square bg-muted">
                  {p.media ? (
                    p.mediaType === "video" ? (
                      <video src={p.media} className="h-full w-full object-cover" muted />
                    ) : (
                      <img src={p.media} alt={p.tag} loading="lazy" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="grid h-full place-items-center bg-brand-soft p-2 text-center text-xs font-semibold text-brand-green-deep">
                      {p.tag}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomNav />

      {/* Modal Redes Sociais do Instagram */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-xs"
          onClick={() => setModalType(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-card shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-extrabold text-foreground">
                {modalType === "followers" ? "Seguidores" : "Seguindo"}
              </h2>
              <button
                onClick={() => setModalType(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isListLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
                </div>
              ) : listData.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum produtor encontrado.
                </p>
              ) : (
                <ul className="space-y-4">
                  {listData.map((u: any) => {
                    const isFollowingUser = myFollowing.includes(u.id);
                    return (
                      <li key={u.id} className="flex items-center gap-3">
                        <Link to="/produtor/$id" params={{ id: u.id }} onClick={() => setModalType(null)} className="shrink-0">
                          <Avatar name={u.nome} size={42} />
                        </Link>
                        <Link to="/produtor/$id" params={{ id: u.id }} onClick={() => setModalType(null)} className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground hover:underline">{u.nome}</p>
                          <p className="truncate text-xs text-muted-foreground">@{u.username}</p>
                        </Link>
                        
                        {/* Se o item da lista não for o próprio usuário, mostra o botão seguir */}
                        {u.id !== userId && (
                          <button
                            onClick={() => toggleFollow(u.id)}
                            className={`shrink-0 rounded-lg px-4 py-1.5 text-xs font-bold transition-transform active:scale-95 ${
                              isFollowingUser
                                ? "border border-border bg-muted text-foreground"
                                : "bg-brand-orange text-primary-foreground"
                            }`}
                          >
                            {isFollowingUser ? "Seguindo" : "Seguir"}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, onClick }: { value: number; label: string; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={onClick ? "cursor-pointer rounded-lg p-1 transition-colors hover:bg-muted" : "p-1"}>
      <p className="text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </Tag>
  );
}

export const profileButton =
  "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-opacity hover:opacity-90";