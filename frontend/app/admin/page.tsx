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
  applications: { total: number; pending: number; accepted: number; rejected: number }
  avgMatchScore: number
  topDomains: { domain: string; count: number }[]
}

function BarChart({ data }: { data: { domain: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="space-y-3">
      {data.map(({ domain, count }) => (
        <div key={domain}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground opacity-60 capitalize">{domain}</span>
            <span className="text-foreground opacity-40">{count}</span>
          </div>
          <div className="h-1.5 bg-neutral-mid rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
                 style={{ width: `${(count / max) * 100}%`, background: 'rgb(var(--primary))' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBar({ pending, accepted, rejected, total }: { pending: number; accepted: number; rejected: number; total: number }) {
  const items = [
    { label: 'Pending', value: pending, color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
    { label: 'Accepted', value: accepted, color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
    { label: 'Rejected', value: rejected, color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  ]
  return (
    <div className="space-y-3">
      {items.map(({ label, value, color, bg, border }) => (
        <div key={label} className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground opacity-60">{label}</span>
              <span className="font-medium" style={{ color }}>{value} ({total ? Math.round((value / total) * 100) : 0}%)</span>
            </div>
            <div className="h-1.5 bg-neutral-mid rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                   style={{ width: total ? `${(value / total) * 100}%` : '0%', background: color }} />
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
    if (!user || user.userType !== 'admin') { router.push('/login'); return }
    apiClient.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-foreground opacity-40 text-sm mb-1">Good to see you back</p>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Link href="/admin/internships/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium text-sm rounded-xl transition-all"
            style={{ background: 'rgb(var(--primary))' }}>
            + New Internship
          </Link>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-neutral-light border border-neutral-mid rounded-2xl animate-pulse" />)}
          </div>
        ) : stats && (
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Students', value: stats.students, sub: 'registered' },
              { label: 'Internships', value: stats.internships, sub: 'active listings' },
              { label: 'Companies', value: stats.companies, sub: 'on platform' },
              { label: 'Avg Match', value: `${stats.avgMatchScore}%`, sub: 'score', accent: true },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className="bg-neutral-light border border-neutral-mid rounded-2xl p-5">
                <div className={`text-2xl font-bold mb-1 ${accent ? 'text-accent' : 'text-primary'}`}>{value}</div>
                <p className="text-foreground text-sm font-medium">{label}</p>
                <p className="text-foreground opacity-35 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <div className="bg-neutral-light border border-neutral-mid rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground text-sm">Applications</h2>
                <span className="text-2xl font-bold text-primary">{stats.applications.total}</span>
              </div>
              <StatusBar
                pending={stats.applications.pending}
                accepted={stats.applications.accepted}
                rejected={stats.applications.rejected}
                total={stats.applications.total}
              />
              <div className="mt-5 pt-4 border-t border-neutral-mid">
                <Link href="/admin/applications" className="text-primary text-xs font-medium hover:underline">
                  Review all applications →
                </Link>
              </div>
            </div>

            <div className="bg-neutral-light border border-neutral-mid rounded-2xl p-6">
              <h2 className="font-semibold text-foreground text-sm mb-5">Top Domains</h2>
              {stats.topDomains.length > 0 ? (
                <BarChart data={stats.topDomains} />
              ) : (
                <p className="text-foreground opacity-35 text-sm">No internships posted yet.</p>
              )}
              <div className="mt-5 pt-4 border-t border-neutral-mid">
                <Link href="/admin/internships" className="text-primary text-xs font-medium hover:underline">
                  Manage internships →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { href: '/admin/internships', emoji: '📝', title: 'Internship Listings', desc: 'Create, edit, and manage positions', cta: 'Manage →' },
            { href: '/admin/applications', emoji: '📊', title: 'Applications', desc: 'Review and accept or reject candidates', cta: 'Review →' },
          ].map(({ href, emoji, title, desc, cta }) => (
            <Link key={href} href={href}
              className="group bg-neutral-light border border-neutral-mid hover:border-primary rounded-2xl p-7 transition-all hover:-translate-y-0.5">
              <div className="text-3xl mb-4">{emoji}</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{title}</h3>
              <p className="text-foreground opacity-40 text-sm mb-4">{desc}</p>
              <span className="text-primary text-sm font-medium">{cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
