import { Stethoscope, Clock, ShieldCheck, MapPin } from 'lucide-react'

export default function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  const points = [
    { icon: Clock, text: 'Book a home visit in under 2 minutes' },
    { icon: ShieldCheck, text: 'Verified doctors & caregivers' },
    { icon: MapPin, text: 'Available across your city' },
  ]

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-gradient-to-b from-brand-50 to-white px-6 py-10 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-200">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h1
          className="text-2xl font-bold text-brand-900 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Welcome to DocHome
        </h1>
        <p className="text-brand-700/70 text-sm max-w-xs">
          Doctors, nurses & caregivers — right at your doorstep, whenever you need them.
        </p>

        <div className="mt-8 space-y-4 w-full max-w-xs text-left">
          {points.map((p) => (
            <div key={p.text} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm shadow-brand-100 shrink-0">
                <p.icon className="w-4.5 h-4.5 text-brand-600" />
              </div>
              <p className="text-sm text-gray-700">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onGetStarted}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-200"
      >
        Get Started
      </button>
    </div>
  )
}