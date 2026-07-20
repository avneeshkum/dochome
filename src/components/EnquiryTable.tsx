import { Phone, MessageCircle, Inbox, ChevronDown, MapPin, Stethoscope, Clock } from 'lucide-react'
import type { Enquiry, EnquiryStatus } from '@/lib/supabase'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS: EnquiryStatus[] = ['New', 'Contacted', 'Converted', 'Not Interested']

export default function EnquiryTable({
  enquiries,
  onStatusChange,
  onRowClick,
}: {
  enquiries: Enquiry[]
  onStatusChange: (id: string, status: EnquiryStatus) => void
  onRowClick: (enquiry: Enquiry) => void
}) {
  if (enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No enquiries found</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-4">Patient</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Specialty</th>
              <th className="px-5 py-4">Message</th>
              <th className="px-5 py-4">Received</th>
              <th className="px-5 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {enquiries.map((e) => (
              <tr 
                key={e.id} 
                onClick={() => onRowClick(e)}
                className="group transition-colors duration-150 hover:bg-brand-50/40 cursor-pointer"
              >
                <td className="px-5 py-4 font-semibold text-gray-900">{e.name}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">{e.phone}</span>
                    <a
                      href={`tel:${e.phone}`}
                      onClick={(ev) => ev.stopPropagation()}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                      title="Call Patient"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/${e.phone.replace('+', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(ev) => ev.stopPropagation()}
                      className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all duration-200"
                      title="WhatsApp Patient"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {e.city}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-gray-400" />
                    {e.specialty}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500 max-w-[180px]">
                  <div className="truncate" title={e.message ?? 'No message'}>
                    {e.message || <span className="text-gray-300 italic">No message</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(e.created_at).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="relative inline-block w-36">
                    <select
                      value={e.status}
                      onChange={(ev) => {
                        ev.stopPropagation()
                        onStatusChange(e.id, ev.target.value as EnquiryStatus)
                      }}
                      onClick={(ev) => ev.stopPropagation()}
                      className="w-full appearance-none text-xs font-medium border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 cursor-pointer hover:border-gray-300"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {enquiries.map((e) => (
          <div 
            key={e.id} 
            onClick={() => onRowClick(e)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 cursor-pointer hover:shadow-md active:scale-[0.99] transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900 text-base">{e.name}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {e.city}
                </div>
              </div>
              <StatusBadge status={e.status} />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Stethoscope className="w-4 h-4 text-brand-500" />
                <span className="font-medium">{e.specialty}</span>
              </div>
              {e.message && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
                  "{e.message}"
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(e.created_at).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${e.phone}`}
                onClick={(ev) => ev.stopPropagation()}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-[0.98] transition-all duration-200"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={`https://wa.me/${e.phone.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                onClick={(ev) => ev.stopPropagation()}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 active:scale-[0.98] transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              
              <div className="col-span-2 relative mt-1">
                <select
                  value={e.status}
                  onChange={(ev) => {
                    ev.stopPropagation()
                    onStatusChange(e.id, ev.target.value as EnquiryStatus)
                  }}
                  onClick={(ev) => ev.stopPropagation()}
                  className="w-full appearance-none text-sm font-medium border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      Mark as: {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}