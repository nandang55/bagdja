-- ============================================================================
-- BAGDJA ACCOUNT - PROFILES TABLE MIGRATION
-- Migration: 20251007000001_create_profiles_table
-- Description: Create profiles table for user account management
-- ============================================================================

-- ============================================================================
-- TABLE: profiles
-- Purpose: Extended user profile information for Bagdja Account service
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Account Info
    email TEXT UNIQUE,
    
    -- Basic Info
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    
    -- Contact Info
    phone TEXT,
    website TEXT,
    
    -- Additional Info
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    
    -- Preferences (JSONB for flexibility)
    preferences JSONB DEFAULT '{
        "theme": "dark",
        "language": "en",
        "notifications": {
            "email": true,
            "push": false,
            "marketing": false
        }
    }'::jsonb,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can search profiles by email (for transfer feature)
CREATE POLICY "Users can search profiles by email"
    ON public.profiles FOR SELECT
    USING (true);

-- Policy: Users can insert own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Users can update own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can delete own profile
CREATE POLICY "Users can delete own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id);

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
        NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        email_verified = EXCLUDED.email_verified;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================
COMMENT ON TABLE public.profiles IS 'User profile information for Bagdja Account service';
COMMENT ON COLUMN public.profiles.username IS 'Unique username for the user';
COMMENT ON COLUMN public.profiles.preferences IS 'User preferences stored as JSONB for flexibility';
COMMENT ON COLUMN public.profiles.is_active IS 'Whether the profile is active and visible to others';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment to add sample profiles
-- Note: These will only work if the corresponding auth.users exist

/*
INSERT INTO public.profiles (id, username, full_name, bio, is_active) 
VALUES 
    -- You can add sample data here after users are created
    -- Example:
    -- ('user-uuid-here', 'johndoe', 'John Doe', 'Software Developer', TRUE)
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

