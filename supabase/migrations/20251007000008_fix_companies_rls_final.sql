-- ============================================================================
-- BAGDJA ACCOUNT - FIX COMPANIES RLS (FINAL FIX)
-- Migration: 20251007000008_fix_companies_rls_final
-- Description: Ultimate fix for 403 Forbidden error
-- ============================================================================

-- ============================================================================
-- STEP 1: Temporary disable RLS for debugging
-- ============================================================================

-- Temporarily disable to check if RLS is the issue
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Check user_id column type and auth.uid() compatibility
-- ============================================================================

-- Ensure user_id references profiles.id (which references auth.users.id)
DO $$
BEGIN
    RAISE NOTICE '=== DEBUGGING INFO ===';
    RAISE NOTICE 'Checking companies table structure...';
END $$;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'companies'
AND column_name = 'user_id';

-- ============================================================================
-- STEP 3: Re-enable RLS with SIMPLER policies
-- ============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can manage own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can view own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can delete own companies" ON public.companies;
DROP POLICY IF EXISTS "Service role has full access" ON public.companies;

-- Create ONE simple policy for ALL operations
-- This is simpler and less prone to issues
CREATE POLICY "Users own their companies"
    ON public.companies
    FOR ALL
    USING (
        user_id = auth.uid()
    )
    WITH CHECK (
        user_id = auth.uid()
    );

-- ============================================================================
-- ALTERNATIVE: If auth.uid() still has issues, use session approach
-- ============================================================================

-- If the above doesn't work, try this alternative:
/*
DROP POLICY IF EXISTS "Users own their companies" ON public.companies;

CREATE POLICY "Users own their companies via session"
    ON public.companies
    FOR ALL
    USING (
        user_id = (SELECT auth.uid())
        OR
        user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
    WITH CHECK (
        user_id = (SELECT auth.uid())
        OR
        user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    );
*/

-- ============================================================================
-- STEP 4: Verify Setup
-- ============================================================================

-- Check RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'companies';

-- Check policies (should have 1 policy now)
SELECT 
    policyname,
    cmd as for_operation,
    qual as using_expression,
    with_check as check_expression
FROM pg_policies 
WHERE tablename = 'companies';

-- Test: Check if you can see your companies
DO $$
DECLARE
    company_count INTEGER;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    SELECT COUNT(*) INTO company_count
    FROM public.companies 
    WHERE user_id = current_user_id;
    
    RAISE NOTICE 'Your user_id: %', current_user_id;
    RAISE NOTICE 'Your companies count: %', company_count;
    
    IF company_count > 0 THEN
        RAISE NOTICE '✅ RLS working! You can see your companies';
    ELSE
        RAISE NOTICE '⚠️  No companies found or RLS still blocking';
    END IF;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users own their companies" ON public.companies IS 
    'Allows users full CRUD access to their own companies. Simplified single policy approach.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT '✅ Companies RLS fixed with simplified policy!' as status;
SELECT '🔄 Refresh browser and test save company!' as next_step;

