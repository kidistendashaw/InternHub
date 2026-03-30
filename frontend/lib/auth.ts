export interface User {
  id: string
  email: string
  fullName: string
  userType: 'student' | 'admin'
}

export interface StudentProfile {
  userId: string
  resumeUrl?: string
  skills: string[]
  education: string
  experience: string
  gpa?: number
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function setAuth(user: User, token: string) {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('authToken', token)
}

export function clearAuth() {
  localStorage.removeItem('user')
  localStorage.removeItem('authToken')
}
