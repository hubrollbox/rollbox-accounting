
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionListStatus } from "@/components/TransactionListStatus";

export default function TransactionsPage() {
  const { data, isLoading, error } = useTransactions();

  const isEmpty = !isLoading && Array.isArray(data) && data.length === 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Transações</h2>
      <TransactionListStatus
        isLoading={isLoading}
        isError={!!error}
        isEmpty={isEmpty}
        errorMessage={error?.message}
      />
      {!isLoading && !!data && data.length > 0 && (
        <ul className="divide-y divide-border animate-fade-in">
          {data.map((tx) => (
            <li key={tx.id} className="py-3 flex justify-between">
              <span>{tx.document_number || "Sem doc."}</span>
              <span className="font-semibold">{Number(tx.amount).toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
