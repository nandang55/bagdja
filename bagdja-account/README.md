# 🔐 Bagdja Account Service

Central authentication and account management service for the Bagdja Ecosystem.

## ✨ Features

- 🔒 **Secure Authentication** - Email & password with Supabase Auth
- 👤 **User Registration** - Create new accounts with email verification
- 📊 **User Dashboard** - View account info with menu cards
- 🏢 **Multi-Company Management** - Add and manage multiple company profiles
- 👥 **Profile Management** - Edit personal information with tab system
- 🍞 **Toast Notifications** - Modern notifications in top-right corner
- 🌓 **Dark Mode** - Full dark mode support with toggle
- 🎨 **Modern UI** - Split-screen design with Bagdja brand colors
- 🚀 **Fast & Lightweight** - Built with React + Vite
- 🔄 **Real-time** - Instant auth state updates

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **Supabase** - Backend & authentication
- **TailwindCSS** - Styling with dark mode
- **react-hot-toast** - Toast notifications
- **Direct Supabase Connection** - No API layer, simple architecture

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account and project
- `profiles` table in Supabase (optional, for dashboard)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these from: **Supabase Dashboard → Settings → API**

### 3. Create Database Tables

Create these tables in Supabase SQL Editor:

Run migrations from `supabase/migrations/` folder:

1. **20251007000001_create_profiles_table.sql** - Creates profiles table
2. **20251007000002_create_companies_table.sql** - Creates companies table

Or use the migration files in project root for quick setup.

### 4. Run Development Server

```bash
npm run dev
```

The app will open at **http://localhost:5175**

## 📱 Usage

### For Users

1. **Sign Up**: Create a new account with email and password
2. **Verify Email**: Check your email for verification link (if enabled)
3. **Sign In**: Login with your credentials
4. **Dashboard**: Access 4 menu cards:
   - 👤 **Profile** - Manage personal & company information
   - 💳 **Payment** - Payment methods (coming soon)
   - 🔑 **API Key** - API authentication (coming soon)
   - ⚡ **Webhook** - Event notifications (coming soon)
5. **Profile Management**:
   - Edit personal information
   - Add/edit/delete company profiles
   - Set primary company
6. **Sign Out**: Logout from your account

### For Developers

The service provides:
- Automatic session management
- JWT token handling
- Auth state persistence
- Real-time auth updates

## 🎨 Design System

### Colors (Bagdja Brand)

- **Primary Dark**: `bg-gray-900`, `bg-gray-800`
- **Accent Teal**: `bg-teal-500`, `text-teal-400`
- **Accent Blue**: `bg-blue-500`
- **Accent Orange**: `text-orange-500`

### Components

- **Buttons**: `btn-primary`, `btn-secondary`
- **Inputs**: `input-field` with focus rings
- **Cards**: `card` with dark background
- **Links**: `link-primary` with hover effects

## 📁 Project Structure

```
bagdja-account/
├── src/
│   ├── components/
│   │   ├── Auth.jsx           # Login & Register (split-screen)
│   │   ├── Dashboard.jsx      # Main dashboard with menu cards
│   │   └── ProfilePage.jsx    # Profile & company management
│   ├── contexts/
│   │   └── ThemeContext.jsx   # Dark mode state management
│   ├── App.jsx                # Root component with auth check
│   ├── main.jsx               # Entry point with providers
│   ├── supabaseClient.js      # Supabase client config
│   └── index.css              # Global styles with dark mode
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

## 🔒 Security

- ✅ Passwords hashed by Supabase Auth
- ✅ JWT tokens with auto-refresh
- ✅ Secure session management
- ✅ Row Level Security (RLS) ready
- ✅ HTTPS enforced in production

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 🔧 Configuration

### Vite Config

Port is set to **5175** in `vite.config.js`:

```javascript
server: {
  port: 5175,
  open: true
}
```

### Tailwind Config

Custom Bagdja colors in `tailwind.config.js`:

```javascript
colors: {
  'bagdja-dark': '#1a202c',
  'bagdja-teal': '#14b8a6',
  'bagdja-blue': '#3b82f6',
  'bagdja-orange': '#f97316',
}
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env` file exists in root directory
- Check that variables start with `VITE_` prefix
- Restart dev server after changing env vars

### Profiles not showing

- Make sure `profiles` table exists in Supabase
- Check RLS policies allow reading
- Verify data exists in the table

### Email verification not working

- Check Supabase Auth settings
- Email confirmations can be disabled for testing: **Authentication → Settings → Disable email confirmations**

## 📚 Related Documentation

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)

## 📄 License

MIT License - Part of Bagdja Ecosystem

## 🆘 Support

For issues or questions:
- Check [Bagdja Documentation](../README.md)
- Open an issue on GitHub
- Contact: support@bagdja.com

---

**Built with ❤️ for the Bagdja Ecosystem**

Version: 1.0.0  
Last Updated: October 2025

