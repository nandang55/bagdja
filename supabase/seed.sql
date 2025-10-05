-- ============================================================================
-- BAGDJA MARKETPLACE - SEED DATA (Optional Development Data)
-- ============================================================================
-- This file is for optional seed data for local development
-- Run with: supabase db reset (will run all migrations + seed)
-- ============================================================================

-- Note: Categories are seeded in migration 20251006000002_seed_categories.sql

-- Additional seed data can be added here for local development
-- For example: test users, sample products, etc.

-- Example: Insert test products (only for local development)
-- Uncomment below if you want sample products:

/*
-- First, ensure we have a test developer user
-- You'll need to create this user via Supabase Auth first, then insert:

INSERT INTO public.products (
    owner_id,
    category_id,
    name,
    slug,
    description,
    price,
    stock,
    image_url,
    status
) VALUES
    (
        'YOUR-USER-UUID-HERE',
        (SELECT id FROM public.categories WHERE slug = 'electronics' LIMIT 1),
        'Wireless Bluetooth Headphones',
        'wireless-bluetooth-headphones',
        'Premium wireless headphones with noise cancellation and 30-hour battery life',
        99.99,
        50,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'published'
    ),
    (
        'YOUR-USER-UUID-HERE',
        (SELECT id FROM public.categories WHERE slug = 'electronics' LIMIT 1),
        'Mechanical Gaming Keyboard',
        'mechanical-gaming-keyboard',
        'RGB mechanical keyboard with cherry MX switches',
        129.99,
        30,
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
        'published'
    ),
    (
        'YOUR-USER-UUID-HERE',
        (SELECT id FROM public.categories WHERE slug = 'fashion' LIMIT 1),
        'Classic Leather Jacket',
        'classic-leather-jacket',
        'Genuine leather jacket with vintage style',
        249.99,
        15,
        'https://images.unsplash.com/photo-1551028719-00167b16eac5',
        'published'
    )
ON CONFLICT (slug) DO NOTHING;
*/

-- Instructions:
-- 1. Create a developer user via Supabase Auth (Console Frontend)
-- 2. Get the user UUID from auth.users table
-- 3. Replace 'YOUR-USER-UUID-HERE' with actual UUID
-- 4. Uncomment the INSERT statement above
-- 5. Run: supabase db reset

