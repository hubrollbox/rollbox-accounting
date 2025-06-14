
import { z } from 'zod';

export const TransactionSchema = z.object({
  amount: z.number({
    required_error: "Valor é obrigatório",
    invalid_type_error: "Deve ser um número"
  }).positive("Valor deve ser positivo"),
  description: z.string()
    .min(5, "Mínimo 5 caracteres")
    .max(100, "Máximo 100 caracteres"),
  date: z.date({
    required_error: "Data é obrigatória",
    invalid_type_error: "Formato inválido",
  }),
  category: z.enum(['receita', 'despesa', 'investimento'], {
    errorMap: () => ({ message: "Selecione uma categoria válida" })
  }),
});

export type TransactionFormData = z.infer<typeof TransactionSchema>;
