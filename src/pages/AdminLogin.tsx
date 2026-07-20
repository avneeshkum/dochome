import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Lock, Loader2, User, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/admin')
    } catch (err) {
      toast.error('Invalid email or password')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-blue-50/30 relative overflow-hidden px-4 selection:bg-brand-100 selection:text-brand-900">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg shadow-brand-100 mb-4 ring-1 ring-brand-100 relative">
            <img src="/icons/icon-192.png" alt="DocHome" className="w-10 h-10 object-contain" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center ring-2 ring-white">
              <Lock className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            DocHome Admin
          </h1>
          <p className="text-gray-500 text-sm mt-2">Secure access for healthcare team members</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-brand-100/40 border border-white/60 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
          
          <form onSubmit={handleLogin} className="space-y-5 mt-2" noValidate>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors duration-200 pointer-events-none z-10">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all duration-200 ease-in-out hover:border-gray-300"
                  placeholder="team@dochome.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors duration-200 pointer-events-none z-10">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3.5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all duration-200 ease-in-out hover:border-gray-300"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Protected by DocHome Enterprise Security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}