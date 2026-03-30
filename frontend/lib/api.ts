import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  register(email: string, password: string, fullName: string, userType: 'student' | 'admin') {
    return this.client.post('/auth/register', { email, password, fullName, userType })
  }

  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password })
  }

  logout() {
    localStorage.removeItem('authToken')
  }

  // Student endpoints
  getStudentProfile(userId: string) {
    return this.client.get(`/students/${userId}`)
  }

  updateStudentProfile(userId: string, data: any) {
    return this.client.put(`/students/${userId}`, data)
  }

  uploadResume(userId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.client.post(`/students/${userId}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  // Internship endpoints
  getInternships(filters?: any) {
    return this.client.get('/internships', { params: filters })
  }

  getInternshipDetails(id: string) {
    return this.client.get(`/internships/${id}`)
  }

  // Match endpoints
  getRecommendedMatches(userId: string) {
    return this.client.get(`/matches/recommended/${userId}`)
  }

  getMatchDetails(matchId: string) {
    return this.client.get(`/matches/${matchId}`)
  }

  // Application endpoints
  applyForInternship(studentId: string, internshipId: string) {
    return this.client.post('/applications', { studentId, internshipId })
  }

  getStudentApplications(studentId: string) {
    return this.client.get(`/applications/student/${studentId}`)
  }

  // Admin endpoints
  createInternship(data: any) {
    return this.client.post('/internships', data)
  }

  updateInternship(id: string, data: any) {
    return this.client.put(`/internships/${id}`, data)
  }

  deleteInternship(id: string) {
    return this.client.delete(`/internships/${id}`)
  }

  getAllApplications() {
    return this.client.get('/applications')
  }

  updateApplicationStatus(applicationId: string, status: string) {
    return this.client.put(`/applications/${applicationId}`, { status })
  }
}

export const apiClient = new APIClient()
