
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, Euro, Hash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const InvoicingModule = () => {
  const invoices = [
    {
      id: 1,
      number: "FT 2024/001",
      type: "Fatura",
      client: "Empresa ABC Lda",
      date: "2024-06-10",
      dueDate: "2024-06-25",
      amount: 1250.00,
      tax: 287.50,
      total: 1537.50,
      status: "Pendente",
      atcud: "CSDF-001",
      qrcode: "A:123456789*B:999999990*C:PT*D:FT*E:N*F:20240610*G:FT 2024/001*H:CSDF-001*I1:PT*I7:1537.50*I8:287.50*N:287.50*O:1537.50*Q:abcd*R:9999"
    },
    {
      id: 2,
      number: "FT 2024/002",
      type: "Fatura",
      client: "Tech Solutions Unipessoal",
      date: "2024-06-12",
      dueDate: "2024-06-27",
      amount: 800.00,
      tax: 184.00,
      total: 984.00,
      status: "Paga",
      atcud: "CSDF-002",
      qrcode: "A:123456789*B:555444333*C:PT*D:FT*E:N*F:20240612*G:FT 2024/002*H:CSDF-002*I1:PT*I7:984.00*I8:184.00*N:184.00*O:984.00*Q:efgh*R:9999"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Sistema de Faturação
          </h2>
          <p className="text-muted-foreground">
            Emissão de documentos legais com conformidade AT
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Fatura
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Fatura</DialogTitle>
              <DialogDescription>
                Documento com assinatura digital e ATCUD
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceType">Tipo de Documento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FT">Fatura</SelectItem>
                    <SelectItem value="FS">Fatura Simplificada</SelectItem>
                    <SelectItem value="RC">Recibo</SelectItem>
                    <SelectItem value="NC">Nota de Crédito</SelectItem>
                    <SelectItem value="ND">Nota de Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="client">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Empresa ABC Lda</SelectItem>
                    <SelectItem value="2">João Silva</SelectItem>
                    <SelectItem value="3">Tech Solutions Unipessoal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" defaultValue="2024-06-13" />
              </div>
              <div>
                <Label htmlFor="dueDate">Data Vencimento</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <div className="mt-4">
              <Label>Linhas do Documento</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Adicionar artigos e quantidades será implementado na próxima versão
                </p>
              </div>
            </div>
            <Button className="w-full mt-4">Criar e Assinar Digitalmente</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Faturação Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€12.450,30</div>
            <p className="text-xs text-muted-foreground">+12.5% vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documentos Emitidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+23 este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Por Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€3.280,50</div>
            <p className="text-xs text-muted-foreground">5 faturas pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Recentes</CardTitle>
          <CardDescription>
            Faturas e documentos emitidos com conformidade AT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{invoice.number}</h3>
                      <Badge variant="outline">{invoice.type}</Badge>
                      <Badge variant={invoice.status === "Paga" ? "default" : "secondary"}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Cliente: {invoice.client}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(invoice.date).toLocaleDateString('pt-PT')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        ATCUD: {invoice.atcud}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span className="text-lg font-bold">
                        €{invoice.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      IVA: €{invoice.tax.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Venc: {new Date(invoice.dueDate).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                  
                  <div className="ml-4 space-y-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver PDF
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      QR Code
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
