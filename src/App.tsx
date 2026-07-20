import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from '@/pages/Home'
import AdminLogin from '@/pages/AdminLogin'
import AdminDashboard from '@/pages/AdminDashboard'
import ProtectedRoute from '@/components/ProtectedRoute'
import SplashScreen from '@/components/SplashScreen'
import WelcomeScreen from '@/components/WelcomeScreen'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

const VISITED_KEY = 'dochome_visited'
const SPLASH_DURATION = 1800

type Stage = 'splash' | 'welcome' | 'app'

export default function App() {
  const isHome = window.location.pathname === '/'
  const [stage, setStage] = useState<Stage>(isHome ? 'splash' : 'app')
  const [splashFadeOut, setSplashFadeOut] = useState(false)

  useEffect(() => {
    if (stage !== 'splash') return
    const fadeTimer = setTimeout(() => setSplashFadeOut(true), SPLASH_DURATION - 300)
    const nextTimer = setTimeout(() => {
      const visited = localStorage.getItem(VISITED_KEY)
      setStage(visited ? 'app' : 'welcome')
    }, SPLASH_DURATION)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(nextTimer)
    }
  }, [stage])

  function handleGetStarted() {
    localStorage.setItem(VISITED_KEY, 'true')
    setStage('app')
  }

  if (stage === 'splash') return <SplashScreen fadeOut={splashFadeOut} />
  if (stage === 'welcome') return <WelcomeScreen onGetStarted={handleGetStarted} />

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isHome && <PWAInstallPrompt />}
    </BrowserRouter>
  )
}