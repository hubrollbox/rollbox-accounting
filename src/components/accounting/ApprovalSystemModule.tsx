
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Plus, Settings } from "lucide-react";
import { useApprovalSystem } from "@/hooks/useApprovalSystem";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ApprovalSystemModule = () => {
  const {
    approvalRules,
    approvalRequests,
    rulesLoading,
    requestsLoading,
    createRule,
    processApproval,
    isCreatingRule,
    isProcessingApproval,
  } = useApprovalSystem();

  const [newRule, setNewRule] = useState({
    name: '',
    condition: 'AMOUNT' as 'AMOUNT' | 'ACCOUNT_TYPE' | 'MANUAL',
    min_amount: '',
    approver_id: '',
  });

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState('');

  const handleCreateRule = () => {
    createRule({
      name: newRule.name,
      condition: newRule.condition,
      min_amount: newRule.min_amount ? parseFloat(newRule.min_amount) : undefined,
      approver_id: newRule.approver_id,
      company_id: 'temp-company-id', // TODO: Get from context
      is_active: true,
    });

    setNewRule({
      name: '',
      condition: 'AMOUNT',
      min_amount: '',
      approver_id: '',
    });
  };

  const handleProcessApproval = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    processApproval({
      requestId,
      status,
      comments: approvalComments,
    });
    setSelectedRequest(null);
    setApprovalComments('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'APPROVED': return 'default';
      case 'REJECTED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Sistema de Aprovação
          </h2>
          <p className="text-muted-foreground">
            Gestão de regras e solicitações de aprovação
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRules?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Configuradas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {approvalRequests?.filter(req => req.status === 'PENDING').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvalRequests?.filter(req => req.status !== 'PENDING').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Aprovação</CardTitle>
              <CardDescription>
                Gerir solicitações pendentes e histórico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Transação</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Aprovador</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {request.transaction_id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {request.requester_id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {request.approver_id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDistanceToNow(new Date(request.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleProcessApproval(request.id, 'APPROVED')}
                              disabled={isProcessingApproval}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleProcessApproval(request.id, 'REJECTED')}
                              disabled={isProcessingApproval}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Regra</CardTitle>
              <CardDescription>
                Definir regras de aprovação automática
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Nome da Regra</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    placeholder="Ex: Aprovação para valores altos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-condition">Condição</Label>
                  <Select
                    value={newRule.condition}
                    onValueChange={(value: 'AMOUNT' | 'ACCOUNT_TYPE' | 'MANUAL') =>
                      setNewRule({ ...newRule, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AMOUNT">Por Valor</SelectItem>
                      <SelectItem value="ACCOUNT_TYPE">Por Tipo de Conta</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newRule.condition === 'AMOUNT' && (
                  <div className="space-y-2">
                    <Label htmlFor="min-amount">Valor Mínimo (€)</Label>
                    <Input
                      id="min-amount"
                      type="number"
                      value={newRule.min_amount}
                      onChange={(e) => setNewRule({ ...newRule, min_amount: e.target.value })}
                      placeholder="1000.00"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="approver">ID do Aprovador</Label>
                  <Input
                    id="approver"
                    value={newRule.approver_id}
                    onChange={(e) => setNewRule({ ...newRule, approver_id: e.target.value })}
                    placeholder="UUID do usuário aprovador"
                  />
                </div>
              </div>
              <Button onClick={handleCreateRule} disabled={isCreatingRule}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Regra
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras Existentes</CardTitle>
              <CardDescription>
                Lista de regras de aprovação configuradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Valor Mínimo</TableHead>
                    <TableHead>Aprovador</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalRules?.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.condition}</Badge>
                      </TableCell>
                      <TableCell>
                        {rule.min_amount ? `€${rule.min_amount.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {rule.approver_id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
