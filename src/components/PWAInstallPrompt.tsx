import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    const hasDismissed = localStorage.getItem('pwa_install_dismissed')
    
    if (isInstalled || hasDismissed) return

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled && !hasDismissed) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (isMobile) setShowPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [deferredPrompt])

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    } else {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (isIOS) {
        alert('To install: Tap the Share button ⬆️ and select "Add to Home Screen"')
      }
      setShowPrompt(false)
    }
  }

  function handleDismiss() {
    setShowPrompt(false)
    localStorage.setItem('pwa_install_dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
        
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 active:scale-90 transition-all"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-brand-50 shrink-0">
            <Download className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900">Install DocHome</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Add to home screen for quick access
            </p>
            <button
              onClick={handleInstall}
              className="mt-2.5 w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-xs font-semibold py-2 rounded-lg transition-all"
            >
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}