
interface JournalEntry {
  id: string;
  company_id: string;
  accounting_date: string;
  total_amount: number;
  lines: JournalEntryLine[];
}

interface JournalEntryLine {
  id: string;
  account_code: string;
  account_name: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
}

export class AccountingError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AccountingError';
  }
}

export const validateJournalEntry = async (entry: JournalEntry): Promise<void> => {
  // 1. Validar equilíbrio débito/crédito
  const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit_amount, 0);
  const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit_amount, 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new AccountingError(
      'ENTRY_UNBALANCED', 
      `Débitos (€${totalDebit.toFixed(2)}) e créditos (€${totalCredit.toFixed(2)}) não equilibrados`
    );
  }

  // 2. Validar data não futura
  const entryDate = new Date(entry.accounting_date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (entryDate > today) {
    throw new AccountingError(
      'FUTURE_DATE', 
      'Data do lançamento não pode ser futura'
    );
  }

  // 3. Validar valor positivo
  if (entry.total_amount <= 0) {
    throw new AccountingError(
      'INVALID_AMOUNT', 
      'Valor do lançamento deve ser positivo'
    );
  }

  // 4. Validar linhas mínimas
  if (entry.lines.length < 2) {
    throw new AccountingError(
      'INSUFFICIENT_LINES', 
      'Lançamento deve ter pelo menos 2 linhas'
    );
  }

  // 5. Validar que cada linha tem apenas débito OU crédito
  for (const line of entry.lines) {
    if ((line.debit_amount > 0 && line.credit_amount > 0) || 
        (line.debit_amount === 0 && line.credit_amount === 0)) {
      throw new AccountingError(
        'INVALID_LINE', 
        'Cada linha deve ter apenas débito OU crédito'
      );
    }
  }
};

export const validateAccountingPeriod = async (
  companyId: string, 
  date: string
): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('accounting_periods')
      .select('is_open')
      .eq('company_id', companyId)
      .lte('start_date', date)
      .gte('end_date', date)
      .single();

    if (error) {
      console.warn('No accounting period found for date:', date);
      return true; // Permitir se não houver período definido
    }

    return data.is_open;
  } catch (error) {
    console.error('Error validating accounting period:', error);
    return true; // Permitir em caso de erro
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

export const parseAmount = (value: string): number => {
  // Remove símbolos de moeda e espaços
  const cleaned = value.replace(/[€\s]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    throw new AccountingError('INVALID_NUMBER', 'Valor inválido');
  }
  
  return parsed;
};
