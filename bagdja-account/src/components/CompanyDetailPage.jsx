import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { useTheme } from '../contexts/ThemeContext'
import Logo from './Logo'

export default function CompanyDetailPage({ session }) {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferEmail, setTransferEmail] = useState('')
  const [transferring, setTransferring] = useState(false)
  const [ownershipLogs, setOwnershipLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState(null)
  
  const [formData, setFormData] = useState({
    company_name: '',
    business_type: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    company_address: '',
    company_city: '',
    company_country: '',
    company_postal_code: '',
    tax_id: '',
    registration_number: '',
    description: '',
    is_primary: false,
  })

  useEffect(() => {
    loadCompany()
  }, [companyId])

  useEffect(() => {
    if (company && activeSection === 'overview') {
      loadOwnershipLogs()
    }
  }, [activeSection, company])

  async function loadCompany() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .eq('user_id', session.user.id) // Ensure user owns this company
        .single()

      if (error) throw error

      if (!data) {
        toast.error('Company not found or access denied', {
          icon: '❌',
        })
        navigate('/profile')
        return
      }

      setCompany(data)
      setFormData({
        company_name: data.company_name || '',
        business_type: data.business_type || '',
        company_phone: data.company_phone || '',
        company_email: data.company_email || '',
        company_website: data.company_website || '',
        company_address: data.company_address || '',
        company_city: data.company_city || '',
        company_country: data.company_country || '',
        company_postal_code: data.company_postal_code || '',
        tax_id: data.tax_id || '',
        registration_number: data.registration_number || '',
        description: data.description || '',
        is_primary: data.is_primary || false,
      })
    } catch (error) {
      console.error('Error loading company:', error)
      toast.error('Failed to load company', {
        icon: '❌',
      })
      navigate('/profile')
    } finally {
      setLoading(false)
    }
  }

  async function loadOwnershipLogs() {
    if (!company) return
    
    try {
      setLoadingLogs(true)
      const { data, error } = await supabase
        .from('company_ownership_history')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOwnershipLogs(data || [])
    } catch (error) {
      console.error('Error loading ownership logs:', error)
    } finally {
      setLoadingLogs(false)
    }
  }

  const sidebarMenu = [
    {
      id: 'overview',
      name: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'information',
      name: 'Company Information',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    const loadingToast = toast.loading('Saving changes...')
    
    try {
      setSaving(true)
      
      // Clean empty strings to null
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      )
      
      // Don't send user_id in update (it's already set)
      delete cleanedData.user_id

      console.log('💾 Updating company:', company.id)
      console.log('📝 Update data:', cleanedData)

      const { error, data } = await supabase
        .from('companies')
        .update(cleanedData)
        .eq('id', company.id)
        .eq('user_id', session.user.id)  // Extra safety check
        .select()

      if (error) {
        console.error('❌ Update error:', error)
        throw error
      }
      
      console.log('✅ Update success:', data)

      toast.success('Company updated successfully!', {
        id: loadingToast,
        icon: '✅',
      })

      // Reload company data
      loadCompany()
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error(error.message || 'Failed to update company', {
        id: loadingToast,
        icon: '❌',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${company.company_name}"?`)) return

    const loadingToast = toast.loading('Deleting company...')
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id)

      if (error) throw error

      toast.success('Company deleted!', {
        id: loadingToast,
        icon: '✅',
      })

      // Go back to profile page
      navigate('/profile')
    } catch (error) {
      console.error('Error deleting company:', error)
      toast.error(error.message || 'Failed to delete company', {
        id: loadingToast,
        icon: '❌',
      })
    }
  }

  const handleTransfer = async () => {
    if (!transferEmail || !transferEmail.trim()) {
      toast.error('Please enter recipient email', {
        icon: '⚠️',
      })
      return
    }

    const loadingToast = toast.loading('Transferring company...')
    
    try {
      setTransferring(true)

      // Find user by email in profiles table
      // Profiles table is auto-synced with auth.users via trigger
      const { data: targetProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', transferEmail.trim())
        .single()

      if (profileError || !targetProfile) {
        throw new Error('User not found with that email. Make sure the user has registered.')
      }

      const targetUserId = targetProfile.id
      
      console.log('✅ Found user:', targetProfile.email, 'ID:', targetUserId)

      // Transfer ownership
      const { error } = await supabase
        .from('companies')
        .update({ 
          user_id: targetUserId,
          is_primary: false, // Remove primary status on transfer
        })
        .eq('id', company.id)

      if (error) throw error

      toast.success(`Company transferred to ${transferEmail}!`, {
        id: loadingToast,
        icon: '✅',
      })

      // Close modal and go back
      setShowTransferModal(false)
      setTransferEmail('')
      
      // Reload logs to show new transfer
      loadOwnershipLogs()
      
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (error) {
      console.error('Error transferring company:', error)
      toast.error(error.message || 'Failed to transfer company', {
        id: loadingToast,
        icon: '❌',
      })
    } finally {
      setTransferring(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading company...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Company Name */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 p-1.5">
                  <Logo className="w-full h-full" />
                </div>
                {company.company_name}
                {company.is_primary && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    Primary
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {sidebarMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left
                  ${activeSection === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Company Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Company Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Company Name</p>
                      <p className="text-gray-900 dark:text-white font-medium">{company.company_name}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Business Type</p>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">
                        {company.business_type?.replace('_', ' ') || 'Not specified'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">{company.company_email || '-'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                      <p className="text-gray-900 dark:text-white font-medium">{company.company_phone || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Ownership History Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ownership History
                  </h2>

                  {loadingLogs ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Loading history...</p>
                    </div>
                  ) : ownershipLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400">No ownership history</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ownershipLogs.map((log, index) => (
                        <div
                          key={log.id}
                          className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                        >
                          {/* Timeline Icon */}
                          <div className="flex-shrink-0">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center
                              ${log.action === 'created' 
                                ? 'bg-green-100 dark:bg-green-900/20' 
                                : log.action === 'transferred'
                                ? 'bg-orange-100 dark:bg-orange-900/20'
                                : 'bg-blue-100 dark:bg-blue-900/20'
                              }
                            `}>
                              {log.action === 'created' ? (
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              ) : log.action === 'transferred' ? (
                                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Log Details */}
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white font-medium">
                              {log.action === 'created' && (
                                <>Company created by <span className="text-blue-600 dark:text-blue-400">{log.to_user_email || 'Unknown'}</span></>
                              )}
                              {log.action === 'transferred' && (
                                <>Transferred from <span className="text-orange-600 dark:text-orange-400">{log.from_user_email || 'Unknown'}</span> to <span className="text-blue-600 dark:text-blue-400">{log.to_user_email || 'Unknown'}</span></>
                              )}
                              {log.action === 'updated' && (
                                <>Company updated</>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              {new Date(log.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>

                          {/* Badge */}
                          <div className="flex-shrink-0">
                            <span className={`
                              px-2 py-1 text-xs font-medium rounded-full
                              ${log.action === 'created'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : log.action === 'transferred'
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              }
                            `}>
                              {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Information Section */}
            {activeSection === 'information' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Edit Company Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="company_name"
                          type="text"
                          value={formData.company_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Type
                        </label>
                        <select
                          name="business_type"
                          value={formData.business_type || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                          <option value="">Select type</option>
                          <option value="sole_proprietorship">Sole Proprietorship</option>
                          <option value="partnership">Partnership</option>
                          <option value="corporation">Corporation</option>
                          <option value="llc">LLC</option>
                          <option value="nonprofit">Non-Profit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Company Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          name="company_email"
                          type="email"
                          value={formData.company_email}
                          onChange={handleChange}
                          placeholder="contact@company.com"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          name="company_phone"
                          type="tel"
                          value={formData.company_phone}
                          onChange={handleChange}
                          placeholder="+62 21 1234567"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Website */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          name="company_website"
                          type="url"
                          value={formData.company_website}
                          onChange={handleChange}
                          placeholder="https://company.com"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Tax ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tax ID / NPWP
                        </label>
                        <input
                          name="tax_id"
                          type="text"
                          value={formData.tax_id}
                          onChange={handleChange}
                          placeholder="12.345.678.9-012.345"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Registration Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Registration Number
                        </label>
                        <input
                          name="registration_number"
                          type="text"
                          value={formData.registration_number}
                          onChange={handleChange}
                          placeholder="REG-123456"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          name="company_city"
                          type="text"
                          value={formData.company_city}
                          onChange={handleChange}
                          placeholder="Jakarta"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Postal Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Postal Code
                        </label>
                        <input
                          name="company_postal_code"
                          type="text"
                          value={formData.company_postal_code}
                          onChange={handleChange}
                          placeholder="12345"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country
                        </label>
                        <input
                          name="company_country"
                          type="text"
                          value={formData.company_country}
                          onChange={handleChange}
                          placeholder="Indonesia"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <textarea
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleChange}
                        placeholder="Street address, building, floor..."
                        rows={2}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="About your company..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Company Settings
                  </h2>
                  
                  {/* Primary Company */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_primary"
                        checked={formData.is_primary}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Set as Primary Company
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          This company will be used as your default company
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Save Settings */}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>

                  {/* Transfer Company Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                      Transfer Company
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Transfer ownership of this company to another user. You will lose access to this company.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTransferModal(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Transfer Company
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Once you delete a company, there is no going back. Please be certain.
                    </p>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete This Company
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Transfer Company
              </h3>
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  setTransferEmail('')
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400">
                    You will lose access to "{company.company_name}" and all its data.
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                placeholder="newowner@example.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                disabled={transferring}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Enter the email address of the user who will receive this company
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleTransfer}
                disabled={transferring || !transferEmail}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transferring ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transferring...
                  </span>
                ) : (
                  'Confirm Transfer'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTransferModal(false)
                  setTransferEmail('')
                }}
                disabled={transferring}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

