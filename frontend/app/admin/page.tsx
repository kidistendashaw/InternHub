'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout'
import { getStoredUser } from '@/lib/auth'

export default function AdminDashboard() {
  const router = useRouter()
  const user = getStoredUser()

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-foreground opacity-75">Manage internships and applications</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Manage Internships */}
          <Link
            href="/admin/internships"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-8 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="text-4xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform">
              📝
            </div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              Internship Listings
            </h3>
            <p className="text-foreground opacity-75 mb-4">
              Create, edit, and manage internship positions
            </p>
            <span className="inline-block px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold group-hover:bg-primary-dark transition-colors">
              Manage →
            </span>
          </Link>

          {/* View Applications */}
          <Link
            href="/admin/applications"
            className="bg-neutral-light border border-neutral-mid rounded-xl p-8 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="text-4xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              Applications
            </h3>
            <p className="text-foreground opacity-75 mb-4">
              Review and manage student applications
            </p>
            <span className="inline-block px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold group-hover:bg-primary-dark transition-colors">
              Review →
            </span>
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-neutral-light to-background rounded-xl p-8 border border-neutral-mid">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Start</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Post a New Internship</h3>
              <p className="text-foreground opacity-75 text-sm mb-3">
                Add internship positions and let our AI match them with suitable students based on their skills and background.
              </p>
              <Link
                href="/admin/internships/new"
                className="text-primary hover:text-primary-dark font-semibold text-sm"
              >
                Create internship →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Review Applications</h3>
              <p className="text-foreground opacity-75 text-sm mb-3">
                See all applications submitted for your positions, review student profiles, and accept or reject candidates.
              </p>
              <Link
                href="/admin/applications"
                className="text-primary hover:text-primary-dark font-semibold text-sm"
              >
                View applications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
