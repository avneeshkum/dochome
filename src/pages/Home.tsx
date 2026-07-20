import { useState } from 'react'
import { toast } from 'sonner'
import { 
  CheckCircle2, 
  Loader2, 
  User, 
  Phone, 
  MapPin, 
  Stethoscope, 
  MessageSquare, 
  ChevronDown, 
  Send,
  Heart,
  Activity,
  Users,
  FlaskConical,
  Ambulance,
  ShieldCheck
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { validateEnquiryForm, normalizePhone, type EnquiryFormValues, type EnquiryFormErrors } from '@/lib/validation'
import InstallAppButton from '@/components/InstallAppButton'

const SPECIALTIES = [
  'General Physician',
  'Physiotherapy',
  'Nursing Care',
  'Elderly Care',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Diabetes Care',
  'Other',
]

const SERVICES = [
  { icon: Stethoscope, title: 'Doctor Visit', desc: 'Expert consultation at home' },
  { icon: Users, title: 'Nursing Care', desc: 'Professional medical nursing' },
  { icon: Activity, title: 'Physiotherapy', desc: 'Recovery and mobility support' },
  { icon: Heart, title: 'Elderly Care', desc: 'Compassionate daily assistance' },
  { icon: FlaskConical, title: 'Lab Tests', desc: 'Safe home sample collection' },
  { icon: Ambulance, title: 'Ambulance', desc: '24/7 emergency transport' },
]

const initialValues: EnquiryFormValues = {
  name: '',
  phone: '',
  city: '',
  specialty: '',
  message: '',
}

export default function Home() {
  const [values, setValues] = useState<EnquiryFormValues>(initialValues)
  const [errors, setErrors] = useState<EnquiryFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update<K extends keyof EnquiryFormValues>(key: K, value: EnquiryFormValues[K]) {
    setValues((v: EnquiryFormValues) => ({ ...v, [key]: value }))
    if (errors[key as keyof EnquiryFormErrors]) {
      setErrors((e: EnquiryFormErrors) => ({ ...e, [key]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validateEnquiryForm(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form')
      return
    }

    setSubmitting(true)
    try {
      await supabase.auth.signOut({ scope: 'local' })

      const payload = {
        id: crypto.randomUUID(),
        name: values.name.trim(),
        phone: normalizePhone(values.phone.trim()),
        city: values.city.trim(),
        specialty: values.specialty,
        message: values.message.trim() || null,
        status: 'New' as const,
      }

      const { error } = await supabase.from('enquiries').insert(payload)
      if (error) throw error

      fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error('WhatsApp notify failed:', err)
      })

      setSubmitted(true)
      toast.success('Enquiry submitted successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6">
        <div className="max-w-md w-full text-center bg-white rounded-[2rem] shadow-2xl shadow-brand-100/50 p-8 animate-in fade-in zoom-in-95 duration-500 border border-brand-100">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 ring-4 ring-green-50 animate-in zoom-in duration-700 delay-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">Request Received! 🎉</h1>
          <p className="text-gray-600 leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Thank you, <span className="font-semibold text-gray-900">{values.name.split(' ')[0]}</span>.<br />
            Our medical team will contact you shortly on <span className="font-semibold text-gray-900">{values.phone}</span>.
          </p>
          <button
            onClick={() => {
              setValues(initialValues)
              setSubmitted(false)
            }}
            className="w-full py-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-brand-50 via-white to-white relative overflow-hidden selection:bg-brand-100 selection:text-brand-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="relative z-10 px-4 py-8 sm:py-12 max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-18 h-18 p-1 rounded-2xl bg-white shadow-lg shadow-brand-100 mb-4 ring-1 ring-brand-100">
            <img
              src="/icons/icon-192.png"
              alt="DocHome"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            DocHome
          </h1>
          <p className="text-[11px] sm:text-xs font-black text-brand-600 tracking-[0.25em] uppercase mt-3 drop-shadow-sm">
            Care At Your Doorstep
          </p>
          <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-sm mx-auto leading-relaxed">
            Expert healthcare at your doorstep. <br className="hidden sm:block" /> Tell us what you need, we'll handle the rest.
          </p>
        </div>

        <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Services</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-200" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {SERVICES.map((service, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 text-center hover:shadow-xl hover:shadow-brand-100/50 hover:-translate-y-1 hover:border-brand-200 active:scale-95 transition-all duration-300 cursor-default animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                style={{ animationDelay: `${200 + idx * 100}ms` }}
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:from-brand-100 group-hover:to-brand-200 transition-all duration-300 shadow-sm">
                  <service.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{service.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl shadow-brand-100/40 border border-white/60 p-6 sm:p-8 space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
          noValidate
        >
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              Book an Enquiry
            </h2>
            <p className="text-xs text-gray-500 mt-1">Fill in your details and we will contact you shortly.</p>
          </div>

          <FormField label="Full Name" error={errors.name} icon={User}>
            <input
              type="text"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className={inputClass(!!errors.name, true)}
              autoComplete="name"
            />
          </FormField>

          <FormField label="Phone Number" error={errors.phone} icon={Phone}>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="10-digit mobile number"
              className={inputClass(!!errors.phone, true)}
              autoComplete="tel"
              inputMode="tel"
            />
          </FormField>

          <FormField label="City / Pincode" error={errors.city} icon={MapPin}>
            <input
              type="text"
              value={values.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="e.g. Lucknow, 226001"
              className={inputClass(!!errors.city, true)}
            />
          </FormField>

          <FormField label="Specialty Needed" error={errors.specialty} icon={Stethoscope}>
            <div className="relative">
              <select
                value={values.specialty}
                onChange={(e) => update('specialty', e.target.value)}
                className={inputClass(!!errors.specialty, true) + ' appearance-none cursor-pointer pr-10'}
              >
                <option value="">Select a specialty</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>
          </FormField>

          <FormField label="Message (optional)" icon={MessageSquare}>
            <textarea
              value={values.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Briefly describe your requirement..."
              rows={3}
              className={inputClass(false, true) + ' resize-none pt-3.5'}
            />
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Enquiry</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5 animate-in fade-in duration-700 delay-500">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          Your information is 100% secure and will only be used to contact you.
        </p>

        <InstallAppButton />
      </div>
    </div>
  )
}

function FormField({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string
  error?: string
  icon?: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700 ml-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors duration-200 pointer-events-none z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 ml-1 flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  )
}

function inputClass(hasError: boolean, hasIcon: boolean) {
  return [
    'w-full bg-gray-50/80 border text-gray-900 text-sm sm:text-base rounded-xl',
    'placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white',
    'transition-all duration-200 ease-in-out',
    hasError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300',
    hasIcon ? 'pl-11 pr-4 py-3.5' : 'px-4 py-3.5',
  ].join(' ')
}