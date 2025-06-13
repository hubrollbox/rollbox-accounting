
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Plus, ShoppingCart, CreditCard, Calculator, Globe, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const IntegrationsModule = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "WooCommerce",
      type: "E-commerce",
      status: "connected",
      description: "Sincronização automática de produtos e encomendas",
      lastSync: "2024-06-13 09:30",
      icon: ShoppingCart,
      config: {
        url: "https://loja.exemplo.com",
        apiKey: "wc_***********",
        syncProducts: true,
        syncOrders: true,
        autoInvoice: true
      }
    },
    {
      id: 2,
      name: "Banco Millennium BCP",
      type: "Bancário",
      status: "connected",
      description: "Importação automática de extratos bancários",
      lastSync: "2024-06-13 08:15",
      icon: CreditCard,
      config: {
        accountNumber: "***********1234",
        iban: "PT50***********",
        autoImport: true,
        reconciliation: true
      }
    },
    {
      id: 3,
      name: "PHC Software",
      type: "Contabilidade",
      status: "pending",
      description: "Exportação de dados contabilísticos",
      lastSync: "Nunca",
      icon: Calculator,
      config: {
        server: "",
        database: "",
        user: "",
        autoExport: false
      }
    },
    {
      id: 4,
      name: "Prestashop",
      type: "E-commerce",
      status: "disconnected",
      description: "Gestão integrada de loja online",
      lastSync: "2024-06-10 14:22",
      icon: Globe,
      config: {
        url: "",
        apiKey: "",
        syncProducts: false,
        syncOrders: false
      }
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "disconnected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "pending":
        return "Pendente";
      case "disconnected":
        return "Desconectado";
      default:
        return "Inativo";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Integrações Externas
          </h2>
          <p className="text-muted-foreground">
            Conecte com plataformas de e-commerce, bancos e sistemas de contabilidade
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Integração
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Integração</DialogTitle>
              <DialogDescription>
                Configure uma nova integração com sistemas externos
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="ecommerce" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                <TabsTrigger value="banking">Bancário</TabsTrigger>
                <TabsTrigger value="accounting">Contabilidade</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ecommerce" className="space-y-4">
                <div>
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="woocommerce">WooCommerce</SelectItem>
                      <SelectItem value="prestashop">PrestaShop</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="magento">Magento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="storeUrl">URL da Loja</Label>
                  <Input id="storeUrl" placeholder="https://minhaloja.com" />
                </div>
                <div>
                  <Label htmlFor="apiKey">Chave API</Label>
                  <Input id="apiKey" type="password" placeholder="Chave de acesso à API" />
                </div>
              </TabsContent>
              
              <TabsContent value="banking" className="space-y-4">
                <div>
                  <Label htmlFor="bank">Banco</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="millennium">Millennium BCP</SelectItem>
                      <SelectItem value="cgd">Caixa Geral de Depósitos</SelectItem>
                      <SelectItem value="santander">Santander</SelectItem>
                      <SelectItem value="bpi">BPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" placeholder="PT50 0000 0000 0000 0000 0000 0" />
                </div>
                <div>
                  <Label htmlFor="bankApiKey">Credenciais de Acesso</Label>
                  <Input id="bankApiKey" type="password" placeholder="Token de acesso bancário" />
                </div>
              </TabsContent>
              
              <TabsContent value="accounting" className="space-y-4">
                <div>
                  <Label htmlFor="software">Software</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar software" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phc">PHC Software</SelectItem>
                      <SelectItem value="primavera">PRIMAVERA</SelectItem>
                      <SelectItem value="sage">Sage</SelectItem>
                      <SelectItem value="toconline">TOConline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="server">Servidor</Label>
                  <Input id="server" placeholder="servidor.empresa.com" />
                </div>
                <div>
                  <Label htmlFor="database">Base de Dados</Label>
                  <Input id="database" placeholder="Nome da base de dados" />
                </div>
              </TabsContent>
            </Tabs>
            
            <Button className="w-full mt-4">Configurar Integração</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-xs text-muted-foreground">de 4 configuradas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sincronizações Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 vs ontem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">09:30</div>
            <p className="text-xs text-muted-foreground">WooCommerce</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <integration.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(integration.status)}
                    {getStatusText(integration.status)}
                  </Badge>
                  <Badge variant="secondary">{integration.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Última sincronização: {integration.lastSync}
                </div>
                
                {integration.status === "connected" && (
                  <div className="grid grid-cols-2 gap-4">
                    {integration.type === "E-commerce" && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`sync-products-${integration.id}`} className="text-sm">
                            Sincronizar Produtos
                          </Label>
                          <Switch 
                            id={`sync-products-${integration.id}`}
                            checked={integration.config.syncProducts}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`sync-orders-${integration.id}`} className="text-sm">
                            Sincronizar Encomendas
                          </Label>
                          <Switch 
                            id={`sync-orders-${integration.id}`}
                            checked={integration.config.syncOrders}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`auto-invoice-${integration.id}`} className="text-sm">
                            Faturação Automática
                          </Label>
                          <Switch 
                            id={`auto-invoice-${integration.id}`}
                            checked={integration.config.autoInvoice}
                          />
                        </div>
                      </>
                    )}
                    
                    {integration.type === "Bancário" && (
                      <>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`auto-import-${integration.id}`} className="text-sm">
                            Importação Automática
                          </Label>
                          <Switch 
                            id={`auto-import-${integration.id}`}
                            checked={integration.config.autoImport}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`reconciliation-${integration.id}`} className="text-sm">
                            Reconciliação Automática
                          </Label>
                          <Switch 
                            id={`reconciliation-${integration.id}`}
                            checked={integration.config.reconciliation}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  {integration.status === "connected" && (
                    <Button variant="outline" size="sm">
                      Sincronizar Agora
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm">
                    Logs
                  </Button>
                  {integration.status === "connected" ? (
                    <Button variant="destructive" size="sm">
                      Desconectar
                    </Button>
                  ) : (
                    <Button variant="default" size="sm">
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
