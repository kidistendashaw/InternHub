'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

interface StudentInfo {
  id: string
  fullName: string
  email: string
  skills?: string[]
  gpa?: number
}

interface Application {
  id: string
  student: StudentInfo
  internship: {
    id: string
    title: string
    company: string
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
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      router.push('/login')
      return
    }
    fetchApplications()
  }, [user, router])

  const fetchApplications = async () => {
    try {
      const response = await apiClient.getAllApplications()
      setApplications(response.data)
    } catch (err: any) {
      setError('Failed to load applications')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appId: string, newStatus: 'accepted' | 'rejected') => {
    setUpdating(appId)
    try {
      await apiClient.updateApplicationStatus(appId, newStatus)
      setApplications(
        applications.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      )
      alert(`Application ${newStatus}!`)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application')
    } finally {
      setUpdating(null)
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Applications</h1>
        <p className="text-foreground opacity-75 mb-8">Review and manage student applications</p>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-neutral-light border border-neutral-mid rounded-xl p-12 text-center">
            <p className="text-foreground opacity-75">No applications yet</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Applications List */}
            <div className="lg:col-span-2 space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className={`bg-neutral-light border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedApp === app.id
                      ? 'border-primary'
                      : 'border-neutral-mid hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {app.student.fullName}
                      </h3>
                      <p className="text-foreground opacity-75 text-sm mb-1">
                        {app.student.email}
                      </p>
                      <p className="text-foreground opacity-75 text-sm">
                        Applied for: <span className="font-semibold">{app.internship.title}</span>
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border capitalize ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="text-foreground opacity-50 text-xs">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Details Panel */}
            {selectedApp && (
              <div className="lg:col-span-1">
                {applications.find((a) => a.id === selectedApp) && (
                  <div className="bg-neutral-light border border-neutral-mid rounded-xl p-6 sticky top-20">
                    {(() => {
                      const app = applications.find((a) => a.id === selectedApp)!
                      return (
                        <>
                          <h2 className="text-2xl font-bold text-foreground mb-4">
                            {app.student.fullName}
                          </h2>

                          <div className="space-y-4 mb-6">
                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                Email
                              </h3>
                              <p className="text-foreground break-all">{app.student.email}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                Position
                              </h3>
                              <p className="text-foreground">{app.internship.title}</p>
                              <p className="text-foreground opacity-75 text-sm">
                                {app.internship.company}
                              </p>
                            </div>

                            {app.student.gpa && (
                              <div>
                                <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                  GPA
                                </h3>
                                <p className="text-foreground">{app.student.gpa}</p>
                              </div>
                            )}

                            {app.student.skills && app.student.skills.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-2">
                                  Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {app.student.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-background border border-primary text-primary text-xs rounded"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <h3 className="text-sm font-semibold text-foreground opacity-75 uppercase tracking-wide mb-1">
                                Status
                              </h3>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border capitalize ${
                                  statusColors[app.status]
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                          </div>

                          {app.status === 'pending' && (
                            <div className="space-y-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(app.id, 'accepted')
                                }
                                disabled={updating === app.id}
                                className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
                              >
                                {updating === app.id ? 'Updating...' : 'Accept'}
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(app.id, 'rejected')
                                }
                                disabled={updating === app.id}
                                className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
                              >
                                {updating === app.id ? 'Updating...' : 'Reject'}
                              </button>
                            </div>
                          )}
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
