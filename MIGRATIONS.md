# 🔄 DATABASE MIGRATIONS GUIDE

Panduan lengkap untuk mengelola database migrations menggunakan Supabase CLI.

## 📋 Overview

Project ini menggunakan **Supabase CLI** untuk database migrations yang memberikan:
- ✅ Version control untuk database schema
- ✅ Incremental changes yang tracked
- ✅ Rollback capabilities
- ✅ Team collaboration yang mudah
- ✅ Local development database
- ✅ Git-based workflow

## 🛠️ Setup Supabase CLI

### 1. Install Supabase CLI

**macOS (Homebrew):**
```bash
brew install supabase/tap/supabase
```

**npm (All Platforms):**
```bash
npm install -g supabase
```

**Verify Installation:**
```bash
supabase --version
```

### 2. Login ke Supabase

```bash
supabase login
```

Browser akan terbuka untuk authentication.

### 3. Link Project ke Supabase

```bash
cd /Users/nandanghermawan/Project/bagdja
supabase link --project-ref your-project-ref
```

**Find your project-ref:**
- Buka Supabase Dashboard
- Settings → General
- Copy "Reference ID"

## 📁 Migration Structure

```
bagdja/
├── supabase/
│   ├── config.toml              # Supabase configuration
│   ├── seed.sql                 # Seed data (optional)
│   └── migrations/
│       ├── 20251006000001_initial_schema.sql
│       ├── 20251006000002_add_sample_categories.sql
│       └── [timestamp]_[description].sql
```

## 🎯 Migration Workflow

### Create New Migration

```bash
# Membuat migration file baru
supabase migration new add_column_to_products

# File akan dibuat di: supabase/migrations/[timestamp]_add_column_to_products.sql
```

### Write Migration

Edit file yang baru dibuat:

```sql
-- supabase/migrations/20251006120000_add_column_to_products.sql

-- Add new column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Add index
CREATE INDEX IF NOT EXISTS idx_products_featured_until 
ON public.products(featured_until);

-- Update existing data (optional)
UPDATE public.products 
SET featured_until = NOW() + INTERVAL '30 days' 
WHERE is_featured = TRUE;
```

### Apply Migrations

**To Local Database:**
```bash
# Start local Supabase (includes PostgreSQL)
supabase start

# Apply all pending migrations
supabase db push
```

**To Remote (Production):**
```bash
# Push migrations to linked project
supabase db push --linked
```

### Check Migration Status

```bash
# Check which migrations have been applied
supabase migration list

# Check database status
supabase db status
```

## 🔄 Common Migration Tasks

### 1. Add New Table

```bash
supabase migration new create_wishlists_table
```

```sql
-- supabase/migrations/[timestamp]_create_wishlists_table.sql

CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One wishlist entry per user per product
    CONSTRAINT wishlists_user_product_unique UNIQUE (user_id, product_id)
);

-- Add indexes
CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON public.wishlists(product_id);

-- RLS policies
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access" ON public.wishlists
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

### 2. Add Column to Existing Table

```bash
supabase migration new add_discount_to_products
```

```sql
-- Add column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0 
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Add comment
COMMENT ON COLUMN public.products.discount_percentage 
IS 'Discount percentage (0-100)';
```

### 3. Modify Column

```bash
supabase migration new modify_product_price_precision
```

```sql
-- Change decimal precision
ALTER TABLE public.products 
ALTER COLUMN price TYPE DECIMAL(12, 2);

-- Add constraint
ALTER TABLE public.products 
ADD CONSTRAINT price_positive CHECK (price > 0);
```

### 4. Add Index

```bash
supabase migration new add_search_indexes
```

```sql
-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search 
ON public.products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Composite index
CREATE INDEX IF NOT EXISTS idx_products_category_status 
ON public.products(category_id, status);
```

### 5. Seed Data Migration

```bash
supabase migration new seed_sample_products
```

```sql
-- Insert sample products for testing
INSERT INTO public.products (
    owner_id, 
    category_id, 
    name, 
    slug, 
    description, 
    price, 
    stock, 
    status
) VALUES
    (
        (SELECT id FROM public.users WHERE role = 'Developer' LIMIT 1),
        (SELECT id FROM public.categories WHERE slug = 'electronics' LIMIT 1),
        'Wireless Mouse',
        'wireless-mouse',
        'Ergonomic wireless mouse with 2.4GHz connection',
        29.99,
        100,
        'published'
    ),
    (
        (SELECT id FROM public.users WHERE role = 'Developer' LIMIT 1),
        (SELECT id FROM public.categories WHERE slug = 'electronics' LIMIT 1),
        'Mechanical Keyboard',
        'mechanical-keyboard',
        'RGB mechanical keyboard with blue switches',
        89.99,
        50,
        'published'
    )
ON CONFLICT (slug) DO NOTHING;
```

## 🔙 Rollback Migrations

### Rollback Last Migration (Local)

```bash
# Rollback last migration
supabase migration repair --status reverted [migration-version]

# Example:
supabase migration repair --status reverted 20251006120000
```

### Create Explicit Rollback Migration

```bash
supabase migration new rollback_add_discount_column
```

```sql
-- Rollback: remove discount column
ALTER TABLE public.products 
DROP COLUMN IF EXISTS discount_percentage;
```

## 🧪 Local Development Workflow

### 1. Start Local Supabase

```bash
cd /Users/nandanghermawan/Project/bagdja
supabase start
```

Output akan menampilkan:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
```

### 2. Apply Migrations Locally

```bash
supabase db push
```

### 3. Test Changes

- Open Supabase Studio: http://localhost:54323
- Test dengan API (port 54321)
- Verify schema di Table Editor

### 4. Reset Local Database (jika perlu)

```bash
# Reset ke initial state
supabase db reset
```

### 5. Stop Local Supabase

```bash
supabase stop
```

## 🚀 Production Deployment Workflow

### 1. Create Migration

```bash
supabase migration new your_feature_name
```

### 2. Write & Test Locally

```bash
# Apply to local
supabase db push

# Test thoroughly
# Run your app against local DB
```

### 3. Commit to Git

```bash
git add supabase/migrations/
git commit -m "feat: add new migration for [feature]"
git push
```

### 4. Deploy to Production

```bash
# Push to remote Supabase project
supabase db push --linked

# Or via CI/CD (recommended)
```

### 5. Verify Production

- Check Supabase Dashboard → Database → Migrations
- Verify schema changes
- Test production app

## 📊 Migration Best Practices

### ✅ DO

1. **Use Descriptive Names**
   ```bash
   supabase migration new add_email_verification_to_users
   # ✅ Clear and descriptive
   ```

2. **One Logical Change Per Migration**
   - Each migration should represent one feature/change
   - Easier to review and rollback

3. **Use IF NOT EXISTS / IF EXISTS**
   ```sql
   CREATE TABLE IF NOT EXISTS ...
   ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...
   DROP TABLE IF EXISTS ...
   ```

4. **Add Comments**
   ```sql
   -- Purpose: Add support for product reviews
   -- Related: Issue #123
   CREATE TABLE public.reviews ...
   ```

5. **Test Before Production**
   - Always test on local first
   - Test on staging if available
   - Verify rollback strategy

6. **Include Indexes**
   ```sql
   -- Always add indexes for foreign keys
   CREATE INDEX idx_table_foreign_key ON table(foreign_key);
   ```

### ❌ DON'T

1. **Don't Modify Existing Migrations**
   - Once applied, never edit
   - Create new migration to fix

2. **Don't Use DROP without Backup**
   ```sql
   -- ❌ Dangerous
   DROP TABLE users;
   
   -- ✅ Better
   ALTER TABLE users RENAME TO users_old;
   -- Then create new users table
   ```

3. **Don't Forget Constraints**
   ```sql
   -- ❌ Missing constraints
   ALTER TABLE products ADD COLUMN price DECIMAL;
   
   -- ✅ With constraints
   ALTER TABLE products 
   ADD COLUMN price DECIMAL(10,2) NOT NULL CHECK (price >= 0);
   ```

4. **Don't Skip Testing**
   - Always test migrations locally
   - Check for data loss
   - Verify app still works

## 🔧 Useful Commands

```bash
# Initialize Supabase in project
supabase init

# Start local development
supabase start

# Create new migration
supabase migration new migration_name

# Apply migrations locally
supabase db push

# Apply migrations to remote
supabase db push --linked

# Check migration status
supabase migration list

# Reset local database
supabase db reset

# Generate types for TypeScript
supabase gen types typescript --local > types/database.ts

# View database diff
supabase db diff

# Stop local Supabase
supabase stop
```

## 🐛 Troubleshooting

### Error: "migration already applied"

```bash
# Check migration list
supabase migration list

# Repair migration status
supabase migration repair --status applied [version]
```

### Local Database Won't Start

```bash
# Stop all
supabase stop

# Remove volumes
supabase stop --no-backup

# Start fresh
supabase start
```

### Migration Failed Halfway

```bash
# Check status
supabase db status

# Rollback manually via SQL
supabase db reset

# Or fix and reapply
```

### Can't Connect to Local Database

```bash
# Check if running
docker ps | grep supabase

# Restart
supabase stop
supabase start
```

## 📚 Advanced Topics

### Generate Migration from Schema Changes

```bash
# Make changes in Supabase Studio
# Then generate migration from diff
supabase db diff -f migration_name
```

### Branching Strategy

```bash
# Feature branch
git checkout -b feature/new-table
supabase migration new add_new_table
# ... make changes ...
git commit -m "feat: add new table"

# Merge to main
git checkout main
git merge feature/new-table

# Deploy
supabase db push --linked
```

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
- name: Deploy migrations
  run: |
    supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    supabase db push --linked
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## 📖 Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/database/migrations)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [CI/CD Integration](https://supabase.com/docs/guides/cli/github-action)

## 🎯 Next Steps

1. ✅ Install Supabase CLI
2. ✅ Initialize Supabase in project
3. ✅ Convert existing schema to migrations
4. ✅ Setup local development
5. ✅ Create first custom migration
6. ✅ Integrate with Git workflow
7. ✅ Setup CI/CD (optional)

---

**Happy Migrating! 🚀**

