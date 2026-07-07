'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

interface Internship {
  id: string
  title: string
  company: string
  companyId: string
  domain: string
  description: string
  skills: string[]
  minCgpa: number
  minYear: number
  positionsAvailable: number
  isActive: boolean
}

interface MatchInfo {
  matchPercent: number
  reasons: string[]
}

const YEAR_LABELS: Record<number, string> = {
  1: '1st year',
  2: '2nd year',
  3: '3rd year',
  4: '4th year',
  5: '5th year',
}

export default function InternshipDetailPage() {
  const router = useRouter()
  const params = useParams()
  const user = getStoredUser()
  const internshipId = params.id as string

  const [internship, setInternship] = useState<Internship | null>(null)
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('/login')
      return
    }
    fetchData()
  }, [internshipId])

  const fetchData = async () => {
    try {
      // Fetch internship details
      const res = await apiClient.getInternshipDetails(internshipId)
      setInternship(res.data)

      // Try to get match score for this student
      try {
        const matchRes = await apiClient.getRecommendedMatches(user!.id)
        const matches: any[] = matchRes.data
        const found = matches.find(
          (m: any) =>
            String(m.internship_id) === String(internshipId) ||
            String(m.id) === String(internshipId)
        )
        if (found) {
          setMatchInfo({
            matchPercent: found.matchPercent ?? Math.round((found.match_score ?? 0) * 100),
            reasons: found.reasons ?? [],
          })
        }
      } catch {
        // Match info is optional — don't block the page
      }

      // Check if already applied
      try {
        const appsRes = await apiClient.getStudentApplications(user!.id)
        const apps: any[] = appsRes.data
        const alreadyApplied = apps.some(
          (a: any) =>
            String(a.internshipId) === String(internshipId) ||
            String(a.internship_id) === String(internshipId)
        )
        setApplied(alreadyApplied)
      } catch {
        // Non-critical
      }
    } catch (err: any) {
      setError('Failed to load internship details')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user || applying || applied) return
    setApplying(true)
    setError('')
    try {
      await apiClient.applyForInternship(user.id, internshipId)
      setApplied(true)
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.message
      if (msg?.toLowerCase().includes('already')) {
        setApplied(true)
      } else {
        setError(msg || 'Failed to submit application')
      }
    } finally {
      setApplying(false)
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
          <div className="h-8 bg-neutral-mid rounded w-2/3" />
          <div className="h-5 bg-neutral-mid rounded w-1/3" />
          <div className="h-40 bg-neutral-mid rounded" />
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-mid rounded" />
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !internship) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            {error || 'Internship not found'}
          </div>
          <Link href="/student/matches" className="text-primary hover:text-primary-dark text-sm">
            ← Back to matches
          </Link>
        </div>
      </Layout>
    )
  }

  const scoreColor =
    !matchInfo ? 'text-foreground opacity-50' :
    matchInfo.matchPercent >= 70 ? 'text-green-400' :
    matchInfo.matchPercent >= 40 ? 'text-yellow-400' :
    'text-red-400'

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/student/matches"
          className="inline-flex items-center gap-1 text-foreground opacity-60 hover:opacity-100 text-sm mb-8 transition-opacity"
        >
          ← Back to matches
        </Link>

        {/* Header card */}
        <div className="bg-neutral-light border border-neutral-mid rounded-xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              {/* Domain badge */}
              <span className="inline-block px-3 py-1 bg-background border border-primary text-primary text-xs font-semibold rounded-full mb-3 capitalize">
                {internship.domain}
              </span>

              <h1 className="text-3xl font-bold text-foreground mb-2">{internship.title}</h1>
              <p className="text-xl text-foreground opacity-75">{internship.company}</p>
            </div>

            {/* Match score badge */}
            <div className="flex-shrink-0 text-center bg-background border border-neutral-mid rounded-xl px-6 py-4 min-w-[110px]">
              <div className={`text-4xl font-bold ${scoreColor}`}>
                {matchInfo ? `${matchInfo.matchPercent}%` : '—'}
              </div>
              <p className="text-foreground opacity-50 text-xs mt-1">Match Score</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Left column — main content */}
          <div className="md:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">About this internship</h2>
              <p className="text-foreground opacity-75 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>

            {/* Required skills */}
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Required Skills</h2>
              {internship.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-background border border-neutral-mid text-foreground text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-foreground opacity-50 text-sm">No specific skills listed</p>
              )}
            </div>

            {/* Why this match */}
            {matchInfo && matchInfo.reasons.length > 0 && (
              <div className="bg-neutral-light border border-primary border-opacity-40 rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Why you match</h2>
                <ul className="space-y-2">
                  {matchInfo.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground opacity-80">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-4">

            {/* Apply card */}
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
              {applied ? (
                <div className="text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-green-400 font-semibold mb-1">Applied!</p>
                  <p className="text-foreground opacity-50 text-sm mb-4">
                    Your application is under review
                  </p>
                  <Link
                    href="/student/applications"
                    className="block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-background transition-colors"
                  >
                    View Applications
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-foreground opacity-60 text-sm mb-4">
                    Ready to apply? Submit your application with one click.
                  </p>
                  {error && (
                    <p className="text-red-400 text-sm mb-3">{error}</p>
                  )}
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {applying ? 'Submitting...' : 'Apply Now'}
                  </button>
                </>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                Requirements
              </h2>

              <div className="flex items-center justify-between">
                <span className="text-foreground opacity-60 text-sm">Min. CGPA</span>
                <span className="text-foreground font-semibold">
                  {internship.minCgpa > 0 ? internship.minCgpa.toFixed(1) : 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground opacity-60 text-sm">Min. Year</span>
                <span className="text-foreground font-semibold">
                  {YEAR_LABELS[internship.minYear] ?? `Year ${internship.minYear}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground opacity-60 text-sm">Open Positions</span>
                <span className="text-foreground font-semibold">
                  {internship.positionsAvailable}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground opacity-60 text-sm">Status</span>
                <span className={`font-semibold text-sm ${internship.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {internship.isActive ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}
