'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'
import type { StudentProfile } from '@/lib/auth'

export default function StudentProfilePage() {
  const router = useRouter()
  const user = getStoredUser()

  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    apiClient.getStudentProfile(user.id)
      .then((res) => setProfile(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const flash = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return
    setSaving(true)
    setError('')
    try {
      await apiClient.updateStudentProfile(user.id, profile)
      flash('Profile saved successfully')
    } catch {
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !resumeFile) return
    setUploadingResume(true)
    setError('')
    try {
      await apiClient.uploadResume(user.id, resumeFile)
      setResumeFile(null)
      flash('Resume uploaded successfully')
      const res = await apiClient.getStudentProfile(user.id)
      setProfile(res.data)
    } catch {
      setError('Failed to upload resume')
    } finally {
      setUploadingResume(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setResumeFile(file)
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4 animate-pulse">
          <div className="h-10 bg-neutral-mid rounded w-1/3" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-80 bg-neutral-mid rounded-2xl" />
            <div className="h-80 bg-neutral-mid rounded-2xl" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user?.fullName}</h1>
            <p className="text-foreground opacity-50">{user?.email}</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-accent bg-opacity-10 border border-accent border-opacity-30 text-accent px-4 py-3 rounded-xl mb-6 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile form */}
          <form onSubmit={handleSave} className="bg-neutral-light border border-neutral-mid rounded-2xl p-8 space-y-5">
            <h2 className="text-xl font-bold text-foreground">Education & Skills</h2>

            <div>
              <label className="block text-sm font-medium text-foreground opacity-70 mb-2">Education</label>
              <input
                type="text"
                value={profile?.education || ''}
                onChange={(e) => setProfile({ ...profile!, education: e.target.value })}
                placeholder="BS Computer Science, Addis Ababa University"
                className="w-full px-4 py-3 bg-background border border-neutral-mid rounded-xl text-foreground placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground opacity-70 mb-2">Experience</label>
              <textarea
                value={profile?.experience || ''}
                onChange={(e) => setProfile({ ...profile!, experience: e.target.value })}
                placeholder="Describe any work experience, projects, or internships..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-neutral-mid rounded-xl text-foreground placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground opacity-70 mb-2">Skills</label>
              <input
                type="text"
                value={profile?.skills?.join(', ') || ''}
                onChange={(e) =>
                  setProfile({ ...profile!, skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
                }
                placeholder="React, Python, SQL, Machine Learning..."
                className="w-full px-4 py-3 bg-background border border-neutral-mid rounded-xl text-foreground placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors"
              />
              {/* Skill tags preview */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-primary bg-opacity-10 border border-primary border-opacity-30 text-primary text-xs rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground opacity-70 mb-2">GPA (out of 4.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={profile?.gpa || ''}
                onChange={(e) => setProfile({ ...profile!, gpa: parseFloat(e.target.value) })}
                placeholder="3.80"
                className="w-full px-4 py-3 bg-background border border-neutral-mid rounded-xl text-foreground placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {saving ? (
                <><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving...</>
              ) : 'Save Profile'}
            </button>
          </form>

          {/* Resume upload */}
          <form onSubmit={handleResumeUpload} className="bg-neutral-light border border-neutral-mid rounded-2xl p-8 flex flex-col">
            <h2 className="text-xl font-bold text-foreground mb-2">Resume</h2>
            <p className="text-foreground opacity-50 text-sm mb-6">
              Upload your resume to auto-fill your profile and improve match accuracy.
            </p>

            {profile?.resumeUrl && (
              <div className="flex items-center gap-3 bg-accent bg-opacity-10 border border-accent border-opacity-30 text-accent px-4 py-3 rounded-xl mb-5 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="truncate">Resume uploaded</span>
              </div>
            )}

            {/* Drop zone */}
            <label
              htmlFor="resume-upload"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5 ${
                dragOver
                  ? 'border-primary bg-primary bg-opacity-5'
                  : resumeFile
                  ? 'border-accent bg-accent bg-opacity-5'
                  : 'border-neutral-mid hover:border-primary hover:bg-primary hover:bg-opacity-5'
              }`}
            >
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="text-3xl mb-3">{resumeFile ? '📄' : '☁️'}</div>
              {resumeFile ? (
                <p className="text-foreground font-medium text-sm">{resumeFile.name}</p>
              ) : (
                <>
                  <p className="text-foreground font-medium text-sm mb-1">Drop your resume here</p>
                  <p className="text-foreground opacity-40 text-xs">PDF, DOC, or DOCX · max 5 MB</p>
                </>
              )}
            </label>

            <button
              type="submit"
              disabled={!resumeFile || uploadingResume}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {uploadingResume ? (
                <><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Uploading...</>
              ) : 'Upload Resume'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
