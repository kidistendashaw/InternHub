'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { getStoredUser } from '@/lib/auth'
import { apiClient } from '@/lib/api'

interface Stats {
  students: number
  internships: number
  companies: number
  applications: {
    total: number
    pending: number
    accepted: number
    rejected: number
  }
  avgMatchScore: number
  topDomains: { domain: string; count: number }[]
}

function StatCard({
  label,
  value,
  sub,
  color = 'text-primary',
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
      <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
      <p className="text-foreground font-medium">{label}</p>
      {sub && <p className="text-foreground opacity-50 text-sm mt-1">{sub}</p>}
    </div>
  )
}

/** Simple horizontal bar built with plain divs — no chart library needed */
function BarChart({ data }: { data: { domain: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="space-y-3">
      {data.map(({ domain, count }) => (
        <div key={domain}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-foreground capitalize">{domain}</span>
            <span className="text-foreground opacity-60">{count}</span>
          </div>
          <div className="h-2 bg-neutral-mid rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Donut-style application status breakdown */
function StatusBreakdown({
  pending,
  accepted,
  rejected,
  total,
}: {
  pending: number
  accepted: number
  rejected: number
  total: number
}) {
  const items = [
    { label: 'Pending', value: pending, color: 'bg-yellow-500', text: 'text-yellow-400' },
    { label: 'Accepted', value: accepted, color: 'bg-green-500', text: 'text-green-400' },
    { label: 'Rejected', value: rejected, color: 'bg-red-500', text: 'text-red-400' },
  ]
  return (
    <div className="space-y-3">
      {items.map(({ label, value, color, text }) => (
        <div key={label} className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">{label}</span>
              <span className={`font-semibold ${text}`}>
                {value} ({total ? Math.round((value / total) * 100) : 0}%)
              </span>
            </div>
            <div className="h-2 bg-neutral-mid rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${color}`}
                style={{ width: total ? `${(value / total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const user = getStoredUser()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      router.push('/login')
      return
    }
    apiClient
      .getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [user, router])

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-1">Admin Dashboard</h1>
            <p className="text-foreground opacity-60">Platform overview and quick actions</p>
          </div>
          <Link
            href="/admin/internships/new"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg transition-colors"
          >
            + New Internship
          </Link>
        </div>

        {/* Top stats */}
        {loading ? (
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-light border border-neutral-mid rounded-xl p-6 animate-pulse h-28"
              />
            ))}
          </div>
        ) : stats ? (
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Students" value={stats.students} sub="registered" />
            <StatCard label="Active Internships" value={stats.internships} sub="open positions" />
            <StatCard label="Companies" value={stats.companies} sub="on platform" />
            <StatCard
              label="Avg Match Score"
              value={`${stats.avgMatchScore}%`}
              sub="across all applications"
              color="text-accent"
            />
          </div>
        ) : (
          <div className="mb-10 text-foreground opacity-50 text-sm">
            Could not load stats — make sure the backend is running.
          </div>
        )}

        {/* Charts row */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Application status breakdown */}
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">Applications</h2>
                <span className="text-2xl font-bold text-primary">
                  {stats.applications.total}
                </span>
              </div>
              <StatusBreakdown
                pending={stats.applications.pending}
                accepted={stats.applications.accepted}
                rejected={stats.applications.rejected}
                total={stats.applications.total}
              />
              <div className="mt-4 pt-4 border-t border-neutral-mid">
                <Link
                  href="/admin/applications"
                  className="text-primary hover:text-primary-dark text-sm font-semibold"
                >
                  Review all applications →
                </Link>
              </div>
            </div>

            {/* Top domains */}
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-5">Top Domains</h2>
              {stats.topDomains.length > 0 ? (
                <BarChart data={stats.topDomains} />
              ) : (
                <p className="text-foreground opacity-50 text-sm">
                  No internships posted yet.
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-mid">
                <Link
                  href="/admin/internships"
                  className="text-primary hover:text-primary-dark text-sm font-semibold"
                >
                  Manage internships →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/internships"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-8 hover:border-primary transition-colors group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📝</div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              Internship Listings
            </h3>
            <p className="text-foreground opacity-75 mb-4">
              Create, edit, and manage internship positions
            </p>
            <span className="inline-block px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold group-hover:bg-primary-dark transition-colors">
              Manage →
            </span>
          </Link>

          <Link
            href="/admin/applications"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-8 hover:border-primary transition-colors group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              Applications
            </h3>
            <p className="text-foreground opacity-75 mb-4">
              Review and manage student applications
            </p>
            <span className="inline-block px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold group-hover:bg-primary-dark transition-colors">
              Review →
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
