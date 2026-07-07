'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { setAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await apiClient.login(email, password)
      const { user, token } = response.data
      setAuth(user, token)
      router.push(user.userType === 'admin' ? '/admin' : '/student')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-neutral-light border-r border-neutral-mid p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm">IH</div>
          <span className="text-lg font-bold text-foreground">InternHub</span>
        </Link>

        <div>
          <div className="w-14 h-14 bg-primary bg-opacity-15 text-primary rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <blockquote className="text-2xl font-semibold text-foreground leading-snug mb-4">
            "InternHub matched me with my dream internship in 3 days."
          </blockquote>
          <p className="text-foreground opacity-50">— Abebe T., Computer Science, AAU</p>
        </div>

        <p className="text-foreground opacity-30 text-sm">© 2024 InternHub</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">IH</div>
            <span className="font-bold text-foreground">InternHub</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-foreground opacity-50 mb-8">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-neutral-light border border-neutral-mid rounded-xl text-foreground placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-neutral-light border border-neutral-mid rounded-xl text-foreground placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground opacity-40 hover:opacity-70 transition-opacity"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-primary shadow-opacity-20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-foreground opacity-50 mt-8 text-sm">
            No account?{' '}
            <Link href="/register" className="text-primary hover:text-primary-dark font-semibold opacity-100">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
