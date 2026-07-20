import { X, Phone, MessageCircle, MapPin, Stethoscope, Clock, TrendingUp } from 'lucide-react'
import type { Enquiry, EnquiryStatus } from '@/lib/supabase'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS: EnquiryStatus[] = ['New', 'Contacted', 'Converted', 'Not Interested']
const STATUS_FLOW: EnquiryStatus[] = ['New', 'Contacted', 'Converted']

export default function EnquiryDrawer({
  enquiry,
  isOpen,
  onClose,
  onStatusChange,
}: {
  enquiry: Enquiry | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: EnquiryStatus) => void
}) {
  if (!enquiry || !isOpen) return null

  const currentStatusIndex = STATUS_FLOW.indexOf(enquiry.status)

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-brand-50/50 to-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Enquiry Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">Patient information & actions</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 active:scale-90 transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">{enquiry.name}</h3>
              <div className="flex items-center gap-3">
                <StatusBadge status={enquiry.status} />
                <span className="text-xs text-gray-400">ID: {enquiry.id.slice(0, 8)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a 
                href={`tel:${enquiry.phone}`} 
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a 
                href={`https://wa.me/${enquiry.phone.replace('+', '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-50 text-green-600 font-semibold hover:bg-green-100 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{enquiry.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Location</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{enquiry.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Stethoscope className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Specialty Needed</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{enquiry.specialty}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Received</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {new Date(enquiry.created_at).toLocaleString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {enquiry.message && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Patient Message</p>
                <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed italic">
                  "{enquiry.message}"
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Status Timeline
              </p>
              <div className="relative">
                {STATUS_FLOW.map((status, idx) => {
                  const isCompleted = idx <= currentStatusIndex
                  const isCurrent = status === enquiry.status
                  return (
                    <div key={status} className="flex items-start gap-3 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted 
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' 
                            : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                          {idx + 1}
                        </div>
                        {idx < STATUS_FLOW.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${isCompleted && idx < currentStatusIndex ? 'bg-brand-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {status}
                          {isCurrent && <span className="ml-2 text-xs text-brand-600">(Current)</span>}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Update Status</p>
              <select
                value={enquiry.status}
                onChange={(e) => onStatusChange(enquiry.id, e.target.value as EnquiryStatus)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 active:scale-[0.99] transition-all cursor-pointer"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}