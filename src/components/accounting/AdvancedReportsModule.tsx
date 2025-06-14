
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Calendar, Calculator } from "lucide-react";
import { formatCurrency } from "@/utils/accountingValidations";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data para demonstração
const balanceSheetData = [
  { account_code: '111', account_name: 'Caixa', account_type: 'ASSET', balance: 5000.00 },
  { account_code: '112', account_name: 'Bancos', account_type: 'ASSET', balance: 25000.00 },
  { account_code: '131', account_name: 'Clientes', account_type: 'ASSET', balance: 15000.00 },
  { account_code: '211', account_name: 'Fornecedores', account_type: 'LIABILITY', balance: -8000.00 },
  { account_code: '241', account_name: 'IVA a Pagar', account_type: 'LIABILITY', balance: -3000.00 },
  { account_code: '511', account_name: 'Capital Social', account_type: 'EQUITY', balance: -20000.00 },
  { account_code: '711', account_name: 'Vendas', account_type: 'REVENUE', balance: -50000.00 },
  { account_code: '621', account_name: 'CMVMC', account_type: 'EXPENSE', balance: 30000.00 },
];

const monthlyData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Fev', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Abr', revenue: 61000, expenses: 40000, profit: 21000 },
  { month: 'Mai', revenue: 55000, expenses: 38000, profit: 17000 },
  { month: 'Jun', revenue: 67000, expenses: 45000, profit: 22000 },
];

export const AdvancedReportsModule = () => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const assets = balanceSheetData.filter(item => item.account_type === 'ASSET');
  const liabilities = balanceSheetData.filter(item => item.account_type === 'LIABILITY');
  const equity = balanceSheetData.filter(item => item.account_type === 'EQUITY');

  const totalAssets = assets.reduce((sum, item) => sum + item.balance, 0);
  const totalLiabilities = Math.abs(liabilities.reduce((sum, item) => sum + item.balance, 0));
  const totalEquity = Math.abs(equity.reduce((sum, item) => sum + item.balance, 0));

  const pieData = [
    { name: 'Ativos', value: totalAssets, color: COLORS[0] },
    { name: 'Passivo', value: totalLiabilities, color: COLORS[1] },
    { name: 'Capital Próprio', value: totalEquity, color: COLORS[2] },
  ];

  const generateReport = () => {
    console.log('Generating report for:', reportDate, reportPeriod);
    // TODO: Call Supabase function to generate report
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Relatórios Avançados</h3>
          <p className="text-muted-foreground">
            Balanços, demonstrações e análises financeiras
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="report-date">Data:</Label>
            <Input
              id="report-date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport}>
            <Download className="w-4 h-4 mr-2" />
            Gerar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalAssets)}
            </div>
            <p className="text-xs text-muted-foreground">Posição atual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Passivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalLiabilities)}
            </div>
            <p className="text-xs text-muted-foreground">Obrigações</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Capital Próprio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalEquity)}
            </div>
            <p className="text-xs text-muted-foreground">Patrimônio</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Equilíbrio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01 ? '✓' : '✗'}
            </div>
            <p className="text-xs text-muted-foreground">Balanço</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="balance-sheet" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="balance-sheet">Balanço</TabsTrigger>
          <TabsTrigger value="income-statement">DRE</TabsTrigger>
          <TabsTrigger value="cash-flow">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Balanço Patrimonial</CardTitle>
                  <CardDescription>
                    Posição patrimonial em {new Date(reportDate).toLocaleDateString('pt-PT')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">ATIVO</h4>
                      <Table>
                        <TableBody>
                          {assets.map((item) => (
                            <TableRow key={item.account_code}>
                              <TableCell className="font-medium">
                                {item.account_code} - {item.account_name}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.balance)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-t-2 font-bold">
                            <TableCell>TOTAL ATIVO</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(totalAssets)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">PASSIVO</h4>
                      <Table>
                        <TableBody>
                          {liabilities.map((item) => (
                            <TableRow key={item.account_code}>
                              <TableCell className="font-medium">
                                {item.account_code} - {item.account_name}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(Math.abs(item.balance))}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-b">
                            <TableCell className="font-bold">TOTAL PASSIVO</TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(totalLiabilities)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <h4 className="font-semibold mt-6 mb-3 text-green-600">CAPITAL PRÓPRIO</h4>
                      <Table>
                        <TableBody>
                          {equity.map((item) => (
                            <TableRow key={item.account_code}>
                              <TableCell className="font-medium">
                                {item.account_code} - {item.account_name}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(Math.abs(item.balance))}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-t-2 font-bold">
                            <TableCell>TOTAL CAPITAL PRÓPRIO</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(totalEquity)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Patrimonial</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="income-statement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demonstração de Resultados</CardTitle>
              <CardDescription>
                Performance financeira - {reportPeriod}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill={COLORS[0]} name="Receitas" />
                  <Bar dataKey="expenses" fill={COLORS[1]} name="Despesas" />
                  <Bar dataKey="profit" fill={COLORS[2]} name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>
                Movimentação de caixa e equivalentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20 text-muted-foreground">
                <Calculator className="w-12 h-12 mx-auto mb-4" />
                <p>Módulo de Fluxo de Caixa em desenvolvimento</p>
                <p className="text-sm">Será implementado na próxima iteração</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análises Financeiras</CardTitle>
              <CardDescription>
                Indicadores e métricas de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Liquidez Corrente</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {(totalAssets / totalLiabilities).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Ativo/Passivo</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Endividamento</h4>
                  <div className="text-2xl font-bold text-orange-600">
                    {((totalLiabilities / totalAssets) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Passivo/Ativo</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Autonomia Financeira</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {((totalEquity / totalAssets) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Capital Próprio/Ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
