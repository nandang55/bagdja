-- ============================================================================
-- BAGDJA ACCOUNT - UPDATE RLS FOR TRANSFER FEATURE
-- Migration: 20251007000004_update_rls_for_transfer
-- Description: Update RLS policies to allow user lookup for transfer feature
-- ============================================================================

-- ============================================================================
-- UPDATE: Profiles Table RLS
-- ============================================================================

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create new policy: Allow all users to search profiles by email
-- This is needed for transfer company feature
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can search profiles by email'
    ) THEN
        CREATE POLICY "Users can search profiles by email"
            ON public.profiles FOR SELECT
            USING (true);
    END IF;
END $$;

-- Note: This allows users to search by email, which is needed for:
-- 1. Transfer company feature
-- 2. Future: Invite/share features
-- 3. Future: Team member search

COMMENT ON POLICY "Users can search profiles by email" ON public.profiles IS 
    'Allow users to search profiles by email for transfer and collaboration features';

-- ============================================================================
-- UPDATE: Users Table RLS (Optional - for marketplace integration)
-- ============================================================================

-- Only run this if 'users' table exists in your database
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) THEN
        -- Check if policy already exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'users' 
            AND policyname = 'Users can search by email for transfer'
        ) THEN
            -- Create policy
            CREATE POLICY "Users can search by email for transfer" 
                ON public.users FOR SELECT 
                USING (true);
            
            RAISE NOTICE 'Users table RLS policy created';
        ELSE
            RAISE NOTICE 'Users table RLS policy already exists';
        END IF;
    ELSE
        RAISE NOTICE 'Users table not found, skipping...';
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check profiles policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test query: Verify email column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ) THEN
        RAISE NOTICE 'Email column exists in profiles table ✅';
    ELSE
        RAISE WARNING 'Email column missing! Run migration 1 first!';
    END IF;
END $$;

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================

-- To rollback this migration, run:
/*
DROP POLICY IF EXISTS "Users can search profiles by email" ON public.profiles;
DROP POLICY IF EXISTS "Users can search by email for transfer" ON public.users;

-- Restore original restrictive policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT 'RLS policies updated for transfer feature!' as message;

