
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema, TransactionFormData } from "@/schemas/transactionSchema";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TransactionForm({ onSubmit }: { onSubmit: (data: TransactionFormData) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionSchema),
    mode: "onTouched"
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto p-6 bg-card rounded-xl shadow space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Valor</label>
        <Input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className={cn(errors.amount && "border-destructive")}
        />
        {errors.amount && <span className="text-destructive text-sm">{errors.amount.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <Input
          {...register("description")}
          className={cn(errors.description && "border-destructive")}
        />
        {errors.description && <span className="text-destructive text-sm">{errors.description.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Data</label>
        <Input
          type="date"
          {...register("date")}
          className={cn(errors.date && "border-destructive")}
        />
        {errors.date && <span className="text-destructive text-sm">{errors.date.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Categoria</label>
        <select
          {...register("category")}
          className={cn("w-full px-2 py-2 border rounded", errors.category && "border-destructive")}
        >
          <option value="">Selecione...</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
          <option value="investimento">Investimento</option>
        </select>
        {errors.category && <span className="text-destructive text-sm">{errors.category.message}</span>}
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-primary text-white rounded font-semibold disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
