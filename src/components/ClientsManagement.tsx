import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Euro } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DOMPurify from "dompurify";

export const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const clients = [
    {
      id: 1,
      name: "Empresa ABC Lda",
      nif: "123456789",
      email: "geral@empresaabc.pt",
      phone: "+351 912 345 678",
      creditLimit: 5000,
      currentDebt: 1250,
      status: "Ativo"
    },
    {
      id: 2,
      name: "João Silva",
      nif: "987654321",
      email: "joao.silva@email.pt",
      phone: "+351 918 765 432",
      creditLimit: 2000,
      currentDebt: 0,
      status: "Ativo"
    },
    {
      id: 3,
      name: "Tech Solutions Unipessoal",
      nif: "555444333",
      email: "info@techsolutions.pt",
      phone: "+351 933 222 111",
      creditLimit: 10000,
      currentDebt: 3200,
      status: "Ativo"
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nif.includes(searchTerm)
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
      // Sanitize all input fields before usage
      const sanitized = {
        name: sanitize(form.name),
        nif: sanitize(form.nif.replace(/\D/g, "")),
        email: sanitize(form.email),
        phone: sanitize(form.phone),
        creditLimit: sanitize(form.creditLimit),
      };
      // Here you would usually submit to your backend
      // For demo purposes, just log the sanitized object
      console.log("Sanitized Client:", sanitized);
      setSubmitting(false);
      // Optionally, clear form or close dialog, and show a toast
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nome/Razão Social</Label>
          <Input id="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="nif">NIF</Label>
          <Input id="nif" value={form.nif.replace(/\D/g, "")} onChange={handleChange} minLength={9} maxLength={9} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="creditLimit">Limite de Crédito (€)</Label>
          <Input id="creditLimit" type="number" value={form.creditLimit} onChange={handleChange} />
        </div>
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "A criar..." : "Criar Cliente"}
        </Button>
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
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{client.name}</h3>
                      <Badge variant="secondary">NIF: {client.nif}</Badge>
                      <Badge variant={client.status === "Ativo" ? "default" : "secondary"}>
                        {client.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{client.email}</span>
                      <span>{client.phone}</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span className="text-sm">
                        Limite: €{client.creditLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-sm ${client.currentDebt > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      Dívida: €{client.currentDebt.toLocaleString()}
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
        </CardContent>
      </Card>
    </div>
  );
};
