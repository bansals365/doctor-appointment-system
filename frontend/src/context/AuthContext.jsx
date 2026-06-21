import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('docapp_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((userData) => {
    localStorage.setItem('docapp_user', JSON.stringify(userData))
    localStorage.setItem('docapp_token', userData.token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('docapp_user')
    localStorage.removeItem('docapp_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
