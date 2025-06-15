
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Euro } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DOMPurify from "dompurify";
import { useClients } from "@/hooks/useClients";

// Tipagem já definida no hook
// export interface Client {...}

export const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients = [], isLoading, error, createClient } = useClients();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.nif ?? client.tax_number ?? "").includes(searchTerm)
  );

  const ClientCreationForm = () => {
    const [form, setForm] = useState({
      name: "",
      nif: "",
      email: "",
      phone: "",
      creditLimit: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const sanitize = (value: string) => DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);

      // Constrói dados para o Supabase. No banco não existe creditLimit nem status
      const sanitized = {
        name: sanitize(form.name),
        nif: sanitize(form.nif.replace(/\D/g, "")),
        email: sanitize(form.email),
        phone: sanitize(form.phone),
      };
      createClient.mutate(
        {
          ...sanitized,
          is_active: true,
        },
        {
          onSuccess: () => {
            setForm({
              name: "",
              nif: "",
              email: "",
              phone: "",
              creditLimit: "",
            });
          },
          onSettled: () => setSubmitting(false),
        }
      );
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nome/Razão Social</Label>
          <Input id="name" value={form.name} onChange={handleChange} required disabled={submitting || createClient.isPending} />
        </div>
        <div>
          <Label htmlFor="nif">NIF</Label>
          <Input id="nif" value={form.nif.replace(/\D/g, "")} onChange={handleChange} minLength={9} maxLength={9} required disabled={submitting || createClient.isPending} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={handleChange} required disabled={submitting || createClient.isPending} />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={form.phone} onChange={handleChange} disabled={submitting || createClient.isPending} />
        </div>
        {/* creditLimit e status não estão no banco atual, se necessário depois cria campo */}
        <DialogFooter>
          <Button className="w-full" type="submit" disabled={submitting || createClient.isPending}>
            {submitting || createClient.isPending ? "A criar..." : "Criar Cliente"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

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
            <ClientCreationForm />
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
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Carregando...</div>
          ) : error ? (
            <div className="py-10 text-center text-destructive">Erro ao carregar clientes</div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{client.name}</h3>
                        {client.nif || client.tax_number ? (
                          <Badge variant="secondary">NIF: {client.nif || client.tax_number}</Badge>
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
                    <div className="text-right space-y-1">
                      {/* Limite e dívida são mock, mostrar só se quiser */}
                      {/* <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4" />
                        <span className="text-sm">
                          Limite: €{client.creditLimit?.toLocaleString()}
                        </span>
                      </div>
                      <div className={`text-sm ${client.currentDebt > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        Dívida: €{client.currentDebt?.toLocaleString()}
                      </div> */}
                      {/* Por ora, não exibimos essas infos pois não existem no banco */}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
