'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

interface Internship {
  id: string
  title: string
  company: string
  description: string
  location: string
  duration: string
  stipend?: number
  requiredSkills: string[]
  applicationsCount: number
}

export default function InternshipsPage() {
  const router = useRouter()
  const user = getStoredUser()
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      router.push('/login')
      return
    }
    fetchInternships()
  }, [user, router])

  const fetchInternships = async () => {
    try {
      const response = await apiClient.getInternships()
      setInternships(response.data)
    } catch (err: any) {
      setError('Failed to load internships')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) return
    try {
      await apiClient.deleteInternship(id)
      setInternships(internships.filter((i) => i.id !== id))
      alert('Internship deleted successfully!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete internship')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-foreground">Loading internships...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Internship Listings</h1>
            <p className="text-foreground opacity-75">Manage your internship positions</p>
          </div>
          <Link
            href="/admin/internships/new"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg transition-colors"
          >
            + New Internship
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {internships.length === 0 ? (
          <div className="bg-neutral-light border border-neutral-mid rounded-xl p-12 text-center">
            <p className="text-foreground opacity-75 mb-4">No internships posted yet</p>
            <p className="text-foreground opacity-50 text-sm mb-6">
              Create your first internship position to start matching with students
            </p>
            <Link
              href="/admin/internships/new"
              className="inline-block px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
            >
              Post Internship
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="bg-neutral-light border border-neutral-mid rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {internship.title}
                    </h3>
                    <p className="text-foreground opacity-75">
                      {internship.company} • {internship.location}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-primary">
                      {internship.applicationsCount}
                    </div>
                    <p className="text-foreground opacity-50 text-sm">Applications</p>
                  </div>
                </div>

                <p className="text-foreground opacity-75 text-sm mb-4 line-clamp-2">
                  {internship.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {internship.requiredSkills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-background border border-neutral-mid text-foreground text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {internship.requiredSkills.length > 4 && (
                    <span className="px-3 py-1 bg-background border border-neutral-mid text-foreground text-xs rounded-full">
                      +{internship.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/admin/internships/${internship.id}`}
                    className="px-4 py-2 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="px-4 py-2 border border-red-700 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-900 hover:bg-opacity-20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
