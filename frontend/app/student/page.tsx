'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { getStoredUser } from '@/lib/auth'
import { apiClient } from '@/lib/api'

interface StudentStats {
  totalApplications: number
  pending: number
  accepted: number
  rejected: number
  bestMatchScore: number
  availableInternships: number
}

function StatCard({
  href,
  emoji,
  label,
  value,
  sub,
  color = 'text-primary',
  loading,
}: {
  href: string
  emoji: string
  label: string
  value?: string | number
  sub: string
  color?: string
  loading?: boolean
}) {
  return (
    <Link
      href={href}
      className="bg-neutral-light border border-neutral-mid rounded-xl p-6 hover:border-primary transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{emoji}</div>
        {loading ? (
          <div className="h-8 w-12 bg-neutral-mid rounded animate-pulse" />
        ) : value !== undefined ? (
          <div className={`text-3xl font-bold ${color}`}>{value}</div>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
        {label}
      </h3>
      <p className="text-foreground opacity-60 text-sm">{sub}</p>
    </Link>
  )
}

export default function StudentDashboard() {
  const router = useRouter()
  const user = getStoredUser()
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('/login')
      return
    }
    apiClient
      .getStudentStats(user.id)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [user, router])

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-foreground opacity-60">
            Find and apply to internships that match your skills
          </p>
        </div>

        {/* Live stat cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard
            href="/student/matches"
            emoji="★"
            label="AI Matches"
            value={stats?.availableInternships}
            sub="open internships available"
            color="text-primary"
            loading={loading}
          />
          <StatCard
            href="/student/applications"
            emoji="📋"
            label="Applications"
            value={stats?.totalApplications}
            sub={
              stats
                ? `${stats.accepted} accepted · ${stats.pending} pending`
                : 'Track your status'
            }
            color="text-primary"
            loading={loading}
          />
          <StatCard
            href="/student/profile"
            emoji="🎯"
            label="Best Match"
            value={stats?.bestMatchScore ? `${stats.bestMatchScore}%` : '—'}
            sub={stats?.bestMatchScore ? 'your top match score' : 'apply to see your score'}
            color="text-accent"
            loading={loading}
          />
        </div>

        {/* Application status summary (only shown if student has applied) */}
        {stats && stats.totalApplications > 0 && (
          <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Application Summary</h2>
              <Link
                href="/student/applications"
                className="text-primary hover:text-primary-dark text-sm font-semibold"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                <p className="text-foreground opacity-60 text-sm mt-1">Pending</p>
              </div>
              <div className="text-center border-x border-neutral-mid">
                <div className="text-2xl font-bold text-green-400">{stats.accepted}</div>
                <p className="text-foreground opacity-60 text-sm mt-1">Accepted</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
                <p className="text-foreground opacity-60 text-sm mt-1">Rejected</p>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-gradient-to-r from-neutral-light to-background rounded-xl p-8 border border-neutral-mid">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-3">1</div>
              <h3 className="font-semibold text-foreground mb-2">Complete Your Profile</h3>
              <p className="text-foreground opacity-75 text-sm">
                Upload your resume and tell us about your skills, education, and experience.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-3">2</div>
              <h3 className="font-semibold text-foreground mb-2">Get AI-Powered Matches</h3>
              <p className="text-foreground opacity-75 text-sm">
                Our AI analyzes your profile and finds internships that match your skills perfectly.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-3">3</div>
              <h3 className="font-semibold text-foreground mb-2">Apply & Get Hired</h3>
              <p className="text-foreground opacity-75 text-sm">
                Apply to opportunities with just one click and track your progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
