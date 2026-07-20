import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LogOut, Search, RefreshCw, X, Download, FileSpreadsheet } from 'lucide-react'
import { supabase, type Enquiry, type EnquiryStatus } from '@/lib/supabase'
import StatsBar from '@/components/StatsBar'
import EnquiryTable from '@/components/EnquiryTable'
import EnquiryDrawer from '@/components/EnquiryDrawer'
import LoadingSkeleton from '@/components/LoadingSkeleton'

const FILTERS: Array<EnquiryStatus | 'All'> = ['All', 'New', 'Contacted', 'Converted', 'Not Interested']

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<EnquiryStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const navigate = useNavigate()

  async function fetchEnquiries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load enquiries')
      console.error(error)
    } else {
      setEnquiries(data as Enquiry[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEnquiries()
    const channel = supabase
      .channel('enquiries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        fetchEnquiries()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handleStatusChange(id: string, status: EnquiryStatus) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status })
    }
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)
    if (error) {
      toast.error('Failed to update status')
      fetchEnquiries()
    } else {
      toast.success(`Marked as ${status}`)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  function handleExportCSV() {
    if (filtered.length === 0) {
      toast.error('No data to export')
      return
    }

    const escapeCSV = (value: string | null | undefined) => {
      if (!value) return ''
      const str = String(value)
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const headers = ['Name', 'Phone', 'City', 'Specialty', 'Message', 'Status', 'Date']
    const rows = filtered.map((e) => [
      escapeCSV(e.name),
      `'${e.phone}`,
      escapeCSV(e.city),
      escapeCSV(e.specialty),
      escapeCSV(e.message),
      escapeCSV(e.status),
      escapeCSV(new Date(e.created_at).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })),
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    link.href = url
    link.setAttribute('download', `DocHome_Enquiries_${timestamp}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 100)
    toast.success(`${filtered.length} enquiries exported!`)
  }

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesFilter = filter === 'All' || e.status === filter
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.city.toLowerCase().includes(q) || e.specialty.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [enquiries, filter, search])

  return (
    <div className="min-h-dvh bg-gray-50/50 relative selection:bg-brand-100 selection:text-brand-900">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header with Slide-Down Animation */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-20 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-brand-50 rounded-xl ring-1 ring-brand-100">
              <img src="/icons/icon-192.png" alt="DocHome" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight tracking-tight text-sm sm:text-base">DocHome Admin</h1>
              <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider">Enquiry Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 active:scale-95 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-0.5 hidden sm:block" />
            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="p-2.5 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 active:scale-95 transition-all duration-200 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl hover:bg-red-50 active:scale-95 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* StatsBar with Staggered Slide-Up Animation */}
        <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <StatsBar enquiries={enquiries} />
        </div>

        {/* Search & Filters with Staggered Slide-Up Animation */}
        <div className="flex flex-col gap-4 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-brand-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search name, phone, city, specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:shadow-md transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:scale-90 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    filter === f
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                      : 'bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  {f}
                  {f === 'All' && (
                    <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{enquiries.length}</span>
                  )}
                  {f !== 'All' && (
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {enquiries.filter((e) => e.status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length !== enquiries.length && !loading && (
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap hidden sm:block">
                Showing {filtered.length} of {enquiries.length}
              </span>
            )}
          </div>
        </div>

        {/* Table with Staggered Slide-Up Animation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <EnquiryTable 
              enquiries={filtered} 
              onStatusChange={handleStatusChange}
              onRowClick={setSelectedEnquiry}
            />
          )}
        </div>

        {/* Footer Info with Delayed Fade-In */}
        {!loading && enquiries.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 px-1 animate-in fade-in duration-700 delay-500">
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{filtered.length} {filtered.length === 1 ? 'enquiry' : 'enquiries'}</span>
            </div>
            <span className="hidden sm:block">Last refreshed: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </main>

      <EnquiryDrawer
        enquiry={selectedEnquiry}
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}