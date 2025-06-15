import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogModalHeader,
  DialogTitle as DialogModalTitle,
  DialogDescription as DialogModalDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSuppliers } from "@/hooks/useSuppliers";

export const SuppliersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Busca fornecedores em Supabase
  const { data: suppliers = [], isLoading, error, createSupplier } = useSuppliers();

  // Estado para novo fornecedor
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    tax_number: "",
    city: "",
  });

  // Apenas exibe a UI, não salva ainda
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSupplier({
      ...newSupplier,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    createSupplier.mutate(
      {
        name: newSupplier.name,
        email: newSupplier.email,
        phone: newSupplier.phone,
        tax_number: newSupplier.tax_number,
        city: newSupplier.city,
        // outros campos são opcionais e preenchidos pelo backend
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNewSupplier({
            name: "",
            email: "",
            phone: "",
            tax_number: "",
            city: "",
          });
        },
      }
    );
    // O toast será disparado pelo próprio hook em caso de sucesso/erro
  };

  // Filtro simples pelo nome/cidade
  const filteredSuppliers = suppliers.filter((supplier: any) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.city && supplier.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Fornecedores</h2>
          <p className="text-muted-foreground">
            Gerir informações dos fornecedores da empresa
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogModalHeader>
              <DialogModalTitle>Novo Fornecedor</DialogModalTitle>
              <DialogModalDescription>
                Preencha os dados para registrar um novo fornecedor.
              </DialogModalDescription>
            </DialogModalHeader>
            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  autoFocus
                  disabled={createSupplier.isPending}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={handleInputChange}
                  disabled={createSupplier.isPending}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  disabled={createSupplier.isPending}
                />
              </div>
              <div>
                <Label htmlFor="tax_number">NIF</Label>
                <Input
                  id="tax_number"
                  name="tax_number"
                  value={newSupplier.tax_number}
                  onChange={handleInputChange}
                  disabled={createSupplier.isPending}
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={newSupplier.city}
                  onChange={handleInputChange}
                  disabled={createSupplier.isPending}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createSupplier.isPending}>
                  {createSupplier.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fornecedores</CardTitle>
          <CardDescription>
            Lista de todos os fornecedores registados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Carregando...</div>
          ) : error ? (
            <div className="py-10 text-center text-destructive">Erro ao carregar fornecedores</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>NIF</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier: any) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.tax_number}</TableCell>
                    <TableCell>{supplier.city}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.is_active ? "default" : "secondary"}>
                        {supplier.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
