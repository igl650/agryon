import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "@/lib/supabase.server";

// Alterna a curtida de um Post associada ao usuário autenticado (através de cookies)
export const toggleLikeFn = createServerFn({ method: "POST" })
  .validator((postId: string) => postId)
  .handler(async ({ data: postId }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Não autorizado");

    // Verifica se já curtiu
    const { data: existingLike } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (existingLike) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      // Decrementa na tabela posts (-1)
      await supabase.rpc('decrement_like', { row_id: postId }); // (Opcional, ou faça fallback localmente/DB Trigger) 
      return { liked: false };
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      // Incrementa na tabela posts (+1)
      await supabase.rpc('increment_like', { row_id: postId }); 
      return { liked: true };
    }
  });

// Alterna Seguidores
export const toggleFollowFn = createServerFn({ method: "POST" })
  .validator((producerId: string) => producerId)
  .handler(async ({ data: producerId }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Não autorizado");

    const { data: existingFollow } = await supabase
      .from("follows")
      .select("following_id")
      .eq("following_id", producerId)
      .eq("follower_id", user.id)
      .single();

    if (existingFollow) {
      await supabase.from("follows").delete().eq("following_id", producerId).eq("follower_id", user.id);
      return { following: false };
    } else {
      await supabase.from("follows").insert({ following_id: producerId, follower_id: user.id });
      return { following: true };
    }
  });