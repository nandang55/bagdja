-- ============================================================================
-- BAGDJA MARKETPLACE - SUPABASE DATABASE SCHEMA (MVP)
-- ============================================================================
-- This schema is designed for a centralized Supabase project
-- RLS is mostly DISABLED as security is enforced by the API layer
-- The API uses the Service Role Key and implements business logic
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- Purpose: Extend Supabase auth.users with marketplace roles
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'Buyer' CHECK (role IN ('Buyer', 'Developer', 'Admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Disabled for Service Role Key (API manages security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TABLE: categories
-- Purpose: Product categorization (e.g., Electronics, Fashion, Books)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Disabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Sample categories for MVP
INSERT INTO public.categories (name, slug, description, is_active) VALUES
    ('Electronics', 'electronics', 'Gadgets, computers, and tech accessories', TRUE),
    ('Fashion', 'fashion', 'Clothing, shoes, and accessories', TRUE),
    ('Books', 'books', 'Physical and digital books', TRUE),
    ('Home & Garden', 'home-garden', 'Furniture, decor, and gardening tools', TRUE),
    ('Sports', 'sports', 'Sports equipment and fitness gear', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- TABLE: products
-- Purpose: Central product catalog with owner isolation
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    
    -- Product Information
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    
    -- Media
    image_url TEXT,
    images JSONB DEFAULT '[]', -- Array of image URLs
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    CONSTRAINT products_slug_key UNIQUE (slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_owner_id ON public.products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- RLS: Disabled (API enforces owner isolation)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.products
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TABLE: reviews
-- Purpose: Product reviews and ratings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One review per user per product
    CONSTRAINT reviews_product_user_unique UNIQUE (product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- RLS: Disabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.reviews
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TABLE: transactions
-- Purpose: Order and payment tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    
    -- Transaction details
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded')),
    
    -- Payment info
    payment_method TEXT,
    payment_id TEXT, -- External payment provider ID
    
    -- Shipping
    shipping_address JSONB,
    tracking_number TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- RLS: Disabled
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.transactions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TABLE: transaction_items
-- Purpose: Line items for each transaction
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON public.transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_product_id ON public.transaction_items(product_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_seller_id ON public.transaction_items(seller_id);

-- RLS: Disabled
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.transaction_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- TABLE: messages
-- Purpose: Buyer-Seller messaging system
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    
    subject TEXT,
    message TEXT NOT NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    parent_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_product_id ON public.messages(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- RLS: Disabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.messages
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SAMPLE DATA FOR MVP TESTING
-- ============================================================================

-- Note: You'll need to create users through Supabase Auth first,
-- then insert them into the users table with their UUID from auth.users

-- Example: After creating auth users, insert into public.users:
-- INSERT INTO public.users (id, email, full_name, role) VALUES
--     ('your-uuid-here', 'developer@example.com', 'John Developer', 'Developer'),
--     ('your-uuid-here', 'buyer@example.com', 'Jane Buyer', 'Buyer');

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
-- 1. RLS is enabled but configured for Service Role Key access only
-- 2. The API layer (bagdja-api-services) enforces ALL business logic
-- 3. Never expose the Service Role Key to frontends
-- 4. Frontends use Anon Key only for authentication (Supabase Auth)
-- 5. All data operations must go through the API

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

