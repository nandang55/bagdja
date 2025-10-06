-- ============================================================================
-- BAGDJA ACCOUNT - FIX RLS AND EMAIL COLUMN
-- Migration: 20251007000007_fix_rls_and_email
-- Description: Fix 403 Forbidden error by updating RLS policies and adding email column
-- ============================================================================

-- ============================================================================
-- STEP 1: Add Email to Profiles (if not exists)
-- ============================================================================

DO $$ 
BEGIN
    -- Add email column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT UNIQUE;
        RAISE NOTICE '✅ Email column added to profiles';
    ELSE
        RAISE NOTICE '✅ Email column already exists';
    END IF;
END $$;

-- Sync emails from auth.users to profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.email = '');

-- ============================================================================
-- STEP 2: Fix Companies RLS Policies
-- ============================================================================

-- Drop old broad policy
DROP POLICY IF EXISTS "Users can manage own companies" ON public.companies;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Users can view own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can delete own companies" ON public.companies;

-- Create 4 separate policies with proper permissions
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

-- ============================================================================
-- STEP 3: Fix Profiles RLS for Search
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can search profiles by email" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- Create new policies
CREATE POLICY "Users can search profiles by email"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check email column exists
DO $$
DECLARE
    has_email BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ) INTO has_email;
    
    IF has_email THEN
        RAISE NOTICE '✅ Email column exists in profiles';
    ELSE
        RAISE WARNING '❌ Email column missing!';
    END IF;
END $$;

-- Check companies policies (should be 4)
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'companies';
    
    RAISE NOTICE 'Companies table has % RLS policies', policy_count;
END $$;

-- Check profiles policies (should be 4)
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'profiles';
    
    RAISE NOTICE 'Profiles table has % RLS policies', policy_count;
END $$;

-- Show policies summary
SELECT 
    'companies' as table_name,
    policyname,
    cmd as command
FROM pg_policies 
WHERE tablename = 'companies'
UNION ALL
SELECT 
    'profiles' as table_name,
    policyname,
    cmd as command
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY table_name, policyname;

-- ============================================================================
-- FINAL MESSAGE
-- ============================================================================

SELECT '✅ All RLS policies fixed!' as status;
SELECT 'Email column added and synced!' as email_status;
SELECT '🔄 Refresh browser and try save company!' as next_step;

