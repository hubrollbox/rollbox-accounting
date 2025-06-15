
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  name: string;
  nif?: string;
  email?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  is_active?: boolean;
}

export function useClients() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user
  });

  const createClient = useMutation({
    mutationFn: async (client: Omit<Client, "id">) => {
      const { data, error } = await supabase
        .from("clients")
        .insert({ ...client, user_id: user?.id })
        .select("*")
        .single();
      if (error) throw error;
      return data as Client;
    },
    onSuccess: () => {
      toast({ title: "Cliente criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar cliente", description: error.message, variant: "destructive" });
    },
  });

  return { ...query, createClient };
}
