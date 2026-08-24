import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useQuery } from "@tanstack/react-query";

export type Producer = {
  id?: string;
  nome: string;
  municipio: string;
  estado: string;
  idade: string;
  tipoCriacao: string;
  quantidadeAnimais: string;
  finalidade: string;
  experiencia: string;
};

export const emptyProducer: Producer = {
  nome: "",
  municipio: "",
  estado: "",
  idade: "",
  tipoCriacao: "",
  quantidadeAnimais: "",
  finalidade: "",
  experiencia: "",
};

export function useProducer() {
  const [producer, setProducer] = useState<Producer | null>(null);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile(sessionUser: any) {
      if (!sessionUser) {
        if (mounted) {
          setUser(null);
          setProducer(null);
          setReady(true);
        }
        return;
      }

      if (mounted) setUser(sessionUser);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (mounted) {
        if (data && !error) {
          setProducer({
            id: data.id,
            nome: data.nome,
            municipio: data.municipio || "",
            estado: data.estado || "",
            idade: data.idade || "",
            tipoCriacao: data.tipo_criacao || "",
            quantidadeAnimais: data.quantidade_animais || "",
            finalidade: data.finalidade || "",
            experiencia: data.experiencia || "",
          });
        } else {
          setProducer(null); // O usuário existe no Auth, mas não tem perfil na tabela
        }
        setReady(true);
      }
    }

    // Carrega na montagem
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user);
    });

    // Fica escutando mudanças na aba
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { producer, setProducer, ready, user };
}

export const tiposCriacao = ["Caprinos", "Ovinos", "Bovinos", "Aves", "Suínos", "Misto"];
export const finalidades = ["Corte", "Leite", "Reprodução / Genética", "Subsistência", "Misto"];

// Busca os dados de um produtor específico + total de seguidores e seguindo
export function useProducerProfile(id: string | undefined) {
  return useQuery({
    queryKey: ["producer-profile", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (error) throw error;
      
      // Conta seguidores
      const { count: followers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", id);
        
      // Conta quem ele segue
      const { count: following } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", id);
        
      return {
        ...data,
        username: data.username || data.nome.toLowerCase().replace(/[^a-z]/g, ""),
        stats: {
          followers: followers || 0,
          following: following || 0
        }
      };
    }
  });
}

// Retorna todos os produtores para a Aba Pesquisar (Rede de Produtores)
export function useCommunityProfiles() {
  return useQuery({
    queryKey: ["community-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome, username, municipio, estado");
      if (error) throw error;
      
      return data.map((p: any) => ({
        ...p,
        username: p.username || p.nome.toLowerCase().replace(/[^a-z]/g, "")
      }));
    }
  });
}
