import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSecureQuery } from '@/hooks/useSecureQuery';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, User, FileText, AlertTriangle } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  entity_id: string;
  old_value: any;
  new_value: any;
  timestamp: string;
  ip_address: string;
  device_info: string;
}

export const AuditTrail: React.FC = () => {
  const { data, isLoading, error } = useSecureQuery<AuditLog>({
    queryKey: ['audit-logs'],
    table: 'audit_logs',
    selectFields: `
      id,
      user_id,
      action,
      entity,
      entity_id,
      old_value,
      new_value,
      timestamp,
      ip_address,
      device_info
    `,
    pagination: { page: 1, pageSize: 50 },
    requireCompanyAccess: false, // Audit logs são filtrados por user_id
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'UPDATE':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'DELETE':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando histórico de auditoria...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-red-600">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p>Erro ao carregar histórico de auditoria</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Now data is type AuditLog[], so we can use it directly
  const auditLogArray: AuditLog[] = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Histórico de Auditoria
        </CardTitle>
        <CardDescription>
          Registro completo de todas as ações realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {auditLogArray.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <p>Nenhum registro de auditoria encontrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Dispositivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogArray.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.entity}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {log.entity_id.slice(0, 8)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">
                      {log.ip_address || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-w-32 truncate" title={log.device_info}>
                      {log.device_info || 'N/A'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
