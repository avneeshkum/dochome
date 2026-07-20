import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 1. Global variable to store the install prompt event
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

// 2. Capture the event as early as possible
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.deferredPrompt = e
  console.log('✅ Install event captured globally!')
})

window.addEventListener('appinstalled', () => {
  console.log('🎉 App successfully installed!')
  window.deferredPrompt = null
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope)
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error)
      })
  })
}