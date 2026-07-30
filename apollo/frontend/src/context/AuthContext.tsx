import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError } from '../api'
import type { AuthResponse, User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  function persist(auth: AuthResponse) {
    localStorage.setItem('token', auth.token)
    localStorage.setItem('user', JSON.stringify(auth.user))
    setToken(auth.token)
    setUser(auth.user)
  }

  async function login(email: string, password: string) {
    const auth = await api.post<AuthResponse>('/login', { email, password })
    persist(auth)
  }

  async function register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) {
    const auth = await api.post<AuthResponse>('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    persist(auth)
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ApiError }
