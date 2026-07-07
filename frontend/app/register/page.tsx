'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { setAuth } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'student' | 'admin'>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await apiClient.register(email, password, fullName, userType)
      const { user, token } = response.data
      setAuth(user, token)
      router.push(userType === 'admin' ? '/admin' : '/student')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-neutral-light border border-neutral-mid rounded-xl text-foreground text-sm placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-15 transition-all"

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] border-r border-neutral-mid p-12"
           style={{ background: 'linear-gradient(160deg, rgb(var(--neutral-light)) 0%, rgb(var(--background)) 100%)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
               style={{ background: 'rgb(var(--primary))' }}>IH</div>
          <span className="text-base font-bold text-foreground">InternHub</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2 leading-snug">
              Start your internship journey today
            </h2>
            <p className="text-foreground opacity-45 text-sm">
              Join thousands of students getting matched with the right opportunities.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { icon: '🎯', title: 'Personalized matches', desc: 'Ranked by how well they fit your profile' },
              { icon: '📄', title: 'Resume auto-parsing', desc: 'Upload once, fill your profile instantly' },
              { icon: '⚡', title: 'Apply in one click', desc: 'No forms, no repetition' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                     style={{ background: 'rgba(139,92,246,0.12)' }}>
                  {icon}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{title}</p>
                  <p className="text-foreground opacity-40 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-foreground opacity-25 text-xs">© 2024 InternHub</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: 'rgb(var(--primary))' }}>IH</div>
            <span className="font-bold text-foreground">InternHub</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
            <p className="text-foreground opacity-45 text-sm">Free forever. No credit card needed.</p>
          </div>

          {/* Account type toggle */}
          <div className="flex gap-1.5 p-1 bg-neutral-light border border-neutral-mid rounded-xl mb-6">
            {(['student', 'admin'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  userType === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground opacity-45 hover:opacity-70'
                }`}
              >
                {type === 'admin' ? '🏢 Recruiter' : '🎓 Student'}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500 bg-opacity-8 border border-red-500 border-opacity-20 text-red-400 px-3.5 py-3 rounded-xl mb-5 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground opacity-60 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Abebe Tadesse"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-60 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-60 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={`${inputClass} pr-11`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground opacity-35 hover:opacity-60 transition-opacity"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-60 uppercase tracking-wide mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
              style={{
                background: loading ? 'rgb(var(--primary))' : 'linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary)) 100%)',
                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-foreground opacity-40 mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold opacity-100 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-foreground opacity-25 text-xs mt-5 leading-relaxed">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
