'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN') {
        setUser(newSession?.user ?? null)
        setSession(newSession)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
        router.push('/login')
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(newSession)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { user, error } = await auth.getUser()
      if (error) throw error
      setUser(user)
      
      // Get the session too
      const { session: currentSession } = await auth.getSession()
      setSession(currentSession)
    } catch (error) {
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut: async () => {
      try {
        await auth.signOut()
        toast.success('Deconnexion reussie')
        router.push('/login')
      } catch (error) {
        toast.error('Erreur lors de la deconnexion')
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
