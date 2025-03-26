"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { Session, User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  image?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signOut: () => Promise<void>
  googleSignIn: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  googleSignIn: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Convert Supabase user to our User type
  const formatUser = (session: Session | null): User | null => {
    if (!session?.user) return null
    
    const supaUser = session.user
    return {
      id: supaUser.id,
      name: supaUser.user_metadata.name || supaUser.user_metadata.full_name || supaUser.email?.split('@')[0] || '',
      email: supaUser.email || '',
      image: supaUser.user_metadata.avatar_url || null,
    }
  }

  // Check for existing session and subscribe to auth changes
  useEffect(() => {
    setIsLoading(true)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(formatUser(session))
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(formatUser(session))
      setIsLoading(false)
      
      // Refresh the page on sign in or sign out to update server components
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Email/password sign in
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error.message)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    }
  }
  
  // Email/password sign up
  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      
      if (error) {
        console.error('Sign up error:', error.message)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Sign up error:', error)
      return false
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Google sign in
  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('Google sign in error:', error.message)
      }
    } catch (error) {
      console.error('Google sign in error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
