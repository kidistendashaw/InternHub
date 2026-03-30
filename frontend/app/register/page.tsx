'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { setAuth } from '@/lib/auth'
import Layout from '@/components/layout'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'student' | 'admin'>('student')
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
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-neutral-light rounded-xl border border-neutral-mid p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-foreground opacity-75 mb-6">Join InternHub and start your internship journey</p>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="John Doe"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="student"
                      checked={userType === 'student'}
                      onChange={(e) => setUserType(e.target.value as 'student' | 'admin')}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-foreground">Student</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="admin"
                      checked={userType === 'admin'}
                      onChange={(e) => setUserType(e.target.value as 'student' | 'admin')}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-foreground">Recruiter</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-foreground opacity-75 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-dark font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
