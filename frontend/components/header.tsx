'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getStoredUser, clearAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import type { User } from '@/lib/auth'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <header className="bg-background border-b border-neutral-mid border-opacity-60 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href={user?.userType === 'admin' ? '/admin' : user ? '/student' : '/'}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'rgb(var(--primary))' }}
          >
            IH
          </div>
          <span className="text-sm font-bold text-foreground">InternHub</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {user?.userType === 'student' && (
            <>
              <Link href="/student" className="text-foreground opacity-55 hover:opacity-100 text-sm transition-opacity">
                Dashboard
              </Link>
              <Link href="/student/matches" className="text-foreground opacity-55 hover:opacity-100 text-sm transition-opacity">
                Matches
              </Link>
              <Link href="/student/applications" className="text-foreground opacity-55 hover:opacity-100 text-sm transition-opacity">
                Applications
              </Link>
            </>
          )}
          {user?.userType === 'admin' && (
            <>
              <Link href="/admin" className="text-foreground opacity-55 hover:opacity-100 text-sm transition-opacity">
                Dashboard
              </Link>
              <Link href="/admin/internships" className="text-foreground opacity-55 hover:opacity-100 text-sm transition-opacity">
                Internships
              </Link>
              <Link href="/admin/applications" className="text-foreground opacity-55 hover:opacity-100 text-sm transition-opacity">
                Applications
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground opacity-40 hover:opacity-70 transition-opacity"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-neutral-light transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgb(var(--primary))' }}
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm text-foreground opacity-70">{user.fullName.split(' ')[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground opacity-30">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 bg-neutral-light border border-neutral-mid rounded-xl shadow-xl z-20 overflow-hidden">
                    <Link
                      href={user.userType === 'admin' ? '/admin' : '/student/profile'}
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2.5 text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-neutral-mid transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-mid transition-colors border-t border-neutral-mid"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-foreground opacity-55 hover:opacity-100 transition-opacity px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm text-white font-medium px-4 py-2 rounded-xl transition-all"
                style={{ background: 'rgb(var(--primary))' }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
