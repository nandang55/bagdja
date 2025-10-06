-- ============================================================================
-- FIX: Companies RLS for Update/Insert
-- Error: 403 Forbidden when saving company
-- ============================================================================

-- Drop existing policy and recreate with proper permissions
DROP POLICY IF EXISTS "Users can manage own companies" ON public.companies;

-- Separate policies for better control
CREATE POLICY "Users can view own companies"
    ON public.companies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies"
    ON public.companies FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies"
    ON public.companies FOR DELETE
    USING (auth.uid() = user_id);

-- Verify policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'companies';

-- Test: Check your user_id vs auth.uid()
DO $$
BEGIN
    RAISE NOTICE 'Your auth.uid(): %', auth.uid();
END $$;

-- Test: View your companies (should work)
SELECT id, company_name, user_id 
FROM public.companies 
WHERE user_id = auth.uid();

SELECT '✅ Companies RLS policies fixed!' as message;

