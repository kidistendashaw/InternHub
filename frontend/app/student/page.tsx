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
  href, emoji, label, value, sub, loading,
}: {
  href: string; emoji: string; label: string
  value?: string | number; sub: string; loading?: boolean
}) {
  return (
    <Link
      href={href}
      className="group bg-neutral-light border border-neutral-mid hover:border-primary rounded-2xl p-5 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
             style={{ background: 'rgba(139,92,246,0.1)' }}>
          {emoji}
        </div>
        {loading ? (
          <div className="h-7 w-10 bg-neutral-mid rounded animate-pulse" />
        ) : value !== undefined ? (
          <span className="text-2xl font-bold text-primary">{value}</span>
        ) : null}
      </div>
      <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{label}</p>
      <p className="text-foreground opacity-40 text-xs mt-0.5">{sub}</p>
    </Link>
  )
}

export default function StudentDashboard() {
  const router = useRouter()
  const user = getStoredUser()
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.userType !== 'student') { router.push('/login'); return }
    apiClient.getStudentStats(user.id)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Greeting */}
        <div className="mb-10">
          <p className="text-foreground opacity-40 text-sm mb-1">Good to see you back</p>
          <h1 className="text-3xl font-bold text-foreground">{user.fullName} 👋</h1>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            href="/student/matches"
            emoji="🎯"
            label="AI Matches"
            value={stats?.availableInternships}
            sub="internships available"
            loading={loading}
          />
          <StatCard
            href="/student/applications"
            emoji="📋"
            label="Applications"
            value={stats?.totalApplications}
            sub={stats ? `${stats.accepted} accepted · ${stats.pending} pending` : 'track your status'}
            loading={loading}
          />
          <StatCard
            href="/student/profile"
            emoji="✨"
            label="Best Match"
            value={stats?.bestMatchScore ? `${stats.bestMatchScore}%` : '—'}
            sub={stats?.bestMatchScore ? 'your top score' : 'apply to see your score'}
            loading={loading}
          />
        </div>

        {/* Application summary */}
        {stats && stats.totalApplications > 0 && (
          <div className="bg-neutral-light border border-neutral-mid rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground text-sm">Application Summary</h2>
              <Link href="/student/applications" className="text-primary text-xs font-medium hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-yellow-400">{stats.pending}</div>
                <p className="text-foreground opacity-40 text-xs mt-1">Pending</p>
              </div>
              <div className="border-x border-neutral-mid">
                <div className="text-xl font-bold text-accent">{stats.accepted}</div>
                <p className="text-foreground opacity-40 text-xs mt-1">Accepted</p>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">{stats.rejected}</div>
                <p className="text-foreground opacity-40 text-xs mt-1">Rejected</p>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-neutral-light border border-neutral-mid rounded-2xl p-7">
          <h2 className="font-semibold text-foreground mb-6">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Complete Your Profile', desc: 'Upload your resume and add your skills, education, and GPA.' },
              { n: '2', title: 'Get Matches', desc: 'Our algorithm scores every internship against your profile.' },
              { n: '3', title: 'Apply & Track', desc: 'One-click apply and watch your status in real time.' },
            ].map(({ n, title, desc }) => (
              <div key={n}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-3"
                     style={{ background: 'rgb(var(--primary))' }}>{n}</div>
                <p className="font-medium text-foreground text-sm mb-1">{title}</p>
                <p className="text-foreground opacity-40 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
