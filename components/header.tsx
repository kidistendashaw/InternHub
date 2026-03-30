'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getStoredUser, clearAuth } from '@/lib/auth'
import type { User } from '@/lib/auth'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <header className="bg-neutral-light border-b border-neutral-mid">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={user?.userType === 'admin' ? '/admin' : '/student'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            IH
          </div>
          <span className="text-lg font-bold text-foreground">InternHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {user?.userType === 'student' && (
            <>
              <Link href="/student/matches" className="text-foreground hover:text-primary transition-colors">
                Matches
              </Link>
              <Link href="/student/applications" className="text-foreground hover:text-primary transition-colors">
                Applications
              </Link>
            </>
          )}
          {user?.userType === 'admin' && (
            <>
              <Link href="/admin/internships" className="text-foreground hover:text-primary transition-colors">
                Internships
              </Link>
              <Link href="/admin/applications" className="text-foreground hover:text-primary transition-colors">
                Applications
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-mid transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm text-foreground">{user.fullName}</span>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-light border border-neutral-mid rounded-lg shadow-lg z-10">
                  <Link
                    href={user.userType === 'admin' ? '/admin/profile' : '/student/profile'}
                    className="block px-4 py-2 text-foreground hover:bg-neutral-mid transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-neutral-mid transition-colors border-t border-neutral-mid"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
