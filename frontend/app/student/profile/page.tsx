'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'
import type { StudentProfile } from '@/lib/auth'

export default function StudentProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const user = getStoredUser()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchProfile()
  }, [user, router])

  const fetchProfile = async () => {
    try {
      if (!user) return
      const response = await apiClient.getStudentProfile(user.id)
      setProfile(response.data)
    } catch (err: any) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setSaving(true)
    try {
      await apiClient.updateStudentProfile(user.id, profile)
      setError('')
      alert('Profile updated successfully!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !resumeFile) return

    setSaving(true)
    try {
      await apiClient.uploadResume(user.id, resumeFile)
      setResumeFile(null)
      setError('')
      alert('Resume uploaded successfully!')
      fetchProfile()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload resume')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-foreground">Loading...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Profile</h1>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="bg-neutral-light border border-neutral-mid rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Education & Experience</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Education</label>
                <input
                  type="text"
                  value={profile?.education || ''}
                  onChange={(e) => setProfile({ ...profile!, education: e.target.value })}
                  placeholder="e.g., BS Computer Science, University of X"
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Experience</label>
                <textarea
                  value={profile?.experience || ''}
                  onChange={(e) => setProfile({ ...profile!, experience: e.target.value })}
                  placeholder="Describe your work experience..."
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={profile?.skills?.join(', ') || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile!,
                      skills: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  placeholder="React, Python, JavaScript, etc."
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={profile?.gpa || ''}
                  onChange={(e) => setProfile({ ...profile!, gpa: parseFloat(e.target.value) })}
                  placeholder="3.8"
                  className="w-full px-4 py-2 bg-background border border-neutral-mid rounded-lg text-foreground placeholder-foreground placeholder-opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-semibold py-2 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          {/* Resume Upload */}
          <form onSubmit={handleResumeUpload} className="bg-neutral-light border border-neutral-mid rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Resume</h2>

            {profile?.resumeUrl && (
              <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg mb-4">
                Resume uploaded: {profile.resumeUrl}
              </div>
            )}

            <div className="space-y-4">
              <div className="border-2 border-dashed border-neutral-mid rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer block">
                  <div className="text-foreground font-semibold mb-2">
                    {resumeFile ? resumeFile.name : 'Drop your resume here'}
                  </div>
                  <div className="text-foreground opacity-50 text-sm">
                    PDF, DOC, or DOCX (max 5MB)
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={!resumeFile || saving}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-background font-semibold py-2 rounded-lg transition-colors"
              >
                {saving ? 'Uploading...' : 'Upload Resume'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
