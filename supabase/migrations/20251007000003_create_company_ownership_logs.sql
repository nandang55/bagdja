-- ============================================================================
-- BAGDJA ACCOUNT - COMPANY OWNERSHIP LOGS
-- Migration: 20251007000003_create_company_ownership_logs
-- Description: Audit trail for company ownership transfers
-- ============================================================================

-- ============================================================================
-- TABLE: company_ownership_logs
-- Purpose: Track ownership history of companies (audit trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.company_ownership_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Transfer Info
    from_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    to_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Additional Info
    action TEXT NOT NULL CHECK (action IN ('created', 'transferred', 'updated')),
    notes TEXT,
    
    -- Metadata
    ip_address TEXT,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_ownership_logs_company_id ON public.company_ownership_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_ownership_logs_from_user ON public.company_ownership_logs(from_user_id);
CREATE INDEX IF NOT EXISTS idx_ownership_logs_to_user ON public.company_ownership_logs(to_user_id);
CREATE INDEX IF NOT EXISTS idx_ownership_logs_created_at ON public.company_ownership_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.company_ownership_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view logs for companies they own
CREATE POLICY "Users can view logs for own companies"
    ON public.company_ownership_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = company_ownership_logs.company_id
            AND companies.user_id = auth.uid()
        )
    );

-- Policy: System can insert logs (via trigger)
CREATE POLICY "Service can insert ownership logs"
    ON public.company_ownership_logs FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- FUNCTION: Auto-log company creation
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_company_creation()
RETURNS TRIGGER AS $$
BEGIN
    -- Log initial ownership when company is created
    INSERT INTO public.company_ownership_logs (
        company_id,
        from_user_id,
        to_user_id,
        action,
        notes
    ) VALUES (
        NEW.id,
        NULL,  -- No previous owner
        NEW.user_id,
        'created',
        'Company created by ' || NEW.user_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_company_creation_trigger
    AFTER INSERT ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.log_company_creation();

-- ============================================================================
-- FUNCTION: Auto-log ownership transfer
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_company_transfer()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if user_id changed (ownership transfer)
    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
        INSERT INTO public.company_ownership_logs (
            company_id,
            from_user_id,
            to_user_id,
            action,
            notes
        ) VALUES (
            NEW.id,
            OLD.user_id,
            NEW.user_id,
            'transferred',
            'Ownership transferred from ' || OLD.user_id || ' to ' || NEW.user_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_company_transfer_trigger
    AFTER UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.log_company_transfer();

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================
COMMENT ON TABLE public.company_ownership_logs IS 'Audit trail for company ownership changes';
COMMENT ON COLUMN public.company_ownership_logs.action IS 'Type of action: created, transferred, updated';
COMMENT ON COLUMN public.company_ownership_logs.from_user_id IS 'Previous owner (NULL if company just created)';
COMMENT ON COLUMN public.company_ownership_logs.to_user_id IS 'New owner';

-- ============================================================================
-- VIEW: Company ownership history with user details
-- ============================================================================
CREATE OR REPLACE VIEW public.company_ownership_history AS
SELECT 
    l.id,
    l.company_id,
    c.company_name,
    l.action,
    l.from_user_id,
    u1.email as from_user_email,
    u1.full_name as from_user_name,
    l.to_user_id,
    u2.email as to_user_email,
    u2.full_name as to_user_name,
    l.notes,
    l.created_at
FROM public.company_ownership_logs l
JOIN public.companies c ON c.id = l.company_id
LEFT JOIN public.users u1 ON u1.id = l.from_user_id
LEFT JOIN public.users u2 ON u2.id = l.to_user_id
ORDER BY l.created_at DESC;

-- Grant access to view
GRANT SELECT ON public.company_ownership_history TO authenticated;

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- View all transfers for a company
/*
SELECT * FROM public.company_ownership_history
WHERE company_id = 'company-uuid-here'
ORDER BY created_at DESC;
*/

-- View your company ownership history
/*
SELECT * FROM public.company_ownership_history
WHERE to_user_id = auth.uid() OR from_user_id = auth.uid()
ORDER BY created_at DESC;
*/

-- Count transfers per company
/*
SELECT 
    company_id,
    company_name,
    COUNT(*) as total_transfers
FROM public.company_ownership_history
WHERE action = 'transferred'
GROUP BY company_id, company_name
ORDER BY total_transfers DESC;
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT 'Company ownership logs table created successfully!' as message;

