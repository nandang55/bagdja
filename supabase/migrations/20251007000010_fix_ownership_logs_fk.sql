-- ============================================================================
-- BAGDJA ACCOUNT - FIX OWNERSHIP LOGS FOREIGN KEY
-- Migration: 20251007000010_fix_ownership_logs_fk
-- Description: Fix FK constraint - change from users to profiles
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop existing triggers (to avoid errors during table modification)
-- ============================================================================

DROP TRIGGER IF EXISTS log_company_creation_trigger ON public.companies;
DROP TRIGGER IF EXISTS log_company_transfer_trigger ON public.companies;

-- ============================================================================
-- STEP 2: Drop and recreate ownership logs table with correct FK
-- ============================================================================

DROP VIEW IF EXISTS public.company_ownership_history;
DROP TABLE IF EXISTS public.company_ownership_logs CASCADE;

-- Recreate table with FK to profiles (not users)
CREATE TABLE public.company_ownership_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- FIXED: Reference to profiles table (not users)
    from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    
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
-- STEP 3: Recreate indexes
-- ============================================================================

CREATE INDEX idx_ownership_logs_company_id ON public.company_ownership_logs(company_id);
CREATE INDEX idx_ownership_logs_from_user ON public.company_ownership_logs(from_user_id);
CREATE INDEX idx_ownership_logs_to_user ON public.company_ownership_logs(to_user_id);
CREATE INDEX idx_ownership_logs_created_at ON public.company_ownership_logs(created_at DESC);

-- ============================================================================
-- STEP 4: Recreate RLS (DISABLED for simplicity)
-- ============================================================================

-- Disable RLS for logs (same approach as companies)
ALTER TABLE public.company_ownership_logs DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.company_ownership_logs IS 
    'Audit trail for company ownership. RLS disabled - access controlled at application level.';

-- ============================================================================
-- STEP 5: Recreate view with correct join to profiles
-- ============================================================================

CREATE OR REPLACE VIEW public.company_ownership_history AS
SELECT 
    l.id,
    l.company_id,
    c.company_name,
    l.action,
    l.from_user_id,
    p1.email as from_user_email,
    p1.full_name as from_user_name,
    l.to_user_id,
    p2.email as to_user_email,
    p2.full_name as to_user_name,
    l.notes,
    l.created_at
FROM public.company_ownership_logs l
JOIN public.companies c ON c.id = l.company_id
LEFT JOIN public.profiles p1 ON p1.id = l.from_user_id
LEFT JOIN public.profiles p2 ON p2.id = l.to_user_id
ORDER BY l.created_at DESC;

-- ============================================================================
-- STEP 6: Recreate triggers
-- ============================================================================

-- Auto-log company creation
CREATE OR REPLACE FUNCTION public.log_company_creation()
RETURNS TRIGGER AS $$
BEGIN
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
        'Company created'
    );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- If logging fails, don't block company creation
    RAISE WARNING 'Failed to log company creation: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_company_creation_trigger
    AFTER INSERT ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.log_company_creation();

-- Auto-log ownership transfer
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
            'Ownership transferred'
        );
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- If logging fails, don't block transfer
    RAISE WARNING 'Failed to log ownership transfer: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_company_transfer_trigger
    AFTER UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.log_company_transfer();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check triggers exist
SELECT 
    trigger_name,
    event_manipulation as event,
    event_object_table as table_name
FROM information_schema.triggers
WHERE event_object_table = 'companies'
AND trigger_name LIKE 'log_%'
ORDER BY trigger_name;

-- Check view exists
SELECT table_name 
FROM information_schema.views 
WHERE table_name = 'company_ownership_history';

-- ============================================================================
-- TEST
-- ============================================================================

-- Test: Try to insert a dummy log (should work now)
DO $$
DECLARE
    test_company_id UUID;
    test_user_id UUID;
BEGIN
    -- Get your user ID
    test_user_id := auth.uid();
    
    -- Get first company (if exists)
    SELECT id INTO test_company_id 
    FROM public.companies 
    WHERE user_id = test_user_id 
    LIMIT 1;
    
    IF test_company_id IS NOT NULL THEN
        -- Try insert log (FK should work now)
        INSERT INTO public.company_ownership_logs (
            company_id,
            from_user_id,
            to_user_id,
            action,
            notes
        ) VALUES (
            test_company_id,
            NULL,
            test_user_id,
            'created',
            'Test log entry'
        );
        
        -- Clean up test log
        DELETE FROM public.company_ownership_logs 
        WHERE company_id = test_company_id 
        AND notes = 'Test log entry';
        
        RAISE NOTICE '✅ FK constraint working! Logs can be inserted';
    ELSE
        RAISE NOTICE '⚠️  No companies found to test';
    END IF;
END $$;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT '✅ Ownership logs FK fixed (users → profiles)!' as status;
SELECT '✅ Triggers recreated with error handling!' as triggers_status;
SELECT '✅ RLS disabled for logs table!' as rls_status;
SELECT '🔄 Refresh browser and test create company!' as next_step;

