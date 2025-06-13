
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Euro, Users, FileText, Hash, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Dashboard = () => {
  const stats = [
    {
      title: "Faturação Mensal",
      value: "€12.450,30",
      change: "+12.5%",
      icon: Euro,
      color: "text-green-600"
    },
    {
      title: "Clientes Ativos",
      value: "156",
      change: "+8",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Documentos Emitidos",
      value: "89",
      change: "+23",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "SAFT Gerado",
      value: "Atual",
      change: "Conforme",
      icon: Hash,
      color: "text-green-600"
    }
  ];

  const pendingDocs = [
    { type: "Fatura", number: "FT 2024/001", client: "Empresa ABC Lda", amount: "€1.250,00", due: "Em 3 dias" },
    { type: "Recibo", number: "RC 2024/045", client: "João Silva", amount: "€450,00", due: "Vencido" },
    { type: "Nota Crédito", number: "NC 2024/012", client: "Tech Solutions", amount: "€320,00", due: "Hoje" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.color}>{stat.change}</span> desde o mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Evolução de Vendas
            </CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"].map((month, index) => (
                <div key={month} className="flex items-center space-x-4">
                  <div className="w-20 text-sm">{month}</div>
                  <Progress value={(index + 1) * 15} className="flex-1" />
                  <div className="w-20 text-sm text-right">€{(8000 + index * 1200).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Documentos Pendentes
            </CardTitle>
            <CardDescription>Requerem atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{doc.type}</Badge>
                      <span className="text-sm font-medium">{doc.number}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{doc.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{doc.amount}</div>
                    <div className={`text-xs ${doc.due === "Vencido" ? "text-red-600" : "text-muted-foreground"}`}>
                      {doc.due}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
