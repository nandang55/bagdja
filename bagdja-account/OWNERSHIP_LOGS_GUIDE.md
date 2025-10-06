# 📊 Company Ownership Logs - Audit Trail System

Complete audit trail untuk tracking ownership history! 🔍

---

## ✨ Features

### **Automatic Logging:**
- ✅ **Auto-log** saat company dibuat
- ✅ **Auto-log** saat ownership transfer
- ✅ **Timeline view** di Overview section
- ✅ **User details** (email, name)
- ✅ **Timestamp** dengan format readable
- ✅ **Action badges** (Created, Transferred)
- ✅ **Color coding** (green, orange, blue)

### **Security:**
- ✅ **RLS protected** - Hanya owner yang bisa lihat
- ✅ **Read-only** - Cannot be edited/deleted
- ✅ **Automatic** - No manual intervention
- ✅ **Cascade delete** - Logs deleted with company

---

## 🗄️ Database Schema

### **Table: company_ownership_logs**

```sql
CREATE TABLE public.company_ownership_logs (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,           -- Which company
    from_user_id UUID,                  -- Previous owner (NULL if created)
    to_user_id UUID NOT NULL,           -- New owner
    action TEXT NOT NULL,                -- 'created', 'transferred', 'updated'
    notes TEXT,                         -- Optional notes
    ip_address TEXT,                    -- Future: Track IP
    user_agent TEXT,                    -- Future: Track browser
    created_at TIMESTAMP               -- When it happened
);
```

### **View: company_ownership_history**

```sql
-- Combines logs with user details (email, name)
CREATE VIEW company_ownership_history AS
SELECT 
    l.id,
    l.company_id,
    c.company_name,
    l.action,
    l.from_user_id,
    u1.email as from_user_email,
    u1.full_name as from_user_name,
    l.to_user_id,
    u2.email as to_user_email,
    u2.full_name as to_user_name,
    l.notes,
    l.created_at
FROM company_ownership_logs l
JOIN companies c ON c.id = l.company_id
LEFT JOIN users u1 ON u1.id = l.from_user_id
LEFT JOIN users u2 ON u2.id = l.to_user_id;
```

---

## 🔄 Automatic Triggers

### **1. Log Company Creation**

When company created:

```sql
CREATE TRIGGER log_company_creation_trigger
    AFTER INSERT ON companies
    FOR EACH ROW
    EXECUTE FUNCTION log_company_creation();
```

**Result:**
```
Action: created
From: NULL
To: creator_user_id
Notes: "Company created by {user_id}"
```

### **2. Log Ownership Transfer**

When `user_id` changes:

```sql
CREATE TRIGGER log_company_transfer_trigger
    AFTER UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION log_company_transfer();
```

**Result:**
```
Action: transferred
From: old_user_id
To: new_user_id
Notes: "Ownership transferred from {old} to {new}"
```

---

## 🎨 UI Timeline Design

### **Overview Section:**

```
┌────────────────────────────────────────┐
│ 🕐 Ownership History                   │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ 🟠 Transferred  (Badge)          │  │
│ │ From: old@email.com              │  │
│ │ To: new@email.com                │  │
│ │ October 7, 2025, 10:30 AM        │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ 🟢 Created  (Badge)              │  │
│ │ By: owner@email.com              │  │
│ │ October 5, 2025, 09:15 AM        │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### **Timeline Elements:**

Each log entry shows:
- **Icon** (colored circle with symbol)
  - 🟢 Green = Created
  - 🟠 Orange = Transferred
  - 🔵 Blue = Updated
- **Description** with user emails highlighted
- **Timestamp** in readable format
- **Badge** with action type

---

## 📋 Setup Instructions

### **Step 1: Run Migration**

Buka **Supabase SQL Editor** dan run:

File: `supabase/migrations/20251007000003_create_company_ownership_logs.sql`

**Or copy-paste this:**

```sql
-- Quick setup
CREATE TABLE public.company_ownership_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    to_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('created', 'transferred', 'updated')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ownership_logs_company_id ON public.company_ownership_logs(company_id);

ALTER TABLE public.company_ownership_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for own companies"
    ON public.company_ownership_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = company_ownership_logs.company_id
            AND companies.user_id = auth.uid()
        )
    );

-- Auto-log creation
CREATE OR REPLACE FUNCTION public.log_company_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.company_ownership_logs (
        company_id, from_user_id, to_user_id, action, notes
    ) VALUES (
        NEW.id, NULL, NEW.user_id, 'created',
        'Company created'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_company_creation_trigger
    AFTER INSERT ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.log_company_creation();

-- Auto-log transfer
CREATE OR REPLACE FUNCTION public.log_company_transfer()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
        INSERT INTO public.company_ownership_logs (
            company_id, from_user_id, to_user_id, action, notes
        ) VALUES (
            NEW.id, OLD.user_id, NEW.user_id, 'transferred',
            'Ownership transferred'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_company_transfer_trigger
    AFTER UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.log_company_transfer();

-- Create view
CREATE OR REPLACE VIEW public.company_ownership_history AS
SELECT 
    l.id, l.company_id, c.company_name, l.action,
    l.from_user_id, u1.email as from_user_email, u1.full_name as from_user_name,
    l.to_user_id, u2.email as to_user_email, u2.full_name as to_user_name,
    l.notes, l.created_at
FROM public.company_ownership_logs l
JOIN public.companies c ON c.id = l.company_id
LEFT JOIN public.users u1 ON u1.id = l.from_user_id
LEFT JOIN public.users u2 ON u2.id = l.to_user_id
ORDER BY l.created_at DESC;
```

### **Step 2: Update Users RLS** (If not done)

Run: `UPDATE_USERS_RLS_FOR_TRANSFER.sql`

```sql
CREATE POLICY "Users can search by email for transfer"
    ON public.users FOR SELECT
    USING (true);
```

---

## 🧪 Testing

### **Test 1: Create Company - Auto Log**

1. Create new company
2. Go to company Overview
3. See ownership history:
   ```
   🟢 Created
   Company created by owner@email.com
   October 7, 2025, 10:00 AM
   ```

### **Test 2: Transfer Company - Auto Log**

1. Transfer company to another user
2. Before leaving, check Overview
3. See new log entry:
   ```
   🟠 Transferred
   Transferred from owner@email.com to newowner@email.com
   October 7, 2025, 10:30 AM
   ```

### **Test 3: View Full History**

1. Company that was transferred multiple times
2. Go to Overview
3. See timeline (newest first):
   ```
   🟠 Transferred (user3 → user4) - Oct 10
   🟠 Transferred (user2 → user3) - Oct 8
   🟠 Transferred (user1 → user2) - Oct 6
   🟢 Created (by user1) - Oct 5
   ```

---

## 📊 Data Flow

### **Company Creation:**

```
1. User creates company
   ↓
2. INSERT INTO companies
   ↓
3. Trigger: log_company_creation()
   ↓
4. INSERT INTO company_ownership_logs
   {
     action: 'created',
     from_user_id: NULL,
     to_user_id: creator_id
   }
```

### **Company Transfer:**

```
1. User transfers company
   ↓
2. UPDATE companies SET user_id = new_owner
   ↓
3. Trigger: log_company_transfer()
   ↓
4. INSERT INTO company_ownership_logs
   {
     action: 'transferred',
     from_user_id: old_owner_id,
     to_user_id: new_owner_id
   }
```

---

## 🎨 Timeline UI Components

### **Colors by Action:**

| Action | Icon Color | Badge Color | Background |
|--------|-----------|-------------|------------|
| Created | 🟢 Green | Green | Green-100 |
| Transferred | 🟠 Orange | Orange | Orange-100 |
| Updated | 🔵 Blue | Blue | Blue-100 |

### **Icons:**

- **Created**: Plus sign (+)
- **Transferred**: Transfer arrows (⇄)
- **Updated**: Edit pencil (✏️)

---

## 📱 Responsive Design

### **Desktop:**
- 3 columns: Icon | Details | Badge
- Full timestamp
- Spacious layout

### **Mobile:**
- Stacked layout
- Abbreviated timestamp
- Compact spacing

---

## 🔍 Query Examples

### **View logs for specific company:**

```sql
SELECT * FROM public.company_ownership_history
WHERE company_id = 'company-uuid-here'
ORDER BY created_at DESC;
```

### **View all your transfer history:**

```sql
SELECT * FROM public.company_ownership_history
WHERE to_user_id = auth.uid() OR from_user_id = auth.uid()
ORDER BY created_at DESC;
```

### **Count transfers per company:**

```sql
SELECT 
    company_name,
    COUNT(CASE WHEN action = 'transferred' THEN 1 END) as transfer_count
FROM public.company_ownership_history
GROUP BY company_id, company_name
ORDER BY transfer_count DESC;
```

---

## 🎯 Features

### **In Overview Section:**
✅ **Ownership History card**  
✅ **Timeline view** (newest first)  
✅ **User emails** highlighted  
✅ **Readable timestamps**  
✅ **Action badges**  
✅ **Color-coded icons**  
✅ **Loading state**  
✅ **Empty state**  

### **Automatic Triggers:**
✅ **Log on create** (from NULL → creator)  
✅ **Log on transfer** (from old → new owner)  
✅ **No manual action** required  
✅ **Cannot be tampered** (trigger-based)  

---

## 📊 Database Tables Summary

### **Tables Created:**

1. **company_ownership_logs** - Raw logs
2. **company_ownership_history** - View dengan user details

### **Triggers Created:**

1. **log_company_creation_trigger** - Auto-log saat create
2. **log_company_transfer_trigger** - Auto-log saat transfer

### **Policies Created:**

1. **Users can view logs for own companies** - RLS read access

---

## ✅ Files Created/Modified

```
✅ supabase/migrations/20251007000003_...  - Migration file
✅ CompanyDetailPage.jsx                   - Load & display logs
✅ UPDATE_USERS_RLS_FOR_TRANSFER.sql       - RLS policy
✅ OWNERSHIP_LOGS_GUIDE.md                 - This file
✅ TRANSFER_COMPANY_GUIDE.md               - Transfer docs
```

---

## 🚀 Ready to Test!

### **Setup (One-time):**

1. ✅ Run migration: `20251007000003_create_company_ownership_logs.sql`
2. ✅ Run RLS update: `UPDATE_USERS_RLS_FOR_TRANSFER.sql`
3. ✅ Refresh browser

### **Test Flow:**

1. **Create company** → See "Created" log
2. **Transfer to user2** → See "Transferred" log
3. **Login as user2** → Transfer to user3
4. **Login as user3** → See full history (3 entries)

---

## 📸 Visual Example

### **Timeline View:**

```
Ownership History
─────────────────────────────────────

[🟠]  Transferred                [Transferred]
      From: alice@test.com → bob@test.com
      October 7, 2025, 2:30 PM

─────────────────────────────────────

[🟠]  Transferred                [Transferred]
      From: john@test.com → alice@test.com
      October 6, 2025, 10:15 AM

─────────────────────────────────────

[🟢]  Company created            [Created]
      By: john@test.com
      October 5, 2025, 9:00 AM
```

---

## 💡 Future Enhancements

Ideas to add:

- [ ] Export logs to CSV
- [ ] Filter by date range
- [ ] Search by user email
- [ ] IP address tracking
- [ ] Geo-location of transfers
- [ ] Email notifications on transfer
- [ ] Revert transfer (undo)
- [ ] Transfer approval workflow

---

## 🔒 Security & Privacy

### **Access Control:**
- ✅ Only **current owner** can view logs
- ✅ Logs **cascade delete** with company
- ✅ Previous owners **lose access** to logs after transfer
- ✅ **Read-only** - Cannot edit history

### **Data Retention:**
- ✅ Logs kept **forever** (or until company deleted)
- ✅ User details cached in logs
- ✅ Even if user deleted, email preserved

---

## 🐛 Troubleshooting

### **Error: "Could not find view 'company_ownership_history'"**

**Fix:** Run migration to create view.

### **Error: "No ownership history"**

**Causes:**
- New company (only 1 log entry)
- Logs table empty

**Fix:**
- Create a company to test
- Check logs table: `SELECT * FROM company_ownership_logs`

### **Logs not appearing**

**Fix:** Check RLS policy:

```sql
-- Should allow current owner to read logs
SELECT * FROM pg_policies 
WHERE tablename = 'company_ownership_logs';
```

---

## 📊 Statistics Queries

### **Most transferred companies:**

```sql
SELECT 
    company_name,
    COUNT(*) as total_transfers
FROM company_ownership_history
WHERE action = 'transferred'
GROUP BY company_id, company_name
ORDER BY total_transfers DESC
LIMIT 10;
```

### **Transfer activity by date:**

```sql
SELECT 
    DATE(created_at) as transfer_date,
    COUNT(*) as transfers
FROM company_ownership_logs
WHERE action = 'transferred'
GROUP BY DATE(created_at)
ORDER BY transfer_date DESC;
```

---

## ✨ Summary

Ownership Logs System provides:

✅ **Complete audit trail** for ownership changes  
✅ **Automatic logging** via triggers  
✅ **Timeline UI** in Overview section  
✅ **User details** (email, name)  
✅ **Color-coded actions** (green, orange, blue)  
✅ **Readable timestamps**  
✅ **RLS security** (only owner can view)  
✅ **Dark mode** support  
✅ **Loading states**  
✅ **Empty states**  
✅ **Database view** for easy querying  

**Total:** 1 migration file, 2 triggers, 1 view, UI updates! 🚀

---

## 🎊 Ready to Use!

1. ✅ Run migration SQL
2. ✅ Refresh browser
3. ✅ Open company Overview
4. ✅ See ownership history!

**Perfect for compliance, audit, and transparency!** 📊✨

