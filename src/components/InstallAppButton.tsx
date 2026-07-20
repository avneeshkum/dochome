import { useState, useEffect } from 'react'
import { Download, Smartphone, X } from 'lucide-react'

export default function InstallAppButton() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed
    const installed = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(installed)
    if (installed) return

    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('install_btn_dismissed')
    if (wasDismissed) {
      setDismissed(true)
      return
    }

    // Check if iOS
    const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    setIsIOS(ios)
  }, [])

  if (isInstalled || dismissed) return null

  async function handleInstall() {
    if (!isIOS && window.deferredPrompt) {
      console.log('Triggering install prompt...')
      window.deferredPrompt.prompt()
      const { outcome } = await window.deferredPrompt.userChoice
      console.log('User choice:', outcome)
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      // Clear the variable after use
      window.deferredPrompt = null
    } else if (isIOS) {
      setShowIOSModal(true)
    } else {
      console.warn('Install prompt not available. Try hard refresh.')
    }
  }

  function handleDismiss(e: React.MouseEvent) {
    e.stopPropagation()
    setDismissed(true)
    localStorage.setItem('install_btn_dismissed', 'true')
  }

  return (
    <>
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <div className="relative bg-gradient-to-br from-brand-50/80 via-white to-brand-50/40 backdrop-blur-sm rounded-2xl border border-brand-100/60 p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/80 active:scale-90 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleInstall}
            className="w-full flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-white shadow-sm ring-1 ring-brand-100 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Get the DocHome App</p>
              <p className="text-xs text-gray-500 mt-0.5">Quick access from your home screen</p>
            </div>
            <div className="shrink-0 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-brand-500/20 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </div>
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in slide-in-from-bottom-8 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Install on iPhone</h3>
              <p className="text-sm text-gray-500">Follow these 3 simple steps:</p>
            </div>

            <div className="space-y-3">
              <Step number={1} text="Tap the Share button" icon="⬆️" />
              <Step number={2} text='Tap "Add to Home Screen"' icon="📲" />
              <Step number={3} text='Tap "Add" to confirm' icon="✓" />
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-6 py-3 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-semibold rounded-xl transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Step({ number, text, icon }: { number: number; text: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs shrink-0">
        {number}
      </div>
      <p className="flex-1 text-sm font-medium text-gray-900">{text}</p>
      <div className="text-xl">{icon}</div>
    </div>
  )
}
