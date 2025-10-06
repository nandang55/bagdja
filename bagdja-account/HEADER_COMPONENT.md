# ✅ Header Component - Logout & Theme Toggle

## 🎯 What Was Done

Dibuat komponen **Header** yang reusable dengan fitur:
1. **Theme Toggle** (Dark/Light mode)
2. **Logout Button** (Sign Out)
3. **Back Button** (optional, untuk navigasi)
4. **Logo & User Email**

---

## 📁 File Changes

### 1. **NEW: `src/components/Header.jsx`**
Komponen header reusable dengan props:
- `session` - User session object
- `showBackButton` - Boolean (default: false)
- `backTo` - Path untuk back button (default: '/')

**Features:**
- ✅ Logo klikable (navigate to home)
- ✅ Theme toggle (Sun/Moon icon)
- ✅ Logout button dengan toast notification
- ✅ Responsive (mobile-friendly)
- ✅ Sticky header (always visible at top)

### 2. **UPDATED: `src/components/Dashboard.jsx`**
- Import `Header` component
- Removed manual header code
- Cleaner code structure

### 3. **UPDATED: `src/components/ProfilePage.jsx`**
- Import `Header` component
- Using `showBackButton={true}` prop
- Removed manual header with back button

### 4. **UPDATED: `src/components/CompanyDetailPage.jsx`**
- Import `Header` component
- Using `showBackButton={true}` and `backTo="/profile"`
- Added separate company header section

---

## 🎨 Header Features

### Theme Toggle Button
```jsx
<button onClick={toggleTheme}>
  {isDark ? <SunIcon /> : <MoonIcon />}
</button>
```
- **Dark Mode**: Shows Sun icon (yellow)
- **Light Mode**: Shows Moon icon (gray)
- Smooth transition with hover effects

### Logout Button
```jsx
<button onClick={handleSignOut}>
  <LogoutIcon />
  Sign Out
</button>
```
- Red button with icon
- Toast notifications:
  - Loading: "Signing out..."
  - Success: "Signed out successfully! 👋"
  - Error: Shows error message
- Auto redirects to login page

### Back Button (Optional)
```jsx
<Header 
  session={session} 
  showBackButton={true} 
  backTo="/profile" 
/>
```
- Only shows if `showBackButton={true}`
- Arrow icon with hover effect
- Navigates to specified path

---

## 🚀 Usage Examples

### Dashboard (No Back Button)
```jsx
<Header session={session} />
```

### Profile Page (With Back Button)
```jsx
<Header 
  session={session} 
  showBackButton={true} 
  backTo="/" 
/>
```

### Company Detail Page (Back to Profile)
```jsx
<Header 
  session={session} 
  showBackButton={true} 
  backTo="/profile" 
/>
```

---

## 🎯 Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `session` | Object | Required | User session from Supabase |
| `showBackButton` | Boolean | `false` | Show/hide back button |
| `backTo` | String | `'/'` | Navigation path for back button |

---

## 💡 Design Highlights

### Sticky Header
```css
position: sticky
top: 0
z-index: 50
```
Header tetap di atas saat scroll.

### Responsive Layout
- **Desktop**: Logo + Email + Theme Toggle + Logout
- **Mobile**: Logo + Theme Toggle + Logout (email hidden)

### Dark Mode Support
- Automatic color switching
- Dark gray background in dark mode
- White background in light mode

---

## 🔥 Benefits

✅ **Consistent UI** - Header sama di semua halaman  
✅ **DRY Principle** - No code duplication  
✅ **Easy Maintenance** - Update 1 file, affect all pages  
✅ **Better UX** - Always accessible logout & theme toggle  
✅ **Professional** - Clean, modern design  

---

## 🧪 Testing

### Test Theme Toggle
1. Click sun/moon icon
2. Page should switch between dark/light mode
3. Icon should change accordingly

### Test Logout
1. Click "Sign Out" button
2. Should see loading toast
3. Should see success toast
4. Should redirect to login page

### Test Back Button
1. Go to Profile or Company page
2. Click back arrow
3. Should navigate to previous page

---

## 📱 Responsive Breakpoints

- **Mobile (<640px)**: Email hidden, compact layout
- **Tablet (640px-1024px)**: Full layout
- **Desktop (>1024px)**: Full layout with extra spacing

---

## 🎨 Color Scheme

### Theme Toggle
- **Sun Icon**: `text-yellow-500` (dark mode)
- **Moon Icon**: `text-gray-700` (light mode)

### Logout Button
- **Background**: `bg-red-600` → `hover:bg-red-700`
- **Text**: `text-white`
- **Shadow**: Elevated shadow on hover

---

## ✅ Checklist

- [x] Header component created
- [x] Theme toggle working
- [x] Logout button working
- [x] Back button optional
- [x] Dashboard updated
- [x] ProfilePage updated
- [x] CompanyDetailPage updated
- [x] Responsive design
- [x] Dark mode support
- [x] Toast notifications

---

**Perfect! 🎉**

Semua halaman sekarang memiliki header konsisten dengan logout & theme toggle yang mudah diakses!

