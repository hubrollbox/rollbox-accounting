
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useStock } from "@/hooks/useStock";

export const StockManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stockItems = [], isLoading, error } = useStock();

  const getStockStatus = (quantity: number, minQuantity: number = 0) => {
    if (quantity <= minQuantity) return "low";
    if (quantity <= minQuantity * 2) return "medium";
    return "good";
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "low":
        return <Badge variant="destructive">Stock Baixo</Badge>;
      case "medium":
        return <Badge variant="secondary">Stock Médio</Badge>;
      default:
        return <Badge variant="default">Stock OK</Badge>;
    }
  };

  const filteredStock = stockItems.filter(item =>
    (item.product_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Stock</h2>
          <p className="text-muted-foreground">
            Controlar inventário e movimentos de stock
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Entrada
          </Button>
          <Button variant="outline">
            <TrendingDown className="w-4 h-4 mr-2" />
            Saída
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajuste Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stockItems.filter(item => getStockStatus(item.quantity, item.min_quantity ?? 0) === "low").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€0,00</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
          <CardDescription>
            Estado atual do stock de todos os produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar (ID produto, localização...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Carregando...</div>
          ) : error ? (
            <div className="py-10 text-center text-destructive">Erro ao carregar stock</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Stock Mín.</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => {
                  const status = getStockStatus(item.quantity, item.min_quantity ?? 0);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product_id /* Trocar para nome quando disponível */}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.min_quantity ?? 0}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{getStockBadge(status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
