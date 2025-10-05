-- ============================================================================
-- BAGDJA MARKETPLACE - SEED CATEGORIES
-- Migration: 20251006000002_seed_categories
-- Description: Insert sample categories for marketplace
-- ============================================================================

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, is_active) VALUES
    ('Electronics', 'electronics', 'Gadgets, computers, and tech accessories', TRUE),
    ('Fashion', 'fashion', 'Clothing, shoes, and accessories', TRUE),
    ('Books', 'books', 'Physical and digital books', TRUE),
    ('Home & Garden', 'home-garden', 'Furniture, decor, and gardening tools', TRUE),
    ('Sports', 'sports', 'Sports equipment and fitness gear', TRUE)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON COLUMN public.categories.name IS 'Display name of the category';
COMMENT ON COLUMN public.categories.slug IS 'URL-friendly identifier';

