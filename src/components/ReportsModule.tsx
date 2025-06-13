
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Hash, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReportsModule = () => {
  const reports = [
    {
      name: "SAFT-PT",
      description: "Standard Audit File for Tax Purposes",
      period: "Junho 2024",
      status: "Gerado",
      compliance: "Conforme AT",
      lastGenerated: "2024-06-13"
    },
    {
      name: "Declaração IVA",
      description: "Declaração Periódica de IVA",
      period: "2º Trimestre 2024",
      status: "Pendente",
      compliance: "A gerar",
      lastGenerated: null
    },
    {
      name: "Anexo J",
      description: "Comunicação de Faturas Emitidas",
      period: "Junho 2024",
      status: "Enviado",
      compliance: "Aceite AT",
      lastGenerated: "2024-06-10"
    }
  ];

  const salesReport = {
    period: "Junho 2024",
    totalSales: 12450.30,
    totalTax: 2863.57,
    invoicesCount: 89,
    avgInvoiceValue: 139.89
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Relatórios e Conformidade
          </h2>
          <p className="text-muted-foreground">
            Exportações SAFT, IVA e relatórios obrigatórios AT
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="2024-06">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-06">Junho 2024</SelectItem>
              <SelectItem value="2024-05">Maio 2024</SelectItem>
              <SelectItem value="2024-04">Abril 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            Atualizar Dados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{salesReport.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{salesReport.period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">IVA Liquidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{salesReport.totalTax.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Por entregar</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Faturas Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesReport.invoicesCount}</div>
            <p className="text-xs text-muted-foreground">Documentos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{salesReport.avgInvoiceValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por fatura</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Relatórios Obrigatórios AT
          </CardTitle>
          <CardDescription>
            Ficheiros de conformidade fiscal e declarações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{report.name}</h3>
                      <Badge variant={report.status === "Gerado" || report.status === "Enviado" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      <Badge variant={report.compliance.includes("Conforme") ? "default" : "outline"}>
                        <Shield className="w-3 h-3 mr-1" />
                        {report.compliance}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {report.description}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Período: {report.period}
                      </span>
                      {report.lastGenerated && (
                        <span>
                          Gerado: {new Date(report.lastGenerated).toLocaleDateString('pt-PT')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center gap-2"
                      disabled={report.status === "Pendente"}
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                    >
                      {report.status === "Pendente" ? "Gerar" : "Regerar"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações de Conformidade</CardTitle>
          <CardDescription>
            Estado atual da conformidade fiscal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Certificação AT</span>
                <Badge variant="default">
                  <Shield className="w-3 h-3 mr-1" />
                  Ativo
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">ATCUD Configurado</span>
                <Badge variant="default">Conforme</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">QR Code</span>
                <Badge variant="default">Ativo</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Assinatura Digital</span>
                <Badge variant="default">Configurada</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Hash Sequencial</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Backup Automático</span>
                <Badge variant="default">Diário</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
