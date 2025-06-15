
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClients } from "@/hooks/useClients";
import { ClientCreationForm } from "./ClientCreationForm";
import { ClientList } from "./ClientList";

export const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients = [], isLoading, error, createClient } = useClients();

  // Filtering uses client.tax_number per Supabase schema
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.tax_number ?? "").includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Gestão de Clientes
          </h2>
          <p className="text-muted-foreground">
            Gerir clientes, limites de crédito e contas correntes
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Introduza os dados do cliente
              </DialogDescription>
            </DialogHeader>
            <ClientCreationForm createClient={createClient} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                {filteredClients.length} clientes encontrados
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou NIF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClientList clients={clients} isLoading={isLoading} error={error} filteredClients={filteredClients} />
        </CardContent>
      </Card>
    </div>
  );
};
