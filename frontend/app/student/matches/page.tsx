'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

interface Match {
  id: string
  internship: {
    id: string
    title: string
    company: string
    description: string
    location: string
    stipend?: number
    duration: string
  }
  matchScore: number
  matchDetails: string[]
}

export default function MatchesPage() {
  const router = useRouter()
  const user = getStoredUser()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('/login')
      return
    }
    fetchMatches()
  }, [user, router])

  const fetchMatches = async () => {
    try {
      const response = await apiClient.getRecommendedMatches(user?.id || '')
      setMatches(response.data)
    } catch (err: any) {
      setError('Failed to load recommendations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (internshipId: string) => {
    if (!user) return
    try {
      await apiClient.applyForInternship(user.id, internshipId)
      alert('Application submitted successfully!')
      router.push('/student/applications')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-foreground">Loading recommendations...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">AI-Powered Matches</h1>
        <p className="text-foreground opacity-75 mb-8">
          These internships are recommended based on your profile and skills
        </p>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {matches.length === 0 ? (
          <div className="bg-neutral-light border border-neutral-mid rounded-xl p-12 text-center">
            <p className="text-foreground opacity-75 mb-4">No matches found yet</p>
            <p className="text-foreground opacity-50 text-sm mb-6">
              Complete your profile to get personalized recommendations
            </p>
            <Link
              href="/student/profile"
              className="inline-block px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Matches List */}
            <div className="lg:col-span-2 space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match.id)}
                  className={`bg-neutral-light border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedMatch === match.id
                      ? 'border-primary'
                      : 'border-neutral-mid hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {match.internship.title}
                      </h3>
                      <p className="text-foreground opacity-75">{match.internship.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary text-accent">
                        {Math.round(match.matchScore)}%
                      </div>
                      <p className="text-foreground opacity-50 text-sm">Match Score</p>
                    </div>
                  </div>

                  <p className="text-foreground opacity-75 text-sm mb-4">
                    {match.internship.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.matchDetails.slice(0, 3).map((detail, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-background border border-primary text-primary text-sm rounded-full"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  <p className="text-foreground opacity-75 text-sm line-clamp-2">
                    {match.internship.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            {selectedMatch && (
              <div className="lg:col-span-1">
                {matches.find((m) => m.id === selectedMatch) && (
                  <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6 sticky top-20">
                    {(() => {
                      const match = matches.find((m) => m.id === selectedMatch)!
                      return (
                        <>
                          <h2 className="text-2xl font-bold text-foreground mb-4">
                            {match.internship.title}
                          </h2>

                          <div className="space-y-4 mb-6">
                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                Company
                              </h3>
                              <p className="text-foreground">{match.internship.company}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                Location
                              </h3>
                              <p className="text-foreground">{match.internship.location}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                Duration
                              </h3>
                              <p className="text-foreground">{match.internship.duration}</p>
                            </div>

                            {match.internship.stipend && (
                              <div>
                                <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                  Stipend
                                </h3>
                                <p className="text-foreground">${match.internship.stipend}/month</p>
                              </div>
                            )}

                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-2">
                                Why This Match
                              </h3>
                              <ul className="space-y-1">
                                {match.matchDetails.map((detail, idx) => (
                                  <li key={idx} className="text-foreground text-sm flex items-start gap-2">
                                    <span className="text-accent mt-1">✓</span>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <p className="text-foreground opacity-75 text-sm mb-6">
                            {match.internship.description}
                          </p>

                          <button
                            onClick={() => handleApply(match.internship.id)}
                            className="w-full bg-primary hover:bg-primary-dark text-background font-semibold py-2 rounded-lg transition-colors"
                          >
                            Apply Now
                          </button>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
