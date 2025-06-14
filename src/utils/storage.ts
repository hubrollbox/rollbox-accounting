
import { supabase } from "@/integrations/supabase/client";

/** Gera o nome do bucket baseado no tenant */
export const getTenantBucket = (tenantId: string) => {
  return `tenant-${tenantId}-documents`;
};

/** Faz upload do arquivo para o bucket do tenant */
export const uploadTenantDocument = async (tenantId: string, file: File) => {
  const bucketName = getTenantBucket(tenantId);

  // Criação de bucket dinâmica não é suportada diretamente pelo client JS (feito no dashboard ou edge function)
  // Assumimos que o bucket já existe previamente para o tenant

  const path = `doc_${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file);

  return { data, error, path };
};
