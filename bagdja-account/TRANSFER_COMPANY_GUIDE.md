# 🔄 Transfer Company Feature

Transfer ownership perusahaan ke user lain! 🎯

---

## ✨ Features

### **Transfer Company:**
- ✅ Transfer ownership ke user lain by email
- ✅ Recipient harus sudah registered
- ✅ Warning message sebelum transfer
- ✅ Confirmation modal
- ✅ Toast notifications
- ✅ Auto remove primary status
- ✅ You lose access after transfer

---

## 🎯 Settings Section Layout

```
┌────────────────────────────────────────┐
│ Company Settings                       │
│                                        │
│ [✓] Set as Primary Company             │
│ [Save Settings]                        │
│                                        │
│ ──────────────────────────────────    │
│ Transfer Company (⚠️ Orange)            │
│ Transfer ownership to another user...  │
│ [🔄 Transfer Company]                  │
│                                        │
│ ──────────────────────────────────    │
│ Danger Zone (🔴 Red)                   │
│ Once you delete a company...           │
│ [🗑️ Delete This Company]               │
└────────────────────────────────────────┘
```

---

## 🚀 How to Use

### **Step 1: Go to Settings**
1. Open company detail page
2. Click **"Settings"** in sidebar
3. Scroll to "Transfer Company" section

### **Step 2: Click Transfer Button**
1. Click **"Transfer Company"** (orange button)
2. Modal dialog appears

### **Step 3: Enter Recipient Email**
1. Type email of target user
2. Example: `newowner@example.com`
3. User must be registered in system

### **Step 4: Confirm Transfer**
1. Click **"Confirm Transfer"**
2. See loading toast: ⏳ "Transferring company..."
3. Wait for confirmation
4. See success toast: ✅ "Company transferred!"
5. Auto-redirect back to company list
6. Company no longer in your list

---

## 🎨 Transfer Modal Design

```
┌─────────────────────────────────────┐
│ Transfer Company               [X]  │
│                                     │
│ ⚠️ Warning: Cannot be undone         │
│ You will lose access to "MMC"       │
│                                     │
│ Recipient Email Address             │
│ [newowner@example.com            ]  │
│ Enter email of user who will...    │
│                                     │
│ [Confirm Transfer] [Cancel]         │
└─────────────────────────────────────┘
```

---

## 🔐 Security & Validation

### **Checks:**
1. ✅ Email required (tidak boleh kosong)
2. ✅ User must exist in database
3. ✅ User must have profile
4. ✅ Only owner can transfer
5. ✅ Confirmation required

### **After Transfer:**
1. ✅ Ownership changes to new user
2. ✅ Primary status removed (safety)
3. ✅ Original owner loses access
4. ✅ New owner sees company in their list

---

## 📊 Data Flow

```
1. Current Owner clicks "Transfer"
   ↓
2. Enter recipient email
   ↓
3. System finds user by email
   ↓
4. Check if user exists
   ↓
5. Update company.user_id → new user ID
   ↓
6. Set is_primary → false
   ↓
7. Original owner loses access
   ↓
8. New owner sees company
```

---

## 🧪 Testing

### **Test 1: Transfer to Valid User**
```
Requirement: 2 registered users
User A: owner@test.com (has company)
User B: newowner@test.com (registered)

Steps:
1. Login as User A
2. Go to Company Settings
3. Click "Transfer Company"
4. Enter: newowner@test.com
5. Confirm transfer
6. ✅ Success toast
7. Company removed from User A
8. Login as User B
9. Company appears in User B's list
```

### **Test 2: Transfer to Non-existent User**
```
1. Click "Transfer Company"
2. Enter: notexist@test.com
3. Click Confirm
4. ❌ Error: "User not found"
```

### **Test 3: Transfer to Same Email**
```
1. Enter your own email
2. Might work (company stays with you)
3. Or show error (optional validation)
```

---

## 🎨 UI Elements

### **Transfer Button:**
- Color: **Orange** (warning action)
- Icon: Transfer arrows (⇄)
- Position: Between primary setting & danger zone

### **Transfer Modal:**
- Overlay: Semi-transparent black
- Modal: White/Dark with border
- Warning: Orange alert box
- Input: Email field with validation
- Actions: Confirm (orange) + Cancel

### **Warning Alert:**
- Icon: ⚠️ Warning triangle
- Title: "This action cannot be undone"
- Message: Shows company name

---

## 🐛 Troubleshooting

### **Error: "User not found"**

**Causes:**
- Email tidak terdaftar
- Typo in email
- User belum signup

**Fix:**
- Verify email is correct
- Ask recipient to register first

### **Error: "Target user does not have profile"**

**Cause:**
- User registered but profile not created

**Fix:**
Run in Supabase SQL Editor:
```sql
-- Create missing profile
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

### **Error: "Permission denied"**

**Cause:**
- RLS policy blocking
- Not the owner

**Fix:**
- Check you are the owner
- Verify RLS policies allow update

---

## 💡 Future Enhancements

Ideas to add:

- [ ] Transfer with confirmation code
- [ ] Recipient must accept transfer
- [ ] Email notification to recipient
- [ ] Transfer history/audit log
- [ ] Prevent transfer if user not verified
- [ ] Add transfer cooldown period
- [ ] Bulk transfer multiple companies

---

## 📝 Database Changes

**Table:** `companies`

```sql
-- user_id updated on transfer
UPDATE companies 
SET user_id = 'new-user-id',
    is_primary = false
WHERE id = 'company-id';
```

**Note:** Tabel `users` sudah ada di initial migration (dari Supabase setup awal)

---

## ✅ Summary

Transfer Company feature includes:

✅ **Orange transfer button** in Settings  
✅ **Modal dialog** with warning  
✅ **Email input** for recipient  
✅ **User lookup** by email  
✅ **Validation** (user must exist)  
✅ **Confirmation** required  
✅ **Toast notifications** throughout  
✅ **Auto-redirect** after transfer  
✅ **Dark mode** support  
✅ **Loading states** with spinner  

**Total:** ~100 lines of code added! 🚀

---

## 🎊 Ready to Test!

1. ✅ Refresh browser
2. ✅ Open company settings
3. ✅ Scroll to Transfer section
4. ✅ Click orange button
5. ✅ Enter recipient email
6. ✅ Confirm transfer!

**Selamat! Company ownership bisa ditransfer!** 🔄✨

