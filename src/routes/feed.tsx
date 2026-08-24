import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ImagePlus, Plus, X, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PostCard } from "@/components/PostCard";
import { usePosts, useCreatePost, useCreateComment } from "@/lib/posts-store";
import { useProducer } from "@/lib/profile";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed Rural — AGRYON" },
      { name: "description", content: "Relatos, dúvidas e soluções compartilhadas pela comunidade." },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const { data: posts = [], isLoading } = usePosts();
  const { mutate: createPost, isPending: isPosting } = useCreatePost();
  const { mutate: createComment } = useCreateComment();
  const { user, producer } = useProducer();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const emptyDraft = {
    titulo: "",
    body: "",
    tag: "Sanidade",
    raca: "",
    afetados: "",
    municipio: producer?.municipio ? `${producer.municipio} - ${producer.estado}` : "",
  };

  const [draft, setDraft] = useState(emptyDraft);
  const [media, setMedia] = useState<{ url: string; type: "image" | "video"; file: File } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMedia({
      url: URL.createObjectURL(file), // Usado apenas para preview local na tela
      type: file.type.startsWith("video") ? "video" : "image",
      file, // Este é o arquivo real que a nossa store enviará para a nuvem
    });
  }

  function removeMedia() {
    setMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.titulo.trim() || !draft.body.trim() || !draft.municipio.trim()) return;
    if (!user) return alert("Você precisa estar logado para publicar!");

    // Constrói informações secundárias apenas se foram preenchidas
    const extraInfo = [
      draft.raca.trim() ? `Raça: ${draft.raca.trim()}` : null,
      draft.afetados.trim() ? `Afetados: ${draft.afetados.trim()}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    // Monta o texto final
    const formattedBody = `${draft.titulo.trim()} — “${draft.body.trim()}”${
      extraInfo ? ` (${extraInfo})` : ""
    }`;

    // Dispara a Mutation criada no posts-store.ts com o arquivo de mídia incluso!
    createPost(
      {
        newPost: {
          author_id: user.id,
          location: draft.municipio.trim(),
          tag: draft.tag,
          body: formattedBody,
        },
        file: media?.file, // <- Enviando o arquivo para o supabase.storage
      },
      {
        onSuccess: () => {
          setDraft(emptyDraft);
          removeMedia();
          setOpen(false);
        },
      }
    );
  }

  function handleComment(postId: string, commentData: { text: string }) {
    if (!user) return alert("Faça login para comentar.");

    createComment({
      post_id: postId,
      author_id: user.id,
      text: commentData.text,
    });
  }

  return (
    <AppShell
      title="Feed Rural"
      action={
        <button
          onClick={() => {
            if (!user) return alert("Você precisa entrar na sua conta para relatar.");
            // Atualiza o default caso a conta do perfil tenha carregado instantes depois da tela
            if (!draft.municipio && producer?.municipio) {
              setDraft((d) => ({ ...d, municipio: `${producer.municipio} - ${producer.estado}` }));
            }
            setOpen(true);
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-green/10 px-3.5 py-1.5 text-sm font-bold text-brand-green transition-opacity hover:opacity-80 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Relatar
        </button>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand-green" />
            <p className="text-sm font-medium">Carregando publicações...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-card">
            <p className="text-lg font-bold text-foreground">Nenhum relato no momento</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Seja o primeiro produtor a compartilhar um manejo ou dúvida com a comunidade!
            </p>
          </div>
        ) : (
          posts.map((p: any) => (
            <PostCard
              key={p.id}
              post={p}
              currentUserId={user?.id}
              onComment={handleComment}
            />
          ))
        )}
      </div>

      {/* MODAL DE PUBLICAR (RELATAR) */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-xs"
          onClick={() => !isPosting && setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-extrabold text-foreground">Registrar no Feed</h2>
              <button
                onClick={() => setOpen(false)}
                disabled={isPosting}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={submit}>
              <ModalField label="Título do Relato / Dúvida" required>
                <input
                  required
                  value={draft.titulo}
                  onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
                  placeholder="Ex: Queda repentina na produção"
                  className={modalInput}
                />
              </ModalField>

              <ModalField label="Descrição Detalhada" required>
                <textarea
                  required
                  rows={3}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  placeholder="Conte o que aconteceu, manejos que utilizou ou os sintomas observados..."
                  className={modalInput}
                />
              </ModalField>

              <ModalField label="Categoria" required>
                <select
                  required
                  value={draft.tag}
                  onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                  className={modalInput}
                >
                  {["Sanidade", "Alimentação", "Manejo", "Água", "Reprodução"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </ModalField>

              <div className="grid grid-cols-2 gap-3">
                <ModalField label="Raça do Rebanho">
                  <input
                    value={draft.raca}
                    onChange={(e) => setDraft({ ...draft, raca: e.target.value })}
                    placeholder="Ex: Boer, Dorper..."
                    className={modalInput}
                  />
                </ModalField>

                <ModalField label="Animais Afetados">
                  <input
                    type="number"
                    value={draft.afetados}
                    onChange={(e) => setDraft({ ...draft, afetados: e.target.value })}
                    placeholder="Ex: 5"
                    className={modalInput}
                  />
                </ModalField>
              </div>

              <ModalField label="Município / Região" required>
                <input
                  required
                  value={draft.municipio}
                  onChange={(e) => setDraft({ ...draft, municipio: e.target.value })}
                  placeholder="Ex: Uauá - BA"
                  className={modalInput}
                />
              </ModalField>

              {/* SELETOR FOTO/VÍDEO RESPONSIVO PARA MOBILE */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden" // Esconde input feio
                />

                {!media ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-brand-green hover:text-brand-green"
                  >
                    <ImagePlus className="h-5 w-5" />
                    Adicionar Foto ou Vídeo
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
                    {media.type === "video" ? (
                      <video src={media.url} className="aspect-video w-full object-cover" controls />
                    ) : (
                      <img src={media.url} alt="Preview da mídia" className="aspect-video w-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1.5 text-background backdrop-blur-xs transition-opacity hover:opacity-80"
                      title="Remover mídia selecionada"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* BOTÃO FINAL DE SUBMIT */}
              <button
                type="submit"
                disabled={isPosting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando e Salvando...
                  </>
                ) : (
                  "Publicar no Feed"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

const modalInput =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-green";

function ModalField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label} {required ? <span className="text-brand-green">*</span> : null}
      </span>
      {children}
    </label>
  );
}