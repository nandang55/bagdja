-- ============================================================================
-- BAGDJA ACCOUNT - COMPANIES TABLE MIGRATION
-- Migration: 20251007000002_create_companies_table
-- Description: Create companies table (one user can have multiple companies)
-- ============================================================================

-- ============================================================================
-- TABLE: companies
-- Purpose: Store company information (one-to-many relationship with users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Company Basic Info
    company_name TEXT NOT NULL,
    business_type TEXT CHECK (business_type IN ('sole_proprietorship', 'partnership', 'corporation', 'llc', 'nonprofit', 'other')),
    
    -- Contact Information
    company_phone TEXT,
    company_email TEXT,
    company_website TEXT,
    
    -- Address
    company_address TEXT,
    company_city TEXT,
    company_country TEXT,
    company_postal_code TEXT,
    
    -- Legal & Tax
    tax_id TEXT,
    registration_number TEXT,
    
    -- Settings
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Additional Info
    description TEXT,
    logo_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_primary ON public.companies(user_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON public.companies(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON public.companies(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own companies
CREATE POLICY "Users can view own companies"
    ON public.companies FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert own companies
CREATE POLICY "Users can insert own companies"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update own companies
CREATE POLICY "Users can update own companies"
    ON public.companies FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete own companies
CREATE POLICY "Users can delete own companies"
    ON public.companies FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE TRIGGER set_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- FUNCTION: Ensure only one primary company per user
-- ============================================================================
CREATE OR REPLACE FUNCTION public.ensure_one_primary_company()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this company as primary, unset all other primary companies for this user
    IF NEW.is_primary = TRUE THEN
        UPDATE public.companies
        SET is_primary = FALSE
        WHERE user_id = NEW.user_id
        AND id != NEW.id
        AND is_primary = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ensure_one_primary_company_trigger
    BEFORE INSERT OR UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_one_primary_company();

-- ============================================================================
-- COMMENTS for Documentation
-- ============================================================================
COMMENT ON TABLE public.companies IS 'Company profiles owned by users (one-to-many relationship)';
COMMENT ON COLUMN public.companies.user_id IS 'Owner of this company profile';
COMMENT ON COLUMN public.companies.is_primary IS 'Mark as primary/default company for the user';
COMMENT ON COLUMN public.companies.is_active IS 'Whether company is active';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
-- Uncomment to add sample companies
/*
INSERT INTO public.companies (user_id, company_name, business_type, company_email, is_primary) 
VALUES 
    ('user-uuid-here', 'Tech Corp', 'corporation', 'info@techcorp.com', TRUE),
    ('user-uuid-here', 'Startup Inc', 'llc', 'hello@startup.com', FALSE)
ON CONFLICT DO NOTHING;
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT 'Companies table created successfully!' as message;

