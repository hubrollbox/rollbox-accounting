
import { z } from "zod";

export const TransactionSchema = z.object({
  amount: z.number({ invalid_type_error: "Valor obrigatório" }).positive("Valor deve ser positivo"),
  description: z.string().min(5, "Descrição muito curta"),
  date: z.coerce.date({ invalid_type_error: "Data obrigatória" }),
  category: z.enum(["receita", "despesa", "investimento"], {
    errorMap: () => ({ message: "Selecione a categoria" }),
  }),
});

export type TransactionSchemaType = z.infer<typeof TransactionSchema>;
