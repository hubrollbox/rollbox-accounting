
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tax_number?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  is_active?: boolean;
  country?: string;
}

export function useSuppliers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Supplier[];
    },
    enabled: !!user
  });

  const createSupplier = useMutation({
    mutationFn: async (supplier: Omit<Supplier, "id">) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ ...supplier, user_id: user?.id })
        .select("*")
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => {
      toast({ title: "Fornecedor criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar fornecedor", description: error.message, variant: "destructive" });
    }
  });

  return { ...query, createSupplier };
}
