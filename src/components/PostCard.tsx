import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Share2, Bookmark, MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { useToggleLike, useDeletePost } from "@/lib/posts-store";

export type Comment = {
  id: string;
  author: string;
  text: string;
};

export type Post = {
  id: string;
  authorId: string;
  author: string;
  location: string;
  time: string;
  tag: string;
  body: string;
  likes: number;
  isLikedByMe?: boolean;
  media?: string | null;
  mediaType?: "image" | "video" | null;
  comments: Comment[];
};

export function PostCard({
  post,
  onComment,
  currentUserId,
}: {
  post: Post;
  onComment: (postId: string, comment: { text: string }) => void;
  currentUserId?: string | null;
}) {
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onComment(post.id, { text: text.trim() });
    setText("");
  }

  function handleDelete() {
    if (window.confirm("Certeza que deseja excluir esta publicação da comunidade?")) {
      deletePost({ postId: post.id, mediaUrl: post.media });
    }
  }

  const isMe = Boolean(currentUserId && post.authorId === currentUserId);

  const authorHeader = (
    <>
      <Avatar name={post.author} />
      <div className="min-w-0 text-left">
        <h2 className="truncate text-lg font-bold text-foreground hover:underline">
          {post.author}
        </h2>
        <p className="truncate text-sm text-muted-foreground">
          {post.location} • {post.time}
        </p>
      </div>
    </>
  );

  return (
    <article className={`overflow-hidden rounded-3xl bg-card shadow-card transition-all ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Cabeçalho do Post */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          {isMe ? (
            <Link to="/perfil" className="flex min-w-0 items-center gap-3">
              {authorHeader}
            </Link>
          ) : (
            <Link
              to="/produtor/$id"
              params={{ id: post.authorId }}
              className="flex min-w-0 items-center gap-3"
            >
              {authorHeader}
            </Link>
          )}

          {/* Botão Apagar: Visível apenas para o Dono */}
          {isMe && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Deletar publicação"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          )}
        </div>

        <span className="mt-4 inline-flex rounded-full bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand-green-deep">
          {post.tag}
        </span>

        <p className="mt-3 text-[17px] leading-relaxed text-foreground">{post.body}</p>
      </div>

      {post.media ? (
        post.mediaType === "video" ? (
          <video
            src={post.media}
            controls
            className="aspect-square w-full bg-muted object-cover"
          />
        ) : (
          <img
            src={post.media}
            alt={`Publicação de ${post.author}`}
            loading="lazy"
            className="aspect-square w-full bg-muted object-cover"
          />
        )
      ) : null}

      {/* Barra de Ações (Estilo Instagram) */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-muted-foreground">
        {/* Botão de Curtir com Animação Otimista */}
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={`flex items-center gap-2 text-sm font-medium transition-transform active:scale-90 ${
            post.isLikedByMe ? "text-brand-orange" : "hover:text-foreground"
          }`}
        >
          <Heart
            className="h-5 w-5 transition-colors"
            fill={post.isLikedByMe ? "currentColor" : "none"}
          />
          <span className="font-semibold">{post.likes}</span>
        </button>

        {/* Botão de Comentários */}
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-green ${
            showComments ? "text-brand-green" : ""
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">{post.comments.length}</span>
        </button>

        {/* Botão de Compartilhar */}
        <button
          type="button"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              void navigator.share({
                title: `Publicação de ${post.author} no AGRYON`,
                text: post.body,
                url: window.location.href,
              });
            }
          }}
          className="flex items-center gap-2 text-sm font-medium hover:text-foreground"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* Botão de Salvar Post */}
        <button
          type="button"
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            saved ? "text-brand-green" : "hover:text-foreground"
          }`}
        >
          <Bookmark className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Caixa de Comentários */}
      {showComments ? (
        <div className="border-t border-border bg-muted/30 px-5 py-4">
          <ul className="max-h-60 space-y-3 overflow-y-auto pr-1">
            {post.comments.length === 0 ? (
              <li className="py-2 text-center text-sm text-muted-foreground">
                Nenhum comentário ainda. Seja o primeiro a responder!
              </li>
            ) : null}
            {post.comments.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <Avatar name={c.author} size={32} />
                <div className="min-w-0 flex-1 rounded-2xl bg-card p-3 shadow-xs">
                  <p className="text-xs font-bold text-foreground">{c.author}</p>
                  <p className="mt-0.5 text-sm text-foreground">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={submit} className="mt-4 flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Adicionar um comentário..."
              className="min-w-0 flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-brand-green"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              aria-label="Enviar comentário"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-orange text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      ) : null}
    </article>
  );
}