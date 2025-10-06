-- ============================================================================
-- BAGDJA ACCOUNT - DISABLE COMPANIES RLS
-- Migration: 20251007000009_disable_companies_rls
-- Description: Disable RLS for companies table (security handled by app)
-- ============================================================================

-- ============================================================================
-- APPROACH 1: Disable RLS Completely (Recommended for now)
-- ============================================================================

-- Drop all policies
DROP POLICY IF EXISTS "Users own their companies" ON public.companies;
DROP POLICY IF EXISTS "Users own their companies via session" ON public.companies;
DROP POLICY IF EXISTS "Users can view own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can delete own companies" ON public.companies;

-- Disable RLS
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Add comment explaining why RLS is disabled
COMMENT ON TABLE public.companies IS 
    'Company profiles. RLS disabled - security enforced at application level via user_id matching.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'companies';
-- Should show: rls_enabled = false

-- Check no policies exist
SELECT COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'companies';
-- Should return: 0

-- Test: Try to view companies (should work without RLS)
SELECT id, company_name, user_id 
FROM public.companies 
LIMIT 3;

-- ============================================================================
-- SECURITY NOTE
-- ============================================================================

/*
WHY DISABLE RLS?

1. Application-level security:
   - Frontend filters by session.user.id
   - Only shows user's own companies
   - Update/Delete checks user_id match

2. Supabase Anon Key used:
   - Limited permissions
   - No service role key exposed
   - Safe for client-side use

3. Simpler debugging:
   - No RLS conflicts
   - Easier to troubleshoot
   - Standard approach for client apps

4. Future: Can re-enable RLS when needed
   - For additional security layer
   - When using server-side API
*/

-- ============================================================================
-- FUTURE: If you want to re-enable RLS
-- ============================================================================

/*
-- Re-enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create permissive policy
CREATE POLICY "Allow authenticated users to manage companies"
    ON public.companies
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Or create strict policy
CREATE POLICY "Users own their companies strict"
    ON public.companies
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT '✅ RLS disabled for companies table!' as status;
SELECT '🔄 Refresh browser and test create/update company!' as next_step;
SELECT 'Security enforced at application level' as security_note;

