'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/layout'
import { apiClient } from '@/lib/api'
import { getStoredUser } from '@/lib/auth'
import type { StudentProfile } from '@/lib/auth'

const inputClass = "w-full px-4 py-3 bg-background border border-neutral-mid rounded-xl text-foreground text-sm placeholder-foreground placeholder-opacity-30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-15 transition-all"

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
    setSaving(true); setError('')
    try {
      await apiClient.updateStudentProfile(user.id, profile)
      flash('Profile saved')
    } catch { setError('Failed to save profile') }
    finally { setSaving(false) }
  }

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !resumeFile) return
    setUploadingResume(true); setError('')
    try {
      await apiClient.uploadResume(user.id, resumeFile)
      setResumeFile(null)
      flash('Resume uploaded')
      const res = await apiClient.getStudentProfile(user.id)
      setProfile(res.data)
    } catch { setError('Failed to upload resume') }
    finally { setUploadingResume(false) }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setResumeFile(file)
  }

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-5 py-12 space-y-4 animate-pulse">
        <div className="h-10 bg-neutral-mid rounded w-1/3" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-80 bg-neutral-mid rounded-2xl" />
          <div className="h-80 bg-neutral-mid rounded-2xl" />
        </div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)), rgb(var(--primary)))' }}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user?.fullName}</h1>
            <p className="text-foreground opacity-40 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500 bg-opacity-8 border border-red-500 border-opacity-20 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-accent bg-opacity-8 border border-accent border-opacity-20 text-accent px-4 py-3 rounded-xl mb-5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          {/* Profile form */}
          <form onSubmit={handleSave} className="bg-neutral-light border border-neutral-mid rounded-2xl p-7 space-y-5">
            <h2 className="font-semibold text-foreground">Education & Skills</h2>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-50 uppercase tracking-wide mb-1.5">Education</label>
              <input type="text" value={profile?.education || ''} onChange={(e) => setProfile({ ...profile!, education: e.target.value })}
                placeholder="BS Computer Science, Addis Ababa University" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-50 uppercase tracking-wide mb-1.5">Experience</label>
              <textarea value={profile?.experience || ''} onChange={(e) => setProfile({ ...profile!, experience: e.target.value })}
                placeholder="Describe projects, work experience, or internships..." rows={4}
                className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-50 uppercase tracking-wide mb-1.5">Skills</label>
              <input type="text"
                value={profile?.skills?.join(', ') || ''}
                onChange={(e) => setProfile({ ...profile!, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="React, Python, SQL, Machine Learning..."
                className={inputClass} />
              {profile?.skills && profile.skills.filter(Boolean).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {profile.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-lg font-medium"
                          style={{ background: 'rgba(139,92,246,0.12)', color: 'rgb(var(--primary))' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground opacity-50 uppercase tracking-wide mb-1.5">GPA (out of 4.0)</label>
              <input type="number" step="0.01" min="0" max="4" value={profile?.gpa || ''}
                onChange={(e) => setProfile({ ...profile!, gpa: parseFloat(e.target.value) })}
                placeholder="3.80" className={inputClass} />
            </div>

            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
              style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)), rgb(var(--primary)))' }}>
              {saving ? (<><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving...</>) : 'Save Profile'}
            </button>
          </form>

          {/* Resume upload */}
          <form onSubmit={handleResumeUpload} className="bg-neutral-light border border-neutral-mid rounded-2xl p-7 flex flex-col">
            <h2 className="font-semibold text-foreground mb-1">Resume</h2>
            <p className="text-foreground opacity-40 text-sm mb-5">Upload to auto-fill your profile and boost match accuracy.</p>

            {profile?.resumeUrl && (
              <div className="flex items-center gap-2 text-accent text-sm mb-4 px-3.5 py-2.5 rounded-xl"
                   style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Resume on file
              </div>
            )}

            <label
              htmlFor="resume-upload"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5 ${
                dragOver ? 'border-primary' : resumeFile ? 'border-accent' : 'border-neutral-mid hover:border-primary'
              }`}
              style={dragOver ? { background: 'rgba(139,92,246,0.05)' } : resumeFile ? { background: 'rgba(52,211,153,0.04)' } : {}}
            >
              <input type="file" id="resume-upload" accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="hidden" />
              <div className="text-3xl mb-3">{resumeFile ? '📄' : '☁️'}</div>
              {resumeFile ? (
                <p className="text-foreground text-sm font-medium">{resumeFile.name}</p>
              ) : (
                <>
                  <p className="text-foreground text-sm font-medium mb-1">Drop your resume here</p>
                  <p className="text-foreground opacity-30 text-xs">PDF, DOC, DOCX · max 5 MB</p>
                </>
              )}
            </label>

            <button type="submit" disabled={!resumeFile || uploadingResume}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-40 text-sm"
              style={{ background: 'linear-gradient(135deg, rgb(var(--primary-dark)), rgb(var(--primary)))' }}>
              {uploadingResume ? (<><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Uploading...</>) : 'Upload Resume'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
