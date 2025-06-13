
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Euro, Search, Plus, Hash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
            <div className="space-y-4">
              <div>
                <Label htmlFor="productCode">Código</Label>
                <Input id="productCode" placeholder="PROD005" />
              </div>
              <div>
                <Label htmlFor="productName">Nome</Label>
                <Input id="productName" placeholder="Nome do produto/serviço" />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="services">Serviços</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="training">Formação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Preço (€)</Label>
                <Input id="price" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="taxRate">Taxa IVA (%)</Label>
                <Select>
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
              <Button className="w-full">Criar Artigo</Button>
            </div>
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
