'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

interface Application {
  id: string
  internship: {
    id: string
    title: string
    company: string
    location: string
  }
  status: 'pending' | 'accepted' | 'rejected'
  appliedAt: string
}

const statusColors = {
  pending: 'bg-yellow-900 text-yellow-100 border-yellow-700',
  accepted: 'bg-green-900 text-green-100 border-green-700',
  rejected: 'bg-red-900 text-red-100 border-red-700',
}

export default function ApplicationsPage() {
  const router = useRouter()
  const user = getStoredUser()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('/login')
      return
    }
    fetchApplications()
  }, [user, router])

  const fetchApplications = async () => {
    try {
      const response = await apiClient.getStudentApplications(user?.id || '')
      setApplications(response.data)
    } catch (err: any) {
      setError('Failed to load applications')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-foreground">Loading applications...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">My Applications</h1>
        <p className="text-foreground opacity-75 mb-8">
          Track the status of all your internship applications
        </p>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-neutral-light border border-neutral-mid rounded-xl p-12 text-center">
            <p className="text-foreground opacity-75 mb-4">No applications yet</p>
            <p className="text-foreground opacity-50 text-sm">
              Start by exploring AI-recommended matches
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
                <div className="text-2xl font-bold text-primary mb-1">
                  {applications.length}
                </div>
                <p className="text-foreground opacity-75 text-sm">Total Applications</p>
              </div>
              <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
                <div className="text-2xl font-bold text-accent mb-1">
                  {applications.filter((a) => a.status === 'accepted').length}
                </div>
                <p className="text-foreground opacity-75 text-sm">Accepted</p>
              </div>
              <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6">
                <div className="text-2xl font-bold text-foreground opacity-75 mb-1">
                  {applications.filter((a) => a.status === 'pending').length}
                </div>
                <p className="text-foreground opacity-75 text-sm">Pending</p>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-neutral-light border border-neutral-mid rounded-xl p-6 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {app.internship.title}
                    </h3>
                    <p className="text-foreground opacity-75 mb-2">
                      {app.internship.company} • {app.internship.location}
                    </p>
                    <p className="text-foreground opacity-50 text-sm">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border capitalize ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
