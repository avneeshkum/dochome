import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setAuthed(!!data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setAuthed(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-gray-400 text-sm">Checking session...</div>
    )
  }

  if (!authed) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
