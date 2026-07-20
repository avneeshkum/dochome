export default function SplashScreen({ fadeOut = false }: { fadeOut?: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100/40 transition-opacity duration-700 ease-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Background Glow Animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Logo with Soft Glow & Glass Effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-400/10 rounded-[2rem] blur-2xl animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-[2rem] shadow-2xl shadow-brand-200/50 ring-1 ring-white/80">
            <img
              src="/icons/icon-512.png"
              alt="DocHome"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight transition-all duration-700 ease-out"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DocHome
          </h1>
          <p 
            className="text-xs sm:text-sm font-semibold text-brand-700/60 tracking-[0.25em] uppercase transition-all duration-700 ease-out delay-100"
          >
            Care at your doorstep
          </p>
        </div>

        {/* Elegant Loading Dots */}
        <div className="mt-12 flex items-center gap-2 transition-all duration-700 delay-300">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}