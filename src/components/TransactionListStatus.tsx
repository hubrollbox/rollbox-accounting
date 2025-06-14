
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

interface TransactionListStatusProps {
  isLoading: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
}

export function TransactionListStatus({
  isLoading,
  isError,
  isEmpty,
  errorMessage,
}: TransactionListStatusProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-10 gap-3 animate-fade-in">
        <Loader className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">A carregar transações…</p>
        <Skeleton className="w-full h-24 max-w-sm mt-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-10 gap-2 animate-fade-in">
        <span className="text-destructive">Erro ao carregar transações</span>
        {errorMessage && (
          <p className="text-xs text-muted-foreground text-center">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-40 animate-fade-in">
        <p className="text-muted-foreground text-sm">Sem transações registadas.</p>
      </div>
    );
  }

  return null;
}
