# 🚀 MIGRATIONS QUICK START

Panduan singkat untuk mulai menggunakan database migrations.

## ⚡ 5-Minute Setup

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# atau via npm
npm install -g supabase

# Verify
supabase --version
```

### 2. Initialize Supabase

```bash
cd /Users/nandanghermawan/Project/bagdja
supabase init
```

✅ Files sudah dibuat! (`supabase/` folder sudah ada dengan migrations)

### 3. Start Local Development

```bash
# Start local Supabase (includes PostgreSQL)
supabase start
```

Output:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
```

### 4. Apply Migrations

```bash
# Apply all migrations to local database
supabase db push
```

✅ Database ready!

### 5. Open Supabase Studio

```bash
open http://localhost:54323
```

Verify tables are created! 🎉

---

## 📝 Daily Workflow

### Create New Migration

```bash
supabase migration new add_new_feature
```

### Edit Migration File

```bash
# File created at: supabase/migrations/[timestamp]_add_new_feature.sql
# Edit dengan text editor favorit
```

Example:
```sql
-- Add new column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2);
```

### Apply Migration

```bash
# Apply to local
supabase db push

# Test your changes
# Run your app

# If OK, commit to git
git add supabase/migrations/
git commit -m "feat: add discount price"
```

---

## 🚢 Deploy to Production

### Option 1: Link & Push (Manual)

```bash
# Login
supabase login

# Link to remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push --linked
```

### Option 2: Via Dashboard (Easy)

1. Go to Supabase Dashboard
2. Database → Migrations
3. Upload migration file
4. Click "Run"

---

## 🔄 Common Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Create migration
supabase migration new migration_name

# Apply migrations locally
supabase db push

# Check migration status
supabase migration list

# Reset local database (fresh start)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > types/database.ts
```

---

## 💡 Pro Tips

### 1. Always Use IF NOT EXISTS

```sql
CREATE TABLE IF NOT EXISTS ...
ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...
```

### 2. Test Locally First

```bash
supabase start
supabase db push
# Test thoroughly
```

### 3. One Change Per Migration

❌ Bad:
```sql
-- Too many changes in one file
ALTER TABLE products ADD COLUMN x;
ALTER TABLE users ADD COLUMN y;
CREATE TABLE new_table;
```

✅ Good:
```sql
-- One logical change
ALTER TABLE products ADD COLUMN discount_price DECIMAL(10,2);
CREATE INDEX idx_products_discount ON products(discount_price);
```

### 4. Include Comments

```sql
-- Purpose: Add discount pricing feature
-- Related: Issue #123
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2);
```

---

## 🐛 Troubleshooting

### Port already in use?

```bash
supabase stop
supabase start
```

### Migration failed?

```bash
# Check status
supabase migration list

# Reset and try again
supabase db reset
```

### Can't connect to local database?

```bash
# Restart Docker
docker restart $(docker ps -q --filter ancestor=supabase/postgres)

# Or full restart
supabase stop --no-backup
supabase start
```

---

## 📚 Full Documentation

For detailed guide: **[MIGRATIONS.md](./MIGRATIONS.md)**

---

## ✅ Checklist

- [ ] Supabase CLI installed
- [ ] `supabase start` berhasil
- [ ] Bisa akses Studio (localhost:54323)
- [ ] Migrations applied (`supabase db push`)
- [ ] Tables terlihat di Studio
- [ ] API bisa connect ke local DB

---

**Happy Migrating! 🚀**

Questions? Read full docs: [MIGRATIONS.md](./MIGRATIONS.md)

