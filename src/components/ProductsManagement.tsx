import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Euro, Search, Plus, Hash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DOMPurify from "dompurify";

export const ProductsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const products = [
    {
      id: 1,
      code: "PROD001",
      name: "Consultoria Informática",
      category: "Serviços",
      price: 75.00,
      stock: null,
      taxRate: 23,
      unit: "Hora"
    },
    {
      id: 2,
      code: "PROD002", 
      name: "Licença Software Anual",
      category: "Software",
      price: 299.99,
      stock: 50,
      taxRate: 23,
      unit: "Unidade"
    },
    {
      id: 3,
      code: "PROD003",
      name: "Formação Presencial",
      category: "Formação",
      price: 150.00,
      stock: null,
      taxRate: 6,
      unit: "Dia"
    },
    {
      id: 4,
      code: "PROD004",
      name: "Equipamento Informático",
      category: "Hardware",
      price: 850.00,
      stock: 12,
      taxRate: 23,
      unit: "Unidade"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductCreationForm = () => {
    const [form, setForm] = useState({
      code: "",
      name: "",
      category: "",
      price: "",
      taxRate: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const sanitize = (value: string) => DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [e.target.id || e.target.name]: e.target.value });
    };

    const handleCategory = (value: string) => {
      setForm({ ...form, category: value });
    };
    const handleTaxRate = (value: string) => {
      setForm({ ...form, taxRate: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      // Sanitize data
      const sanitized = {
        code: sanitize(form.code),
        name: sanitize(form.name),
        category: sanitize(form.category),
        price: sanitize(form.price),
        taxRate: sanitize(form.taxRate),
      };
      // Here you would usually submit to your backend
      // For demo: log sanitized product
      console.log("Sanitized Product:", sanitized);
      setSubmitting(false);
      // Optionally, clear form/close dialog, toast etc.
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="code">Código</Label>
          <Input id="code" value={form.code} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select onValueChange={handleCategory} value={form.category}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Serviços">Serviços</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Formação">Formação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">Preço (€)</Label>
          <Input id="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="taxRate">Taxa IVA (%)</Label>
          <Select onValueChange={handleTaxRate} value={form.taxRate}>
            <SelectTrigger>
              <SelectValue placeholder="Taxa IVA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="23">23% - Taxa Normal</SelectItem>
              <SelectItem value="13">13% - Taxa Intermédia</SelectItem>
              <SelectItem value="6">6% - Taxa Reduzida</SelectItem>
              <SelectItem value="0">0% - Isento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "A criar..." : "Criar Artigo"}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Euro className="w-6 h-6" />
            Gestão de Artigos
          </h2>
          <p className="text-muted-foreground">
            Gerir produtos, preços, stock e impostos
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Artigo</DialogTitle>
              <DialogDescription>
                Introduza os dados do artigo/serviço
              </DialogDescription>
            </DialogHeader>
            <ProductCreationForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventário de Artigos</CardTitle>
              <CardDescription>
                {filteredProducts.length} artigos encontrados
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="outline">
                        <Hash className="w-3 h-3 mr-1" />
                        {product.code}
                      </Badge>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Unidade: {product.unit}</span>
                      {product.stock !== null && (
                        <span className={product.stock < 10 ? "text-orange-600" : ""}>
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span className="text-lg font-medium">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      IVA: {product.taxRate}%
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
