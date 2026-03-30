'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { setAuth } from '@/lib/auth'
import Layout from '@/components/layout'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-neutral-light rounded-xl border border-neutral-mid p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-foreground opacity-75 mb-6">Sign in to your InternHub account</p>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-foreground opacity-75 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary-dark font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
