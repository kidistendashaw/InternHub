'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'

export default function NewInternshipPage() {
  const router = useRouter()
  const user = getStoredUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    duration: '3 months',
    stipend: '',
    requiredSkills: '',
  })

  if (!user || user.userType !== 'admin') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-foreground">Redirecting...</div>
        </div>
      </Layout>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const skills = formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)

      const data = {
        ...formData,
        requiredSkills: skills,
        stipend: formData.stipend ? parseInt(formData.stipend) : undefined,
      }

      await apiClient.createInternship(data)
      alert('Internship created successfully!')
      router.push('/admin/internships')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create internship')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Post New Internship</h1>

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
                  Position Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Frontend Engineer Intern"
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g., TechCorp Inc"
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe the internship position, responsibilities, and what students will learn..."
                className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
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
                Monthly Stipend (Optional)
              </label>
              <input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Required Skills (comma-separated) *
              </label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                required
                placeholder="e.g., React, JavaScript, CSS, Node.js"
                className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-semibold py-2 rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Post Internship'}
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
