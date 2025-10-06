-- ============================================================================
-- BAGDJA ACCOUNT - SYNC EXISTING PROFILES EMAIL
-- Migration: 20251007000005_sync_existing_profiles_email
-- Description: Update existing profiles with email from auth.users
-- ============================================================================

-- This migration is for EXISTING databases where profiles already exist
-- If fresh setup, skip this - Migration 1 already includes email column

-- ============================================================================
-- ADD EMAIL COLUMN (if not exists)
-- ============================================================================

DO $$ 
BEGIN
    -- Check if email column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ) THEN
        -- Add email column
        ALTER TABLE public.profiles 
        ADD COLUMN email TEXT UNIQUE;
        
        RAISE NOTICE 'Email column added to profiles table';
    ELSE
        RAISE NOTICE 'Email column already exists';
    END IF;
END $$;

-- ============================================================================
-- SYNC EMAIL FROM AUTH.USERS TO PROFILES
-- ============================================================================

-- Update existing profiles with email from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND p.email IS NULL;

-- Log how many profiles were updated
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count
    FROM public.profiles
    WHERE email IS NOT NULL;
    
    RAISE NOTICE '% profiles now have email addresses', updated_count;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check all profiles have email
SELECT 
    COUNT(*) as total_profiles,
    COUNT(email) as profiles_with_email,
    COUNT(*) - COUNT(email) as profiles_without_email
FROM public.profiles;

-- Show sample profiles
SELECT id, email, username, full_name 
FROM public.profiles 
LIMIT 5;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT 'Existing profiles synced with email!' as message;

