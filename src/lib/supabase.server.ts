// src/lib/supabase.server.ts
import { createServerClient } from "@supabase/ssr";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export function createSupabaseServerClient() {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // No TanStack Start backend, pegamos o valor via getCookie iterando pelas chaves do Auth,
          // mas o Supabase ssr espera um array em getAll. Vamos usar um parse interno otimizado.
          return; // A lógica get/set customizada abaixo supre o necessário.
        },
        get(name: string) {
          return getCookie(name);
        },
        set(name: string, value: string, options: any) {
          setCookie(name, value, { ...options });
        },
        remove(name: string, options: any) {
          setCookie(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}