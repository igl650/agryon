import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { toast } from "sonner";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const myId = user?.id || null;

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:author_id(nome, username, municipio, estado),
          comments( id, text, profiles:author_id(nome) ),
          post_likes(user_id) 
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((post: any) => ({
        id: post.id,
        authorId: post.author_id,
        author: post.profiles?.nome || "Desconhecido",
        location: post.profiles?.municipio ? `${post.profiles.municipio} - ${post.profiles.estado}` : "",
        time: new Date(post.created_at).toLocaleDateString("pt-BR"),
        tag: post.tag,
        body: post.body,
        likes: post.post_likes?.length || 0,
        isLikedByMe: myId ? post.post_likes.some((l: any) => l.user_id === myId) : false,
        media: post.media_url || null,
        mediaType: post.media_type || null,
        comments: (post.comments || []).map((c: any) => ({
          id: c.id,
          author: c.profiles?.nome || "Desconhecido",
          text: c.text,
        })),
      }));
    },
  });
}

// Hook de Curtida Otimista
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Você não está autorizado.");

      const posts = queryClient.getQueryData<any[]>(["posts"]);
      const post = posts?.find((p) => p.id === postId);

      if (post?.isLikedByMe) {
        const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              isLikedByMe: !post.isLikedByMe,
              likes: post.isLikedByMe ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        });
      });
      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      toast.error('Erro de conexão ao curtir.');
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// Hook de Upload Real e Criação de Post
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newPost, file }: { newPost: any; file?: File | null }) => {
      let media_url = null;
      let media_type = null;

      // Se houver arquivo, sobe para o Supabase Storage primeiro
      if (file) {
        const fileExt = file.name.split('.').pop();
        // Nome único da pasta pra evitar colisão (autor/data_criacao)
        const fileName = `${newPost.author_id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        // Pega a URL Publica gerada
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
        media_url = publicUrlData.publicUrl;
        media_type = file.type.startsWith("video") ? "video" : "image";
      }

      // Agora insere no banco passando a URL da nuvem!
      const { error } = await supabase.from("posts").insert({
        ...newPost,
        media_url,
        media_type
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Relato publicado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(`Falha ao publicar: ${error.message}`);
    }
  });
}

// Hook Profissional de Deleção (Limpa Banco e Storage)
export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, mediaUrl }: { postId: string, mediaUrl?: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Acesso negado.");

      // Limpeza Inteligente: Se existir uma imagem/video, descubra o caminho e apague da nuvem
      if (mediaUrl && mediaUrl.includes('/storage/v1/object/public/media/')) {
        const path = mediaUrl.split('/storage/v1/object/public/media/')[1];
        if (path) {
          await supabase.storage.from('media').remove([path]);
        }
      }

      // Agora deleta a linha do Postgres (Os likes/comentarios sumirao por causa do ON DELETE CASCADE)
      const { error } = await supabase.from('posts').delete().eq('id', postId).eq('author_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Publicação apagada.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });
}

// Comentar
export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newComment: { post_id: string; author_id: string; text: string }) => {
      const { error } = await supabase.from("comments").insert(newComment);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}