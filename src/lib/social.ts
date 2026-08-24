import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { toast } from "sonner";

export function useFollowing() {
  return useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);
        
      if (error) throw error;
      return data.map((f: any) => f.following_id) as string[];
    },
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (producerId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Você não está autorizado.");

      const followingIds = queryClient.getQueryData<string[]>(["following"]) || [];
      const isFollowing = followingIds.includes(producerId);

      if (isFollowing) {
        const { error } = await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", producerId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("follows").insert({ follower_id: user.id, following_id: producerId });
        if (error) throw error;
      }
    },
    onMutate: async (producerId) => {
      await queryClient.cancelQueries({ queryKey: ["following"] });
      const previous = queryClient.getQueryData<string[]>(["following"]);
      
      queryClient.setQueryData<string[]>(["following"], (old = []) => {
        if (old.includes(producerId)) return old.filter((id) => id !== producerId);
        return [...old, producerId];
      });
      
      return { previous };
    },
    onError: (err, id, context) => {
      toast.error("Erro de conexão ao seguir.");
      queryClient.setQueryData(["following"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["producer-profile"] }); 
    }
  });
}

// NOVO: Busca as pessoas que seguem ou que são seguidas por um perfil
export function useFollowList(userId: string | undefined, type: "followers" | "following" | null) {
  return useQuery({
    queryKey: ["follow-list", userId, type],
    enabled: !!userId && !!type, // Só dispara se a modal estiver aberta (type != null)
    queryFn: async () => {
      const columnToFilter = type === "followers" ? "following_id" : "follower_id";
      const columnToSelect = type === "followers" ? "follower_id" : "following_id";
      
      const { data: followRows, error } = await supabase
        .from("follows")
        .select(columnToSelect)
        .eq(columnToFilter, userId);
        
      if (error) throw error;
      if (!followRows || followRows.length === 0) return [];
      
      const ids = followRows.map(r => r[columnToSelect]);
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nome, username, municipio, estado")
        .in("id", ids);
        
      if (profilesError) throw profilesError;
      
      return profiles.map(p => ({
        ...p,
        username: p.username || p.nome.toLowerCase().replace(/[^a-z]/g, "")
      }));
    }
  });
}