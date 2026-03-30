'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
}

export default function EditInternshipPage() {
  const router = useRouter()
  const params = useParams()
  const user = getStoredUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [internship, setInternship] = useState<Internship | null>(null)

  const internshipId = params.id as string

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      router.push('/login')
      return
    }
    fetchInternship()
  }, [user, router, internshipId])

  const fetchInternship = async () => {
    try {
      const response = await apiClient.getInternshipDetails(internshipId)
      setInternship(response.data)
    } catch (err: any) {
      setError('Failed to load internship')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (!internship) return

    if (name === 'requiredSkills') {
      setInternship({
        ...internship,
        requiredSkills: value.split(',').map((s) => s.trim()),
      })
    } else {
      setInternship({
        ...internship,
        [name]: name === 'stipend' && value ? parseInt(value) : value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!internship) return

    setSaving(true)
    setError('')

    try {
      await apiClient.updateInternship(internshipId, internship)
      alert('Internship updated successfully!')
      router.push('/admin/internships')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update internship')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center text-foreground">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!internship) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
            Internship not found
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Edit Internship</h1>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-neutral-light border border-neutral-mid rounded-xl p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Position Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={internship.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={internship.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={internship.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={internship.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={internship.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="4 months">4 months</option>
                  <option value="5 months">5 months</option>
                  <option value="6 months">6 months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monthly Stipend
              </label>
              <input
                type="number"
                name="stipend"
                value={internship.stipend || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                name="requiredSkills"
                value={internship.requiredSkills.join(', ')}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-semibold py-2 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-neutral-mid text-foreground hover:bg-neutral-mid font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
