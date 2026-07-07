'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

interface Application {
  id: string
  student: { id: string; fullName: string; email: string; skills?: string[]; cgpa?: number }
  internship: { id: string; title: string; company: string }
  matchScore?: number
  status: 'pending' | 'accepted' | 'rejected'
  appliedAt: string
}

const STATUS = {
  pending:  { pill: 'bg-yellow-500 bg-opacity-15 border-yellow-500 border-opacity-30 text-yellow-400', dot: 'bg-yellow-400' },
  accepted: { pill: 'bg-green-500 bg-opacity-15 border-green-500 border-opacity-30 text-green-400',  dot: 'bg-green-400' },
  rejected: { pill: 'bg-red-500 bg-opacity-15 border-red-500 border-opacity-30 text-red-400',        dot: 'bg-red-400' },
}

export default function AdminApplicationsPage() {
  const router = useRouter()
  const user = getStoredUser()
  const [applications, setApplications] = useState<Application[]>([])
  const [filtered, setFiltered] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  useEffect(() => {
    if (!user || user.userType !== 'admin') { router.push('/login'); return }
    apiClient.getAllApplications()
      .then((res) => { setApplications(res.data); setFiltered(res.data) })
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(filter === 'all' ? applications : applications.filter((a) => a.status === filter))
    setSelectedId(null)
  }, [filter, applications])

  const handleStatus = async (id: string, status: 'accepted' | 'rejected') => {
    setUpdating(id)
    try {
      await apiClient.updateApplicationStatus(id, status)
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    } catch {
      setError('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const selected = applications.find((a) => a.id === selectedId)

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-1">Applications</h1>
          <p className="text-foreground opacity-50">Review and manage student applications</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-neutral-light border border-neutral-mid text-foreground opacity-60 hover:opacity-100'
              }`}
            >
              {f} <span className="ml-1 opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-light border border-neutral-mid rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-neutral-light border border-neutral-mid rounded-2xl p-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-foreground opacity-50">No {filter === 'all' ? '' : filter} applications yet</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              {filtered.map((app) => {
                const s = STATUS[app.status]
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    className={`bg-neutral-light border-2 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 ${
                      selectedId === app.id ? 'border-primary' : 'border-neutral-mid hover:border-primary hover:border-opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Avatar + info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {app.student?.fullName?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{app.student?.fullName}</p>
                          <p className="text-foreground opacity-50 text-sm truncate">{app.internship?.title}</p>
                        </div>
                      </div>

                      {/* Score + status */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {app.matchScore != null && (
                          <span className="text-xs font-semibold text-primary bg-primary bg-opacity-10 px-2.5 py-1 rounded-lg">
                            {Math.round(app.matchScore * 100)}% match
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${s.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <div className="bg-neutral-light border border-neutral-mid rounded-2xl p-6 sticky top-20">
                  {/* Avatar */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold">
                      {selected.student?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{selected.student?.fullName}</p>
                      <p className="text-foreground opacity-50 text-sm">{selected.student?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-foreground opacity-40 uppercase tracking-wider mb-1">Position</p>
                      <p className="text-foreground font-medium">{selected.internship?.title}</p>
                      <p className="text-foreground opacity-50 text-sm">{selected.internship?.company}</p>
                    </div>

                    {selected.matchScore != null && (
                      <div>
                        <p className="text-xs font-semibold text-foreground opacity-40 uppercase tracking-wider mb-1">Match Score</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-neutral-mid rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.round(selected.matchScore * 100)}%` }}
                            />
                          </div>
                          <span className="text-primary font-bold text-sm">{Math.round(selected.matchScore * 100)}%</span>
                        </div>
                      </div>
                    )}

                    {selected.student?.cgpa && (
                      <div>
                        <p className="text-xs font-semibold text-foreground opacity-40 uppercase tracking-wider mb-1">GPA</p>
                        <p className="text-foreground font-medium">{selected.student.cgpa}</p>
                      </div>
                    )}

                    {selected.student?.skills && selected.student.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-foreground opacity-40 uppercase tracking-wider mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.student.skills.map((s, i) => (
                            <span key={i} className="px-2.5 py-1 bg-primary bg-opacity-10 border border-primary border-opacity-20 text-primary text-xs rounded-lg">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-foreground opacity-40 uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border capitalize ${STATUS[selected.status].pill}`}>
                        <span className={`w-2 h-2 rounded-full ${STATUS[selected.status].dot}`} />
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  {selected.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatus(selected.id, 'accepted')}
                        disabled={updating === selected.id}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {updating === selected.id ? (
                          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        ) : '✓'} Accept
                      </button>
                      <button
                        onClick={() => handleStatus(selected.id, 'rejected')}
                        disabled={updating === selected.id}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-red-500 border-opacity-40 text-red-400 hover:bg-red-500 hover:bg-opacity-10 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-neutral-light border border-dashed border-neutral-mid rounded-2xl p-10 text-center text-foreground opacity-30">
                  <p className="text-3xl mb-2">👆</p>
                  <p className="text-sm">Select an application to review</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
