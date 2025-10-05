-- ============================================================================
-- BAGDJA MARKETPLACE - ADD API KEYS TABLE
-- Migration: 20251006000003_add_api_keys_table
-- Description: Support flexible authentication for external integrations
-- ============================================================================

-- ============================================================================
-- TABLE: api_keys
-- Purpose: Store API keys for external app integrations
-- Supports: Linked auth (Level 2) and API-only auth (Level 3)
-- ============================================================================
-- 1. Hapus ekstensi di mana pun ia berada (jika diinstal di tempat yang salah)
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- 2. Instal ulang ekstensi secara eksplisit di SCHEMA "public"
CREATE EXTENSION "uuid-ossp" SCHEMA public; 

CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    
    -- Owner (can be NULL for system-level keys)
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- External project identification
    project_id TEXT NOT NULL,
    project_name TEXT,
    
    -- API Key details
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    
    -- Permissions (JSON array of scopes)
    -- Example: ["read:products", "write:orders", "read:analytics"]
    permissions JSONB DEFAULT '[]',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Usage tracking
    last_used_at TIMESTAMP WITH TIME ZONE,
    request_count INTEGER DEFAULT 0,
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_project_id ON public.api_keys(project_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON public.api_keys(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON public.api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.api_keys
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Comments
COMMENT ON TABLE public.api_keys IS 'API keys for external app integrations';
COMMENT ON COLUMN public.api_keys.user_id IS 'Owner of this API key (NULL for system keys)';
COMMENT ON COLUMN public.api_keys.project_id IS 'External project identifier (e.g., my-porto)';
COMMENT ON COLUMN public.api_keys.key_hash IS 'Hashed API key (bgdj_sk_...)';
COMMENT ON COLUMN public.api_keys.permissions IS 'Array of permission scopes';

-- Trigger for updated_at
CREATE TRIGGER set_api_keys_updated_at BEFORE UPDATE ON public.api_keys
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Sample permissions reference
-- ============================================================================
-- Common permission scopes:
--   "read:products"     - Can read products
--   "write:products"    - Can create/update products (own only)
--   "delete:products"   - Can delete products (own only)
--   "read:orders"       - Can read orders
--   "write:orders"      - Can create orders
--   "read:analytics"    - Can access analytics
--   "admin:*"           - Full admin access
-- ============================================================================

-- MIGRATION COMPLETE

