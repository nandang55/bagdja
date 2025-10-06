import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import Header from './Header'

export default function Dashboard({ session }) {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState(null)

  const handleMenuClick = (menuId) => {
    setActiveSection(menuId)
    if (menuId === 'profile') {
      navigate('/profile')
    } else {
      // For other menus, show coming soon message (stay on dashboard)
    }
  }

  const menuCards = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your personal information and account settings',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      borderLight: 'border-blue-200',
      borderDark: 'border-blue-800',
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'View payment methods and transaction history',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-900/20',
      borderLight: 'border-green-200',
      borderDark: 'border-green-800',
    },
    {
      id: 'apikey',
      title: 'API Key',
      description: 'Generate and manage your API authentication keys',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900/20',
      borderLight: 'border-purple-200',
      borderDark: 'border-purple-800',
    },
    {
      id: 'webhook',
      title: 'Webhook',
      description: 'Configure webhooks for real-time event notifications',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-900/20',
      borderLight: 'border-orange-200',
      borderDark: 'border-orange-800',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Component */}
      <Header session={session} />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
              <p className="text-gray-900 dark:text-white font-medium">{session.user.email}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
              <p className="text-gray-900 dark:text-white font-mono text-sm">{session.user.id.slice(0, 20)}...</p>
            </div>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Account Management
          </h2>

          {/* Grid of Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {menuCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleMenuClick(card.id)}
                className={`
                  group relative overflow-hidden
                  ${isDark ? card.bgDark : card.bgLight}
                  ${isDark ? card.borderDark : card.borderLight}
                  rounded-xl p-6 border-2
                  hover:shadow-xl hover:scale-105
                  transition-all duration-300
                  text-left
                  ${activeSection === card.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}
                `}
              >
                {/* Gradient Background on Hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${card.color}
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `}></div>

                {/* Icon */}
                <div className={`
                  relative mb-4 w-14 h-14 
                  bg-gradient-to-br ${card.color}
                  rounded-xl flex items-center justify-center
                  text-white shadow-lg
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="relative text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {card.description}
                </p>

                {/* Arrow Icon */}
                <div className="relative mt-4 flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <span>Manage</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Active Indicator */}
                {activeSection === card.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selected Section Message */}
          {activeSection && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">
                  {menuCards.find(c => c.id === activeSection)?.title}
                </span>
                {' '}section selected. Feature coming soon!
              </p>
            </div>
          )}
        </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-600">
            <p>Bagdja Account • Secure account management • Real-time data</p>
          </div>
        </div>
      </div>
    </div>
  )
}
