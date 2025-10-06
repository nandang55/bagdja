import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import ProfilePage from './components/ProfilePage'
import CompanyDetailPage from './components/CompanyDetailPage'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading Bagdja Account...</p>
        </div>
      </div>
    )
  }

  // Render with Router
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Default options
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            },
            // Success
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            // Error
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            // Loading
            loading: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Auth Route */}
          <Route 
            path="/login" 
            element={!session ? <Auth /> : <Navigate to="/" replace />} 
          />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={session ? <ProfilePage session={session} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/company/:companyId"
            element={session ? <CompanyDetailPage session={session} /> : <Navigate to="/login" replace />}
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
