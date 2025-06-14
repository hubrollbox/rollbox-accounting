
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateJournalEntry, AccountingError, formatCurrency } from "@/utils/accountingValidations";

interface JournalEntryLine {
  id: string;
  account_code: string;
  account_name: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
}

interface JournalEntry {
  id: string;
  entry_number: string;
  description: string;
  accounting_date: string;
  total_amount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'POSTED';
  lines: JournalEntryLine[];
}

export const JournalEntriesModule = () => {
  const { toast } = useToast();
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    description: '',
    accounting_date: new Date().toISOString().split('T')[0],
    lines: [],
  });

  const [newLine, setNewLine] = useState<Partial<JournalEntryLine>>({
    account_code: '',
    account_name: '',
    description: '',
    debit_amount: 0,
    credit_amount: 0,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const addLine = () => {
    if (!newLine.account_code || (!newLine.debit_amount && !newLine.credit_amount)) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const line: JournalEntryLine = {
      id: crypto.randomUUID(),
      account_code: newLine.account_code!,
      account_name: newLine.account_name || newLine.account_code!,
      description: newLine.description || '',
      debit_amount: newLine.debit_amount || 0,
      credit_amount: newLine.credit_amount || 0,
    };

    setCurrentEntry(prev => ({
      ...prev,
      lines: [...(prev.lines || []), line],
    }));

    setNewLine({
      account_code: '',
      account_name: '',
      description: '',
      debit_amount: 0,
      credit_amount: 0,
    });

    validateEntry();
  };

  const removeLine = (lineId: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      lines: prev.lines?.filter(line => line.id !== lineId) || [],
    }));
    validateEntry();
  };

  const validateEntry = () => {
    const errors: string[] = [];
    const lines = currentEntry.lines || [];

    if (lines.length < 2) {
      errors.push("Mínimo de 2 linhas necessárias");
    }

    const totalDebit = lines.reduce((sum, line) => sum + line.debit_amount, 0);
    const totalCredit = lines.reduce((sum, line) => sum + line.credit_amount, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      errors.push(`Lançamento não equilibrado: Débitos ${formatCurrency(totalDebit)} ≠ Créditos ${formatCurrency(totalCredit)}`);
    }

    // Verificar se cada linha tem apenas débito OU crédito
    lines.forEach((line, index) => {
      if ((line.debit_amount > 0 && line.credit_amount > 0) || 
          (line.debit_amount === 0 && line.credit_amount === 0)) {
        errors.push(`Linha ${index + 1}: deve ter apenas débito OU crédito`);
      }
    });

    setValidationErrors(errors);

    // Atualizar total
    setCurrentEntry(prev => ({
      ...prev,
      total_amount: Math.max(totalDebit, totalCredit),
    }));
  };

  const saveEntry = async () => {
    try {
      if (!currentEntry.lines || currentEntry.lines.length === 0) {
        throw new Error("Adicione pelo menos uma linha ao lançamento");
      }

      const entry = {
        id: crypto.randomUUID(),
        company_id: 'temp-company-id', // TODO: Get from context
        accounting_date: currentEntry.accounting_date!,
        total_amount: currentEntry.total_amount || 0,
        lines: currentEntry.lines,
      };

      await validateJournalEntry(entry);

      // TODO: Save to Supabase
      console.log('Saving journal entry:', entry);

      toast({
        title: "Lançamento salvo",
        description: "Lançamento contábil criado com sucesso.",
      });

      // Reset form
      setCurrentEntry({
        description: '',
        accounting_date: new Date().toISOString().split('T')[0],
        lines: [],
      });
      setValidationErrors([]);

    } catch (error) {
      if (error instanceof AccountingError) {
        toast({
          title: "Erro de validação",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao salvar lançamento.",
          variant: "destructive",
        });
      }
    }
  };

  const totalDebit = currentEntry.lines?.reduce((sum, line) => sum + line.debit_amount, 0) || 0;
  const totalCredit = currentEntry.lines?.reduce((sum, line) => sum + line.credit_amount, 0) || 0;
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Lançamentos Contábeis</h3>
          <p className="text-muted-foreground">
            Criar e gerir lançamentos do diário geral
          </p>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Validações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-orange-700 text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Lançamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={currentEntry.description || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do lançamento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data Contábil</Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentEntry.accounting_date || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, accounting_date: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Linha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="account-code">Código da Conta</Label>
                  <Input
                    id="account-code"
                    value={newLine.account_code || ''}
                    onChange={(e) => setNewLine(prev => ({ ...prev, account_code: e.target.value }))}
                    placeholder="Ex: 111"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line-description">Descrição</Label>
                  <Input
                    id="line-description"
                    value={newLine.description || ''}
                    onChange={(e) => setNewLine(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da linha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debit">Débito (€)</Label>
                  <Input
                    id="debit"
                    type="number"
                    step="0.01"
                    value={newLine.debit_amount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setNewLine(prev => ({ ...prev, debit_amount: value, credit_amount: 0 }));
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit">Crédito (€)</Label>
                  <Input
                    id="credit"
                    type="number"
                    step="0.01"
                    value={newLine.credit_amount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setNewLine(prev => ({ ...prev, credit_amount: value, debit_amount: 0 }));
                    }}
                    placeholder="0.00"
                  />
                </div>
                <Button onClick={addLine} className="h-10">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linhas do Lançamento</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEntry.lines?.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-mono">{line.account_code}</TableCell>
                      <TableCell>{line.description}</TableCell>
                      <TableCell className="text-right">
                        {line.debit_amount > 0 ? formatCurrency(line.debit_amount) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {line.credit_amount > 0 ? formatCurrency(line.credit_amount) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeLine(line.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentEntry.lines && currentEntry.lines.length > 0 && (
                    <TableRow className="font-bold border-t-2">
                      <TableCell colSpan={2}>TOTAIS</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalDebit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalCredit)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isBalanced ? "default" : "destructive"}>
                          {isBalanced ? "Equilibrado" : "Desequilibrado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Débito:</span>
                  <span className="font-bold">{formatCurrency(totalDebit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Crédito:</span>
                  <span className="font-bold">{formatCurrency(totalCredit)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Diferença:</span>
                  <span className={Math.abs(totalDebit - totalCredit) < 0.01 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(Math.abs(totalDebit - totalCredit))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Linhas:</span>
                  <span>{currentEntry.lines?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={isBalanced ? "default" : "secondary"}>
                    {isBalanced ? "Válido" : "Inválido"}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={saveEntry}
                disabled={!isBalanced || validationErrors.length > 0 || !currentEntry.lines?.length}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Lançamento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
