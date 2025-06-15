
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client } from "@/hooks/useClients";

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  error: unknown;
  filteredClients: Client[];
}

export const ClientList = ({
  clients,
  isLoading,
  error,
  filteredClients
}: ClientListProps) => {
  if (isLoading) {
    return <div className="py-10 text-center text-muted-foreground">Carregando...</div>;
  }
  if (error) {
    return <div className="py-10 text-center text-destructive">Erro ao carregar clientes</div>;
  }
  return (
    <div className="space-y-4">
      {filteredClients.map((client) => (
        <div key={client.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">{client.name}</h3>
                {client.tax_number ? (
                  <Badge variant="secondary">NIF: {client.tax_number}</Badge>
                ) : null}
                <Badge variant={client.is_active === false ? "secondary" : "default"}>
                  {client.is_active === false ? "Inativo" : "Ativo"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{client.email}</span>
                <span>{client.phone}</span>
              </div>
            </div>
            <div className="ml-4">
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
