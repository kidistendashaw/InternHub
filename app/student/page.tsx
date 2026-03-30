'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { getStoredUser } from '@/lib/auth'

export default function StudentDashboard() {
  const router = useRouter()
  const user = getStoredUser()

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.fullName}!</h1>
          <p className="text-foreground opacity-75">Find and apply to internships that match your skills</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Quick Stats */}
          <Link
            href="/student/matches"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="text-3xl font-bold text-primary mb-2">★</div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              AI Matches
            </h3>
            <p className="text-foreground opacity-75 text-sm">Discover personalized opportunities</p>
          </Link>

          <Link
            href="/student/applications"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="text-3xl font-bold text-primary mb-2">📋</div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              Applications
            </h3>
            <p className="text-foreground opacity-75 text-sm">Track your application status</p>
          </Link>

          <Link
            href="/student/profile"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="text-3xl font-bold text-primary mb-2">👤</div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              Profile
            </h3>
            <p className="text-foreground opacity-75 text-sm">Manage your information</p>
          </Link>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-neutral-light to-background rounded-xl p-8 border border-neutral-mid">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-3">1</div>
              <h3 className="font-semibold text-foreground mb-2">Complete Your Profile</h3>
              <p className="text-foreground opacity-75 text-sm">
                Upload your resume and tell us about your skills, education, and experience.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-3">2</div>
              <h3 className="font-semibold text-foreground mb-2">Get AI-Powered Matches</h3>
              <p className="text-foreground opacity-75 text-sm">
                Our AI analyzes your profile and finds internships that match your skills perfectly.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-3">3</div>
              <h3 className="font-semibold text-foreground mb-2">Apply & Get Hired</h3>
              <p className="text-foreground opacity-75 text-sm">
                Apply to opportunities with just one click and track your progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
