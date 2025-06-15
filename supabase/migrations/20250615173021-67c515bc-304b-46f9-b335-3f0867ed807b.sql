
-- Drop existing policies if they exist and then create new ones
-- Enable Row Level Security and add strict tenant/user-based access policies

-- 1. accounting_periods (by company_id)
ALTER TABLE public.accounting_periods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company users can view own accounting periods" ON public.accounting_periods;
DROP POLICY IF EXISTS "Company users can manage own accounting periods" ON public.accounting_periods;

CREATE POLICY "Company users can view own accounting periods"
    ON public.accounting_periods FOR SELECT
    USING (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    );

CREATE POLICY "Company users can manage own accounting periods"
    ON public.accounting_periods FOR ALL
    USING (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    );

-- 2. approval_requests (requester/approver-based access)
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Requesters and approvers can view approval requests" ON public.approval_requests;
DROP POLICY IF EXISTS "Requesters can insert approval requests" ON public.approval_requests;
DROP POLICY IF EXISTS "Approvers can update requests" ON public.approval_requests;
DROP POLICY IF EXISTS "Requesters can delete their approval requests" ON public.approval_requests;

CREATE POLICY "Requesters and approvers can view approval requests"
    ON public.approval_requests FOR SELECT
    USING (requester_id = auth.uid() OR approver_id = auth.uid());

CREATE POLICY "Requesters can insert approval requests"
    ON public.approval_requests FOR INSERT
    WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Approvers can update requests"
    ON public.approval_requests FOR UPDATE
    USING (approver_id = auth.uid());

CREATE POLICY "Requesters can delete their approval requests"
    ON public.approval_requests FOR DELETE
    USING (requester_id = auth.uid());

-- 3. approval_rules (company_id)
ALTER TABLE public.approval_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company users can view own approval rules" ON public.approval_rules;
DROP POLICY IF EXISTS "Company users can manage own approval rules" ON public.approval_rules;

CREATE POLICY "Company users can view own approval rules"
    ON public.approval_rules FOR SELECT
    USING (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    );

CREATE POLICY "Company users can manage own approval rules"
    ON public.approval_rules FOR ALL
    USING (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    );

-- 4. audit_logs (user_id)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON public.audit_logs;

CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- 6. journal_entries (company_id)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company users can view own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Company users can manage own journal entries" ON public.journal_entries;

CREATE POLICY "Company users can view own journal entries"
    ON public.journal_entries FOR SELECT
    USING (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    );

CREATE POLICY "Company users can manage own journal entries"
    ON public.journal_entries FOR ALL
    USING (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    )
    WITH CHECK (
      company_id IN (
        SELECT id FROM public.company_settings WHERE user_id = auth.uid()
      )
    );

-- 7. journal_entry_lines (journal_entry_id parent check)
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company users can view entry lines by journal entry" ON public.journal_entry_lines;
DROP POLICY IF EXISTS "Company users can manage entry lines by journal entry" ON public.journal_entry_lines;

CREATE POLICY "Company users can view entry lines by journal entry"
    ON public.journal_entry_lines FOR SELECT
    USING (
      journal_entry_id IN (
        SELECT id FROM public.journal_entries
        WHERE company_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      )
    );

CREATE POLICY "Company users can manage entry lines by journal entry"
    ON public.journal_entry_lines FOR ALL
    USING (
      journal_entry_id IN (
        SELECT id FROM public.journal_entries
        WHERE company_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      )
    )
    WITH CHECK (
      journal_entry_id IN (
        SELECT id FROM public.journal_entries
        WHERE company_id IN (
          SELECT id FROM public.company_settings WHERE user_id = auth.uid()
        )
      )
    );
