
-- Enable Row Level Security
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;

-- Chart of Accounts: Only allow access if the company is owned by the user
CREATE POLICY "Company users can view their chart of accounts"
  ON public.chart_of_accounts FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM public.company_settings
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Company users can manage their chart of accounts"
  ON public.chart_of_accounts FOR ALL
  USING (
    company_id IN (
      SELECT id FROM public.company_settings
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT id FROM public.company_settings
      WHERE user_id = auth.uid()
    )
  );

-- Journal Entries: Only allow access if the company is owned by the user
CREATE POLICY "Company users can view their journal entries"
  ON public.journal_entries FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM public.company_settings
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Company users can manage their journal entries"
  ON public.journal_entries FOR ALL
  USING (
    company_id IN (
      SELECT id FROM public.company_settings
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT id FROM public.company_settings
      WHERE user_id = auth.uid()
    )
  );

-- Journal Entry Lines: Restrict actions based on parent journal entry's company
CREATE POLICY "Company users can view their journal entry lines"
  ON public.journal_entry_lines FOR SELECT
  USING (
    journal_entry_id IN (
      SELECT id FROM public.journal_entries
      WHERE company_id IN (
        SELECT id FROM public.company_settings
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Company users can manage their journal entry lines"
  ON public.journal_entry_lines FOR ALL
  USING (
    journal_entry_id IN (
      SELECT id FROM public.journal_entries
      WHERE company_id IN (
        SELECT id FROM public.company_settings
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    journal_entry_id IN (
      SELECT id FROM public.journal_entries
      WHERE company_id IN (
        SELECT id FROM public.company_settings
        WHERE user_id = auth.uid()
      )
    )
  );

-- Indexes for performance (if not already present)
CREATE INDEX IF NOT EXISTS chart_of_accounts_company_id_idx ON public.chart_of_accounts(company_id);
CREATE INDEX IF NOT EXISTS journal_entries_company_id_idx ON public.journal_entries(company_id);
CREATE INDEX IF NOT EXISTS journal_entry_lines_journal_entry_id_idx ON public.journal_entry_lines(journal_entry_id);

