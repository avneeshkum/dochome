import { useMemo } from 'react'
import { TrendingUp, Clock, PhoneCall, CheckCircle2, XCircle, Users } from 'lucide-react'
import type { Enquiry } from '@/lib/supabase'

export default function StatsBar({ enquiries }: { enquiries: Enquiry[] }) {
  const stats = useMemo(() => {
    const total = enquiries.length
    const newCount = enquiries.filter(e => e.status === 'New').length
    const contactedCount = enquiries.filter(e => e.status === 'Contacted').length
    const convertedCount = enquiries.filter(e => e.status === 'Converted').length
    const notInterestedCount = enquiries.filter(e => e.status === 'Not Interested').length
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const targetDateStr = `${year}-${month}-${day}`
      
      const count = enquiries.filter(e => {
        const enquiryDate = new Date(e.created_at)
        const enquiryYear = enquiryDate.getFullYear()
        const enquiryMonth = String(enquiryDate.getMonth() + 1).padStart(2, '0')
        const enquiryDay = String(enquiryDate.getDate()).padStart(2, '0')
        const enquiryDateStr = `${enquiryYear}-${enquiryMonth}-${enquiryDay}`
        return enquiryDateStr === targetDateStr
      }).length
      
      return { 
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }), 
        count,
        isToday: i === 6
      }
    })
    
    const maxCount = Math.max(...last7Days.map(d => d.count), 1)

    return { 
      total,
      newCount, 
      contactedCount, 
      convertedCount, 
      notInterestedCount, 
      last7Days, 
      maxCount 
    }
  }, [enquiries])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Total" value={stats.total} color="purple" />
        <StatCard icon={Clock} label="New" value={stats.newCount} color="blue" />
        <StatCard icon={PhoneCall} label="Contacted" value={stats.contactedCount} color="brand" />
        <StatCard icon={CheckCircle2} label="Converted" value={stats.convertedCount} color="green" />
        <StatCard icon={XCircle} label="Not Interested" value={stats.notInterestedCount} color="gray" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            Last 7 Days Activity
          </h3>
          <span className="text-xs text-gray-400">Enquiries per day</span>
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-3 h-24 sm:h-28">
          {stats.last7Days.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex items-end justify-center h-16 sm:h-20">
                <div 
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 ease-out ${
                    d.isToday ? 'bg-brand-500 shadow-lg shadow-brand-500/30' : d.count > 0 ? 'bg-brand-400 group-hover:bg-brand-500' : 'bg-gray-100'
                  }`}
                  style={{ height: d.count > 0 ? `${Math.max((d.count / stats.maxCount) * 100, 30)}%` : '15%' }}
                />
                {d.count > 0 && (
                  <span className="absolute -top-6 text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${d.isToday ? 'text-brand-600 font-bold' : 'text-gray-400'}`}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colors: any = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-100',
  }
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-all duration-200 ${colors[color]}`}>
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 bg-white shadow-sm">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}